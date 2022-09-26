const { getMappingConfig } = require("../../util");

const BASE_URL = "https://adsapi.snapchat.com/v1";
const ConfigCategory = {
  AUDIENCE_LIST: { type: "audienceList", name: "offlineDataJobs" }
};
const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  BASE_URL,
  ConfigCategory,
  mappingConfig
};
