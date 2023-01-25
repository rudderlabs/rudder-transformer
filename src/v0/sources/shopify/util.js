/* eslint-disable camelcase */
const sha256 = require('sha256');
const { constructPayload, extractCustomFields, flattenJson, generateUUID } = require('../../util');
const logger = require('../../../logger');
const {
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS,
  RUDDER_ECOM_MAP,
  SHOPIFY_TRACK_MAP,
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

module.exports = {
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  setAnonymousId,
};
