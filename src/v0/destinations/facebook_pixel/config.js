const { getMappingConfig } = require('../../util');

const VERSION = 'v18.0';

const CONFIG_CATEGORIES = {
  USERDATA: {
    standard: false,
    type: 'identify',
    name: 'FBPIXELUserDataConfig',
  },
  COMMON: { name: 'FBPIXELCommonConfig' },
  SIMPLE_TRACK: {
    standard: false,
    type: 'simple track',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  PRODUCT_LIST_VIEWED: {
    standard: true,
    type: 'product list viewed',
    eventName: 'ViewContent',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  PRODUCT_VIEWED: {
    standard: true,
    type: 'product viewed',
    eventName: 'ViewContent',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  PRODUCT_ADDED: {
    standard: true,
    type: 'product added',
    eventName: 'AddToCart',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  ORDER_COMPLETED: {
    standard: true,
    type: 'order completed',
    eventName: 'Purchase',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  PRODUCTS_SEARCHED: {
    standard: true,
    type: 'products searched',
    eventName: 'Search',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  CHECKOUT_STARTED: {
    standard: true,
    type: 'checkout started',
    eventName: 'InitiateCheckout',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  OTHER_STANDARD: {
    standard: true,
    type: 'otherStandard',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  PAGE_VIEW: {
    standard: true,
    type: 'page_view',
    eventName: 'PageView',
    name: 'FBPIXELPSimpleCustomConfig',
  },
  PAGE: {
    standard: false,
    type: 'page',
    eventName: 'PageView',
    name: 'FBPIXELPSimpleCustomConfig',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const ACTION_SOURCES_VALUES = [
  'email',
  'website',
  'app',
  'phone_call',
  'chat',
  'physical_store',
  'system_generated',
  'other',
];

const OTHER_STANDARD_EVENTS = [
  'AddToWishlist',
  'AddPaymentInfo',
  'Lead',
  'CompleteRegistration',
  'Contact',
  'CustomizeProduct',
  'Donate',
  'FindLocation',
  'Schedule',
  'StartTrial',
  'SubmitApplication',
  'Subscribe',
];

const FB_PIXEL_DEFAULT_EXCLUSION = ['opt_out', 'event_id', 'action_source'];
const FB_PIXEL_CUSTOM_DATA_EXCLUDE_FLATTENING = ['content_ids', 'contents'];
const STANDARD_ECOMM_EVENTS_TYPE = [
  CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type,
  CONFIG_CATEGORIES.PRODUCT_VIEWED.type,
  CONFIG_CATEGORIES.PRODUCT_ADDED.type,
  CONFIG_CATEGORIES.ORDER_COMPLETED.type,
  CONFIG_CATEGORIES.PRODUCTS_SEARCHED.type,
  CONFIG_CATEGORIES.CHECKOUT_STARTED.type,
];

module.exports = {
  VERSION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ACTION_SOURCES_VALUES,
  FB_PIXEL_DEFAULT_EXCLUSION,
  FB_PIXEL_CUSTOM_DATA_EXCLUDE_FLATTENING,
  STANDARD_ECOMM_EVENTS_TYPE,
  OTHER_STANDARD_EVENTS,
  DESTINATION: 'FACEBOOK_PIXEL',
};
