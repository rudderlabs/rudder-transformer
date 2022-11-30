const DESTINATION = "PersistIQ";
const BASE_URL = "https://api.persistiq.com/v1";
const { getMappingConfig } = require("../../util");

const identifySourceKeys = [
  "email",
  "phone",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "title",
  "city",
  "country",
  "gender",
  "linkedinUrl",
  "twitterUrl",
  "facebookUrl",
  "company",
  "status",
  "dup",
  "creator_id"
];
const configCategories = {
  Create: {
    endpoint: `${BASE_URL}/leads`,
    method: "POST"
  },
  Update: {
    endpoint: `${BASE_URL}/leads/leadId`,
    method: "PATCH"
  },
  Group: {
    add: {
      endpoint: `${BASE_URL}/campaigns/:campaign_id/leads`,
      method: "POST"
    },
    remove: {
      endpoint: `${BASE_URL}/campaigns/:campaign_id/leads/:lead_id`,
      method: "DELETE"
    }
  }
};
const fileConfigCategories = {
  IDENTIFY: {
    type: "identify",
    name: "persistIqIdentifyConfig"
  }
};
const mappingConfig = getMappingConfig(fileConfigCategories, __dirname);
module.exports = {
  DESTINATION,
  configCategories,
  identifySourceKeys,
  mappingConfig,
  fileConfigCategories
};
