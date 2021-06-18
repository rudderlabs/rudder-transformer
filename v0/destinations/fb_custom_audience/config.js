const { getMappingConfig, getHashFromArray } = require("../../util");

const BASE_URL = "https://graph.facebook.com/v11.0";

function getAudienceId(messageEvent, destination) {
  const { eventAudienceMapping } = destination.Config;
  const hashMap = getHashFromArray(eventAudienceMapping, "from", "to");

  return hashMap[messageEvent.toLowerCase()];
}

function getEndPoint(audienceId) {
  const eventUrl = `${BASE_URL}/${audienceId}/users`;
  return eventUrl;
}

const CONFIG_CATEGORIES = {
  EVENT: { name: "eventConfig" }
};

const schemaFiels = [
  "EMAIL_SHA256",
  "PHONE_SHA256",
  "MOBILE_ADVERTISER_ID",
  "EXTERN_ID",
  "EMAIL",
  "PHONE",
  "GEN",
  "DOBY",
  "DOBM",
  "DOBD",
  "LN",
  "FN",
  "FI",
  "CT",
  "ST",
  "ZIP",
  "MADID",
  "COUNTRY"
];

const MAX_USER_COUNT = 10000;
const sessionBlockField = ["session_id", "batch_seq", "last_batch_flag"];
const userUpdateOptions = ["userListAdd", "userListDelete"];
const typeFields = [
  "UNKNOWN",
  "FILE_IMPORTED",
  "EVENT_BASED",
  "SEED_BASED",
  "THIRD_PARTY_IMPORTED",
  "COPY_PASTE",
  "CONTACT_IMPORTER",
  "HOUSEHOLD_AUDIENCE"
];

const subTypeFields = [
  "ANYTHING",
  "NOTHING",
  "HASHES",
  "USER_IDS",
  "HASHES_OR_USER_IDS",
  "MOBILE_ADVERTISER_IDS",
  "EXTERNAL_IDS",
  "MULTI_HASHES",
  "TOKENS",
  "EXTERNAL_IDS_MIX",
  "HOUSEHOLD_EXPANSION",
  "WEB_PIXEL_HITS",
  "MOBILE_APP_EVENTS",
  "MOBILE_APP_COMBINATION_EVENTS",
  "VIDEO_EVENTS",
  "WEB_PIXEL_COMBINATION_EVENTS",
  "PLATFORM",
  "MULTI_DATA_EVENTS",
  "IG_BUSINESS_EVENTS",
  "STORE_VISIT_EVENTS",
  "INSTANT_ARTICLE_EVENTS",
  "FB_EVENT_SIGNALS",
  "ENGAGEMENT_EVENT_USERS",
  "FACEBOOK_WIFI_EVENTS",
  "CUSTOM_AUDIENCE_USERS",
  "PAGE_FANS",
  "CONVERSION_PIXEL_HITS",
  "APP_USERS",
  "S_EXPR",
  "DYNAMIC_RULE",
  "CAMPAIGN_CONVERSIONS",
  "WEB_PIXEL_HITS_CUSTOM_AUDIENCE_USERS",
  "MOBILE_APP_CUSTOM_AUDIENCE_USERS",
  "COMBINATION_CUSTOM_AUDIENCE_USERS",
  "VIDEO_EVENT_USERS",
  "FB_PIXEL_HITS",
  "IG_PROMOTED_POST",
  "PLACE_VISITS",
  "OFFLINE_EVENT_USERS",
  "EXPANDED_AUDIENCE",
  "SEED_LIST",
  "PARTNER_CATEGORY_USERS",
  "PAGE_SMART_AUDIENCE",
  "MULTICOUNTRY_COMBINATION",
  "PLATFORM_USERS",
  "MULTI_EVENT_SOURCE",
  "SMART_AUDIENCE",
  "LOOKALIKE_PLATFORM",
  "SIGNAL_SOURCE",
  "MAIL_CHIMP_EMAIL_HASHES",
  "CONSTANT_CONTACTS_EMAIL_HASHES",
  "COPY_PASTE_EMAIL_HASHES",
  "CONTACT_IMPORTER",
  "DATA_FILE"
];

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getEndPoint,
  schemaFiels,
  CustomError,
  sessionBlockField,
  userUpdateOptions,
  MAX_USER_COUNT,
  typeFields,
  subTypeFields,
  getAudienceId
};
