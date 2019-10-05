const { getMappingConfig } = require("../util");

const ConfigCategory = {
  CART_OR_WISHLIST: {
    name: "AFAddToCartOrWishlistConfig"
  },
  PURCHASE: {
    name: "AFPurchaseConfig"
  },
  SEARCH: {
    name: "AFSearchConfig"
  },
  CONTENT_VIEW: {
    name: "AFContentViewConfig"
  }
};

const Event = {
  WISHLIST_PRODUCT_ADDED_TO_CART: {
    name: "wishlist product added to cart",
    category: ConfigCategory.CART_OR_WISHLIST
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    name: "product added to wishlist",
    category: ConfigCategory.CART_OR_WISHLIST
  },
  CHECKOUT_STARTED: {
    name: "checkout started",
    category: ConfigCategory.CART_OR_WISHLIST
  },
  ORDER_COMPLETED: {
    name: "order completed",
    category: ConfigCategory.PURCHASE
  },
  PRODUCT_REMOVED: {
    name: "product removed",
    category: ConfigCategory.PURCHASE
  },
  PRODUCT_SEARCHED: {
    name: "products searched",
    category: ConfigCategory.SEARCH
  },
  PRODUCT_VIEWED: {
    name: "product viewed",
    category: ConfigCategory.CONTENT_VIEW
  }
};

const ENDPOINT = "https://api2.appsflyer.com/inappevent/";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const nameToEventMap = {};
const events = Object.keys(Event);
events.forEach(event => {
  nameToEventMap[event.name] = event;
});

module.exports = {
  Event,
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
};
