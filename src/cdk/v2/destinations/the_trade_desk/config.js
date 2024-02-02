const { getMappingConfig } = require('../../../../v0/util');

const SUPPORTED_EVENT_TYPE = ['record', 'track'];
const ACTION_TYPES = ['insert', 'delete'];
const DATA_PROVIDER_ID = 'rudderstack';

// ref:- https://partner.thetradedesk.com/v3/portal/data/doc/DataEnvironments
// api ref:- https://partner.thetradedesk.com/v3/portal/data/doc/post-data-advertiser-external
const DATA_SERVERS_BASE_ENDPOINTS_MAP = {
  apac: 'https://sin-data.adsrvr.org',
  tokyo: 'https://tok-data.adsrvr.org',
  usEastCoast: 'https://use-data.adsrvr.org',
  usWestCoast: 'https://usw-data.adsrvr.org',
  ukEu: 'https://euw-data.adsrvr.org',
  china: 'https://data-cn2.adsrvr.cn',
};

// ref:- https://partner.thetradedesk.com/v3/portal/data/doc/DataConversionEventsApi
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

const ECOMM_EVENT_MAP = {
  'product added': {
    event: 'addtocart',
    rootLevelPriceSupported: true,
  },
  'order completed': {
    event: 'purchase',
    itemsArray: true,
    revenueFieldSupported: true,
  },
  'product viewed': {
    event: 'viewitem',
    rootLevelPriceSupported: true,
  },
  'checkout started': {
    event: 'startcheckout',
    itemsArray: true,
    revenueFieldSupported: true,
  },
  'cart viewed': {
    event: 'viewcart',
    itemsArray: true,
  },
  'product added to wishlist': {
    event: 'wishlistitem',
    rootLevelPriceSupported: true,
  },
};

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
  CONFIG_CATEGORIES,
  COMMON_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON_CONFIGS.name],
  ITEM_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.ITEM_CONFIGS.name],
  ECOMM_EVENT_MAP,
  REAL_TIME_CONVERSION_ENDPOINT,
};
