const { getMappingConfig } = require("../../util");

const BASE_URL = "https://pi.pardot.com";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "PardotIdentify" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  identifyConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
