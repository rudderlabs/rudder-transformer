const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://www.google-analytics.com/mp/collect";

/**
 * config for GA4 events
 *
 * For Item list these are the convention that is being followed
 * "YES" - Item list is present and is a required field
 * "NO" - Item list is present and is not a required field
 *
 * Item parameters present in properties {}
 * following are the convention
 * "YES" - Item is present and is a required field
 * "NO" - Item is present and is not a required field
 */
const ConfigCategory = {
  COMMON: { name: "GA4CommonConfig" },
  ITEM_LIST: { name: "GA4ItemListConfig" },
  ITEM: { name: "GA4ItemConfig" },

  /* E-Commerce Events */
  // Ref - https://www.rudderstack.com/docs/rudderstack-api/api-specification/rudderstack-ecommerce-events-specification/

  /* Browsing Section */
  PRODUCTS_SEARCHED: {
    name: "GA4ProductsSearchedConfig",
    event: "search"
  },
  PRODUCT_LIST_VIEWED: {
    name: "GA4ProductListViewedConfig",
    event: "view_item_list",
    itemList: "YES"
  },

  /* Promotions Section */
  PROMOTION_VIEWED: {
    name: "GA4PromotionViewedConfig",
    event: "view_promotion",
    itemList: "YES"
  },
  PROMOTION_CLICKED: {
    name: "GA4PromotionClickedConfig",
    event: "select_promotion",
    itemList: "NO"
  },

  /* Ordering Section */
  PRODUCT_CLICKED: {
    name: "GA4ProductClickedConfig",
    event: "select_item",
    item: "YES"
  },
  PRODUCT_VIEWED: {
    name: "GA4ProductViewedConfig",
    event: "view_item",
    item: "YES"
  },
  PRODUCT_ADDED: {
    name: "GA4ProductAddedConfig",
    event: "add_to_cart",
    itemList: "YES"
  },
  PRODUCT_REMOVED: {
    name: "GA4ProductRemovedConfig",
    event: "remove_from_cart",
    itemList: "YES"
  },
  CART_VIEWED: {
    name: "GA4CartViewedConfig",
    event: "view_cart",
    itemList: "YES"
  },
  CHECKOUT_STARTED: {
    name: "GA4CheckoutStartedConfig",
    event: "begin_checkout",
    itemList: "YES"
  },
  PAYMENT_INFO_ENTERED: {
    name: "GA4PaymentInfoEnteredConfig",
    event: "add_payment_info",
    itemList: "YES"
  },
  CHECKOUT_STEP_COMPLETED: {
    name: "GA4CheckoutStepCompleted",
    event: "add_shipping_info",
    itemList: "YES"
  },
  ORDER_COMPLETED: {
    name: "GA4OrderCompletedConfig",
    event: "purchase",
    itemList: "YES"
  },
  ORDER_REFUNDED: {
    name: "GA4OrderRefundedConfig",
    event: "refund",
    itemList: "NO"
  },

  /* Wishlist Section */
  PRODUCT_ADDED_TO_WISHLIST: {
    name: "GA4ProductAddedToWishlistConfig",
    event: "add_to_wishlist",
    itemList: "YES"
  },

  /* Sharing Section */
  PRODUCT_SHARED: {
    name: "GA4ProductSharedConfig",
    event: "share"
  },
  CART_SHARED: {
    name: "GA4CartSharedConfig",
    event: "share"
  },

  /* Group */
  GROUP: {
    name: "GA4GroupConfig",
    event: "group"
  },

  /* GA4 Events */
  GENERATE_LEAD: {
    name: "GA4GenerateLeadConfig",
    event: "generate_lead"
  },
  VIEW_SEARCH_RESULTS: {
    name: "GA4ViewSearchResults",
    event: "view_search_results",
    itemList: "YES"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  trackCommonConfig: mappingConfig[ConfigCategory.COMMON.name]
};
