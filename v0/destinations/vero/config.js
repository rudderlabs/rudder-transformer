const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.getvero.com/api/v2";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "VeroIdentifyConfig",
    type: "identify",
    endpoint: `${BASE_URL}/users/track`
  },
  TRACK: {
    name: "VeroTrackConfig",
    type: "track",
    endpoint: `${BASE_URL}/events/track`
  },
  ALIAS: {
    name: "VeroAliasConfig",
    type: "alias",
    endpoint: `${BASE_URL}/users/reidentify`
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
