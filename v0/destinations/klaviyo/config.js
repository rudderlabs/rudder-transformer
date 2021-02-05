const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://a.klaviyo.com";

// TRACK and IDENTIFY DOCS: https://www.klaviyo.com/docs/http-api
// LIST API [MEMBERSHIP/SUBSCRIBE] DOCS:https://www.klaviyo.com/docs/http-api

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "KlaviyoIdentify", apiUrl: "/api/identify" },
  SCREEN: { name: "KlaviyoTrack", apiUrl: "/api/track" },
  TRACK: { name: "KlaviyoTrack", apiUrl: "/api/track" },
  GROUP: { name: "KlaviyoGroup" }
};

const LIST_CONF = {
  SUBSCRIBE: "Subscribe",
  MEMBERSHIP: "Membership"
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  LIST_CONF
};
