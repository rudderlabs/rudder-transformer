const {
  constructPayload,
  //   extractCustomFields,
  //   flattenJson,
  //   generateUUID,
  //   isDefinedAndNotNull,
} = require('../../../v0/util');

const {
  lineItemsMappingJSON,
  productMappingJSON,
  //   LINE_ITEM_EXCLUSION_FIELDS,
  //   PRODUCT_MAPPING_EXCLUSION_FIELDS,
  //   SHOPIFY_TRACK_MAP,
  //   SHOPIFY_ADMIN_ONLY_EVENTS,
  //   useRedisDatabase,
  //   maxTimeToIdentifyRSGeneratedCall,
} = require('../../../v0/sources/shopify/config');

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

const createPropertiesForV2EcomEvent = (message) => {
  const { line_items: lineItems } = message;
  if (!lineItems || lineItems.length === 0) {
    return [];
  }
  const mappedPayload = constructPayload(message, productMappingJSON);
  mappedPayload.products = getProductsFromLineItems(lineItems, lineItemsMappingJSON);
  return mappedPayload;
};

module.exports = {
  createPropertiesForV2EcomEvent,
  getProductsFromLineItems,
};
