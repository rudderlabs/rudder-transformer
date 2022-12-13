const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT_MAIN = "https://api.sendinblue.com";
const BASE_ENDPOINT_TRACKER = "https://in-automate.sendinblue.com";
const VERSION_MAIN = "v3";
const VERSION_TRACKER = "v2";
const EMAIL_SUFFIX = "@mailin-sms.com";

const CONFIG_CATEGORIES = {
  TRACK_EVENTS: {
    name: "SendinblueTrackEventConfig",
    type: "track",
    endpoint: `${BASE_ENDPOINT_TRACKER}/api/${VERSION_TRACKER}/trackEvent`
  },
  TRACK_LINK: {
    name: "SendinblueTrackLinkConfig",
    eventName: "trackLink",
    type: "track",
    endpoint: `${BASE_ENDPOINT_TRACKER}/api/${VERSION_TRACKER}/trackLink`
  },
  PAGE: {
    name: "SendinbluePageConfig",
    type: "page",
    endpoint: `${BASE_ENDPOINT_TRACKER}/api/${VERSION_TRACKER}/trackPage`
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT_MAIN,
  BASE_ENDPOINT_TRACKER,
  VERSION_MAIN,
  VERSION_TRACKER,
  EMAIL_SUFFIX,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  DESTINATION: "SENDINBLUE"
};
