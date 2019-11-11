const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "SFIdentifyConfig"
  }
};


const SF_API_VERSION = "47.0";
const SF_TOKEN_REQUEST_URL = "https://login.salesforce.com/services/oauth2/token";


const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  mappingConfig
};
