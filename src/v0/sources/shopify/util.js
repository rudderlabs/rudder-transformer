/* eslint-disable camelcase */
const _ = require('lodash');
const sha256 = require('sha256');
const { constructPayload, extractCustomFields, flattenJson, generateUUID, isDefinedAndNotNull } = require('../../util');
const { DBConnector } = require('../../../util/redisConnector');
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
const getShopifyTopic = (event) => {
  const { query_parameters: qParams } = event;
  logger.info(`[Shopify] Input event: query_params: ${JSON.stringify(qParams)}`);
  if (!qParams) {
    logger.info(JSON.stringify(event));
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
    case SHOPIFY_TRACK_MAP.carts_create:
    case SHOPIFY_TRACK_MAP.carts_update:
      message.setProperty(
        'anonymousId',
        message.properties?.id
          ? sha256(message.properties.id).toString().substring(0, 36)
          : generateUUID(),
      );
      break;
    case SHOPIFY_TRACK_MAP.orders_delete:
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
const setAnonymousIdorUserIdAndStore = async (message) => {
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
      cartToken = message.properties?.cart_token;
      break;
    /*
     * we dont have cart_token for carts_create and update events but have id and token field
     * which later on for orders become cart_token so we are fethcing cartToken from id
     */
    case SHOPIFY_TRACK_MAP.carts_create:
    case SHOPIFY_TRACK_MAP.carts_update:
      cartToken = message.properties?.id;
      break;
    // https://help.shopify.com/en/manual/orders/edit-orders -> order can be edited through shopify-admin only
    // https://help.shopify.com/en/manual/orders/fulfillment/setting-up-fulfillment -> fullfillments wont include cartToken neither in manual or automatiic
    case SHOPIFY_TRACK_MAP.orders_edited:
    case SHOPIFY_TRACK_MAP.fulfillments_create:
    case SHOPIFY_TRACK_MAP.fulfillments_update:
      if (!message.userId) {
        message.setProperty('userId', 'shopify-admin');
      }
      return;
    default:
  }
  try {
    let anonymousIDfromDB;
    const redisInstance = await DBConnector.getRedisInstance();
    const valFromDB = await redisInstance.get(`${cartToken}`);
    if (valFromDB) {
      const parsedVal = JSON.parse(valFromDB);
      anonymousIDfromDB = parsedVal.anonymousId;
    } else {
      // this is for backward compatability when we don't have the redis mapping for older events
      // we will get anonymousIDFromDb as null so we will set UUID using the session Key
      anonymousIDfromDB = cartToken;
    }
    message.setProperty('anonymousId', anonymousIDfromDB);
  } catch (e) {
    logger.error(`Couldn't fetch data for cartToken ${cartToken} due error: ${e}`);
  }
};

/**
 * It compares the line items element wise and checks the properties parameter for every element
 * as for duplicate ones it may be same.
 * It returns true if every item matches.
 * Example:
 * Input :
 * prevLineItems: [
 * {...,
 * properties:null,
 * ...
 * },
 * {...,
 * properties:null,
 * ...
 * }]
 *
 * newLineItems: [
 * {...,
 * properties:{},
 * ...
 * },
 * {...,
 * properties:{},
 * ...
 * }]
 *
 * This above example can shwo you the need of this function
 * that is to check for properties parameter as
 * in some cases it is {} and in others as null
 * which makes it difficult to comapre the json
 * @param {*} prevLineItems
 * @param {*} newLineItems
 * @returns
 */
// https://shopify.dev/docs/api/liquid/objects/line_item#line_item-properties
const isContainingSameLineItems = (prevLineItems, newLineItems) => {
  let noOfItems = prevLineItems.length;
  while (noOfItems > 0) {
    const modifiedPrev = _.cloneDeep(prevLineItems[noOfItems - 1]);
    const modifiedNew = _.cloneDeep(newLineItems[noOfItems - 1]);
    if (modifiedPrev?.properties === null) {
      modifiedPrev.properties = {};
    }
    if (modifiedNew?.properties === null) {
      modifiedNew.properties = {};
    }
    if (JSON.stringify(modifiedPrev) !== JSON.stringify(modifiedNew)) {
      return false;
    }
    noOfItems -= 1;
  }
  return true;
};

/**
 * This function returns true if payloads are same or Timestamp difference is less than `timeDifferenceForCartEvents` seconds otherwise false
 * @param {*} prevPayload
 * @param {*} newPayload
 */
const isDuplicateCartPayload = (prevPayload, newPayload) => {
  // The cart?.items.length param is in the case when rudder identifier is stored in the database
  const prevPayloadLineItemsLength = prevPayload?.line_items?.length || prevPayload.cart?.items.length
  const newPayloadLineItemsLength = newPayload.line_items?.length || newPayload.cart?.items.length
  if (prevPayloadLineItemsLength !== newPayloadLineItemsLength) {
    return false;
  }
  if (
    Date.parse(newPayload.updated_at) - Date.parse(prevPayload.updated_at) <
    timeDifferenceForCartEvents ||
    newPayloadLineItemsLength === 0 ||
    isContainingSameLineItems(prevPayload.line_items, newPayload.line_items)
  ) {
    return true;
  }
  return false;
};

/**
 * This Function will check for cart duplication events
 * @param {*} event
 */
const checkForValidRecord = async (newCart) => {
  const cartToken = newCart.cart_token || newCart.token;
  let redisVal = {};
  let cartDetails;
  let redisInstance;
  let anonymousId;
  try {
    redisInstance = await DBConnector.getRedisInstance();
    cartDetails = await redisInstance.get(`${cartToken}`);
  } catch (e) {
    logger.error(`Could not get cart details due error: ${e}`);
  }
  if (cartDetails) {
    redisVal = JSON.parse(cartDetails);
    anonymousId = redisVal.anonymousId;
    if (isDefinedAndNotNull(redisVal) && isDuplicateCartPayload(redisVal, newCart)) {
      return false;
    }
  }
  try {
    await redisInstance.set(`${cartToken}`, JSON.stringify({ anonymousId, ...newCart }));
  } catch (e) {
    logger.error(`Could not set cart details due error: ${e}`);
  }
  return true;
};

module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  setAnonymousIdorUserIdAndStore,
  checkForValidRecord,
  setAnonymousId,
};
