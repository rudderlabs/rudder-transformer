const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://api.topsort.com/v2/events';

const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'TopsortTrackConfig',
  },
  ITEM: { name: 'TopsortItemConfig' },
  PLACEMENT: { name: 'TopsortPlacementConfig' },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);

module.exports = {
  mappingConfig,
  ConfigCategories,
  BASE_URL,
};
