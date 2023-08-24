/* eslint-disable camelcase */
const sha256 = require('sha256');
const stats = require('../../../util/stats');
const { constructPayload, extractCustomFields, flattenJson } = require('../../util');
const { RedisDB } = require('../../../util/redis/redisConnector');
const logger = require('../../../logger');
const {
  lineItemsMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  RUDDER_ECOM_MAP,
  ECOM_MAPPING_JSON,
} = require('./config');
const { TransformationError } = require('../../util/errorTypes');

const getCartToken = (message, shopifyTopic) => {
  if (shopifyTopic === 'carts_update') {
    return message.properties?.id || message.properties?.token;
  }
  return message.properties?.cart_token || null;
};

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
  } catch (e) {
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


const getProductsListFromLineItems = (lineItems) => {
  if (!lineItems || lineItems.length === 0) {
    return [];
  }
  const products = [];
  lineItems.forEach((lineItem) => {
    const product = constructPayload(lineItem, lineItemsMappingJSON);
    extractCustomFields(lineItem, product, 'root', LINE_ITEM_EXCLUSION_FIELDS);
    products.push(product);
  });
  return products;
};
/**
 * This function creates the ecom event specific payload through mapping jsons
 * @param {*} message
 * @param {*} shopifyTopic
 * @returns mapped payload for an ecom event
 */
const createPropertiesForEcomEvent = (message, shopifyTopic) => {
  const mappedPayload = constructPayload(
    message,
    ECOM_MAPPING_JSON[RUDDER_ECOM_MAP[shopifyTopic].name],
  );
  // extractCustomFields(message, mappedPayload, 'root', PROPERTIES_MAPPING_EXCLUSION_FIELDS);
  if (RUDDER_ECOM_MAP[shopifyTopic].lineItems) {
    const { line_items: lineItems } = message;
    const productsList = getProductsListFromLineItems(lineItems);
    mappedPayload.products = productsList;
  }

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

module.exports = {
  getCartToken,
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
  getHashLineItems,
  getDataFromRedis,
};
