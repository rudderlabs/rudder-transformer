const { getMappingConfig } = require('../../util');

const API_VERSION = 'v19';

const CUSTOMER_ID_PARAM = ':customerId';

const BASE_ENDPOINT = `https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID_PARAM}`;

// Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v19/customers/uploadClickConversions
const CLICK_CONVERSION_ENDPOINT_PATH = 'uploadClickConversions';
const CLICK_CONVERSION = `${BASE_ENDPOINT}:${CLICK_CONVERSION_ENDPOINT_PATH}`;

// Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v19/customers/uploadCallConversions
const CALL_CONVERSION_ENDPOINT_PATH = 'uploadCallConversions';
const CALL_CONVERSION = `${BASE_ENDPOINT}:${CALL_CONVERSION_ENDPOINT_PATH}`;

// Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v19/customers.googleAds/searchStream
const SEARCH_STREAM_ENDPOINT_PATH = 'searchStream';
const SEARCH_STREAM = `${BASE_ENDPOINT}/googleAds:${SEARCH_STREAM_ENDPOINT_PATH}`;

// Batch size limit for click and call conversions
// https://developers.google.com/google-ads/api/docs/best-practices/quotas
const MAX_CONVERSIONS_PER_BATCH = 2000;

const STORE_CONVERSION_ENDPOINT_PATH = 'offlineUserDataJobs';
const STORE_CONVERSION_CONFIG = `${BASE_ENDPOINT}/${STORE_CONVERSION_ENDPOINT_PATH}`;
const CONFIG_CATEGORIES = {
  TRACK_CLICK_CONVERSIONS_CONFIG: {
    name: 'TrackClickConversionsConfig',
  },
  TRACK_CALL_CONVERSIONS_CONFIG: {
    name: 'TrackCallConversionsConfig',
  },
  TRACK_STORE_CONVERSION_CONFIG_CREATE_JOB: {
    name: 'TrackCreateJobStoreConversionsConfig',
  },
  TRACK_STORE_CONVERSION_CONFIG_ADD_CONVERSION: {
    name: 'TrackAddStoreConversionsConfig',
  },
  TRACK_STORE_ADDRESS_IDENTIFIER: {
    name: 'storeAddoperationAddressMap',
  },
};

const CONVERSION_ACTION_ID_CACHE_TTL = process.env.CONVERSION_ACTION_ID_CACHE_TTL
  ? parseInt(process.env.CONVERSION_ACTION_ID_CACHE_TTL, 10)
  : 60 * 60 * 24; // in seconds - i.e 1 day

const CONVERSION_CUSTOM_VARIABLE_CACHE_TTL = process.env.CONVERSION_CUSTOM_VARIABLE_CACHE_TTL
  ? parseInt(process.env.CONVERSION_CUSTOM_VARIABLE_CACHE_TTL, 10)
  : 60 * 60 * 24; // in seconds - i.e 1 day

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const consentConfigMap = {
  personalizationConsent: 'adPersonalization',
  userDataConsent: 'adUserData',
};

module.exports = {
  destType: 'google_adwords_offline_conversions',
  trackClickConversionsMapping:
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CLICK_CONVERSIONS_CONFIG.name],
  trackCallConversionsMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_CALL_CONVERSIONS_CONFIG.name],
  CUSTOMER_ID_PARAM,
  CLICK_CONVERSION_ENDPOINT_PATH,
  CLICK_CONVERSION,
  CALL_CONVERSION_ENDPOINT_PATH,
  CALL_CONVERSION,
  SEARCH_STREAM_ENDPOINT_PATH,
  SEARCH_STREAM,
  CONVERSION_ACTION_ID_CACHE_TTL,
  CONVERSION_CUSTOM_VARIABLE_CACHE_TTL,
  STORE_CONVERSION_ENDPOINT_PATH,
  STORE_CONVERSION_CONFIG,
  trackCreateStoreConversionsMapping:
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_STORE_CONVERSION_CONFIG_CREATE_JOB.name],
  trackAddStoreConversionsMapping:
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_STORE_CONVERSION_CONFIG_ADD_CONVERSION.name],
  trackAddStoreAddressConversionsMapping:
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_STORE_ADDRESS_IDENTIFIER.name],
  consentConfigMap,
  API_VERSION,
  MAX_CONVERSIONS_PER_BATCH,
};
