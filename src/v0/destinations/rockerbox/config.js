const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://webhooks.getrockerbox.com/rudderstack';

const CONFIG_CATEGORIES = {
  TRACK: {
    name: 'RockerboxTrackConfig',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}`,
    method: 'POST',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
};
