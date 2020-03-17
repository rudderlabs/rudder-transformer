const { getMappingConfig } = require("../util");

const defaultFields = [
  "email",
  "name",
  "organizationId",
  "timezone",
  "phone",
  "userId"
];

const ConfigCategory = {
  IDENTIFY: {
    name: "ZDIdentifyConfig",
    json_name: "user",
    userFieldsEndpoint: "user_fields.json",
    createOrUpdateUserEndpoint: "users/create_or_update.json"
  },
  GROUP: {
    name: "ZDGroupConfig",
    json_name: "organization",
    userMembershipEndpoint: "organization_memberships.json",
    createEndpoint: "organizations/create_or_update.json"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  defaultFields
};
