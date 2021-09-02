const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://insights.algolia.io/1/events";
const CONFIG_CATEGORIES = {
  TRACK: { type: "track", name: "AlgoliaTrack" }
};

const ECOM_EVENTS = [
  "product list viewed",
  "product list filtered",
  "product viewed",
  "product clicked",
  "product added",
  "order completed"
];
const MAX_BATCH_SIZE = 1000;
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  ENDPOINT,
  MAX_BATCH_SIZE,
  ECOM_EVENTS,
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
};
