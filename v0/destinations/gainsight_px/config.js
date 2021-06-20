const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.aptrinsic.com/v1";
const ENDPOINTS = {
  USERS_ENDPOINT: `${BASE_ENDPOINT}/users`
};

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "GainsightPX_Identify" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const USER_EXCLUSION_FIELDS = [
  "email",
  "firstName",
  "lastName",
  "lastSeenDate",
  "signUpDate",
  "firstVisitDate",
  "title",
  "phone",
  "score",
  "role",
  "subscriptionId",
  "subscriptionId",
  "numberOfVisits",
  "createDate",
  "globalUnsubscribe",
  "sfdcContactId",
  "customAttributes",
  "name"
];

module.exports = {
  ENDPOINTS,
  USER_EXCLUSION_FIELDS,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
