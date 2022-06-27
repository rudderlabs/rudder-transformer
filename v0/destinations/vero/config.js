const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.getvero.com/api/v2";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "VeroIdentifyConfig",
    type: "identify"
  },
  TRACK: {
    name: "VeroTrackConfig",
    type: "track"
  },
  ALIAS: {
    name: "VeroAliasConfig",
    type: "alias"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
