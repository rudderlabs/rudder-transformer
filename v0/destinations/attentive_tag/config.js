const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.attentivemobile.com/v1";

const CONFIG_CATEGORIES = {
  SUBSCRIBE: { name: "attentiveSubscribeConfig" },
  UNSUBSCRIBE: {
    name: "attentiveUnsubscribeConfig"
  },
  TRACK: { name: "customTrackConfig", endPoint: "/events/custom" },
  ORDER_COMPLETED: {
    name: "orderCompletedConfig",
    endPoint: "/events/ecommerce/purchase"
  },
  PRODUCT_ADDED: {
    name: "productAddedConfig",
    endpoint: "/events/ecommerce/add-to-cart"
  },
  PRODUCT_VIEWED: {
    name: "productViewedConfig",
    endpoint: "/events/ecommerce/product-view"
  },
  PRODUCT_LIST_VIEWED: {
    name: "productListViewedConfig",
    endpoint: "/events/ecommerce/product-view"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};
