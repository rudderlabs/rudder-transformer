const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.clevertap.com/1/upload";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "CleverTapIdentify" },
  PAGESCREEN: { name: "CleverTapPageScreen" },
  TRACK: { name: "CleverTapTrack" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
