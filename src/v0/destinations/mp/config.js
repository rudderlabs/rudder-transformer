const { getMappingConfig } = require('../../util');

const BASE_ENDPOINT = 'https://api.mixpanel.com';
const BASE_ENDPOINT_EU = 'https://api-eu.mixpanel.com';
const CREATE_DELETION_TASK_ENDPOINT = 'https://mixpanel.com/api/app/data-deletions/v3.0/';

const getCreateDeletionTaskEndpoint = (projectToken) =>
  `${CREATE_DELETION_TASK_ENDPOINT}?token=${projectToken}`;

const ConfigCategory = {
  IDENTIFY: {
    name: 'MPIdentifyConfig',
  },
  PROFILE_ANDROID: {
    name: 'MPProfilePropertiesAndroid',
  },
  PROFILE_IOS: {
    name: 'MPProfilePropertiesIOS',
  },
  EVENT_PROPERTIES: {
    name: 'MPEventPropertiesConfig',
  },
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const MP_IDENTIFY_EXCLUSION_LIST = [
  'createdAt',
  'email',
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'name',
  'username',
  'userName',
  'phone',
  'avatar',
  'address',
  'country',
  'city',
  'state',
  'unsubscribed',
];

const GEO_SOURCE_ALLOWED_VALUES = [null, 'reverse_geocoding'];
const DEL_MAX_BATCH_SIZE = 1000;
const DISTINCT_ID_MAX_BATCH_SIZE = 1999;

module.exports = {
  mappingConfig,
  BASE_ENDPOINT,
  DEL_MAX_BATCH_SIZE,
  ConfigCategory,
  BASE_ENDPOINT_EU,
  GEO_SOURCE_ALLOWED_VALUES,
  MP_IDENTIFY_EXCLUSION_LIST,
  getCreateDeletionTaskEndpoint,
  DISTINCT_ID_MAX_BATCH_SIZE,
};
