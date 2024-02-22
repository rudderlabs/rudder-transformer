const { getMappingConfig } = require('../../../../v0/util');

const SUPPORTED_EVENT_TYPE = ['track'];

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
  CONFIG_CATEGORIES,
  CONVERSION_SUPPORTED_ID_TYPES,
  COMMON_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON_CONFIGS.name],
  ITEM_CONFIGS: MAPPING_CONFIG[CONFIG_CATEGORIES.ITEM_CONFIGS.name],
  ECOMM_EVENT_MAP,
  REAL_TIME_CONVERSION_ENDPOINT,
};
