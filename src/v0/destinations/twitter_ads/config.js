const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://ads-api.twitter.com/12/measurement/conversions';

const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'TwitterAdsTrackConfig',
  },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);

module.exports = {
  mappingConfig,
  ConfigCategories,
  BASE_URL
};
