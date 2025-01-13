const { getMappingConfig } = require('../../util');

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
const eventNameMapping = {
  'product viewed': 'Viewed Product',
  'product clicked': 'Viewed Product',
  'product added': 'Added to Cart',
  'checkout started': 'Started Checkout',
};
const jsonNameMapping = {
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
// api version used
const revision = '2024-06-15';
module.exports = {
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
  revision,
  WhiteListedTraitsV2,
  useUpdatedKlaviyoAPI,
};
