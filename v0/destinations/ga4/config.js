const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://www.google-analytics.com/mp/collect";

const ConfigCategory = {
  COMMON: {
    name: "GA4CommonConfig"
  },
  PRODUCTS_SEARCHED: {
    name: "GA4ProductsSearchedConfig"
  },
  PRODUCT_LIST_VIEWED: {
    name: "GA4ProductListViewedConfig"
  },
  PROMOTION_VIEWED: {
    name: "GA4ProductsSearchedConfig"
  },
  PROMOTION_CLICKED: {
    name: "GA4ProductsSearchedConfig"
  },
  PRODUCT_CLICKED: {
    name: "GA4ProductsSearchedConfig"
  },
  PRODUCT_VIEWED: {
    name: "GA4ProductsSearchedConfig"
  },
  PRODUCT_ADDED: {
    name: "GA4ProductsSearchedConfig"
  },
  PRODUCT_REMOVED: {
    name: "GA4ProductsSearchedConfig"
  },
  CART_VIEWED: {
    name: "GA4ProductsSearchedConfig"
  },
  CHECKOUT_STARTED: {
    name: "GA4ProductsSearchedConfig"
  },
  PAYMENT_INFO_ENTERED: {
    name: "GA4ProductsSearchedConfig"
  },
  ORDER_COMPLETED: {
    name: "GA4ProductsSearchedConfig"
  },
  ORDER_REFUNDED: {
    name: "GA4ProductsSearchedConfig"
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    name: "GA4ProductsSearchedConfig"
  },
  PRODUCT_SHARED: {
    name: "GA4ProductsSearchedConfig"
  },
  CART_SHARED: {
    name: "GA4ProductsSearchedConfig"
  },
  GROUP: {
    name: "GA4ProductsSearchedConfig"
  },
  EARN_VIRTUAL_CURRENCY: {
    name: "GA4ProductsSearchedConfig"
  }
};

const eventNameMapping = {
  /* E-Commerce Events */
  /* Browsing Section */
  products_searched: "search",
  product_list_viewed: "view_item_list",

  /* Promotions Section */
  promotion_viewed: "view_promotion",
  promotion_clicked: "select_promotion",

  /* Ordering Section */
  product_clicked: "select_item",
  product_viewed: "view_item",
  product_added: "add_to_cart",
  product_removed: "remove_from_cart",
  cart_viewed: "view_cart",
  checkout_started: "begin_checkout",
  payment_info_entered: "add_payment_info",
  // payment_info_entered: "add_shipping_info",
  order_completed: "purchase",
  order_refunded: "refund",

  /* Wishlist Section */
  product_added_to_wishlist: "add_to_wishlist",

  /* Sharing Section */
  product_shared: "share",
  cart_shared: "share",

  /* Group */
  group: "join_group",

  /* GA4 Events */
  earn_virtual_currency: "earn_virtual_currency",
  generate_lead: "generate_lead",
  level_up: "level_up",
  login: "login",
  post_score: "post_score",
  select_content: "select_content",
  sign_up: "sign_up",
  spend_virtual_currency: "spend_virtual_currency",
  tutorial_begin: "tutorial_begin",
  tutorial_complete: "tutorial_complete",
  unlock_achievement: "unlock_achievement",
  view_search_results: "view_search_results"
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ENDPOINT,
  eventNameMapping,
  trackCommonConfig: mappingConfig[ConfigCategory.COMMON.name],
  mappingConfig,
  ConfigCategory
};
