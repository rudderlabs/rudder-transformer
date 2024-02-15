const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3/offline';
const MAX_BATCH_SIZE = 80;

const CONFIG_CATEGORIES = {
  TRACK: {
    type: 'track',
    name: 'TikTokTrack',
    endpoint: `${BASE_URL}/track/`,
    batchEndpoint: `${BASE_URL}/batch/`,
    method: 'POST',
  },
  TRACK_PROPERTIES_CONTENTS: {
    name: 'ContentsObject',
  },
};

const PARTNER_NAME = 'RudderStack';

const EVENT_NAME_MAPPING = {
  'checkout step completed': 'CompletePayment',
  'checkout started': 'InitiateCheckout',
  'order completed': 'PlaceAnOrder',
  'payment info entered': 'AddPaymentInfo',
  'product added to wishlist': 'AddToWishlist',
  'product added': 'AddToCart',
  clickbutton: 'ClickButton',
  completeregistration: 'CompleteRegistration',
  contact: 'Contact',
  download: 'Download',
  search: 'Search',
  submitform: 'SubmitForm',
  subscribe: 'Subscribe',
  viewcontent: 'ViewContent',
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  BASE_URL,
  MAX_BATCH_SIZE,
  CONFIG_CATEGORIES,
  PARTNER_NAME,
  EVENT_NAME_MAPPING,
  MAPPING_CONFIG,
};
