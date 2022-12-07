const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "identifyConfig",
    type: "identify",
    baseUrl: ".myfreshworks.com/crm/sales/api/contacts/upsert",
    method: "POST"
  },
  GROUP: {
    name: "groupConfig",
    type: "group",
    baseUrlAccount: ".myfreshworks.com/crm/sales/api/sales_accounts/upsert",
    method: "POST"
  },
  SALES_ACTIVITY: {
    name: "SalesActivityConfig",
    baseUrlCreate: ".myfreshworks.com/crm/sales/api/sales_activities",
    baseUrlListAll:
      ".myfreshworks.com/crm/sales/api/selector/sales_activity_types"
  }
};

const LIFECYCLE_STAGE_ENDPOINT =
  ".myfreshworks.com/crm/sales/api/selector/lifecycle_stages";

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  LIFECYCLE_STAGE_ENDPOINT
};
