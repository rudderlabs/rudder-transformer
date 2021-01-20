const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.indicative.com/service";
const TRACK_ENDPOINT = `${BASE_ENDPOINT}/event`;
const IDENTIFY_ENDPOINT = `${BASE_ENDPOINT}/identify`;
const ALIAS_ENDPOINT = `${BASE_ENDPOINT}/alias`;

const CONFIG_CATEGORIES = {
  ALIAS: { endPoint: ALIAS_ENDPOINT, name: "INAliasConfig" },
  IDENTIFY: { endPoint: IDENTIFY_ENDPOINT, name: "INIdentifyConfig" },
  PAGE: { endPoint: TRACK_ENDPOINT, name: "INPageConfig" },
  SCREEN: { endPoint: TRACK_ENDPOINT, name: "INScreenConfig" },
  TRACK: { endPoint: TRACK_ENDPOINT, name: "INTrackConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
