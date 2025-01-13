const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'FRESHMARKETERIdentifyConfig',
    type: 'identify',
    baseUrl: '/crm/sales/api/contacts/upsert',
  },
  GROUP: {
    name: 'FRESHMARKETERGroupConfig',
    type: 'group',
    baseUrlAccount: '/crm/sales/api/sales_accounts/upsert',
    baseUrlList: '/crm/sales/api/lists',
  },
  SALES_ACTIVITY: {
    name: 'SalesActivityConfig',
    baseUrlCreate: '/crm/sales/api/sales_activities',
    baseUrlListAll: '/crm/sales/api/selector/sales_activity_types',
  },
};

const DELETE_ENDPOINT = '/crm/sales/api/contacts/';
const LIFECYCLE_STAGE_ENDPOINT = '/crm/sales/api/selector/lifecycle_stages';

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  DELETE_ENDPOINT,
  LIFECYCLE_STAGE_ENDPOINT,
};
