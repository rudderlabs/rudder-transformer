const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.getdrip.com";

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "DripIdentify" },
  TRACK: { type: "track", name: "DripTrack" },
  CAMPAIGN: { type: "campaign", name: "DripCampaign" }
};

const IDENTIFY_EXCLUSION_FIELDS = [
  "email",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "name",
  "phone",
  "userId",
  "anonymousId",
  "id",
  "status",
  "initial_status",
  "time_zone",
  "country",
  "city",
  "zip",
  "ip_address",
  "euConsentMessage",
  "euConsent",
  "address",
  "tags",
  "removeTags"
];

const TRACKING_EXLCUSION_FIELDS = [
  "action",
  "email",
  "prospect",
  "occurred_at",
  "properties",
  "id"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ENDPOINT,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  campaignMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.CAMPAIGN.name],
  IDENTIFY_EXCLUSION_FIELDS,
  TRACKING_EXLCUSION_FIELDS
};
