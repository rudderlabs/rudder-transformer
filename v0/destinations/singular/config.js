const { getMappingConfig } = require("../../util");

const BASE_URL = "https://s2s.singular.net/api/v1";

/* Supported events in Singular: SessionNotification, EventNotification
   ref: https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference
 */
const CONFIG_CATEGORIES = {
  SESSION: {
    name: "SINGULARSessionNotificationConfig",
    type: "track"
  },
  EVENT: {
    name: "SINGULAREventNotificationConfig",
    type: "track"
  }
};

const SINGULAR_SESSION_EXCLUSION = [
  "install_source",
  "install_receipt",
  "asid",
  "openuri",
  "install_ref",
  "custom_user_id",
  "n",
  "utime",
  "attribution_token",
  "skan_conversion_value",
  "skan_first_call_timestamp",
  "skan_last_call_timestamp"
];

const SINGULAR_EVENT_EXCLUSION = [
  "skan_conversion_value",
  "skan_first_call_timestamp",
  "skan_last_call_timestamp",
  "is_revenue_event",
  "amt",
  "cur",
  "purchase_receipt",
  "purchase_product_id",
  "purchase_transaction_id"
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
  SINGULAR_SESSION_EXCLUSION,
  SINGULAR_EVENT_EXCLUSION,
  BASE_URL
};
