const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "identifyConfig",
    type: "identify",
    endpoint: ".myfreshworks.com/crm/sales/api/contacts/upsert",
    method: "POST"
  },
  GROUP: {
    name: "groupConfig",
    type: "group",
    endpoint: ".myfreshworks.com/crm/sales/api/sales_accounts/upsert",
    method: "POST"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES
};
