const { getMappingConfig } = require('../../util');

const DEFAULT_BASE_ENDPOINT = 'https://api.kustomerapp.com';

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: 'KustomerIdentify' },
  PAGE: { name: 'KustomerPage' },
  SCREEN: { name: 'KustomerScreen' },
  TRACK: { name: 'KustomerTrack' },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  DEFAULT_BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
};
