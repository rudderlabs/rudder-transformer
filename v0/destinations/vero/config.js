const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.getvero.com/api/v2";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "VeroIdentifyConfig",
    type: "identify",
    endpoint: `${BASE_URL}/users/track`,
    method: "POST"
  },
  TRACK: {
    name: "VeroTrackConfig",
    type: "track",
    endpoint: `${BASE_URL}/events/track`,
    method: "POST"
  },
  ALIAS: {
    name: "VeroAliasConfig",
    type: "alias",
    endpoint: `${BASE_URL}/users/reidentify`,
    method: "PUT"
  },
  TAGS: {
    name: "VeroSimpleConfig",
    type: "tags",
    endpoint: `${BASE_URL}/users/tags/edit`,
    method: "PUT"
  },
  UNSUBSCRIBE: {
    name: "VeroSimpleConfig",
    type: "unsubscribe",
    endpoint: `${BASE_URL}/users/unsubscribe`,
    method: "POST"
  },
  RESUBSCRIBE: {
    name: "VeroSimpleConfig",
    type: "resubscribe",
    endpoint: `${BASE_URL}/users/resubscribe`,
    method: "POST"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
