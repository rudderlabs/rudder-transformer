const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://graph.facebook.com/v15.0/OFFLINE_EVENT_SET_ID/events";

const CONFIG_CATEGORIES = {
  OFFLINE_EVENTS: {
    type: "track",
    name: "FbOfflineConversionsTrackConfig"
  }
};

const destKeys = [
  "email",
  "phone",
  "gen",
  "ln",
  "fn",
  "fi",
  "dobm",
  "doby",
  "dobd",
  "ct",
  "st",
  "zip",
  "country",
  "madid",
  "extern_id",
  "lead_id",
  "fbc",
  "fbp",
  "client_user_agent"
];

const destKeyType = {
  email: "array",
  phone: "array",
  st: "array",
  zip: "array",
  gen: "string",
  ln: "string",
  fn: "string",
  fi: "string",
  dobm: "string",
  doby: "string",
  dobd: "string",
  ct: "string",
  madid: "string",
  country: "string",
  extern_id: "string",
  lead_id: "string",
  fbc: "string",
  fbp: "string",
  client_user_agent: "string"
};

const TRACK_EXCLUSION_FIELDS = [
  "currency",
  "total",
  "price",
  "value",
  "revenue",
  "products",
  "order_id",
  "item_number",
  "email",
  "upload_tag"
];

const eventToStandardMapping = {
  "Products Searched": "Search",
  "Product Viewed": "ViewContent",
  "Product List Viewed": "ViewContent",
  "Product Added to Wishlist": "AddToWishlist",
  "Product Added": "AddToCart",
  "Checkout Started": "InitiateCheckout",
  "Payment Info Entered": "AddPaymentInfo",
  "Order Completed": "Purchase"
};

const ACTION_SOURCES_VALUES = [
  "email",
  "website",
  "phone_call",
  "chat",
  "app",
  "physical_store",
  "system_generated",
  "other"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ENDPOINT,
  destKeys,
  destKeyType,
  ACTION_SOURCES_VALUES,
  TRACK_EXCLUSION_FIELDS,
  eventToStandardMapping,
  DESTINATION: "FACEBOOK_OFFLINE_CONVERSIONS"
};
