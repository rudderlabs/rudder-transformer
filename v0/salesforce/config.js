const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "SFIdentifyConfig"
  },
  PAGE: {
    name: "SFPageViewConfig",
    hitType: "pageview"
  },
  SCREEN: {
    name: "SFScreenViewConfig",
    hitType: "screenview"
  },
  NON_ECOM: {
    name: "SFNonEComEventConfig",
    hitType: "event"
  },
  PROMOTION: {
    name: "SFPromotionEventConfig",
    hitType: "event"
  },
  PAYMENT: {
    name: "SFPaymentRelatedEventConfig",
    hitType: "transaction"
  },
  REFUND: {
    name: "SFRefundEventConfig",
    hitType: "transaction"
  },
  PRODUCT: {
    name: "SFProductEventConfig",
    hitType: "event"
  },
  PRODUCT_LIST: {
    name: "SFProductListEventConfig",
    hitType: "event"
  },
  TRANSACTION: {
    name: "SFTransactionEventConfig",
    hitType: "transaction"
  },
  SHARING: {
    name: "SFSharingEventConfig",
    hitType: "social"
  },
  ECOM_GENERIC: {
    name: "SFEComGenericEventConfig",
    hitType: "event"
  }
};

const Event = {
  PRODUCT_LIST_VIEWED: {
    name: "product list viewed",
    category: ConfigCategory.PRODUCT_LIST
  },
  PRODUCT_LIST_FILTERED: {
    name: "product list filtered",
    category: ConfigCategory.PRODUCT_LIST
  },
  PRODUCT_LIST_CLICKED: {
    name: "product list clicked",
    category: ConfigCategory.PRODUCT_LIST
  },
  PROMOTION_VIEWED: {
    name: "promotion viewed",
    category: ConfigCategory.PROMOTION
  },
  PROMOTION_CLICKED: {
    name: "promotion clicked",
    category: ConfigCategory.PROMOTION
  },
  PRODUCT_CLICKED: {
    name: "product clicked",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_VIEWED: {
    name: "product viewed",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_ADDED: {
    name: "product added",
    category: ConfigCategory.PRODUCT
  },
  WISHLIST_PRODUCT_ADDED_TO_CART: {
    name: "wishlist product added to cart",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_REMOVED: {
    name: "product removed",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_REMOVED_FROM_WISHLIST: {
    name: "product removed from wishlist",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    name: "product added to wishlist",
    category: ConfigCategory.PRODUCT
  },
  CHECKOUT_STARTED: {
    name: "checkout started",
    category: ConfigCategory.TRANSACTION
  },
  ORDER_UPDATED: {
    name: "order updated",
    category: ConfigCategory.TRANSACTION
  },
  ORDER_COMPLETED: {
    name: "order completed",
    category: ConfigCategory.TRANSACTION
  },
  ORDER_CANCELLED: {
    name: "order cancelled",
    category: ConfigCategory.TRANSACTION
  },
  ORDER_REFUNDED: {
    name: "order refunded",
    category: ConfigCategory.REFUND
  },
  CHECKOUT_STEP_VIEWED: {
    name: "checkout step viewed",
    category: ConfigCategory.PAYMENT
  },
  CHECKOUT_STEP_COMPLETED: {
    name: "checkout step completed",
    category: ConfigCategory.PAYMENT
  },
  PAYMENT_INFO_ENTERED: {
    name: "payment info entered",
    category: ConfigCategory.PAYMENT
  },
  PRODUCT_SHARED: {
    name: "product shared",
    category: ConfigCategory.SHARING
  },
  CART_SHARED: {
    name: "cart shared",
    category: ConfigCategory.SHARING
  },
  CART_VIEWED: {
    name: "cart viewed",
    category: ConfigCategory.ECOM_GENERIC
  },
  COUPON_ENTERED: {
    name: "coupon entered",
    category: ConfigCategory.ECOM_GENERIC
  },
  COUPON_APPLIED: {
    name: "coupon applied",
    category: ConfigCategory.ECOM_GENERIC
  },
  COUPON_DENIED: {
    name: "coupon denied",
    category: ConfigCategory.ECOM_GENERIC
  },
  COUPON_REMOVED: {
    name: "coupon removed",
    category: ConfigCategory.ECOM_GENERIC
  },
  PRODUCT_REVIEWED: {
    name: "product reviewed",
    category: ConfigCategory.ECOM_GENERIC
  },
  PRODUCTS_SEARCHED: {
    name: "products searched",
    category: ConfigCategory.ECOM_GENERIC
  }
};

const SF_API_VERSION = "47.0";
const SF_TOKEN_REQUEST_HOST = "login.salesforce.com";
const SF_TOKEN_REQUEST_PORT = 443;
const SF_TOKEN_REQUEST_PATH = "/services/oauth2/token";
const SF_TOKEN_REQUEST_URL = "https://login.salesforce.com/services/oauth2/token";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const nameToEventMap = {};
const events = Object.keys(Event);
events.forEach(event => {
  nameToEventMap[Event[event].name] = Event[event];
});

module.exports = {
  Event,
  ConfigCategory,
  SF_API_VERSION,
  SF_TOKEN_REQUEST_HOST,
  SF_TOKEN_REQUEST_PORT,
  SF_TOKEN_REQUEST_PATH,
  SF_TOKEN_REQUEST_URL,
  mappingConfig,
  nameToEventMap
};
