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
  useRedisDatabase,
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

/**
 * This function checks and returns `rudderAnonymousId` from message if present
 * returns null if not present or found
 * @param {*} message
 */
const getRudderIdFromNoteAtrributes = (noteAttributes, field) => {
  const rudderIdObj = noteAttributes.find((obj) => obj.name === field);
  if (isDefinedAndNotNull(rudderIdObj)) {
    return rudderIdObj.value;
  }
  return null;
};
/**
 * This function gets the anonymousId based on cart_token from redis
 * @param {*} message
 * @returns
 */
const getAnonymousIdFromDb = async (cartToken, message, metricMetadata) => {
  let anonymousId;
  stats.increment('shopify_redis_calls', {
    type: 'get',
    ...metricMetadata,
  });
  let failCount = 0;
  try {
    anonymousId = await RedisDB.getVal(`${cartToken}`, 'anonymousId');
  } catch (e) {
    failCount += 1;
  }
  stats.counter('shopify_redis_failures', failCount, {
    type: 'get',
    ...metricMetadata,
  });
  if (isDefinedAndNotNull(anonymousId)) {
    return anonymousId;
  }
  stats.increment('shopify_redis_no_val', {
    ...metricMetadata,
    event: message.event,
  });
  // If there is no mapping or there is some error in connection we return null
  return null;
};

/**
 * This function retrieves anonymousId in folowing steps:
 * 1. Checks for `rudderAnonymousId` in `note_atrributes`
 * 2. if redis is enabled checks in redis
 * 3. This means we don't have `anonymousId` and hence events CAN NOT be stitched and we check for cartToken
 *    a. if cartToken is available we return its hash value
 *    b. else we check if the event is an SHOPIFY_ADMIN_ONLY_EVENT
 *       -> if true we return `null`;
 *       -> else we don't have any identifer (very edge case) we return `random anonymousId`
 * @param {*} message
 * @param {*} metricMetadata
 * @returns
 */
const getAnonymousId = async (message, metricMetadata) => {
  let anonymousId;
  const noteAttributes = message.properties?.note_attributes;
  // Giving Priority to note_attributes to fetch rudderAnonymousId over Redis ue to better functionality
  if (isDefinedAndNotNull(noteAttributes)) {
    anonymousId = getRudderIdFromNoteAtrributes(noteAttributes, 'rudderAnonymousId');
  }
  // falling back to cartToken mapping or its hash in case no rudderAnonymousId is found
  if (isDefinedAndNotNull(anonymousId)) {
    return anonymousId;
  }
  const cartToken = getCartToken(message);
  if (!isDefinedAndNotNull(cartToken)) {
    if (SHOPIFY_ADMIN_ONLY_EVENTS.includes(message.event)) {
      return null;
    }
    return generateUUID();
  }
  if (useRedisDatabase) {
    anonymousId = await getAnonymousIdFromDb(cartToken, message, metricMetadata);
  }
  if (isDefinedAndNotNull(anonymousId)) {
    stats.increment('shopify_redis_success', {
      event: message.event,
      field: 'anonymousId',
      ...metricMetadata,
    });
  } else {
    /* anonymousId not found from db as well
    Hash the id and use it as anonymousId (limiting 256 -> 36 chars)
    */
    anonymousId = v5(cartToken, v5.URL);
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
/**
 * This function checks for duplicate cart update event by checking the lineItems hash of previous cart update event
 * and comapre it with the received lineItems hash.
 * Also if redis is down or there is no lineItems hash for the given cartToken we be default take it as a valid cart update event
 * @param {*} inputEvent
 * @param {*} metricMetadata
 * @returns boolean
 */
const checkAndUpdateCartItems = async (inputEvent, metricMetadata) => {
  const cartToken = inputEvent.token || inputEvent.id;
  let itemsHash;
  try {
    stats.increment('shopify_redis_calls', {
      type: 'set',
      ...metricMetadata,
    });
    itemsHash = await RedisDB.getVal(cartToken, 'itemsHash');
    if (!isDefinedAndNotNull(itemsHash)) {
      stats.increment('shopify_redis_no_val', {
        ...metricMetadata,
        event: 'Cart Update',
      });
    }
  } catch (e) {
    stats.increment('shopify_redis_failures', {
      type: 'get',
      ...metricMetadata,
    });
  }
  if (isDefinedAndNotNull(itemsHash)) {
    const newCartItemsHash = getHashLineItems(inputEvent);
    const isCartValid = isValidCartEvent(newCartItemsHash, itemsHash);
    if (!isCartValid) {
      return false;
    }
    await updateCartItemsInRedis(cartToken, newCartItemsHash, metricMetadata);
  }
  return true;
};
module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  getAnonymousId,
  checkAndUpdateCartItems,
  getHashLineItems,
};
