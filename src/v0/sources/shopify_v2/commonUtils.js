/* eslint-disable camelcase */
const stats = require('../../../util/stats');
const { flattenJson } = require('../../util');
const { RedisDB } = require('../../../util/redis/redisConnector');
const logger = require('../../../logger');
const { TransformationError } = require('../../util/errorTypes');

const getCartToken = (message, shopifyTopic) => {
  if (shopifyTopic === 'carts_update') {
    return message.id || message.token || message.properties?.cart_id;
  }
  return message.cart_token || message.properties?.cart_token || null;
};

const getDataFromRedis = async (key, metricMetadata) => {
  try {
    stats.increment('shopify_redis_calls', {
      type: 'get',
      field: 'all',
      ...metricMetadata,
    });
    const dbData = await RedisDB.getVal(key);
    if (dbData === null) {
      stats.increment('shopify_redis_no_val', {
        ...metricMetadata,
      });
    }
    return dbData;
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

/**
 * This function generates the lineItems containing id and quantity only for a cart event
 * @param {*} cartEvent
 * returns lineItems Object with { line_items.$.id: line_items.$.quantiy}
 */
const getLineItems = (cartEvent) => {
  const lineItems = {};
  if (cartEvent?.line_items?.length > 0) {
    const { line_items } = cartEvent;
    line_items.forEach((element) => {
      lineItems[element.id] = {
        quantity: element?.quantity,
        variant_id: element?.variant_id,
        key: element?.key,
        price: element?.price,
        product_id: element?.product_id,
        sku: element?.sku,
        title: element?.title,
        vendor: element?.vendor,
      };
    });
    return lineItems;
  }
  return 'EMPTY';
};

const getLineItemsToStore = (cart) => {
  const lineItems = getLineItems(cart);
  if (lineItems === 'EMPTY') {
    return lineItems;
  }
  return JSON.stringify(lineItems);
  // return msgpack.encode(lineItems);
};

const getUnhashedLineItems = (lineItems) => {
  if (lineItems === 'EMPTY') {
    return {};
  }
  return JSON.parse(lineItems);
  // return msgpack.decode(lineItems);
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
  extractEmailFromPayload,
  getLineItemsToStore,
  getDataFromRedis,
  getUnhashedLineItems,
};
