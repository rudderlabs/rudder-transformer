const { getMappingConfig } = require("../../util");

const TRACK_ENDPOINT =
  "https://business-api.tiktok.com/open_api/v1.2/pixel/track/";
const BATCH_ENDPOINT =
  "https://business-api.tiktok.com/open_api/v1.2/pixel/batch/";
const MAX_BATCH_SIZE = 50;

const ConfigCategory = {
  TRACK: {
    type: "track",
    name: "TikTokTrack"
  }
};

const webEvents = [
  "ViewContent",
  "ClickButton",
  "Search",
  "Contact",
  "Download",
  "SubmitForm",
  "CompleteRegistration",
  "Subscribe",
  "AddToWishlist",
  "AddToCart",
  "InitiateCheckout",
  "AddPaymentInfo",
  "CompletePayment",
  "PlaceAnOrder"
];

const eventNameMapping = {
  "product added to wishlist": "AddToWishlist",
  "product added": "AddToCart",
  "checkout started": "InitiateCheckout",
  "payment info entered": "AddPaymentInfo",
  "checkout step completed": "CompletePayment",
  "order completed": "PlaceAnOrder"
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  TRACK_ENDPOINT,
  BATCH_ENDPOINT,
  MAX_BATCH_SIZE,
  trackMapping: mappingConfig[ConfigCategory.TRACK.name],
  webEvents,
  eventNameMapping
};
