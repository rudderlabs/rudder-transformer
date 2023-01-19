const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.june.so/api';

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'JuneIdentifyConfig',
    type: 'identify',
    endpoint: `${BASE_ENDPOINT}/identify`,
  },
  TRACK: {
    name: 'JuneTrackConfig',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}/track`,
  },
  GROUP: {
    name: 'JuneGroupConfig',
    type: 'group',
    endpoint: `${BASE_ENDPOINT}/group`,
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  DESTINATION: 'JUNE',
};
