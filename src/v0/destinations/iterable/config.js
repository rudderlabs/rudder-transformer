const { getMappingConfig } = require('../../util');

const BASE_URL = {
  USDC: 'https://api.iterable.com/api/',
  EUDC: 'https://api.eu.iterable.com/api/',
};

const ConfigCategory = {
  IDENTIFY_BROWSER: {
    name: 'IterableRegisterBrowserTokenConfig',
    action: 'identifyBrowser',
    endpoint: `users/registerBrowserToken`,
  },
  IDENTIFY_DEVICE: {
    name: 'IterableRegisterDeviceTokenConfig',
    action: 'identifyDevice',
    endpoint: `users/registerDeviceToken`,
  },
  IDENTIFY: {
    name: 'IterableIdentifyConfig',
    action: 'identify',
    endpoint: `users/update`,
  },
  PAGE: {
    name: 'IterablePageConfig',
    action: 'page',
    endpoint: `events/track`,
  },
  SCREEN: {
    name: 'IterablePageConfig',
    action: 'screen',
    endpoint: `events/track`,
  },
  TRACK: {
    name: 'IterableTrackConfig',
    action: 'track',
    endpoint: `events/track`,
  },
  TRACK_PURCHASE: {
    name: 'IterableTrackPurchaseConfig',
    action: 'trackPurchase',
    endpoint: `commerce/trackPurchase`,
  },
  PRODUCT: {
    name: 'IterableProductConfig',
    action: 'product',
    endpoint: '',
  },
  UPDATE_CART: {
    name: 'IterableProductConfig',
    action: 'updateCart',
    endpoint: `commerce/updateCart`,
  },
  DEVICE: {
    name: 'IterableDeviceConfig',
    action: 'product',
    endpoint: '',
  },
  ALIAS: {
    name: 'IterableAliasConfig',
    action: 'alias',
    endpoint: `users/updateEmail`,
  },
  CATALOG: {
    name: 'IterableCatalogConfig',
    action: 'catalogs',
    endpoint: `catalogs`,
  },
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

// Function to construct endpoint based on the selected data center
const constructEndpoint = (dataCenter, category) => {
  const baseUrl = BASE_URL[dataCenter] || BASE_URL.USDC; // Default to USDC if not found
  return `${baseUrl}${category.endpoint}`;
};

const BULK_ENDPOINTS = ['/api/users/bulkUpdate', '/api/events/trackBulk'];

const IDENTIFY_MAX_BATCH_SIZE = 1000;
const IDENTIFY_MAX_BODY_SIZE_IN_BYTES = 4000000;

const TRACK_MAX_BATCH_SIZE = 8000;

const ITERABLE_RESPONSE_USER_ID_PATHS = [
  'invalidUserIds',
  'failedUpdates.invalidUserIds',
  'failedUpdates.notFoundUserIds',
  'failedUpdates.forgottenUserIds',
  'failedUpdates.conflictUserIds',
  'failedUpdates.invalidDataUserIds',
];

const ITERABLE_RESPONSE_EMAIL_PATHS = [
  'invalidEmails',
  'failedUpdates.invalidEmails',
  'failedUpdates.notFoundEmails',
  'failedUpdates.forgottenEmails',
  'failedUpdates.conflictEmails',
  'failedUpdates.invalidDataEmails',
];

module.exports = {
  mappingConfig,
  ConfigCategory,
  constructEndpoint,
  TRACK_MAX_BATCH_SIZE,
  IDENTIFY_MAX_BATCH_SIZE,
  IDENTIFY_MAX_BODY_SIZE_IN_BYTES,
  ITERABLE_RESPONSE_USER_ID_PATHS,
  ITERABLE_RESPONSE_EMAIL_PATHS,
  BULK_ENDPOINTS,
};
