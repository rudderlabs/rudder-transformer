const { getMappingConfig } = require('../../util');

const baseEndpoint = 'https://s2s.adjust.com/event';

const CONFIG_CATEGORIES = {
  TRACK: { name: 'ADJUSTTrackConfig' },
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  baseEndpoint,
};
