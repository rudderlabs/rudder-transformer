const { getMappingConfig } = require('../../util');

const getEndpoint = (config, endpoint = '/upload') => {
  const { region } = config;
  if (region && region !== 'none') {
    return `https://${region}.api.clevertap.com/1${endpoint}`;
  }
  return `https://api.clevertap.com/1${endpoint}`;
};

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: 'CleverTapIdentify', type: 'identify' },
  PAGE: { name: 'CleverTapPage', type: 'page' },
  SCREEN: { name: 'CleverTapScreen', type: 'screen' },
  TRACK: { name: 'CleverTapTrack', type: 'track' },
  ECOM: { name: 'CleverTapEcom' },
  ALIAS: { name: 'CleverTapIdentify', type: 'alias' },
};

// These are clevertap specific properties we are already mapping
// using our mapping json.
const CLEVERTAP_DEFAULT_EXCLUSION = [
  'email',
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'name',
  'phone',
  'gender',
  'education',
  'employed',
  'birthday',
  'married',
  'customerType',
  'anonymousId',
  'avatar',
  'userId',
  'id',
  'ts',
  'overrideFields',
];
// ref : https://developer.clevertap.com/docs/disassociate-api
const DEL_MAX_BATCH_SIZE = 100;

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  getEndpoint,
  DEL_MAX_BATCH_SIZE,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  CLEVERTAP_DEFAULT_EXCLUSION,
  DESTINATION: 'CLEVERTAP',
};
