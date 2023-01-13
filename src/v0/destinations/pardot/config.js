const { getMappingConfig } = require("../../util");

const BASE_URL = "https://pi.pardot.com";
const version = "4";

const endpoints = {
  upsertUrl: `${BASE_URL}/api/prospect/version/${version}/do/upsert`
};

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "PardotIdentify",
    endPointUpsert: endpoints.upsertUrl
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  identifyConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  DESTINATION: "PARDOT",
  CONFIG_CATEGORIES
};
