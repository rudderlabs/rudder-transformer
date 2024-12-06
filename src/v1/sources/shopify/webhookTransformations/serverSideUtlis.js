const { isDefinedAndNotNull } = require('@rudderstack/integrations-lib');
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

module.exports = {
  createPropertiesForEcomEventFromWebhook,
  getProductsFromLineItems,
  getAnonymousIdFromAttributes,
};
