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

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES
};
