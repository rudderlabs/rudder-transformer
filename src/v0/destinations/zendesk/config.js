const { getMappingConfig } = require("../../util");

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
    "userId",
    "id"
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

const ZENDESK_MARKET_PLACE_NAME = "RudderStack";
const ZENDESK_MARKET_PLACE_ORG_ID = "3339";
const ZENDESK_MARKET_PLACE_APP_ID = "263241";

module.exports = {
  ConfigCategory,
  mappingConfig,
  defaultFields,
  ZENDESK_MARKET_PLACE_NAME,
  ZENDESK_MARKET_PLACE_ORG_ID,
  ZENDESK_MARKET_PLACE_APP_ID
};
