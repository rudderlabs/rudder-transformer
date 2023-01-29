const { getMappingConfig } = require('../../util');

const getTrackEndPoint = (baseUrl, event) =>
  `${baseUrl}/v1/track?eventKey=${encodeURIComponent(event)}`;

const CONFIG_CATEGORIES = {
  TRACK: {
    name: 'OptimizelyFullStackTrackConfig',
    type: 'track',
    endpoint: '/v1/track',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getTrackEndPoint,
};
