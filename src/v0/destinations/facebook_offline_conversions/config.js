const { getMappingConfig } = require('../../util');

const ENDPOINT = (version) => version === 'v17.0' ? 'https://graph.facebook.com/v17.0/OFFLINE_EVENT_SET_ID/events' : 'https://graph.facebook.com/v16.0/OFFLINE_EVENT_SET_ID/events';

const CONFIG_CATEGORIES = {
  OFFLINE_EVENTS: {
    type: 'track',
    name: 'FbOfflineConversionsTrackConfig',
  },
};

// ref : https://developers.facebook.com/docs/marketing-api/offline-conversions/#upload-events
const MATCH_KEY_FIELD_TYPE_DICTIONARY = {
  email: 'array',
  phone: 'array',
  st: 'array',
  zip: 'array',
  gen: 'string',
  ln: 'string',
  fn: 'string',
  fi: 'string',
  dobm: 'string',
  doby: 'string',
  dobd: 'string',
  ct: 'string',
  madid: 'string',
  country: 'string',
  extern_id: 'string',
  lead_id: 'string',
  fbc: 'string',
  fbp: 'string',
  client_user_agent: 'string',
};

const USER_DATA_FIELD_TYPE_DICTIONARY = {
  em: 'array',
  ph: 'array',
  st: 'array',
  zp: 'array',
  ge: 'string',
  ln: 'string',
  fn: 'string',
  db: 'string',
  ct: 'string',
  madid: 'string',
  country: 'string',
  extern_id: 'string',
  lead_id: 'string',
  fbc: 'string',
  fbp: 'string',
  client_user_agent: 'string',
};

const HASHING_REQUIRED_KEYS = [
  'ln',
  'fn',
  'fi',
  'ct',
  'st',
  'gen',
  'zip',
  'email',
  'madid',
  'phone',
  'country',
];

const TRACK_EXCLUSION_FIELDS = [
  'currency',
  'total',
  'price',
  'value',
  'revenue',
  'products',
  'order_id',
  'item_number',
  'email',
  'upload_tag',
];

const eventToStandardMapping = {
  'Products Searched': 'Search',
  'Product Viewed': 'ViewContent',
  'Product List Viewed': 'ViewContent',
  'Product Added to Wishlist': 'AddToWishlist',
  'Product Added': 'AddToCart',
  'Checkout Started': 'InitiateCheckout',
  'Payment Info Entered': 'AddPaymentInfo',
  'Order Completed': 'Purchase',
};

const ACTION_SOURCES_VALUES = [
  'email',
  'website',
  'phone_call',
  'chat',
  'app',
  'physical_store',
  'system_generated',
  'other',
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  ENDPOINT,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  ACTION_SOURCES_VALUES,
  HASHING_REQUIRED_KEYS,
  TRACK_EXCLUSION_FIELDS,
  eventToStandardMapping,
  MATCH_KEY_FIELD_TYPE_DICTIONARY,
  USER_DATA_FIELD_TYPE_DICTIONARY,
  DESTINATION: 'FACEBOOK_OFFLINE_CONVERSIONS',
};
