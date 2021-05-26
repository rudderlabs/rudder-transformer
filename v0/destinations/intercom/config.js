const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.intercom.io";
const ENDPOINTS = {
  IDENTIFY_ENDPOINT: `${BASE_ENDPOINT}/contacts`,
  GROUP_ENDPOINT: `${BASE_ENDPOINT}/companies`,
  TRACK_ENDPOINT: `${BASE_ENDPOINT}/events`
}

const CONFIG_CATEGORY = {
  IDENTIFY: { type: "identify", name: "INTERCOMIdentifyConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORY, __dirname);

module.exports = {
  ENDPOINTS,
  identifyDataMapping: MAPPING_CONFIG[CONFIG_CATEGORY.IDENTIFY.name]
};
