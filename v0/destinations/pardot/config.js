const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.pardot.com/service";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "PardotIdentify" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
