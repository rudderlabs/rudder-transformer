/* eslint-disable no-param-reassign */
const get = require('get-value');
const { isDefinedAndNotNull } = require('@rudderstack/integrations-lib');
const { extractEmailFromPayload } = require('../../../../v0/sources/shopify/util');
const { constructPayload } = require('../../../../v0/util');
const { INTEGERATION, lineItemsMappingJSON, productMappingJSON } = require('../config');
const { RedisDB } = require('../../../../util/redis/redisConnector');
const stats = require('../../../../util/stats');
/**
 * Returns an array of products from the lineItems array received from the webhook event
 * @param {Array} lineItems
 * @param {Object} mapping
 * @returns {Array} products
 */
const getProductsFromLineItems = (lineItems, mapping) => {
  if (!lineItems || lineItems.length === 0) {
    return [];
  }
  const products = [];
  lineItems.forEach((lineItem) => {
    const product = constructPayload(lineItem, mapping);
    products.push(product);
  });
  return products;
};

/**
 * Creates properties for the ecommerce webhook events received from the pixel based app
 * @param {Object} message
 * @returns {Object} properties
 */
const createPropertiesForEcomEventFromWebhook = (message, shopifyTopic) => {
  const { line_items: lineItems } = message;
  if (!lineItems || lineItems.length === 0) {
    return [];
  }
  const mappedPayload = constructPayload(message, productMappingJSON);
  if (shopifyTopic === 'orders_updated' || shopifyTopic === 'checkouts_update') {
    delete mappedPayload.value;
  }
  mappedPayload.products = getProductsFromLineItems(lineItems, lineItemsMappingJSON);
  return mappedPayload;
};

/**
 * Returns the anonymousId from the noteAttributes array in the webhook event
 * @param {Object} event
 * @returns {String} anonymousId
 */
const getAnonymousIdFromAttributes = (event) => {
  if (!isDefinedAndNotNull(event) || !isDefinedAndNotNull(event.note_attributes)) {
    return null; // Return early if event or note_attributes is invalid
  }

  const noteAttributes = event.note_attributes;
  const rudderAnonymousIdObject = noteAttributes.find((attr) => attr.name === 'rudderAnonymousId');

  return rudderAnonymousIdObject ? rudderAnonymousIdObject.value : null;
};

/**
 * Returns the cart_token from the event message
 * @param {Object} event
 * @returns {String} cart_token
 */
const getCartToken = (event) => event?.cart_token || null;

/**
 * Handles the anonymousId assignment for the message, based on the event attributes and redis data
 * @param {Object} message rudderstack message object
 * @param {Object} event raw shopify event payload
 * @param {Object} metricMetadata metric metadata object
 */
const setAnonymousId = async (message, event, metricMetadata) => {
  const anonymousId = getAnonymousIdFromAttributes(event);
  if (isDefinedAndNotNull(anonymousId)) {
    message.anonymousId = anonymousId;
  } else {
    // if anonymousId is not present in note_attributes or note_attributes is not present, query redis for anonymousId
    const cartToken = getCartToken(event);
    if (cartToken) {
      const redisData = await RedisDB.getVal(`pixel:${cartToken}`);
      if (redisData?.anonymousId) {
        message.anonymousId = redisData.anonymousId;
      }
    } else {
      stats.increment('shopify_pixel_cart_token_not_found_server_side', {
        source: metricMetadata.source,
        writeKey: metricMetadata.writeKey,
      });
    }
  }
};

/**
  Handles userId, email and contextual properties enrichment for the message payload
 * @param {Object} message rudderstack message object
 * @param {Object} event raw shopify event payload
 * @param {String} shopifyTopic shopify event topic
*/
const handleCommonProperties = (message, event, shopifyTopic) => {
  if (message.userId) {
    message.userId = String(message.userId);
  }
  if (!get(message, 'traits.email')) {
    const email = extractEmailFromPayload(event);
    if (email) {
      message.setProperty('traits.email', email);
    }
  }
  message.setProperty(`integrations.${INTEGERATION}`, true);
  message.setProperty('context.library', {
    eventOrigin: 'server',
    name: 'RudderStack Shopify Cloud',
    version: '2.0.0',
  });
  message.setProperty('context.topic', shopifyTopic);
  // attaching cart, checkout and order tokens in context object
  message.setProperty(`context.cart_token`, event.cart_token);
  message.setProperty(`context.checkout_token`, event.checkout_token);
  // raw shopify payload passed inside context object under shopifyDetails
  message.setProperty('context.shopifyDetails', event);
  if (shopifyTopic === 'orders_updated') {
    message.setProperty(`context.order_token`, event.token);
  }
  return message;
};

module.exports = {
  createPropertiesForEcomEventFromWebhook,
  getProductsFromLineItems,
  getAnonymousIdFromAttributes,
  getCartToken,
  setAnonymousId,
  handleCommonProperties,
};
