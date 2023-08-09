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
  PAGE: {
    name: 'JunePageConfig',
    type: 'page',
    endpoint: `${BASE_ENDPOINT}/page`,
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  DESTINATION: 'JUNE',
};
