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
  timeDifferenceForCartEvents,
} = require('./config');

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

/**
 * This function sets the anonymousId based on cart_token or id from the properties of message. 
 * If it's null then we set userId as "ADMIN".
 * @param {*} message 
 * @returns 
 */
const setAnonymousIdorUserId = async (message) => {
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
    case SHOPIFY_TRACK_MAP.orders_delete:
      if (!message.properties?.cart_token || message?.properties?.cart_token === null) {
        /**
         * This case will rise when we will be using Shopify Admin Dashboard to create, update, delete orders etc.
         * Since it is done by admin we will set "userId" to be "admin"
         */
        if (!message?.userId) {
          message.setProperty('userId', 'admin');
        }
        return;
      }
      cartToken = message?.properties?.cart_token;
      break;
    /*
     * we dont have cart_token for carts_create and update events but have id and token field
     * which later on for orders become cart_token so we are fethcing sesionKey from id
    */
    case SHOPIFY_TRACK_MAP.carts_create:
    case SHOPIFY_TRACK_MAP.carts_update:
      cartToken = message?.properties?.id;
      break;

    case SHOPIFY_TRACK_MAP.fulfillments_create:
    case SHOPIFY_TRACK_MAP.fulfillments_update:
      if (!message?.userId) {
        message.setProperty('userId', 'admin');
      }
      return;
    case SHOPIFY_TRACK_MAP.orders_edited:
      cartToken = message?.properties?.order_id;
      break;
    default:
      throw new Error(`${message.event} missed`);
  }

  const valFromDB = JSON.parse(await redisConnector.getFromDB(cartToken));
  let anonymousIDfromDB = valFromDB.anonymousId;
  if (anonymousIDfromDB === null) {
    // this is for backward compatability when we don't have the redis mapping for older events
    // we will get anonymousIDFromDb as null so we will set UUID using the session Key
    anonymousIDfromDB = cartToken;
  }
  message.setProperty('anonymousId', anonymousIDfromDB || "Not Found");
};

/**
 * This function returns true if payloads are same or Timestamp difference is less 10 seconds otherwise false
 * @param {*} prevPayload 
 * @param {*} newPayload 
 */
const compareCartPayloadandTimestamp = (prevPayload, newPayload) => {
  if (Date.parse(newPayload.updated_at) - Date.parse(prevPayload.updated_at) < timeDifferenceForCartEvents || JSON.stringify(prevPayload.line_items) === JSON.stringify(newPayload.line_items)) {
    return true;
  }
  return false;
};

/**
 * This Function will check for cart duplication events 
 * @param {*} event 
 */
const checkForValidRecord = async event => {
  const sesionKey = event.cart_token || event.token;
  const redisVal = JSON.parse(await redisConnector.getFromDB(sesionKey));
  if (redisVal && compareCartPayloadandTimestamp(redisVal, event)) {
    return false;
  }
  redisConnector.postToDB(sesionKey, JSON.stringify({ ...redisVal, ...event }));
  return true;
};

module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  setAnonymousIdorUserId,
  checkForValidRecord
};
