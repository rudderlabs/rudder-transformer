/* eslint-disable camelcase */
const { v5 } = require('uuid');
const sha256 = require('sha256');
const stats = require('../../../util/stats');
const {
  constructPayload,
  extractCustomFields,
  flattenJson,
  generateUUID,
  isDefinedAndNotNull,
} = require('../../util');
const { RedisDB } = require('../../../util/redis/redisConnector');
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
const getHashLineItems = (cart) => {
  if (cart && cart?.line_items && cart.line_items.length > 0) {
    return sha256(JSON.stringify(cart.line_items));
  }
  return 'EMPTY';
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
};
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
  let anonymousId;
  try {
    anonymousId = await RedisDB.getVal(`${cartToken}`, 'anonymousId');
  } catch (e) {
    stats.increment('shopify_redis_failures', {
      type: 'get',
      ...metricMetadata,
    });
  }
  stats.increment('shopify_redis_calls', {
    type: 'get',
    ...metricMetadata,
  });
  if (anonymousId === null) {
    stats.increment('shopify_redis_no_val', {
      ...metricMetadata,
      event,
    });
  }
  if (!isDefinedAndNotNull(anonymousId)) {
    /* if redis does not have the mapping for cartToken as key (null) 
      or redis is down(undefined)
      we will set anonymousId as sha256(cartToken)
     */
    return v5(cartToken, v5.URL);
  }
  return anonymousId;
};

/**
 * It checks if the event is valid or not based on previous cartItems
 * @param {*} inputEvent
 * @returns true if event is valid else false
 */
const isValidCartEvent = (newCartItems, prevCartItems) => !(prevCartItems === newCartItems);

const updateCartItemsInRedis = async (cartToken, newCartItemsHash, metricMetadata) => {
  const value = ['itemsHash', newCartItemsHash];
  try {
    await RedisDB.setVal(`${cartToken}`, value);
  } catch (e) {
    stats.increment('shopify_redis_failures', {
      type: 'set',
      ...metricMetadata,
    });
  }
};
const checkAndUpdateCartItems = async (inputEvent, metricMetadata) => {
  const cartToken = inputEvent.token || inputEvent.id;
  let itemsHash;
  try {
    itemsHash = await RedisDB.getVal(cartToken, 'itemsHash');
    if (!isDefinedAndNotNull(itemsHash)) {
      stats.increment('shopify_redis_no_val', {
        ...metricMetadata,
        event: 'carts_update',
      });
    }
  } catch (e) {
    // so if redis is down we will send the event to downstream destinations
    stats.increment('shopify_redis_failures', {
      type: 'get',
      ...metricMetadata,
    });
    return true;
  }
  if (isDefinedAndNotNull(itemsHash)) {
    const newCartItemsHash = getHashLineItems(inputEvent);
    const isCartValid = isValidCartEvent(newCartItemsHash, itemsHash);
    if (!isCartValid) {
      return false;
    }
    await updateCartItemsInRedis(cartToken, newCartItemsHash, metricMetadata);
    return true;
  }
  // if nothing is found for cartToken provided then we will return false as we dont want to pollute the downstream destinations
  return false;
};
module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  getAnonymousIdFromDb,
  getAnonymousId,
  checkAndUpdateCartItems,
  getHashLineItems,
};
