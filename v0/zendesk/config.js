const { getMappingConfig } = require("../util");

const defaultUserFields = ['email', 'name', 'organizationId', 'timezone', 'phone', 'userId'];

const ConfigCategory = {
  IDENTIFY: {
    name: "ZDIdentifyConfig",
    json_name: "user",
    action: "users/create_or_update.json"
  }
};

const ENDPOINT = ".zendesk.com/api/v2/";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  ENDPOINT,
  defaultUserFields
};
