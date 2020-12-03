const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  USERDATA: { type: "identify", name: "FBPIXELUserDataConfig" },
  COMMON: { name: "FBPIXELCommonConfig" },
  SIMPLE_TRACK: { type: "simple track", name: "FBPIXELPSimpleCustomConfig" },
  PRODUCT_LIST_VIEWED: {
    type: "product list viewed",
    name: "FBPIXELProductListViewedConfig"
  },
  PRODUCT_VIEWED: {
    type: "product viewed",
    name: "FBPIXELProductViewedConfig"
  },
  PRODUCT_ADDED: {
    type: "product added",
    name: "FBPIXELProductAddedConfig"
  },
  ORDER_COMPLETED: {
    type: "order completed",
    name: "FBPIXELOrderCompletedConfig"
  },
  PRODUCTS_SEARCHED: {
    type: "products searched",
    name: "FBPIXELProductsSearchedConfig"
  },
  CHECKOUT_STARTED: {
    type: "checkout started",
    name: "FBPIXELCheckoutStartedConfig"
  },
  PAGE: { type: "page", name: "FBPIXELPSimpleCustomConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
