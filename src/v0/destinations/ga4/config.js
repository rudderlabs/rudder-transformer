const { getMappingConfig } = require('../../util');

const ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

/**
 * config for GA4 events
 *
 * For Item list these are the convention that is being followed
 * Here, Item list is basically means `products` array parameter in the input and it will be mapped to GA4 `Items` array parameter
 * "YES" - Item list is present and is a required field in the input
 * "NO" - Item list is present and is not a required field in the input
 *
 * Item parameters present in properties {}
 * Here, Item is basically means root-level `properties` present in the input and these will be mapped to GA4 `Items` array parameter
 * following are the convention
 * "YES" - Item is present and is a required field in the input
 * "NO" - Item is present and is not a required field in the input
 */
const ConfigCategory = {
  COMMON: { name: 'GA4CommonConfig' },
  ITEM_LIST: { name: 'GA4ItemListConfig' },
  ITEM: { name: 'GA4ItemConfig' },

  /**
   * taking optional params paramerters depending on message type
   * and any additional changes to the mapping here must be updated in
   * GA4_PARAMETERS_EXCLUSION = [] list in utils.js
   */
  IdentifyGroupCommonParamsConfig: {
    name: 'GA4IdentifyGroupCommonParamsConfig',
  },
  TrackPageCommonParamsConfig: { name: 'GA4TrackPageCommonParamsConfig' },

  /* E-Commerce Events */
  // Ref - https://www.rudderstack.com/docs/rudderstack-api/api-specification/rudderstack-ecommerce-events-specification/

  /* Browsing Section */
  PRODUCTS_SEARCHED: {
    name: 'GA4ProductsSearchedConfig',
    event: 'search',
  },
  PRODUCT_LIST_VIEWED: {
    name: 'GA4ProductListViewedConfig',
    event: 'view_item_list',
    itemList: 'YES',
  },

  /* Promotions Section */
  PROMOTION_VIEWED: {
    name: 'GA4PromotionViewedConfig',
    event: 'view_promotion',
    itemList: 'YES',
  },
  PROMOTION_CLICKED: {
    name: 'GA4PromotionClickedConfig',
    event: 'select_promotion',
    itemList: 'NO',
  },

  /* Ordering Section */
  PRODUCT_CLICKED: {
    name: 'GA4ProductClickedConfig',
    event: 'select_item',
    item: 'YES',
  },
  PRODUCT_VIEWED: {
    name: 'GA4ProductViewedConfig',
    event: 'view_item',
    item: 'YES',
  },
  PRODUCT_ADDED: {
    name: 'GA4ProductAddedConfig',
    event: 'add_to_cart',
    itemList: 'NO',
    item: 'YES',
  },
  PRODUCT_REMOVED: {
    name: 'GA4ProductRemovedConfig',
    event: 'remove_from_cart',
    itemList: 'NO',
    item: 'YES',
  },
  CART_VIEWED: {
    name: 'GA4CartViewedConfig',
    event: 'view_cart',
    itemList: 'YES',
  },
  CHECKOUT_STARTED: {
    name: 'GA4CheckoutStartedConfig',
    event: 'begin_checkout',
    itemList: 'YES',
  },
  PAYMENT_INFO_ENTERED: {
    name: 'GA4PaymentInfoEnteredConfig',
    event: 'add_payment_info',
    itemList: 'YES',
  },
  CHECKOUT_STEP_COMPLETED: {
    name: 'GA4CheckoutStepCompleted',
    event: 'add_shipping_info',
    itemList: 'YES',
  },
  ORDER_COMPLETED: {
    name: 'GA4OrderCompletedConfig',
    event: 'purchase',
    itemList: 'YES',
  },
  ORDER_REFUNDED: {
    name: 'GA4OrderRefundedConfig',
    event: 'refund',
    itemList: 'NO',
  },

  /* Wishlist Section */
  PRODUCT_ADDED_TO_WISHLIST: {
    name: 'GA4ProductAddedToWishlistConfig',
    event: 'add_to_wishlist',
    itemList: 'NO',
    item: 'YES',
  },

  /* Sharing Section */
  PRODUCT_SHARED: {
    name: 'GA4ProductSharedConfig',
    event: 'share',
  },
  CART_SHARED: {
    name: 'GA4CartSharedConfig',
    event: 'share',
  },

  /* Page */
  PAGE: {
    name: 'GA4PageConfig',
    event: 'page',
  },

  /* Group */
  GROUP: {
    name: 'GA4GroupConfig',
    event: 'group',
  },

  /* GA4 Events */
  VIEW_SEARCH_RESULTS: {
    name: 'GA4ViewSearchResults',
    event: 'view_search_results',
    itemList: 'YES',
  },
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const VALID_ITEM_OR_PRODUCT_PROPERTIES = [
  ConfigCategory.PRODUCT_CLICKED.event,
  ConfigCategory.PRODUCT_VIEWED.event,
  ConfigCategory.PRODUCT_ADDED.event,
  ConfigCategory.PRODUCT_REMOVED.event,
  ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.event,
];

module.exports = {
  ENDPOINT,
  DEBUG_ENDPOINT,
  ConfigCategory,
  mappingConfig,
  trackCommonConfig: mappingConfig[ConfigCategory.COMMON.name],
  VALID_ITEM_OR_PRODUCT_PROPERTIES,
};
