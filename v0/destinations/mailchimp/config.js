const { getMappingConfig } = require("../../util");

// const BASE_URL = 'https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}';
const MAX_BATCH_SIZE = 10;

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "mailchimpIdentifyConfig",
    type: "identify"
  }
};

const MAILCHIMP_IDENTIFY_EXCLUSION = [
  "email",
  "firstName",
  "lastName",
  "FirstName",
  "LastName",
  "firstname",
  "lastname",
  "phone",
  "Phone",
  "PHONE",
  "address",
  "Address",
  "ADDRESS"
];
const SUBSCRIPTION_STATUS = {
  subscribed: "subscribed",
  pending: "pending"
};

const VALID_STATUSES = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAX_BATCH_SIZE,
  MAILCHIMP_IDENTIFY_EXCLUSION,
  SUBSCRIPTION_STATUS,
  VALID_STATUSES,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  MAPPING_CONFIG
};
