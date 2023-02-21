/* eslint-disable camelcase */
const { constructPayload, extractCustomFields, flattenJson } = require('../../util');
const { redisConnector } = require('../../../util/redisConnector');
const logger = require('../../../logger');
const {
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS,
  RUDDER_ECOM_MAP,
  SHOPIFY_TRACK_MAP,
  ORDER_CACHE_TTL,
} = require('./config');
const Cache = require('../../util/cache');

const orderIdCache = new Cache(ORDER_CACHE_TTL); // 1 hr
const { TransformationError } = require('../../util/errorTypes');

/**
 * query_parameters : { topic: ['<shopify_topic>'], ...}
 * Throws error otherwise
 * @param {*} event
 * @returns
 */
function getShopifyTopic(event) {
  const { query_parameters: qParams } = event;
  logger.info(`[Shopify] Input event: query_params: ${JSON.stringify(qParams)}`);
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
}

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
/**
 * This function sets the anonymousId based on cart_token or id from the properties of message. 
 * If it's null then we set userId as "ADMIN".
 * @param {*} message 
 * @returns 
 */
const setAnonymousIdorUserId = async (message) => {
  let sessionKey;
  switch (message.event) {
    /**
     * Following events will contain cart_token and we will map it in sessionKey
     */
    case RUDDER_ECOM_MAP.checkouts_create:
    case RUDDER_ECOM_MAP.checkouts_update:
    case SHOPIFY_TRACK_MAP.orders_edited:
    case SHOPIFY_TRACK_MAP.orders_cancelled:
    case SHOPIFY_TRACK_MAP.orders_fulfilled:
    case SHOPIFY_TRACK_MAP.orders_paid:
    case SHOPIFY_TRACK_MAP.orders_partially_fullfilled:
    case RUDDER_ECOM_MAP.orders_create:
      if (message?.properties?.cart_token === null) {
        /**
         * This case will rise when we will be using Shopify Admin Dashboard to create, update, delete orders etc.
         * Since it is done by admin we will set "userId" to be "admin"
         */
        message.setProperty('userId', 'admin');
        return;
      }
      sessionKey = message?.properties?.cart_token;
      break;
    /** 
     * orders_updated event is kept different from other orders events 
     * as we will be storing id vs cart_token map in cache from its payload
     */
    case RUDDER_ECOM_MAP.orders_updated:
      // cache the orderID to cart_token to help the fullfillments events to get anonymousID
      orderIdCache.get(message?.properties?.id, async () => message?.properties?.cart_token);
      if (message?.properties?.cart_token === null) {
        /**
         * This case will rise when we will be using Shopify Admin Dashboard to create, update, delete orders etc.
         * Since it is done by admin we will set "userId" to be "admin"
         */
        message.setProperty('userId', 'admin');
        return;
      }
      sessionKey = message?.properties?.cart_token;
      break;

    /*
     * we dont have cart_token for carts_create and update events but have id and token field
     * which later on for orders become cart_token so we are fethcing sesionKey from id
     */
    case SHOPIFY_TRACK_MAP.carts_create:
    case SHOPIFY_TRACK_MAP.carts_update:
      sessionKey = message?.properties?.id;
      break;
    case SHOPIFY_TRACK_MAP.orders_delete:
      /* 
       * "delete" event dont have "cart_token" but an "id" which is "order_id" in other order events using which
       * we will be fetching the "cart_token" through cache
       */
      sessionKey = orderIdCache.get(message?.properties?.id, async () => null);
      break;

    case SHOPIFY_TRACK_MAP.fulfillments_create:
    case SHOPIFY_TRACK_MAP.fulfillments_update:
      /** "fulfillments" event dont have "cart_token" but an "order_id" same as in order events using which
       * we will be fetching the "cart_token" through cache
       */
      sessionKey = orderIdCache.get(message.properties?.order_id, async () => null);
      break;
    default:
      throw new Error(`${message.event} missed`);
  }
  if (!sessionKey) {
    throw new Error(`Impossible for ${message.event}`);
  }
  const anonymousIDfromDB = await redisConnector.getFromDB(sessionKey);
  message.setProperty('anonymousId', anonymousIDfromDB || "Not Found");
};

module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  setAnonymousIdorUserId
};
