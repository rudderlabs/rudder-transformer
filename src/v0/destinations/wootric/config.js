const BASE_ENDPOINT = 'https://api.wootric.com';

const VERSION = 'v1';
const PROPERTIES = 'properties';
const END_USER_PROPERTIES = 'end_user[properties]';

const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  CREATE_USER: {
    name: 'identifyConfig',
    type: 'identify',
    endpoint: `${BASE_ENDPOINT}/${VERSION}/end_users`,
  },
  UPDATE_USER: {
    name: 'identifyConfig',
    type: 'identify',
    endpoint: `${BASE_ENDPOINT}/${VERSION}/end_users/<end_user_id>`,
  },
  CREATE_RESPONSE: {
    name: 'createResponseConfig',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}/${VERSION}/end_users/<end_user_id>/responses`,
  },
  CREATE_DECLINE: {
    name: 'createDeclineConfig',
    type: 'track',
    endpoint: `${BASE_ENDPOINT}/${VERSION}/end_users/<end_user_id>/declines`,
  },
};

const ACCESS_TOKEN_CACHE_TTL_SECONDS = process.env.ACCESS_TOKEN_CACHE_TTL_SECONDS
  ? parseInt(process.env.ACCESS_TOKEN_CACHE_TTL, 10)
  : 100 * 60;

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  VERSION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ACCESS_TOKEN_CACHE_TTL_SECONDS,
  PROPERTIES,
  END_USER_PROPERTIES,
};
