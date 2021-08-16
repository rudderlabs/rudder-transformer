const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.ometria.com/v2/push";
const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "OmetriaContact" }
};

const MAX_BATCH_SIZE = 100;
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const IDENTIFY_EXCLUSION_FIELDS = [
  "email",
  "phoneNumber",
  "collection",
  "marketinOptin",
  "userIdOnly",
  "prefix",
  "first_name",
  "firstName",
  "last_name",
  "lastName",
  "middle_name",
  "middleName",
  "firstName",
  "lastname",
  "middlename",
  "dateOfBirth",
  "countryId",
  "timezone",
  "timestampSubscribed",
  "timestampUnsubscribed",
  "channels",
  "storeIds",
  "gender",
  "removeFromLists",
  "addToLists",
  "marketingOptin",
  "properties",
  "listingId"
];

const MARKETING_OPTIN_LIST = [
  "EXPLICITYLY_OPTED_OUT",
  "NOT_SPECIFIED",
  "EXPLICITLY_OPTED_IN"
];

module.exports = {
  ENDPOINT,
  MAX_BATCH_SIZE,
  IDENTIFY_EXCLUSION_FIELDS,
  MARKETING_OPTIN_LIST,
  contactDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
