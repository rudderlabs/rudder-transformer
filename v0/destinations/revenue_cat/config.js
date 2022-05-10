const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "RCIdentifyConfig",
    type: "identify"
  },
  TRACK: {
    name: "RCTrackConfig",
    type: "track"
  }
};

const REVENUE_CAT_IDENTIFY_EXCLUSION = [
  "email",
  "phone",
  "phoneNumber",
  "phone_number",
  "name",
  "userId",
  "anonymousId",
  "id",
  "apnsTokens",
  "gpsAdId",
  "creative",
  "keyword",
  "mediaSource",
  "ad",
  "addGroup"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  REVENUE_CAT_IDENTIFY_EXCLUSION
};
