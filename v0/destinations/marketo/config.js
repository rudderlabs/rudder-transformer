const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "MARKETOIdentify" },
  PAGE: { name: "MARKETOPage" },
  SCREEN: { name: "MARKETOScreen" },
  TRACK: { name: "MARKETOTrack" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
