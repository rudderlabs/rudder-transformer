const { getMappingConfig } = require("../../util");

const MAX_BATCH_SIZE = 500;
// ref: https://mailchimp.com/developer/marketing/api/lists/batch-subscribe-or-unsubscribe/

const MAILCHIMP_IDENTIFY_EXCLUSION = [
  "email",
  "firstName",
  "lastName",
  "FirstName",
  "LastName",
  "firstname",
  "lastname",
  "addr1",
  "city",
  "state",
  "zip",
  "phone"
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

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "mailchimpMergeFieldConfig" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAX_BATCH_SIZE,
  MAILCHIMP_IDENTIFY_EXCLUSION,
  SUBSCRIPTION_STATUS,
  VALID_STATUSES,
  MERGE_CONFIG: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
};
