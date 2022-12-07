const { getMappingConfig } = require("../../util");

const API_VERSION = "v11";

const BASE_ENDPOINT = `https://googleads.googleapis.com/${API_VERSION}/customers/:customerId`;

// Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v11/customers/uploadClickConversions
const CLICK_CONVERSION = `${BASE_ENDPOINT}:uploadClickConversions`;

// Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v11/customers/uploadCallConversions
const CALL_CONVERSION = `${BASE_ENDPOINT}:uploadCallConversions`;

// Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v11/customers.googleAds/searchStream
const SEARCH_STREAM = `${BASE_ENDPOINT}/googleAds:searchStream`;

const CONFIG_CATEGORIES = {
  TRACK_CLICK_CONVERSIONS_CONFIG: {
    name: "TrackClickConversionsConfig"
  },
  TRACK_CALL_CONVERSIONS_CONFIG: {
    name: "TrackCallConversionsConfig"
  }
};

const CONVERSION_ACTION_ID_CACHE_TTL = process.env
  .CONVERSION_ACTION_ID_CACHE_TTL
  ? parseInt(process.env.CONVERSION_ACTION_ID_CACHE_TTL, 10)
  : 60 * 60 * 24; // in seconds - i.e 1 day

const CONVERSION_CUSTOM_VARIABLE_CACHE_TTL = process.env
  .CONVERSION_CUSTOM_VARIABLE_CACHE_TTL
  ? parseInt(process.env.CONVERSION_CUSTOM_VARIABLE_CACHE_TTL, 10)
  : 60 * 60 * 24; // in seconds - i.e 1 day

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  trackClickConversionsMapping:
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CLICK_CONVERSIONS_CONFIG.name],
  trackCallConversionsMapping:
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CALL_CONVERSIONS_CONFIG.name],
  CLICK_CONVERSION,
  CALL_CONVERSION,
  SEARCH_STREAM,
  CONVERSION_ACTION_ID_CACHE_TTL,
  CONVERSION_CUSTOM_VARIABLE_CACHE_TTL
};
