const { getMappingConfig } = require('../../util');

const ENDPOINT = 'https://ct.pinterest.com/events/v3';

// ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
const MAX_BATCH_SIZE = 1000;

const CONFIG_CATEGORIES = {
  USER_CONFIGS: { name: 'pinterestUserConfig' },
  COMMON_CONFIGS: { name: 'pinterestCommonConfig' },
  CUSTOM_CONFIGS: { name: 'pinterestCustomConfig' },
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ENDPOINT,
  MAX_BATCH_SIZE,
  USER_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.USER_CONFIGS.name],
  COMMON_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON_CONFIGS.name],
  CUSTOM_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.CUSTOM_CONFIGS.name],
};
