const { getMappingConfig } = require('../../util');

const ConfigCategory = {
  IDENTIFY: {
    name: 'GAIdentifyConfig',
    hitType: 'event',
  },
  PAGE: {
    name: 'GAPageViewConfig',
    hitType: 'pageview',
  },
  SCREEN: {
    name: 'GAScreenViewConfig',
    hitType: 'screenview',
  },
  NON_ECOM: {
    name: 'GANonEComEventConfig',
    hitType: 'event',
  },
  PROMOTION: {
    name: 'GAPromotionEventConfig',
    hitType: 'event',
  },
  PAYMENT: {
    name: 'GAPaymentRelatedEventConfig',
    hitType: 'transaction',
  },
  REFUND: {
    name: 'GARefundEventConfig',
    hitType: 'transaction',
  },
  PRODUCT: {
    name: 'GAProductEventConfig',
    hitType: 'event',
  },
  PRODUCT_LIST: {
    name: 'GAProductListEventConfig',
    hitType: 'event',
  },
  TRANSACTION: {
    name: 'GATransactionEventConfig',
    hitType: 'transaction',
  },
  SHARING: {
    name: 'GASharingEventConfig',
    hitType: 'social',
  },
  ECOM_GENERIC: {
    name: 'GAEComGenericEventConfig',
    hitType: 'event',
  },
};

const Event = {
  PRODUCT_LIST_VIEWED: {
    name: 'product list viewed',
    category: ConfigCategory.PRODUCT_LIST,
  },
  PRODUCT_LIST_FILTERED: {
    name: 'product list filtered',
    category: ConfigCategory.PRODUCT_LIST,
  },
  PRODUCT_LIST_CLICKED: {
    name: 'product list clicked',
    category: ConfigCategory.PRODUCT_LIST,
  },
  PROMOTION_VIEWED: {
    name: 'promotion viewed',
    category: ConfigCategory.PROMOTION,
  },
  PROMOTION_CLICKED: {
    name: 'promotion clicked',
    category: ConfigCategory.PROMOTION,
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
  CHECKOUT_STEP_VIEWED: {
    name: 'checkout step viewed',
    category: ConfigCategory.PAYMENT,
  },
  CHECKOUT_STEP_COMPLETED: {
    name: 'checkout step completed',
    category: ConfigCategory.PAYMENT,
  },
  PAYMENT_INFO_ENTERED: {
    name: 'payment info entered',
    category: ConfigCategory.PAYMENT,
  },
  PRODUCT_SHARED: {
    name: 'product shared',
    category: ConfigCategory.SHARING,
  },
  CART_SHARED: {
    name: 'cart shared',
    category: ConfigCategory.SHARING,
  },
  CART_VIEWED: {
    name: 'cart viewed',
    category: ConfigCategory.ECOM_GENERIC,
  },
  COUPON_ENTERED: {
    name: 'coupon entered',
    category: ConfigCategory.ECOM_GENERIC,
  },
  COUPON_APPLIED: {
    name: 'coupon applied',
    category: ConfigCategory.ECOM_GENERIC,
  },
  COUPON_DENIED: {
    name: 'coupon denied',
    category: ConfigCategory.ECOM_GENERIC,
  },
  COUPON_REMOVED: {
    name: 'coupon removed',
    category: ConfigCategory.ECOM_GENERIC,
  },
  PRODUCT_REVIEWED: {
    name: 'product reviewed',
    category: ConfigCategory.ECOM_GENERIC,
  },
  PRODUCTS_SEARCHED: {
    name: 'products searched',
    category: ConfigCategory.ECOM_GENERIC,
  },
};

const GA_ENDPOINT = 'https://www.google-analytics.com/collect';

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const nameToEventMap = {};
const events = Object.keys(Event);
events.forEach((event) => {
  nameToEventMap[Event[event].name] = Event[event];
});
const DESTINATION = 'googleAnalytics';

module.exports = {
  Event,
  GA_ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap,
  DESTINATION,
  GA_USER_DELETION_ENDPOINT:
    'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
};
