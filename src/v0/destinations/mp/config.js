const { getMappingConfig } = require('../../util');

// ref: https://developer.mixpanel.com/reference/overview#ingestion-api
const BASE_ENDPOINT = 'https://api.mixpanel.com';
const BASE_ENDPOINT_EU = 'https://api-eu.mixpanel.com';
const BASE_ENDPOINT_IN = 'https://api-in.mixpanel.com';

// ref: https://developer.mixpanel.com/reference/overview#gdpr-api
const CREATE_DELETION_TASK_ENDPOINT = 'https://mixpanel.com/api/app/data-deletions/v3.0/';
const CREATE_DELETION_TASK_ENDPOINT_EU = 'https://eu.mixpanel.com/api/app/data-deletions/v3.0/';
const CREATE_DELETION_TASK_ENDPOINT_IN = 'https://in.mixpanel.com/api/app/data-deletions/v3.0/';

const ConfigCategory = {
  IDENTIFY: {
    name: 'MPIdentifyConfig',
  },
  SET_ONCE: {
    name: 'MPSetOnceConfig',
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
const IMPORT_MAX_BATCH_SIZE = 2000;
const ENGAGE_MAX_BATCH_SIZE = 2000;
const GROUPS_MAX_BATCH_SIZE = 200;

// Property limits
// ref: https://developer.mixpanel.com/reference/track-event
const MAX_PROPERTY_KEYS_COUNT = 255;
const MAX_ARRAY_ELEMENTS_COUNT = 255;
const MAX_PAYLOAD_SIZE_BYTES = 1024 * 1024; // 1MB

// Delete user
const DEL_MAX_BATCH_SIZE = 1000;
const DISTINCT_ID_MAX_BATCH_SIZE = 1999;

const DESTINATION = 'MP';

module.exports = {
  mappingConfig,
  BASE_ENDPOINT,
  DEL_MAX_BATCH_SIZE,
  ConfigCategory,
  BASE_ENDPOINT_EU,
  GEO_SOURCE_ALLOWED_VALUES,
  MP_IDENTIFY_EXCLUSION_LIST,
  DISTINCT_ID_MAX_BATCH_SIZE,
  IMPORT_MAX_BATCH_SIZE,
  ENGAGE_MAX_BATCH_SIZE,
  GROUPS_MAX_BATCH_SIZE,
  MAX_PROPERTY_KEYS_COUNT,
  MAX_ARRAY_ELEMENTS_COUNT,
  MAX_PAYLOAD_SIZE_BYTES,
  BASE_ENDPOINT_IN,
  CREATE_DELETION_TASK_ENDPOINT,
  CREATE_DELETION_TASK_ENDPOINT_EU,
  CREATE_DELETION_TASK_ENDPOINT_IN,
  DESTINATION,
};
