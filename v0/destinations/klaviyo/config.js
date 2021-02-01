const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://a.klaviyo.com";
const LIST_SUBSCRIBE_URL = "/api/v2/list/###/members";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "KlaviyoIdentify", apiUrl: "/api/identify" },
  SCREEN: { name: "KlaviyoScreen", apiUrl: "/api/track" },
  TRACK: { name: "KlaviyoTrack", apiUrl: "/api/track" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  LIST_SUBSCRIBE_URL
};
