const { getMappingConfig } = require('../../../../v0/util');

const BASE_URL = 'https://api.bluecore.com/api/track/mobile/v1';

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

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  BASE_URL,
  BLUECORE_EXCLUSION_FIELDS,
};
