import { getMappingConfig } from '../../util';

const BASE_ENDPOINT = 'https://a.klaviyo.com';

const MAX_BATCH_SIZE = 100;

// TRACK and IDENTIFY DOCS: https://www.klaviyo.com/docs/http-api
// LIST API [MEMBERSHIP/SUBSCRIBE] DOCS:https://www.klaviyo.com/docs/http-api

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: 'KlaviyoIdentify', apiUrl: '/api/profiles' },
  IDENTIFYV2: { name: 'KlaviyoProfileV2', apiUrl: '/api/profile-import' },
  TRACK: { name: 'KlaviyoTrack', apiUrl: '/api/events' },
  TRACKV2: { name: 'KlaviyoTrackV2', apiUrl: '/api/events' },
  GROUP: { name: 'KlaviyoGroup' },
  PROFILE: { name: 'KlaviyoProfile' },
  PROFILEV2: { name: 'KlaviyoProfileV2' },
  STARTED_CHECKOUT: { name: 'StartedCheckout' },
  VIEWED_PRODUCT: { name: 'ViewedProduct' },
  ADDED_TO_CART: { name: 'AddedToCart' },
  ITEMS: { name: 'Items' },
  SUBSCRIBE: { name: 'KlaviyoProfileV2', apiUrl: '/api/profile-subscription-bulk-create-jobs' },
  UNSUBSCRIBE: {
    name: 'KlaviyoProfileV2',
    apiUrl: '/api/profile-subscription-bulk-delete-jobs',
  },
};
const ecomExclusionKeys = [
  'name',
  'product_id',
  'sku',
  'image_url',
  'url',
  'brand',
  'price',
  'compare_at_price',
  'quantity',
  'categories',
  'products',
  'product_names',
  'order_id',
  'value',
  'checkout_url',
  'item_names',
  'items',
  'checkout_url',
];

const ecomEvents = ['product viewed', 'product clicked', 'product added', 'checkout started'];
const eventNameMapping: Record<string, string> = {
  'product viewed': 'Viewed Product',
  'product clicked': 'Viewed Product',
  'product added': 'Added to Cart',
  'checkout started': 'Started Checkout',
};
const jsonNameMapping: Record<string, string> = {
  'Viewed Product': 'VIEWED_PRODUCT',
  'Added to Cart': 'ADDED_TO_CART',
  'Started Checkout': 'STARTED_CHECKOUT',
};
const LIST_CONF = {
  SUBSCRIBE: 'subscribe_with_consentInfo',
  ADD_TO_LIST: 'subscribe_without_consentInfo',
};
const useUpdatedKlaviyoAPI = process.env.USE_UPDATED_KLAVIYO_API === 'true' || false;
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const WhiteListedTraitsV2 = [
  'email',
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'phone',
  'title',
  'organization',
  'city',
  'region',
  'country',
  'zip',
  'image',
  'timezone',
  'anonymousId',
  'userId',
  'properties',
  'location',
  '_kx',
  'street',
  'address',
];
const destType = 'klaviyo';
const KLAVIYO_API_VERSION = {
  V1: 'v1',
  V2: 'v2',
  V3: 'v3',
};
const KLAVIYO_SUBSCRIPTION_MODE = {
  LEGACY: 'legacy',
  STRICT: 'strict',
};
const KLAVIYO_VERSION_CONFIG = {
  [KLAVIYO_API_VERSION.V1]: {
    revision: '2023-02-22',
    usesProfileImportApi: false,
    subscriptionMode: KLAVIYO_SUBSCRIPTION_MODE.LEGACY,
  },
  [KLAVIYO_API_VERSION.V2]: {
    revision: '2024-10-15',
    usesProfileImportApi: true,
    subscriptionMode: KLAVIYO_SUBSCRIPTION_MODE.LEGACY,
  },
  [KLAVIYO_API_VERSION.V3]: {
    revision: '2026-04-15',
    usesProfileImportApi: true,
    subscriptionMode: KLAVIYO_SUBSCRIPTION_MODE.STRICT,
  },
};

const getKlaviyoVersionConfig = (apiVersion) => {
  const resolvedApiVersion = apiVersion;
  const versionConfig = KLAVIYO_VERSION_CONFIG[resolvedApiVersion];
  if (!versionConfig) {
    throw new Error(`Unsupported Klaviyo apiVersion: ${apiVersion}`);
  }
  return versionConfig;
};

const usesProfileImportApi = (apiVersion) => {
  if (apiVersion === undefined || apiVersion === null) {
    return false;
  }
  return getKlaviyoVersionConfig(apiVersion).usesProfileImportApi;
};

const getKlaviyoSubscriptionMode = (apiVersion) => getKlaviyoVersionConfig(apiVersion).subscriptionMode;

const getKlaviyoRevision = (apiVersion) => {
  if (apiVersion === undefined || apiVersion === null) {
    return KLAVIYO_VERSION_CONFIG[KLAVIYO_API_VERSION.V2].revision;
  }
  return getKlaviyoVersionConfig(apiVersion).revision;
};

export {
  BASE_ENDPOINT,
  MAX_BATCH_SIZE,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  LIST_CONF,
  ecomExclusionKeys,
  ecomEvents,
  eventNameMapping,
  jsonNameMapping,
  destType,
  KLAVIYO_API_VERSION,
  KLAVIYO_SUBSCRIPTION_MODE,
  usesProfileImportApi,
  getKlaviyoSubscriptionMode,
  getKlaviyoRevision,
  WhiteListedTraitsV2,
  useUpdatedKlaviyoAPI,
};
