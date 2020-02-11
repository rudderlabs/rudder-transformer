const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "BrazeUserAttributesConfig"
  },
  PAGE: {
    name: "AmplitudePageConfig"
  },
  SCREEN: {
    name: "AmplitudeScreenConfig"
  },
  PROMOTION_VIEWED: {
    name: "AmplitudePromotionViewedConfig"
  },
  PROMOTION_CLICKED: {
    name: "AmplitudePromotionClickedConfig"
  },
  PRODUCT: {
    name: "AmplitudeProductActionsConfig"
  },
  REVENUE: {
    name: "AmplitudeRevenueConfig"
  },
  DEFAULT: {
    name: "AmplitudeDefaultConfig"
  }
};

const Event = {
  PRODUCT_LIST_VIEWED: {
    name: "product list viewed",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_LIST_FILTERED: {
    name: "product list filtered",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_LIST_CLICKED: {
    name: "product list clicked",
    category: ConfigCategory.PRODUCT
  },
  PROMOTION_VIEWED: {
    name: "promotion viewed",
    category: ConfigCategory.PROMOTION_VIEWED
  },
  PROMOTION_CLICKED: {
    name: "promotion clicked",
    category: ConfigCategory.PROMOTION_CLICKED
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
  }
};

function getIdentifyEndpoint(endPoint)
{
  return endPoint+"/users/identify";
}

function getTrackEndPoint(endPoint)
{
  return endPoint+"/users/track";
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const nameToEventMap = {};
const events = Object.keys(Event);
events.forEach(event => {
  nameToEventMap[Event[event].name] = Event[event];
});

module.exports = {
  Event, 
  ConfigCategory,
  mappingConfig,
  nameToEventMap,
  getIdentifyEndpoint,
  getTrackEndPoint
};
