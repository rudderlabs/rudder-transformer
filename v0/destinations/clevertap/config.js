const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://{{value}}api.clevertap.com/1/upload";

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "CleverTapIdentify", type: "identify" },
  PAGE: { name: "CleverTapPage", type: "page" },
  SCREEN: { name: "CleverTapScreen", type: "screen" },
  TRACK: { name: "CleverTapTrack", type: "track" }
};

const CLEVERTAP_DEFAULT_EXCLUSION = [
  "email",
  "name",
  "phone",
  "gender",
  "education",
  "birthday",
  "married",
  "customerType",
  "anonymousId",
  "userId",
  "id"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CLEVERTAP_DEFAULT_EXCLUSION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
