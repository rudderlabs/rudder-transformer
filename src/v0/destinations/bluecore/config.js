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

const EVENT_NAME_MAPPING = {
  'Product Viewed': 'viewed_product',
  'Product Added': 'add_to_cart',
  'Order Completed': 'purchase',
  'Products Searched': 'search',
  'Product Added to Wishlist': 'wishlist',
  'Checkout Step Viewed': 'checkout',
  'Product Removed': 'remove_from_cart',
  'Subscribe Interest': 'subscribe_interest',
  'Unsubscribe Interest': 'unsubscribe_interest',
  Identify: 'identify',
};

const BLUECORE_IDENTIFY_EXCLUSION = [
  'event',
  'phone',
  'phoneNumber',
  'phone_number',
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'gender',
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  BLUECORE_IDENTIFY_EXCLUSION,
  BASE_URL,
};
