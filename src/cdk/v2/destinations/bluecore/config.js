const { getMappingConfig } = require('../../../../v0/util');

const BASE_URL = 'https://api.bluecore.app/api/track/mobile/v1';

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'bluecoreIdentifyConfig',
    type: 'identify',
  },
  TRACK: {
    name: 'bluecoreTrackConfig',
    type: 'track',
  },
  COMMON: {
    name: 'bluecoreCommonConfig',
    type: 'common',
  },
  SUBSCRIPTION_EVENT: {
    name: 'bluecoreSubscriptionEventConfig',
    type: 'subscription_event',
  },
};

const EVENT_NAME_MAPPING = [
  {
    src: ['product viewed'],
    dest: 'viewed_product',
  },
  {
    src: ['products searched'],
    dest: 'search',
  },
  {
    src: ['product added'],
    dest: 'add_to_cart',
  },
  {
    src: ['product removed'],
    dest: 'remove_from_cart',
  },
  {
    src: ['product added to wishlist'],
    dest: 'wishlist',
  },
  {
    src: ['order completed'],
    dest: 'purchase',
  },
];

const BLUECORE_EXCLUSION_FIELDS = ['query', 'order_id', 'total'];

const IDENTIFY_EXCLUSION_LIST = [
  'name',
  'firstName',
  'first_name',
  'firstname',
  'lastName',
  'last_name',
  'lastname',
  'email',
  'age',
  'sex',
  'address',
  'action',
  'event',
];

const SUBSCRIPTION_EVENT_EXCLUSION_LIST = [
  'name',
  'firstName',
  'first_name',
  'firstname',
  'lastName',
  'last_name',
  'lastname',
  'email',
  'age',
  'sex',
  'address',
];

const TRACK_EXCLUSION_LIST = [...IDENTIFY_EXCLUSION_LIST, 'query', 'order_id', 'total', 'products'];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  BASE_URL,
  BLUECORE_EXCLUSION_FIELDS,
  IDENTIFY_EXCLUSION_LIST,
  TRACK_EXCLUSION_LIST,
  SUBSCRIPTION_EVENT_EXCLUSION_LIST,
};
