/* eslint-disable camelcase */
const { v5 } = require('uuid');
const sha256 = require('sha256');
const stats = require('../../../util/stats');
const { constructPayload, extractCustomFields, flattenJson, generateUUID, isDefinedAndNotNull, } = require('../../util');
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


const getDataFromRedis = async (key, metricMetadata) => {
  try {
    stats.increment('shopify_redis_calls', {
      type: 'get',
      field: 'all',
      ...metricMetadata,
    });
    const redisData = await RedisDB.getVal(key);
    if (redisData === null) {
      stats.increment('shopify_redis_no_val', {
        ...metricMetadata,
      });
    }
    return redisData;
  }
  catch (e) {
    logger.debug(`{{SHOPIFY::}} Get call Failed due redis error ${e}`);
    stats.increment('shopify_redis_failures', {
      type: 'get',
      ...metricMetadata,
    });
  }
  return null;
};
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
 * This function checks and returns rudderId from message if present
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
 * This function retrieves anonymousId and sessionId in folowing steps:
 * 1. Checks for `rudderAnonymousId`and `rudderSessionId in `note_atrributes`
 * 2. if redis is enabled checks in redis
 * 3. This means we don't have `anonymousId` and hence events CAN NOT be stitched and we check for cartToken
 *    a. if cartToken is available we return its hash value
 *    b. else we check if the event is an SHOPIFY_ADMIN_ONLY_EVENT
 *       -> if true we return `null`;
 *       -> else we don't have any identifer (very edge case) we return `random anonymousId`
 *    No Random SessionId is generated as its not a required field
 * @param {*} message 
 * @param {*} metricMetadata 
 * @returns 
 */
const getAnonymousIdAndSessionId = async (message, metricMetadata, redisData = null) => {
  let anonymousId;
  let sessionId;
  const noteAttributes = message.properties?.note_attributes;
  // Giving Priority to note_attributes to fetch rudderAnonymousId over Redis due to better efficiency
  if (isDefinedAndNotNull(noteAttributes)) {
    anonymousId = getRudderIdFromNoteAtrributes(noteAttributes, "rudderAnonymousId");
    sessionId = getRudderIdFromNoteAtrributes(noteAttributes, "rudderSessionId");
  }
  // falling back to cartToken mapping or its hash in case no rudderAnonymousId or rudderSessionId is found
  if (isDefinedAndNotNull(anonymousId) && isDefinedAndNotNull(sessionId)) {
    return { anonymousId, sessionId };
  }
  const cartToken = getCartToken(message);
  if (!isDefinedAndNotNull(cartToken)) {
    if (SHOPIFY_ADMIN_ONLY_EVENTS.includes(message.event)) {
      return { anonymousId, sessionId };
    }
    return { anonymousId: isDefinedAndNotNull(anonymousId) ? anonymousId : generateUUID(), sessionId };
  }
  if (useRedisDatabase) {
    if (!isDefinedAndNotNull(redisData)) {
      // eslint-disable-next-line no-param-reassign
      redisData = await getDataFromRedis(cartToken, metricMetadata);
    }
    anonymousId = redisData?.anonymousId;
    sessionId = redisData?.sessionId;
  }
  if (!isDefinedAndNotNull(anonymousId)) {
    /* anonymousId or sessionId not found from db as well
    Hash the id and use it as anonymousId (limiting 256 -> 36 chars) and sessionId is not sent as its not required field
    */
    anonymousId = v5(cartToken, v5.URL);
  }
  return { anonymousId, sessionId };
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
    stats.increment('shopify_redis_calls', {
      type: 'set',
      field: 'itemsHash',
      ...metricMetadata,
    });
    await RedisDB.setVal(`${cartToken}`, value);
  }
  catch (e) {
    logger.debug(`{{SHOPIFY::}} itemsHash set call Failed due redis error ${e}`);
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
const checkAndUpdateCartItems = async (inputEvent, redisData, metricMetadata) => {
  const cartToken = inputEvent.token || inputEvent.id;
  if (!isDefinedAndNotNull(redisData)) {
    // eslint-disable-next-line no-param-reassign
    redisData = await getDataFromRedis(cartToken, metricMetadata);
  }
  const itemsHash = redisData?.itemsHash;
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
  getAnonymousIdAndSessionId,
  checkAndUpdateCartItems,
  getHashLineItems,
  getDataFromRedis,
};
