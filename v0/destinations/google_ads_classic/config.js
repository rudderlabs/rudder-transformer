const { getMappingConfig } = require("../../util");

const baseEndpoint = "https://www.googleadservices.com/pagead/conversion/app/";

const CONFIG_CATEGORIES = {
  TRACK: { name: "GoogleAdsTrackConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const reservedEventNames = [
  "first_open",
  "session_start",
  "in_app_purchase",
  "view_item_list",
  "view_item",
  "view_search_results",
  "add_to_cart",
  "ecommerce_purchase",
  "custom"
];

const mappedEventTypes = {
  "application installed": "first_open",
  "application opened": "session_start",
  "product list viewed": "view_item_list",
  "product added": "add_to_cart",
  "products searched": "view_search_results",
  "product viewed": "view_item"
};

module.exports = {
  trackConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  baseEndpoint,
  reservedEventNames,
  mappedEventTypes
};
