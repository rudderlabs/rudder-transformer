const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  USERDATA: {
    standard: false,
    type: "identify",
    name: "FBPIXELUserDataConfig"
  },
  COMMON: { name: "FBPIXELCommonConfig" },
  SIMPLE_TRACK: {
    standard: false,
    type: "simple track",
    name: "FBPIXELPSimpleCustomConfig"
  },
  PRODUCT_LIST_VIEWED: {
    standard: true,
    type: "product list viewed",
    name: "FBPIXELPSimpleCustomConfig"
  },
  PRODUCT_VIEWED: {
    standard: true,
    type: "product viewed",
    name: "FBPIXELProductViewedConfig"
  },
  PRODUCT_ADDED: {
    standard: true,
    type: "product added",
    name: "FBPIXELProductAddedConfig"
  },
  ORDER_COMPLETED: {
    standard: true,
    type: "order completed",
    name: "FBPIXELOrderCompletedConfig"
  },
  PRODUCTS_SEARCHED: {
    standard: true,
    type: "products searched",
    name: "FBPIXELProductsSearchedConfig"
  },
  CHECKOUT_STARTED: {
    standard: true,
    type: "checkout started",
    name: "FBPIXELCheckoutStartedConfig"
  },
  PAGE: { standard: false, type: "page", name: "FBPIXELPSimpleCustomConfig" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
