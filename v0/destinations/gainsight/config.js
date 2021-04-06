const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://personapi.gainsightcloud.com";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "GAINSIGHTIdentifyConfig" },
  TRACK: { name: "GAINSIGHTTrackConfig" },
  GROUP: { name: "GAINSIGHTGroupConfig"}
};


const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  EVENT_REGEX,
  MAPPING_CONFIG
};
