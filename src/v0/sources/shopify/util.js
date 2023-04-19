/* eslint-disable camelcase */
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
  RUDDER_ECOM_MAP,
  SHOPIFY_TRACK_MAP
} = require('./config');
// 30 mins
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
// Hash the id and use it as anonymousId (limiting 256 -> 36 chars)
const setAnonymousId = (message) => {
  switch (message.event) {
    // These events are fired from admin dashabord and hence we are setting userId as "ADMIN"
    case SHOPIFY_TRACK_MAP.orders_delete:
    case SHOPIFY_TRACK_MAP.fulfillments_create:
    case SHOPIFY_TRACK_MAP.fulfillments_update:
      if (!message.userId) {
        message.setProperty('userId', 'shopify-admin');
      }
      return;
    case SHOPIFY_TRACK_MAP.carts_create:
    case SHOPIFY_TRACK_MAP.carts_update:
      message.setProperty(
        'anonymousId',
        message.properties?.id
          ? sha256(message.properties.id).toString().substring(0, 36)
          : generateUUID(),
      );
      break;
    case SHOPIFY_TRACK_MAP.orders_edited:
    case SHOPIFY_TRACK_MAP.orders_cancelled:
    case SHOPIFY_TRACK_MAP.orders_fulfilled:
    case SHOPIFY_TRACK_MAP.orders_paid:
    case SHOPIFY_TRACK_MAP.orders_partially_fullfilled:
    case RUDDER_ECOM_MAP.checkouts_create:
    case RUDDER_ECOM_MAP.checkouts_update:
    case RUDDER_ECOM_MAP.orders_create:
    case RUDDER_ECOM_MAP.orders_updated:
      message.setProperty(
        'anonymousId',
        message.properties?.cart_token
          ? sha256(message.properties.cart_token).toString().substring(0, 36)
          : generateUUID(),
      );
      break;
    default:
      message.setProperty('anonymousId', generateUUID());
      break;
  }
};
/**
 * This function sets the anonymousId based on cart_token or id from the properties of message.
 * If it's null then we set userId as "ADMIN".
 * @param {*} message
 * @returns
 */
const setAnonymousIdorUserIdFromDb = async (message, metricMetadata) => {
  let cartToken;
  switch (message.event) {
    /**
     * Following events will contain cart_token and we will map it in cartToken
     */
    case RUDDER_ECOM_MAP.checkouts_create:
    case RUDDER_ECOM_MAP.checkouts_update:
    case SHOPIFY_TRACK_MAP.orders_cancelled:
    case SHOPIFY_TRACK_MAP.orders_fulfilled:
    case SHOPIFY_TRACK_MAP.orders_paid:
    case SHOPIFY_TRACK_MAP.orders_partially_fullfilled:
    case RUDDER_ECOM_MAP.orders_create:
    case RUDDER_ECOM_MAP.orders_updated:

      if (!isDefinedAndNotNull(message.properties?.cart_token)) {
        /**
         * This case will rise when we will be using Shopify Admin Dashboard to create, update, delete orders etc.
         * Since it is done by shopify-admin we will set "userId" to be "shopify-admin"
         */
        if (!message.userId) {
          message.setProperty('userId', 'shopify-admin');
        }
        return;
      }
      cartToken = message.properties.cart_token;
      break;
    /*
     * we dont have cart_token for carts_create and update events but have id and token field
     * which later on for orders become cart_token so we are fethcing cartToken from id
     */
    case SHOPIFY_TRACK_MAP.carts_create:
    case SHOPIFY_TRACK_MAP.carts_update:
      cartToken = message.properties?.id || message.properties?.token;
      break;
    // https://help.shopify.com/en/manual/orders/edit-orders -> order can be edited through shopify-admin only
    // https://help.shopify.com/en/manual/orders/fulfillment/setting-up-fulfillment -> fullfillments wont include cartToken neither in manual or automatiic
    case SHOPIFY_TRACK_MAP.orders_edited:
    case SHOPIFY_TRACK_MAP.orders_delete:
    case SHOPIFY_TRACK_MAP.fulfillments_create:
    case SHOPIFY_TRACK_MAP.fulfillments_update:
      if (!message.userId) {
        message.setProperty('userId', 'shopify-admin');
      }
      return;
    default:
      logger.error(`Event ${message.event} not supported`);
  }
  if(!isDefinedAndNotNull(cartToken)){
    message.setProperty('anonymousId', 'shopify-admin');
    return;
  }
  let anonymousIDfromDB;
  const executeStartTime = Date.now();
  const redisVal = await RedisDB.getVal(`${cartToken}`);
  stats.timing('redis_get_latency', executeStartTime, {
    ...metricMetadata,
  });
  stats.increment('shopify_redis_get_data', {
    ...metricMetadata,
    timestamp: Date.now(),
  });
  if (redisVal !== null) {
    anonymousIDfromDB = redisVal.anonymousId;
  }
  if (!isDefinedAndNotNull(anonymousIDfromDB)) {
    /* this is for backward compatability when we don't have the redis mapping for older events
    we will get anonymousIDFromDb as null so we will set UUID using the session Key */
    anonymousIDfromDB = sha256(cartToken).toString().substring(0, 36);
  }
  message.setProperty('anonymousId', anonymousIDfromDB);
};

module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  setAnonymousIdorUserIdFromDb,
  setAnonymousId,
};
