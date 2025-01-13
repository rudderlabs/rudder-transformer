const { getMappingConfig } = require('../../../../v0/util');

// ref : https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/conversions-api?view=li-lms-2024-02&tabs=http#adding-multiple-conversion-events-in-a-batch
const BATCH_ENDPOINT = 'https://api.linkedin.com/rest/conversionEvents';
const API_HEADER_METHOD = 'BATCH_CREATE';
const API_VERSION = '202402'; // yyyymm format
const API_PROTOCOL_VERSION = '2.0.0';

const CONFIG_CATEGORIES = {
  USER_INFO: {
    name: 'linkedinUserInfoConfig',
    type: 'user',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAX_BATCH_SIZE: 5000,
  BATCH_ENDPOINT,
  API_HEADER_METHOD,
  API_VERSION,
  API_PROTOCOL_VERSION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
};
