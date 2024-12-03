const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://api.topsort.com/v2/events';

const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'TopsortTrackConfig',
  },
  PLACEMENT: { name: 'TopsortPlacementConfig' },
  ITEM: { name: 'TopsortItemConfig' },
};

const ECOMM_EVENTS_WITH_PRODUCT_ARRAY = ['Order Completed'];

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);

module.exports = {
  mappingConfig,
  ConfigCategories,
  BASE_URL,
  ECOMM_EVENTS_WITH_PRODUCT_ARRAY,
};
