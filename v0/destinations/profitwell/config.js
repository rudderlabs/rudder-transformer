const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.profitwell.com";

const ConfigCategory = {
  IDENTIFY_CREATE: {
    name: "CreateSubscription",
    action: "identify"
  },
  IDENTIFY_UPDATE: {
    name: "UpdateSubscription",
    action: "identify"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
module.exports = {
  createPayloadMapping: mappingConfig[ConfigCategory.IDENTIFY_CREATE.name],
  updatePayloadMapping: mappingConfig[ConfigCategory.IDENTIFY_UPDATE.name],
  mappingConfig,
  BASE_ENDPOINT
};
