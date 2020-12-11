const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "SFIdentifyConfig"
  },
  IGNORE: {
    name: "SFIgnoreConfig"
  }
};

const SF_API_VERSION = "50.0";
const SF_TOKEN_REQUEST_URL =
  "https://login.salesforce.com/services/oauth2/token";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  mappingJson: mappingConfig[ConfigCategory.IDENTIFY.name],
  ignoredTraits: mappingConfig[ConfigCategory.IGNORE.name]
};
