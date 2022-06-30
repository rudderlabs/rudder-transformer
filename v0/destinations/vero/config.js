const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.getvero.com/api/v2";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "VeroIdentifyConfig",
    type: "identify",
    endpoint: `${BASE_URL}/users/track`,
    channelType: "push"
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
  },
  TAGS: {
    name: "VeroTagsConfig",
    type: "identify",
    endpoint: `${BASE_URL}/users/tags/edit`
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
