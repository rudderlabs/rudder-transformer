const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.lytics.io/collect/json";
const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "LYTICSIdentifyConfig"
  },
  PAGESCREEN: {
    name: "LYTICSPageScreenConfig"
  },
  TRACK: {
    name: "LYTICSTrackConfig"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ENDPOINT,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES
};
