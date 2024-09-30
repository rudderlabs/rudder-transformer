const { getMappingConfig } = require('../../../../v0/util');

const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'trackMapping',
  },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
const singleEventEndpoint = 'https://s2s.smartly.io/events';
const batchEndpoint = 'https://s2s.smartly.io/events/batch';

module.exports = {
  ConfigCategories,
  mappingConfig,
  singleEventEndpoint,
  batchEndpoint,
  TRACK_CONFIG: mappingConfig[ConfigCategories.TRACK.name],
  MAX_BATCH_SIZE: 1000,
};
