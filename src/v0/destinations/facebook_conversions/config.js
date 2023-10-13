const { getMappingConfig } = require('../../util');

const CONFIG_CATEGORIES = {
  USERDATA: {
    standard: false,
    type: 'identify',
    name: 'FBCUserDataConfig',
  },
  COMMON: { name: 'FBCCommonConfig' },
  SIMPLE_TRACK: {
    standard: false,
    type: 'simple track',
  },
  PRODUCT_LIST_VIEWED: {
    standard: true,
    type: 'product list viewed',
    eventName: 'ViewContent',
    name: 'FBCProductListViewedCustomData',
  },
  PRODUCT_VIEWED: {
    standard: true,
    type: 'product viewed',
    eventName: 'ViewContent',
    name: 'FBCProductViewedCustomData',
  },
  PRODUCT_ADDED: {
    standard: true,
    type: 'product added',
    eventName: 'AddToCart',
    name: 'FBCProductAddedCustomData',
  },
  ORDER_COMPLETED: {
    standard: true,
    type: 'order completed',
    eventName: 'Purchase',
    name: 'FBCOrderCompletedCustomData',
  },
  PRODUCTS_SEARCHED: {
    standard: true,
    type: 'products searched',
    eventName: 'Search',
    name: 'FBCProductSearchedCustomData',
  },
  CHECKOUT_STARTED: {
    standard: true,
    type: 'checkout started',
    eventName: 'InitiateCheckout',
    name: 'FBCCheckoutStartedCustomData',
  },
  OTHER_STANDARD: {
    standard: true,
    type: 'otherStandard',
  },
  PAGE_VIEW: {
    standard: true,
    type: 'page_view',
    eventName: 'PageView',
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

const FB_CONVERSIONS_DEFAULT_EXCLUSION = ['opt_out', 'event_id', 'action_source'];
const STANDARD_ECOMM_EVENTS_CATEGORIES = [
  CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED,
  CONFIG_CATEGORIES.PRODUCT_VIEWED,
  CONFIG_CATEGORIES.PRODUCT_ADDED,
  CONFIG_CATEGORIES.ORDER_COMPLETED,
  CONFIG_CATEGORIES.PRODUCTS_SEARCHED,
  CONFIG_CATEGORIES.CHECKOUT_STARTED,
];

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ACTION_SOURCES_VALUES,
  FB_CONVERSIONS_DEFAULT_EXCLUSION,
  STANDARD_ECOMM_EVENTS_CATEGORIES,
  OTHER_STANDARD_EVENTS,
  DESTINATION: 'FACEBOOK_CONVERSIONS',
};
