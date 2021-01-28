const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.klaviyo.com/service";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "KlaviyoIdentify" },
  PAGE: { name: "KlaviyoPage" },
  SCREEN: { name: "KlaviyoScreen" },
  TRACK: { name: "KlaviyoTrack" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
