const { getMappingConfig } = require('../../util');

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
};

// const EVENT_NAME_MAPPING = {
//   'Product Viewed': 'viewed_product',
//   'Products Searched': 'search',
//   'Product Added': 'add_to_cart',
//   'Product Removed': 'remove_from_cart',
//   'Product Added to Wishlist': 'wishlist',
//   'Order Completed': 'purchase',
//   'Identify': 'identify',
// };

const EVENT_NAME_MAPPING = [
  {
    src: ['Product Viewed'],
    dest: 'viewed_product',
  },
  {
    src: ['Products Searched'],
    dest: 'search',
  },
  {
    src: ['Product Added'],
    dest: 'add_to_cart',
  },
  {
    src: ['Product Removed'],
    dest: 'remove_from_cart',
  },
  {
    src: ['Product Added to Wishlist'],
    dest: 'wishlist',
  },
  {
    src: ['Order Completed'],
    dest: 'purchase',
  },
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  BASE_URL,
};
