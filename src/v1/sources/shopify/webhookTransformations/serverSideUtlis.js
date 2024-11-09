const { constructPayload } = require('../../../../v0/util');

const {
  lineItemsMappingJSON,
  productMappingJSON,
} = require('../../../../v0/sources/shopify/config');

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
    // const product = constructPayload(lineItem, lineItemsMappingJSON);
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
const createPropertiesForEcomEventFromWebhook = (message) => {
  const { line_items: lineItems } = message;
  if (!lineItems || lineItems.length === 0) {
    return [];
  }
  const mappedPayload = constructPayload(message, productMappingJSON);
  mappedPayload.products = getProductsFromLineItems(lineItems, lineItemsMappingJSON);
  return mappedPayload;
};

module.exports = {
  createPropertiesForEcomEventFromWebhook,
  getProductsFromLineItems,
};
