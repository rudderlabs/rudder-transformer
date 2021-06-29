const { getMappingConfig, getHashFromArray } = require("../../util");

const BASE_URL = "https://graph.facebook.com/v11.0";

function getAudienceId(messageEvent, destination) {
  const { eventAudienceMapping } = destination.Config;
  const hashMap = getHashFromArray(eventAudienceMapping, "from", "to", "false");

  return hashMap[messageEvent] || hashMap["*"];
}

function getEndPoint(audienceId) {
  return `${BASE_URL}/${audienceId}/users`;
}

const CONFIG_CATEGORIES = {
  EVENT: { name: "eventConfig" },
  SESSION: { name: "sessionField" },
  DATA_SOURCE: { name: "data_sourceConfig" }
};

const schemaFields = [
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
// as per real time experimentation maximum 500 users can be added at a time
const MAX_USER_COUNT = 500;
const sessionBlockField = ["session_id", "batch_seq", "last_batch_flag"];
const USER_ADD = "userListAdd";
const USER_DELETE = "userListDelete";

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getEndPoint,
  schemaFields,
  sessionBlockField,
  USER_ADD,
  USER_DELETE,
  MAX_USER_COUNT,
  getAudienceId
};
