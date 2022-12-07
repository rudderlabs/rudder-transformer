const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.revenuecat.com/v1";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "RCIdentifyConfig",
    type: "identify"
  },
  TRACK: {
    name: "RCTrackConfig",
    type: "track"
  },
  PROPERTY: {
    name: "RCProductConfig"
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
  "addGroup",
  "campaign",
  "adGroup",
  "adjustId",
  "amazonAdId",
  "androidId",
  "fbAnonId",
  "idfa",
  "idfv",
  "iterableCampaignId",
  "iterableTemplateId",
  "mixpanelDistinctId",
  "airshipChannelId",
  "onesignalId",
  "mparticleId",
  "iterableUserId",
  "appsflyerId",
  "fcmTokens",
  "clevertapId"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  REVENUE_CAT_IDENTIFY_EXCLUSION,
  BASE_URL
};
