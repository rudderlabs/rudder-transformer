const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://a.klaviyo.com";

// TRACK and IDENTIFY DOCS: https://www.klaviyo.com/docs/http-api
// LIST API [MEMBERSHIP/SUBSCRIBE] DOCS:https://www.klaviyo.com/docs/http-api

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "KlaviyoIdentify", apiUrl: "/api/identify" },
  SCREEN: { name: "KlaviyoTrack", apiUrl: "/api/track" },
  TRACK: { name: "KlaviyoTrack", apiUrl: "/api/track" },
  GROUP: { name: "KlaviyoGroup" },
  STARTED_CHECKOUT: { name: "StartedCheckout" },
  VIEWED_PRODUCT: { name: "ViewedProduct" },
  ADDED_TO_CART: { name: "AddedToCart" },
  ITEMS: { name: "Items" }
};
const ecomExclusionKeys = [
  "name",
  "product_id",
  "sku",
  "image_url",
  "url",
  "brand",
  "price",
  "compare_at_price",
  "quantity",
  "categories",
  "products",
  "product_names",
  "order_id",
  "value",
  "checkout_url",
  "item_names",
  "items",
  "checkout_url"
];

const EVENT_NAME_MAPPING = {
  "product viewed": "Viewed Product",
  "product clicked": "Viewed Product",
  "product added": "Added to Cart",
  "checkout started": "Started Checkout"
};

const ECOM_EVENT_MAPPING = {
  "product viewed": "VIEWED_PRODUCT",
  "product clicked": "VIEWED_PRODUCT",
  "product added": "ADDED_TO_CART",
  "checkout started": "STARTED_CHECKOUT"
};

const LIST_CONF = {
  SUBSCRIBE: "Subscribe",
  MEMBERSHIP: "Membership"
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  LIST_CONF,
  ECOM_EVENT_MAPPING,
  EVENT_NAME_MAPPING,
  ecomExclusionKeys
};
