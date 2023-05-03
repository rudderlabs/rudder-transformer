/* eslint-disable camelcase */
const sha256 = require('sha256');
const stats = require('../../../util/stats');
const { constructPayload, extractCustomFields, flattenJson, generateUUID, isDefinedAndNotNull } = require('../../util');
const Cache = require('../../util/cache');
const { RedisDB } = require('../../../util/redisConnector');
const logger = require('../../../logger');
const {
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS,
  RUDDER_ECOM_MAP,
  SHOPIFY_TRACK_MAP,
  ANONYMOUSID_CACHE_TTL_IN_SEC,
} = require('./config');
// 30 mins
const { TransformationError } = require('../../util/errorTypes');

const anonymousIdCache = new Cache(ANONYMOUSID_CACHE_TTL_IN_SEC);

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
// Hash the id and use it as anonymousId (limiting 256 -> 36 chars)
const getAnonymousId = (message) => {
  switch (message.event) {
    // These events are fired from admin dashabord and hence we are setting userId as "ADMIN"
    case SHOPIFY_TRACK_MAP.orders_delete:
    case SHOPIFY_TRACK_MAP.fulfillments_create:
    case SHOPIFY_TRACK_MAP.fulfillments_update:
      return null;
    case SHOPIFY_TRACK_MAP.carts_update:
      return message.properties?.id
        ? sha256(message.properties.id).toString().substring(0, 36)
        : generateUUID()
    case SHOPIFY_TRACK_MAP.orders_edited:
    case SHOPIFY_TRACK_MAP.orders_cancelled:
    case SHOPIFY_TRACK_MAP.orders_fulfilled:
    case SHOPIFY_TRACK_MAP.orders_paid:
    case SHOPIFY_TRACK_MAP.orders_partially_fullfilled:
    case RUDDER_ECOM_MAP.checkouts_create:
    case RUDDER_ECOM_MAP.checkouts_update:
    case RUDDER_ECOM_MAP.orders_create:
    case RUDDER_ECOM_MAP.orders_updated:
      return message.properties?.cart_token
        ? sha256(message.properties.cart_token).toString().substring(0, 36)
        : generateUUID()
    default:
      return generateUUID();
  }
};
/**
 * This function sets the anonymousId based on cart_token or id from the properties of message.
 * If it's null then we set userId as "shopify-admin".
 * @param {*} message
 * @returns
 */
const getAnonymousIdFromDb = async (message, metricMetadata) => {
  let cartToken;
  const { event, properties } = message;
  switch (event) {
    /**
     * Following events will contain cart_token and we will map it in cartToken
     */
    case RUDDER_ECOM_MAP.checkouts_create:
    case RUDDER_ECOM_MAP.checkouts_update:
    case SHOPIFY_TRACK_MAP.checkouts_delete:
    case SHOPIFY_TRACK_MAP.orders_cancelled:
    case SHOPIFY_TRACK_MAP.orders_fulfilled:
    case SHOPIFY_TRACK_MAP.orders_paid:
    case SHOPIFY_TRACK_MAP.orders_partially_fullfilled:
    case RUDDER_ECOM_MAP.orders_create:
    case RUDDER_ECOM_MAP.orders_updated:
      cartToken = properties?.cart_token;
      break;
    /*
     * we dont have cart_token for carts_update events but have id and token field
     * which later on for orders become cart_token so we are fethcing cartToken from id
     */
    case SHOPIFY_TRACK_MAP.carts_update:
      cartToken = properties?.id || properties?.token;
      break;
    // https://help.shopify.com/en/manual/orders/edit-orders -> order can be edited through shopify-admin only
    // https://help.shopify.com/en/manual/orders/fulfillment/setting-up-fulfillment -> fullfillments wont include cartToken neither in manual or automatiic
    default:
  }
  if (!isDefinedAndNotNull(cartToken)) {
    stats.increment('shopify_no_cartToken', {
      ...metricMetadata,
      event,
    });
    return null;
  }
  const anonymousIDfromCache = await anonymousIdCache.get(cartToken, () => null); // check if anonymousId is present in cachewith cartToken as key
  let anonymousIDfromDB;
  let redisVal;
  if (!isDefinedAndNotNull(anonymousIDfromCache)) {
    const executeStartTime = Date.now();
    try{
      redisVal = await RedisDB.getVal(`${cartToken}`);
    }catch(e){
      stats.increment('shopify_events_lost_due_redis', {
      ...metricMetadata,
      });
      return null;
    }
    stats.timing("redis_latency", executeStartTime, {
      operation: 'get',
      ...metricMetadata,
    });
    stats.increment('shopify_redis_get_data', {
      ...metricMetadata,
      timestamp: Date.now(),
    });
  } else {
    anonymousIDfromDB = anonymousIDfromCache;
  }
  if (isDefinedAndNotNull(redisVal)) {
    anonymousIDfromDB = redisVal.anonymousId;
  }
  if (!isDefinedAndNotNull(anonymousIDfromDB)) {
    /* this is for backward compatability when we don't have the redis mapping for older events
    we will get anonymousIDFromDb as null so we will set UUID using the session Key */
    stats.increment('shopify_no_anon_id_from_redis', {
      ...metricMetadata,
      event,
    })
    anonymousIDfromDB = sha256(cartToken).toString().substring(0, 36);
  }
  return anonymousIDfromDB;
};

/**
 * It checks if the event is valid or not based on previous cartItems
 * @param {*} inputEvent 
 * @returns true if event is valid else false
 */
const isValidCartEvent = async (inputEvent) => {
  const cartToken = inputEvent.token || inputEvent.id;
  const redisVal = await RedisDB.getVal(cartToken);
  const newCartItems = inputEvent?.line_items.length !== 0 ? sha256(inputEvent.line_items) : 0;
  if (redisVal) {
    const prevCartItems = redisVal.itemsHash;
    if (prevCartItems === newCartItems) {
      return false;
    }
    await anonymousIdCache.get(cartToken, () => redisVal.anonymousId);
    const value = ["itemsHash", newCartItems];
    await RedisDB.setVal(`${cartToken}`, value);
    return true;
  }
  return false; // if redisVal is null then we will return false as we dont want to pollute the downstream destinations
}

module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  getAnonymousIdFromDb,
  getAnonymousId,
  isValidCartEvent
};
