const { getMappingConfig } = require("../../util");

const BASE_URL = "https://s2s.singular.net/api/v1";

/* Supported events in Singular: SessionNotification, EventNotification
   ref: https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference
 */
const CONFIG_CATEGORIES = {
  SESSION_ANDROID: {
    name: "SINGULARAndroidSessionConfig",
    type: "track"
  },
  SESSION_IOS: {
    name: "SINGULARIosSessionConfig",
    type: "track"
  },
  EVENT_ANDROID: {
    name: "SINGULARAndroidEventConfig",
    type: "track"
  },
  EVENT_IOS: {
    name: "SINGULARIosEventConfig",
    type: "track"
  },
  PRODUCT_PROPERTY: {
    name: "SINGULAREventProductConfig"
  }
};

const SINGULAR_SESSION_ANDROID_EXCLUSION = [
  "install_source",
  "asid",
  "openuri",
  "install_ref",
  "bd",
  "install"
];

const SINGULAR_SESSION_IOS_EXCLUSION = [
  "install_receipt",
  "openuri",
  "ua",
  "attribution_token",
  "skan_conversion_value",
  "skan_first_call_timestamp",
  "skan_last_call_timestamp",
  "bd",
  "install"
];

const SINGULAR_EVENT_ANDROID_EXCLUSION = [
  "amt",
  "cur",
  "asid",
  "is_revenue_event",
  "purchase_receipt",
  "purchase_product_id",
  "purchase_transaction_id",
  "receipt_signature",
  "products"
];
const SINGULAR_EVENT_IOS_EXCLUSION = [
  "amt",
  "cur",
  "is_revenue_event",
  "purchase_receipt",
  "purchase_product_id",
  "purchase_transaction_id",
  "skan_conversion_value",
  "skan_first_call_timestamp",
  "skan_last_call_timestamp",
  "products"
];

const sessionEvents = [
  "Application Installed",
  "Application Updated",
  "Application Opened"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  sessionEvents,
  SINGULAR_SESSION_ANDROID_EXCLUSION,
  SINGULAR_SESSION_IOS_EXCLUSION,
  SINGULAR_EVENT_ANDROID_EXCLUSION,
  SINGULAR_EVENT_IOS_EXCLUSION,
  BASE_URL
};
