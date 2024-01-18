const { getMappingConfig } = require('../../../../v0/util');

const SUPPORTED_EVENT_TYPE = 'record';
const ACTION_TYPES = ['insert', 'delete'];
const DATA_PROVIDER_ID = 'rudderstack';

// ref:- https://partner.thetradedesk.com/v3/portal/data/doc/DataEnvironments
const DATA_SERVERS_BASE_ENDPOINTS_MAP = {
  apac: 'https://sin-data.adsrvr.org',
  tokyo: 'https://tok-data.adsrvr.org',
  usEastCoast: 'https://use-data.adsrvr.org',
  usWestCoast: 'https://usw-data.adsrvr.org',
  ukEu: 'https://euw-data.adsrvr.org',
  china: 'https://data-cn2.adsrvr.cn',
};

const REAL_TIME_CONVERSION_ENDPOINT = 'https://insight.adsrvr.org/track/realtimeconversion';

const CONVERSION_SUPPORTED_ID_TYPES = [
  'TDID',
  'IDFA',
  'AAID',
  'DAID',
  'NAID',
  'IDL',
  'EUID',
  'UID2',
];

const ECOMM_EVENT_MAP = [
  {
    src: 'Product Added',
    dest: 'addtocart',
  },
  {
    src: 'Order Completed',
    dest: 'purchase',
  },
  {
    src: 'Product Viewed',
    dest: 'viewitem',
  },
  {
    src: 'Checkout Started',
    dest: 'startcheckout',
  },
  {
    src: 'Cart Viewed',
    dest: 'viewcart',
  },
  {
    src: 'Product Added to Wishlist',
    dest: 'wishlistitem',
  },
];

const CONFIG_CATEGORIES = {
  COMMON_CONFIGS: { name: 'TTDCommonConfig' },
  ITEM_CONFIGS: { name: 'TTDItemConfig' },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  SUPPORTED_EVENT_TYPE,
  ACTION_TYPES,
  DATA_PROVIDER_ID,
  MAX_REQUEST_SIZE_IN_BYTES: 2500000,
  DATA_SERVERS_BASE_ENDPOINTS_MAP,
  CONVERSION_SUPPORTED_ID_TYPES,
  COMMON_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON_CONFIGS.name],
  ITEM_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.ITEM_CONFIGS.name],
  ECOMM_EVENT_MAP,
  REAL_TIME_CONVERSION_ENDPOINT,
};
