const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://rudderstack.t.stormly.com/webhook/rudderstack';

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'StormlyIdentifyConfig',
    type: 'identify',
    endpoint: `${BASE_ENDPOINT}/identify`,
  },
  TRACK: {
    name: 'StormlyTrackConfig',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}/track`,
  },
  GROUP: {
    name: 'StormlyGroupConfig',
    type: 'group',
    endpoint: `${BASE_ENDPOINT}/group`,
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  DESTINATION: 'STORMLY',
};
