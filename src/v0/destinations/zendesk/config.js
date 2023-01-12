const { getMappingConfig } = require("../../util");

const getBaseEndpoint = domain => {
  return `https://${domain}.zendesk.com/api/v2/`;
};
const NAME = "zendesk";
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

const ZENDESK_MARKETPLACE_NAME = "RudderStack";
const ZENDESK_MARKETPLACE_ORG_ID = "3339";
const ZENDESK_MARKETPLACE_APP_ID = "263241";

module.exports = {
  getBaseEndpoint,
  ConfigCategory,
  mappingConfig,
  defaultFields,
  ZENDESK_MARKETPLACE_NAME,
  ZENDESK_MARKETPLACE_ORG_ID,
  ZENDESK_MARKETPLACE_APP_ID,
  NAME
};
