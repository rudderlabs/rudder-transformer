const { getMappingConfig } = require('../../util');

const ENDPOINT = 'https://insights.algolia.io/1/events';
const CONFIG_CATEGORIES = {
  TRACK: { type: 'track', name: 'AlgoliaTrack' },
};
const EVENT_TYPES = ['click', 'view', 'conversion'];
const MAX_BATCH_SIZE = 1000;
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  ENDPOINT,
  MAX_BATCH_SIZE,
  EVENT_TYPES,
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
};
