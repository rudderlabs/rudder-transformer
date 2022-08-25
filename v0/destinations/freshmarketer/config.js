const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "FRESHMARKETERIdentifyConfig",
    type: "identify",
    baseUrl: ".myfreshworks.com/crm/sales/api/contacts/upsert"
  },
  GROUP: {
    name: "FRESHMARKETERGroupConfig",
    type: "group",
    baseUrl: ".myfreshworks.com/crm/sales/api/sales_accounts/upsert"
  }
};

const FRESHMARKETER_IDENTIFY_EXCLUSION = [
  "email",
  "phone",
  "phoneNumber",
  "phone_number",
  "firstName",
  "firstname",
  "lastname",
  "lastName",
  "name",
  "userId",
  "subscriptionStatus",
  "job_title",
  "jobTitle",
  "phone",
  "mobileNumber",
  "address",
  "state",
  "country",
  "zipcode",
  "zip",
  "postalcode",
  "salesAccounts",
  "sales_accounts",
  "territoryId",
  "leadSourceId",
  "ownerId",
  "subscriptionTypes",
  "medium",
  "campaignId",
  "campaign_id",
  "keyword",
  "timeZone",
  "facebook",
  "twitter",
  "linkedin",
  "createdAt",
  "timestamp",
  "contactStatusId",
  "lifecycleStageId"
];

const FRESHMARKETER_GROUP_EXCLUSION = [
  "groupId",
  "name",
  "industryTypeId",
  "business_type_id",
  "businessTypeId",
  "phone",
  "numberOfEmployees",
  "annualRevenue",
  "address",
  "city",
  "state",
  "country",
  "zipcode",
  "zip",
  "postalcode"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  FRESHMARKETER_IDENTIFY_EXCLUSION,
  FRESHMARKETER_GROUP_EXCLUSION
};
