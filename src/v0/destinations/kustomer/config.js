const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.kustomerapp.com';

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: 'KustomerIdentify' },
  PAGE: { name: 'KustomerPage' },
  SCREEN: { name: 'KustomerScreen' },
  TRACK: { name: 'KustomerTrack' },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
};
