const { getMappingConfig } = require('../../util');

const ENDPOINT = (datasetId, accessToken) =>
  `https://graph.facebook.com/v18.0/${datasetId}/events?access_token=${accessToken}`;

const CONFIG_CATEGORIES = {
  USERDATA: {
    standard: false,
    type: 'identify',
    name: 'FBCUserDataConfig',
  },
  COMMON: { name: 'FBCCommonConfig' },
  APPDATA: { name: 'FBCAppEventsConfig' },
  SIMPLE_TRACK: {
    standard: false,
    type: 'simple track',
    name: 'FBCSimpleCustomConfig',
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
  PAYMENT_INFO_ENTERED: {
    standard: true,
    type: 'payment info entered',
    eventName: 'AddPaymentInfo',
    name: 'FBCPaymentInfoEnteredCustomData',
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    standard: true,
    type: 'product added to wishlist',
    eventName: 'AddToWishlist',
    name: 'FBCProductAddedToWishlistCustomData',
  },
  OTHER_STANDARD: {
    standard: true,
    type: 'otherStandard',
    name: 'FBCSimpleCustomConfig',
  },
  PAGE_VIEW: {
    standard: true,
    type: 'page_view',
    eventName: 'PageView',
    name: 'FBCSimpleCustomConfig',
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
  CONFIG_CATEGORIES.PAYMENT_INFO_ENTERED,
  CONFIG_CATEGORIES.PRODUCT_ADDED_TO_WISHLIST,
];

module.exports = {
  ENDPOINT,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  ACTION_SOURCES_VALUES,
  FB_CONVERSIONS_DEFAULT_EXCLUSION,
  STANDARD_ECOMM_EVENTS_CATEGORIES,
  OTHER_STANDARD_EVENTS,
  DESTINATION: 'FACEBOOK_CONVERSIONS',
};
