const { getMappingConfig } = require('../../util');

const TRACK_ENDPOINT = 'https://business-api.tiktok.com/open_api/v1.3/pixel/track/';
const BATCH_ENDPOINT = 'https://business-api.tiktok.com/open_api/v1.3/pixel/batch/';
const MAX_BATCH_SIZE = 50;

const ConfigCategory = {
  TRACK: {
    type: 'track',
    name: 'TikTokTrack',
  },
  TRACK_V2: {
    type: 'track',
    name: 'TikTokTrackV2',
  },
};

const PARTNER_NAME = 'RudderStack';

const eventNameMapping = {
  'product added to wishlist': 'AddToWishlist',
  'product added': 'AddToCart',
  'checkout started': 'InitiateCheckout',
  'payment info entered': 'AddPaymentInfo',
  'checkout step completed': 'CompletePayment',
  'order completed': 'PlaceAnOrder',
  viewcontent: 'ViewContent',
  clickbutton: 'ClickButton',
  search: 'Search',
  contact: 'Contact',
  download: 'Download',
  submitform: 'SubmitForm',
  completeregistration: 'CompleteRegistration',
  subscribe: 'Subscribe',
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

// tiktok docs for max batch size for events 2.0: https://business-api.tiktok.com/portal/docs?id=1771100779668482
const maxBatchSizeV2 = 1000;
const trackEndpointV2 = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';
module.exports = {
  TRACK_ENDPOINT,
  BATCH_ENDPOINT,
  MAX_BATCH_SIZE,
  PARTNER_NAME,
  trackMapping: mappingConfig[ConfigCategory.TRACK.name],
  trackMappingV2: mappingConfig[ConfigCategory.TRACK_V2.name],
  eventNameMapping,
  DESTINATION: 'TIKTOK_ADS',
  trackEndpointV2,
  maxBatchSizeV2,
};
