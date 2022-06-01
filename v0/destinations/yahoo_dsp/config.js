const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://dspapi.admanagerplus.yahoo.com";

const CONFIG_CATEGORIES = {
  AUDIENCE_LIST: { type: "audienceList", name: "Yahoo_DSP_AudienceListConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
