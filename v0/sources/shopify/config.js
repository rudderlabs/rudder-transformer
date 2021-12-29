const path = require("path");
const fs = require("fs");
const { EventType } = require("../../../constants");

const IDENTIFY_TOPICS = ["customers_create", "customers_update"];

// Mapping from shopify_topic --> Rudder Ecom Event
const ECOM_TOPICS = {
  checkout_create: "Checkout Started",
  order_udpated: "Order Updated"
};

const identifyMappingJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data", "identifyMapping.json"))
);

const INTEGERATION = "SHOPIFY";

const MAPPING_CATEGORIES = {
  [EventType.IDENTIFY]: identifyMappingJSON
};

module.exports = {
  ECOM_TOPICS,
  IDENTIFY_TOPICS,
  INTEGERATION,
  MAPPING_CATEGORIES
};
