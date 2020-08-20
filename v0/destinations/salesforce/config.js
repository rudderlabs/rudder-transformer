const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "SFIdentifyConfig"
  },
  IGNORE: {
    name: "SFIgnoreConfig"
  }
};

const SF_API_VERSION = "47.0";
const SF_TOKEN_REQUEST_URL =
  "https://login.salesforce.com/services/oauth2/token";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const defaultTraits = [
  "email",
  "phone",
  "rating",
  "title",
  "firstName",
  "lastName",
  "address.postalCode",
  "address.city",
  "address.country",
  "address.state",
  "address.street",
  "country",
  "postalCode",
  "state",
  "street",
  "city",
  "company.industry",
  "company.employee_count",
  "company.name",
  "company",
  "description",
  "website"
];

module.exports = {
  ConfigCategory,
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  mappingConfig,
  defaultTraits
};
