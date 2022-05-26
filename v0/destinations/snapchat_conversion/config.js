const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://tr.snapchat.com/v2/conversion";
const MAX_BATCH_SIZE = 2000;

const ConfigCategory = {
  COMMON: { name: "SnapchatCommonConfig" },
  /* E-Commerce Events */
  // Ref - https://www.rudderstack.com/docs/rudderstack-api/api-specification/rudderstack-ecommerce-events-specification/
  /* Browsing Section */
  PRODUCTS_SEARCHED: { name: "ProductsSearchedConfig" },
  PRODUCT_LIST_VIEWED: { name: "ProductListViewedConfig" },

  /* Promotions Section */
  PROMOTION_VIEWED: { name: "PromotionViewedConfig" },
  PROMOTION_CLICKED: { name: "PromotionClickedConfig" },

  /* Ordering Section */
  PRODUCT_VIEWED: { name: "ProductViewedConfig" },
  PRODUCT_ADDED: { name: "ProductAddedConfig" },
  CHECKOUT_STARTED: { name: "CheckoutStartedConfig" },
  PAYMENT_INFO_ENTERED: { name: "PaymentInfoEnteredConfig" },
  ORDER_COMPLETED: { name: "OrderCompletedConfig" },

  /* Wishlist Section */
  PRODUCT_ADDED_TO_WISHLIST: { name: "ProductAddedToWishlistConfig" },

  /* Snapchat General Events */
  SIGN_UP: { name: "SignupConfig" }
};

const eventNameMapping = {
  /* E-Commerce Events */
  /* Browsing Section */
  products_searched: "SEARCH",
  product_list_viewed: "VIEW_CONTENT",

  /* Promotions Section */
  promotion_viewed: "AD_VIEW",
  promotion_clicked: "AD_CLICK",

  /* Ordering Section */
  product_viewed: "VIEW_CONTENT",
  product_added: "ADD_CART",
  checkout_started: "START_CHECKOUT",
  payment_info_entered: "ADD_BILLING",
  order_completed: "PURCHASE",

  /* Wishlist Section */
  product_added_to_wishlist: "ADD_TO_WISHLIST",

  sign_up: "SIGN_UP",
  app_open: "APP_OPEN",
  save: "SAVE",
  subscribe: "SUBSCRIBE",
  complete_tutorial: "COMPLETE_TUTORIAL",
  invite: "INVITE",
  login: "LOGIN",
  share: "SHARE",
  reserve: "RESERVE",
  achievement_unlocked: "ACHIEVEMENT_UNLOCKED",
  spent_credits: "SPENT_CREDITS",
  rate: "RATE",
  start_trial: "START_TRIAL",
  list_view: "LIST_VIEW",
  page_view: "PAGE_VIEW",
  app_install: "APP_INSTALL",

  custom_event_1: "CUSTOM_EVENT_1",
  custom_event_2: "CUSTOM_EVENT_2",
  custom_event_3: "CUSTOM_EVENT_3",
  custom_event_4: "CUSTOM_EVENT_4",
  custom_event_5: "CUSTOM_EVENT_5"
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ENDPOINT,
  ConfigCategory,
  eventNameMapping,
  mappingConfig,
  trackCommonConfig: mappingConfig[ConfigCategory.COMMON.name],
  MAX_BATCH_SIZE
};
