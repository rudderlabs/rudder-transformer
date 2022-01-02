const path = require("path");
const fs = require("fs");
const { EventType } = require("../../../constants");

const IDENTIFY_TOPICS = {
  CUSTOMERS_CREATE: "customers_create",
  CUSTOMERS_UPDATE: "customers_update"
};

// Mapping from shopify_topic name for ecom events
const ECOM_TOPICS = {
  CHECKOUT_CREATE: "checkout_create",
  ORDER_UPDATED: "order_updated"
};

const RUDDER_ECOM_MAP = {
  checkout_create: "Checkout Started",
  order_updated: "Order Updated"
};

const identifyMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data", "identifyMapping.json"))
);

const productMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data", "productMapping.json"))
);

const lineItemsMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data", "lineItemsMapping.json"))
);

const INTEGERATION = "SHOPIFY";

const MAPPING_CATEGORIES = {
  [EventType.IDENTIFY]: identifyMappingJSON,
  [EventType.TRACK]: productMappingJSON
};

const LINE_ITEM_EXCLUSION_FIELDS = [
  "product_id",
  "sku",
  "name",
  "price",
  "vendor",
  "quantity",
  "variant_id",
  "variant_price",
  "variant_title"
];

const PRODUCT_MAPPING_EXCLUSION_FIELDS = [
  "id",
  "total_price",
  "total_tax",
  "currency",
  "line_items"
];

/**
 * this list would contain the list of event names
 */
const SUPPORTED_TRACK_EVENTS = [];

module.exports = {
  ECOM_TOPICS,
  IDENTIFY_TOPICS,
  INTEGERATION,
  MAPPING_CATEGORIES,
  RUDDER_ECOM_MAP,
  lineItemsMappingJSON,
  productMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
  PRODUCT_MAPPING_EXCLUSION_FIELDS,
  SUPPORTED_TRACK_EVENTS
};
