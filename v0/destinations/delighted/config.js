const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.delighted.com/v1/people.json";

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "DelightedIdentify" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const TRACKING_EXCLUSION_FIELDS = ["channel", "delay", "last_sent_at", "send"];

module.exports = {
  ENDPOINT,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  TRACKING_EXCLUSION_FIELDS
};
