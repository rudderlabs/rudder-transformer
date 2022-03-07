const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://googleads.googleapis.com/v10/customers";

const CONFIG_CATEGORIES = {
  TRACK_CONFIG: { type: "track", name: "trackConfig" }
};
const hashAttributes = [
  "email",
  "phone",
  "firstName",
  "lastName",
  "streetAddress"
];
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CONFIG.name],
  BASE_ENDPOINT,
  hashAttributes
};
