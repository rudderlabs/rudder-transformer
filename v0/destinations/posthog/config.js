const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://app.posthog.com";

const CONFIG_CATEGORIES = {
  ALIAS: {
    endPoint: BASE_ENDPOINT,
    name: "PHAliasConfig",
    type: "alias",
    event: "$create_alias"
  },
  TRACK: { endPoint: BASE_ENDPOINT, name: "PHTrackConfig", type: "track" },
  IDENTIFY: {
    endPoint: BASE_ENDPOINT,
    name: "PHIdentifyConfig",
    type: "identify",
    event: "$identify"
  },
  GROUP: {
    endPoint: BASE_ENDPOINT,
    name: "PHGroupConfig",
    type: "group",
    event: "$group"
  },
  PAGE: {
    endPoint: BASE_ENDPOINT,
    name: "PHPageConfig",
    type: "page",
    event: "$page"
  },
  SCREEN: {
    endPoint: BASE_ENDPOINT,
    name: "PHScreenConfig",
    type: "screen",
    event: "$screen"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
