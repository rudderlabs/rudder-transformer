/* eslint-disable camelcase */
const { v5 } = require('uuid');
const sha256 = require('sha256');
const stats = require('../../../util/stats');
const { constructPayload, extractCustomFields, flattenJson, generateUUID, isDefinedAndNotNull } = require('../../util');
const { RedisDB } = require('../../../util/redisConnector');
const logger = require('../../../logger');
const {
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS,
  SHOPIFY_TRACK_MAP,
  SHOPIFY_ADMIN_ONLY_EVENTS,
} = require('./config');
const { TransformationError } = require('../../util/errorTypes');

/**
 * query_parameters : { topic: ['<shopify_topic>'], ...}
 * Throws error otherwise
 * @param {*} event
 * @returns
 */
const getShopifyTopic = (event) => {
  const { query_parameters: qParams } = event;
  logger.debug(`[Shopify] Input event: query_params: ${JSON.stringify(qParams)}`);
  if (!qParams) {
    throw new TransformationError('Query_parameters is missing');
  }
  const { topic } = qParams;
  if (!topic || !Array.isArray(topic)) {
    throw new TransformationError('Invalid topic in query_parameters');
  }

  if (topic.length === 0) {
    throw new TransformationError('Topic not found');
  }
  return topic[0];
};

const getVariantString = (lineItem) => {
  const { variant_id, variant_price, variant_title } = lineItem;
  return `${variant_id || ''} ${variant_price || ''} ${variant_title || ''}`;
};

const getProductsListFromLineItems = (lineItems) => {
  if (!lineItems || lineItems.length === 0) {
    return [];
  }
  const products = [];
  lineItems.forEach((lineItem) => {
    const product = constructPayload(lineItem, lineItemsMappingJSON);
    extractCustomFields(lineItem, product, 'root', LINE_ITEM_EXCLUSION_FIELDS);
    product.variant = getVariantString(lineItem);
    products.push(product);
  });
  return products;
};

const createPropertiesForEcomEvent = (message) => {
  const { line_items: lineItems } = message;
  const productsList = getProductsListFromLineItems(lineItems);
  const mappedPayload = constructPayload(message, productMappingJSON);
  extractCustomFields(message, mappedPayload, 'root', PRODUCT_MAPPING_EXCLUSION_FIELDS);
  mappedPayload.products = productsList;
  return mappedPayload;
};

const extractEmailFromPayload = (event) => {
  const flattenedPayload = flattenJson(event);
  let email;
  const regex_email = /\bemail\b/i;
  Object.entries(flattenedPayload).some(([key, value]) => {
    if (regex_email.test(key)) {
      email = value;
      return true;
    }
    return false;
  });
  return email;
};

const getCartToken = (message) => {
  const { event } = message;
  if (event === SHOPIFY_TRACK_MAP.carts_update) {
    return message.properties?.id || message.properties?.token;
  }
  return message.properties?.cart_token || null;
}
// Hash the id and use it as anonymousId (limiting 256 -> 36 chars)
const getAnonymousId = (message) => {
  const cartToken = getCartToken(message);
  if (isDefinedAndNotNull(cartToken)) {
    return v5(cartToken, v5.URL);
  }
  if (SHOPIFY_ADMIN_ONLY_EVENTS.includes(message.event)) {
    return null;
  }
  return generateUUID();

};
/**
 * This function sets the anonymousId based on cart_token or id from the properties of message.
 * If it's null then we set userId as "shopify-admin".
 * @param {*} message
 * @returns
 */
const getAnonymousIdFromDb = async (message, metricMetadata) => {
  const cartToken = getCartToken(message);
  const { event } = message;
  if (!isDefinedAndNotNull(cartToken)) {
    return null;
  }
  let redisVal;
  try {
    redisVal = await RedisDB.getVal(`${cartToken}`);
  } catch (e) {
    stats.increment('shopify_redis_call_failure', {
      type: 'get',
      ...metricMetadata,
    });
  }

  stats.increment('shopify_redis_call', {
    type: 'get',
    ...metricMetadata,
  });
  if (redisVal === null) {
    stats.increment('shopify_redis_no_val', {
      ...metricMetadata,
      event,
    })
  }
  if (!isDefinedAndNotNull(redisVal)) {
    /* if redis does not have the mapping for cartToken as key (null) 
      or redis is down(undefined)
      we will set anonymousId as sha256(cartToken)
     */
    return v5(cartToken, v5.URL)
  }
  return redisVal.anonymousId;
};

/**
 * It checks if the event is valid or not based on previous cartItems
 * @param {*} inputEvent 
 * @returns true if event is valid else false
 */
const isValidCartEvent = (inputEvent, redisEvent) => {
  const newCartItems = inputEvent?.line_items.length !== 0 ? sha256(inputEvent.line_items) : "0";
  const prevCartItems = redisEvent.itemsHash;
  return !(prevCartItems === newCartItems);
}
const updateCartItemsInRedis = async (inputEvent) => {
  const cartToken = inputEvent.token || inputEvent.id;
  const newCartItems = inputEvent?.line_items.length !== 0 ? sha256(inputEvent.line_items) : "0";
  const value = ["itemsHash", newCartItems];
  await RedisDB.setVal(`${cartToken}`, value);
}
const checkAndUpdateCartItems = async (inputEvent, metricMetadata) => {
  const cartToken = inputEvent.token || inputEvent.id;
  let redisVal;
  try {
    redisVal = await RedisDB.getVal(cartToken);
  } catch (e) {
    // so if redis is down we will send the event to downstream destinations
    stats.increment('shopify_redis_call_failure', {
      type: 'get',
      ...metricMetadata,
    });
    return true;
  }
  if (redisVal) {
    const isCartValid = isValidCartEvent(inputEvent, redisVal);
    if (!isCartValid) {
      return false;
    }
    await updateCartItemsInRedis(inputEvent);
    return true;
  }
  // if nothing is found for cartToken provided then we will return false as we dont want to pollute the downstream destinations
  return false;
}
module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  getAnonymousIdFromDb,
  getAnonymousId,
  checkAndUpdateCartItems
};
