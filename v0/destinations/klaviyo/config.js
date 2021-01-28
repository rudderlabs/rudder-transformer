const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://a.klaviyo.com";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "KlaviyoIdentify", apiUrl: "/api/identify" },
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
