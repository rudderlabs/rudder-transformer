const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3';
const TRACK_ENDPOINT_PATH = 'pixel/track';
const TRACK_ENDPOINT = `${BASE_URL}/${TRACK_ENDPOINT_PATH}/`;
const BATCH_ENDPOINT_PATH = 'pixel/batch';
const BATCH_ENDPOINT = `${BASE_URL}/${BATCH_ENDPOINT_PATH}/`;
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

// We need to remove 'checkout step completed' and 'submitform' from the list of events as per tiktok docs
// tiktok changed the mapping for 'checkout step completed => purchase' and 'submitform => lead'
// once all customer migrate to new event we can remove old mapping
// https://ads.tiktok.com/help/article/standard-events-parameters?lang=en
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
  purchase: 'Purchase',
  lead: 'Lead',
  customizeproduct: 'CustomizeProduct',
  findlocation: 'FindLocation',
  schedule: 'Schedule',
  'application approval': 'ApplicationApproval',
  'submit application': 'SubmitApplication',
  'start trial': 'StartTrial',
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

// tiktok docs for max batch size for events 2.0: https://business-api.tiktok.com/portal/docs?id=1771100779668482
const maxBatchSizeV2 = 1000;
const trackEndpointV2Path = 'event/track';
const trackEndpointV2 = `${BASE_URL}/${trackEndpointV2Path}/`;
// Following is the list of standard events for which some parameters are recommended
// Ref: https://business-api.tiktok.com/portal/docs?id=1771101186666498
const eventsWithRecommendedParams = ['AddToCart', 'CompletePayment', 'PlaceAnOrder', 'ViewContent'];
module.exports = {
  TRACK_ENDPOINT_PATH,
  TRACK_ENDPOINT,
  BATCH_ENDPOINT_PATH,
  BATCH_ENDPOINT,
  MAX_BATCH_SIZE,
  PARTNER_NAME,
  trackMapping: mappingConfig[ConfigCategory.TRACK.name],
  trackMappingV2: mappingConfig[ConfigCategory.TRACK_V2.name],
  eventNameMapping,
  DESTINATION: 'TIKTOK_ADS',
  trackEndpointV2Path,
  trackEndpointV2,
  maxBatchSizeV2,
  eventsWithRecommendedParams,
};
