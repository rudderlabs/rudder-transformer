const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://googleads.googleapis.com/v9/customers";
const CONFIG_CATEGORIES = {
  AUDIENCE_LIST: { type: "audienceList", name: "offlineDataJobs" },
  ADDRESSINFO: { type: "addressInfo", name: "addressInfo" }
};
const attributeMapping = {
  email: "hashedEmail",
  phone: "hashedPhoneNumber"
};
const hashAttributes = ["email", "phone", "firstName", "lastName"];
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  attributeMapping,
  hashAttributes,
  offlineDataJobsMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.AUDIENCE_LIST.name],
  addressInfoMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.ADDRESSINFO.name]
};
