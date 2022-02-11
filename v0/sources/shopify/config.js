const path = require("path");
const fs = require("fs");
const { EventType } = require("../../../constants");

const IDENTIFY_TOPICS = {
  CUSTOMERS_CREATE: "customers_create",
  CUSTOMERS_UPDATE: "customers_update"
};

// Mapping from shopify_topic name for ecom events
const ECOM_TOPICS = {
  CHECKOUTS_CREATE: "checkouts_create",
  ORDERS_UPDATED: "orders_updated"
};

const RUDDER_ECOM_MAP = {
  checkouts_create: "Checkout Started",
  orders_updated: "Order Updated"
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
 * list of events name supported as generic track calls
 * track events not belonging to this list or ecom events will
 * be discarded.
 */
const SUPPORTED_TRACK_EVENTS = [
  "checkouts_delete",
  "checkouts_update",
  "customers_disabled",
  "customers_enable",
  "carts_create",
  "carts_update",
  "fulfillments_create",
  "fulfillments_update",
  "orders_create",
  "orders_delete",
  "orders_cancelled",
  "orders_fulfilled",
  "orders_paid",
  "orders_partially_fullfilled"
];

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
