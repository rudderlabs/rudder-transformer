const {
  getMappingConfig,
  defaultPutRequestConfig,
  defaultPostRequestConfig,
} = require('../../util');

const BASE_URL = 'https://api.engage.so/v1';
const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'EngagePageConfig', // is not used
    genericFields: [],
    method: defaultPostRequestConfig.requestMethod,
    endpoint: `${BASE_URL}/users/uid/events`,
  },
  IDENTIFY: {
    type: 'identify',
    name: 'EngageIdentifyConfig',
    genericFields: [
      'email',
      'firstName',
      'firstname',
      'first_name',
      'lastName',
      'lastname',
      'last_name',
      'phone',
    ],
    method: defaultPutRequestConfig.requestMethod,
    endpoint: `${BASE_URL}/users/uid`,
  },
  PAGE: {
    type: 'page',
    name: 'EngagePageConfig',
    genericFields: ['search', 'title', 'referrer', 'url'],
    method: defaultPostRequestConfig.requestMethod,
    endpoint: `${BASE_URL}/users/uid/events`,
  },
  GROUP: {
    type: 'group',
    name: 'EngageIdentifyConfig',
    genericFields: [
      'email',
      'firstName',
      'firstname',
      'first_name',
      'lastName',
      'lastname',
      'last_name',
      'phone',
      'subscriber_status',
      'operation',
    ],
    method: defaultPostRequestConfig.requestMethod,
    endpoint: `${BASE_URL}/lists/id/subscribers`,
  },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
module.exports = {
  BASE_URL,
  mappingConfig,
  ConfigCategories,
  DESTINATION: 'ENGAGE',
};
