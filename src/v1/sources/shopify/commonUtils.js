/* eslint-disable camelcase */
const zlib = require('zlib');
const { TransformationError } = require('@rudderstack/integrations-lib');
const stats = require('../../../util/stats');
const { flattenJson } = require('../../../v0/util');
const { RedisDB } = require('../../../util/redis/redisConnector');
const logger = require('../../../logger');

const getCartToken = (message, shopifyTopic) => {
  if (shopifyTopic === 'carts_update') {
    return message.id || message.token || message.properties?.cart_id;
  }
  return message.cart_token || message.properties?.cart_token || null;
};

/**
 * This fucntion fetches the data from redis for a particular key and  w.r.t. shopify integration
 * @param {*} key 
 * @param {*} metricMetadata 
 * @returns 
 */
const getDataFromRedis = async (key, metricMetadata) => {
  try {
    stats.increment('shopify_redis_calls', {
      type: 'get',
      field: 'all',
      ...metricMetadata,
    });
    const dbData = await RedisDB.getVal(key);
    if (dbData === null || (typeof dbData === 'object' && Object.keys(dbData).length === 0)) {
      stats.increment('shopify_redis_no_val', {
        ...metricMetadata,
      });
    }
    if (dbData.lineItems && dbData.lineItems !== 'EMPTY') {
      const decodedData = Buffer.from(dbData.lineItems, 'base64');
      const decompressedData = zlib.gunzipSync(decodedData).toString();
      dbData.lineItems = JSON.parse(decompressedData);
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
  if (cartEvent.line_items?.length > 0) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { line_items } = cartEvent;
    line_items.forEach((element) => {
      lineItems[element.id] = {
        quantity: element.quantity,
        variant_id: element.variant_id,
        key: element.key,
        price: element.price,
        product_id: element.product_id,
        sku: element.sku,
        title: element.title,
        vendor: element.vendor,
      };
    });
    return lineItems;
  }
  return 'EMPTY';
};
/**
 * This fucntion generates the line items that we want to store in db.
 * If it is EMPTY we store it as it is otherwise we compress the line_itmes using zipping and base64 encoding
 * and return to let redis take less space to store this data
 * @param {*} cart
 * @returns
 */
const getLineItemsToStore = (cart) => {
  const lineItems = getLineItems(cart);
  if (lineItems === 'EMPTY') {
    return lineItems;
  }
  const a = zlib.gzipSync(JSON.stringify(lineItems));

  return a.toString('base64'); // compressing the data here
};

const extractEmailFromPayload = (event) => {
  const flattenedPayload = flattenJson(event);
  let email;
  // eslint-disable-next-line @typescript-eslint/naming-convention
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

const sanitizePayload = (obj) => {
  const objWithNonNullValues = JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (value === null) {
        return undefined;
      }
      const regexForPrice = /price/i;
      if (regexForPrice.test(key) && typeof value === 'string') {
        // Try parsing as float
        const floatResult = parseFloat(value) * 1.0;

        // Check if either parsing resulted in a valid number
        if (!Number.isNaN(floatResult)) {
          return floatResult;
        }
        // Try parsing as integer
        const intResult = parseInt(value, 10);
        if (!Number.isNaN(intResult)) {
          return intResult;
        }
      }
      return value;
    }),
  );
  return objWithNonNullValues;
};

/**
* This function sets the updated cart stae in redis in the form 
* newCartItemsHash = [{
   id: "some_id",
   quantity: 2,
   variant_id: "vairnat_id",
   key: 'some:key',
   price: '30.00',
   product_id: 1234,
   sku: '40',
   title: 'Product Title',
   vendor: 'example',
 }]
* @param {*} updatedCartState
* @param {*} cart_token
* @param {*} metricMetadata
*/
const updateCartState = async (updatedCartState, cart_token, metricMetadata) => {
  if (cart_token) {
    try {
      stats.increment('shopify_redis_calls', {
        type: 'set',
        field: 'lineItems',
        ...metricMetadata,
      });
      await RedisDB.setVal(`${cart_token}`, ['lineItems', updatedCartState]);
    } catch (e) {
      logger.debug(`{{SHOPIFY::}} cartToken map set call Failed due redis error ${e}`);
      stats.increment('shopify_redis_failures', {
        type: 'set',
        ...metricMetadata,
      });
    }
  }
};
module.exports = {
  getCartToken,
  getShopifyTopic,
  extractEmailFromPayload,
  getLineItemsToStore,
  getDataFromRedis,
  sanitizePayload,
  updateCartState,
};
