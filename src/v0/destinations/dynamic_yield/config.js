const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://dy-api.com/v2';

const ConfigCategory = {
  IDENTIFY: { name: 'DynamicYieldIdentifyConfig' },
  TRACK: { name: 'DynamicYieldTrackConfig' },
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  BASE_URL,
  ConfigCategory,
  mappingConfig,
};
