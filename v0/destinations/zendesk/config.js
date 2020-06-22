const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "ZDIdentifyConfig",
    json_name: "user",
    userFieldsEndpoint: "user_fields.json",
    userFieldsJson: "user_fields",
    createOrUpdateUserEndpoint: "users/create_or_update.json"
  },
  GROUP: {
    name: "ZDGroupConfig",
    json_name: "organization",
    organizationFieldsEndpoint: "organization_fields.json",
    organizationFieldsJson: "organization_fields",
    userMembershipEndpoint: "organization_memberships.json",
    createEndpoint: "organizations/create_or_update.json"
  }
};

const defaultFields = {
  [ConfigCategory.IDENTIFY.userFieldsJson]: [
    "email",
    "name",
    "organizationId",
    "timezone",
    "phone",
    "userId"
  ],
  [ConfigCategory.GROUP.organizationFieldsJson]: [
    "name",
    "domainNames",
    "tags",
    "groupId",
    "url",
    "deleted"
  ]
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  defaultFields
};
