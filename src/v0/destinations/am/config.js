const { getMappingConfig } = require('../../util');

const ConfigCategory = {
  IDENTIFY: {
    name: 'AmplitudeIdentifyConfig',
  },
  PAGE: {
    name: 'AmplitudePageConfig',
  },
  SCREEN: {
    name: 'AmplitudeScreenConfig',
  },
  GROUP: {
    name: 'AmplitudeGroupConfig',
  },
  ALIAS: {
    name: 'AmplitudeAliasConfig',
  },
  PROMOTION_VIEWED: {
    name: 'AmplitudePromotionViewedConfig',
  },
  PROMOTION_CLICKED: {
    name: 'AmplitudePromotionClickedConfig',
  },
  PRODUCT: {
    name: 'AmplitudeProductActionsConfig',
  },
  REVENUE: {
    name: 'AmplitudeRevenueConfig',
  },
  DEFAULT: {
    name: 'AmplitudeDefaultConfig',
  },
  COMMON_CONFIG: {
    name: 'AmplitudeCommonConfig',
  },
};

const Event = {
  PRODUCT_LIST_VIEWED: {
    name: 'product list viewed',
    category: ConfigCategory.PRODUCT,
  },
  PRODUCT_LIST_FILTERED: {
    name: 'product list filtered',
    category: ConfigCategory.PRODUCT,
  },
  PRODUCT_LIST_CLICKED: {
    name: 'product list clicked',
    category: ConfigCategory.PRODUCT,
  },
  PROMOTION_VIEWED: {
    name: 'promotion viewed',
    category: ConfigCategory.PROMOTION_VIEWED,
  },
  PROMOTION_CLICKED: {
    name: 'promotion clicked',
    category: ConfigCategory.PROMOTION_CLICKED,
  },
  PRODUCT_CLICKED: {
    name: 'product clicked',
    category: ConfigCategory.PRODUCT,
  },
  PRODUCT_VIEWED: {
    name: 'product viewed',
    category: ConfigCategory.PRODUCT,
  },
  PRODUCT_ADDED: {
    name: 'product added',
    category: ConfigCategory.PRODUCT,
  },
  WISHLIST_PRODUCT_ADDED_TO_CART: {
    name: 'wishlist product added to cart',
    category: ConfigCategory.PRODUCT,
  },
  PRODUCT_REMOVED: {
    name: 'product removed',
    category: ConfigCategory.PRODUCT,
  },
  PRODUCT_REMOVED_FROM_WISHLIST: {
    name: 'product removed from wishlist',
    category: ConfigCategory.PRODUCT,
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    name: 'product added to wishlist',
    category: ConfigCategory.PRODUCT,
  },
  CHECKOUT_STARTED: {
    name: 'checkout started',
    category: ConfigCategory.TRANSACTION,
  },
  ORDER_UPDATED: {
    name: 'order updated',
    category: ConfigCategory.TRANSACTION,
  },
  ORDER_COMPLETED: {
    name: 'order completed',
    category: ConfigCategory.TRANSACTION,
  },
  ORDER_CANCELLED: {
    name: 'order cancelled',
    category: ConfigCategory.TRANSACTION,
  },
  ORDER_REFUNDED: {
    name: 'order refunded',
    category: ConfigCategory.REFUND,
  },
};

const BASE_URL = 'https://api2.amplitude.com';
const BASE_URL_EU = 'https://api.eu.amplitude.com';

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
const batchEventsWithUserIdLengthLowerThanFive =
  process.env.BATCH_NOT_MET_CRITERIA_USER === 'true' || false;
const nameToEventMap = {};
const events = Object.keys(Event);
events.forEach((event) => {
  nameToEventMap[Event[event].name] = Event[event];
});
// Ref : https://www.docs.developers.amplitude.com/analytics/apis/user-privacy-api/#response
const DELETE_MAX_BATCH_SIZE = 100;
const DESTINATION = 'amplitude';
const IDENTIFY_AM = '$identify';

module.exports = {
  DESTINATION,
  Event,
  BASE_URL,
  BASE_URL_EU,
  ConfigCategory,
  mappingConfig,
  nameToEventMap,
  DELETE_MAX_BATCH_SIZE,
  batchEventsWithUserIdLengthLowerThanFive,
  IDENTIFY_AM,
};
