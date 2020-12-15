const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.indicative.com/service";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "ACIdentify" },
  PAGE: { name: "ACPage" },
  SCREEN: { name: "ACScreen" },
  TRACK: { name: "ACTrack" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
