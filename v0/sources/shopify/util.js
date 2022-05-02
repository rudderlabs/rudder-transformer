/* eslint-disable camelcase */
const {
  CustomError,
  constructPayload,
  extractCustomFields,
  flattenJson
} = require("../../util");
const {
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS
} = require("./config");

/**
 * query_parameters : { topic: ['<shopify_topic>'], ...}
 * Throws error otherwise
 * @param {*} event
 * @returns
 */
const getShopifyTopic = event => {
  const { query_parameters: qParams } = event;
  console.log("query_params", qParams);
  if (!qParams) {
    throw new CustomError("[Shopify Source] query_parameters is missing", 400);
  }
  const { topic } = qParams;
  if (!topic || !Array.isArray(topic)) {
    throw new CustomError(
      "[Shopify Source] invalid topic in query_parameters",
      400
    );
  }

  if (topic.length === 0) {
    throw new CustomError("[Shopify Source] topic not found", 400);
  }
  return topic[0];
};

const getVariantString = lineItem => {
  const { variant_id, variant_price, variant_title } = lineItem;
  return `${variant_id || ""} ${variant_price || ""} ${variant_title || ""}`;
};

const getProductsListFromLineItems = lineItems => {
  if (!lineItems || lineItems.length === 0) {
    return [];
  }
  const products = [];
  lineItems.forEach(lineItem => {
    const product = constructPayload(lineItem, lineItemsMappingJSON);
    extractCustomFields(lineItem, product, "root", LINE_ITEM_EXCLUSION_FIELDS);
    product.variant = getVariantString(lineItem);
    products.push(product);
  });
  return products;
};

const createPropertiesForEcomEvent = message => {
  const { line_items: lineItems } = message;
  const productsList = getProductsListFromLineItems(lineItems);
  const mappedPayload = constructPayload(message, productMappingJSON);
  extractCustomFields(
    message,
    mappedPayload,
    "root",
    PRODUCT_MAPPING_EXCLUSION_FIELDS
  );
  mappedPayload.products = productsList;
  return mappedPayload;
};

const extractEmailFromPayload = event => {
  const flattenedPayload = flattenJson(event);
  let email;
  const regex_email = new RegExp("\\bemail\\b", "i");
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
  getShopifyTopic,
  getProductsListFromLineItems,
  createPropertiesForEcomEvent,
  extractEmailFromPayload
};
