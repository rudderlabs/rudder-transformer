const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.pardot.com/service";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "PardotIdentify" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  identifyConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  MAPPING_CONFIG
};
