const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.delighted.com/v1/people.json";

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "DelightedIdentify" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const DELIGHTED_EXCLUSION_FIELDS = [
  "email",
  "name",
  "phone",
  "delay",
  "send",
  "channel",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "last_sent_at"
];

const TRACKING_EXCLUSION_FIELDS = ["channel", "delay", "last_sent_at", "send"];

module.exports = {
  ENDPOINT,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  TRACKING_EXCLUSION_FIELDS,
  DELIGHTED_EXCLUSION_FIELDS
};
