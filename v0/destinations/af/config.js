const { getMappingConfig } = require("../../util");

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
  },
  DEFAULT: {
    name: "AFDefaultConfig"
  }
};

const Event = {
  WISHLIST_PRODUCT_ADDED_TO_CART: {
    name: "wishlist product added to cart",
    category: ConfigCategory.CART_OR_WISHLIST,
    afName: "af_add_to_cart"
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    name: "product added to wishlist",
    category: ConfigCategory.CART_OR_WISHLIST,
    afName: "af_add_to_wishlist"
  },
  CHECKOUT_STARTED: {
    name: "checkout started",
    category: ConfigCategory.CART_OR_WISHLIST,
    afName: "af_initiated_checkout"
  },
  ORDER_COMPLETED: {
    name: "order completed",
    category: ConfigCategory.PURCHASE,
    afName: "af_purchase"
  },
  PRODUCT_REMOVED: {
    name: "product removed",
    category: ConfigCategory.PURCHASE,
    afName: "remove_from_cart"
  },
  PRODUCT_SEARCHED: {
    name: "products searched",
    category: ConfigCategory.SEARCH,
    afName: "af_search"
  },
  PRODUCT_VIEWED: {
    name: "product viewed",
    category: ConfigCategory.CONTENT_VIEW,
    afName: "af_content_view"
  }
};

const ENDPOINT = "https://api2.appsflyer.com/inappevent/";

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const nameToEventMap = {};
const events = Object.keys(Event);
events.forEach(event => {
  nameToEventMap[Event[event].name] = Event[event];
});

module.exports = {
  Event,
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
};
