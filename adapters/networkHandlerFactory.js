const {
  networkHandler: GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");
const {
  networkHandler: BrazeNetworkHandler
} = require("../v0/destinations/braze/util");
const {
  networkHandler: MarketoNetworkHandler
} = require("../v0/destinations/marketo/util");
const {
  networkHandler: PardotNetworkHandler
} = require("../v0/destinations/pardot/util");
const {
  networkHandler: GoogleAdwordsRemarketingListNetworkHandler
} = require("../v0/destinations/google_adwords_remarketing_lists/util");
const {
  networkHandler: GoogleAdwordsEnhancedConversions
} = require("../v0/destinations/google_adwords_enhanced_conversions/util");
const {
  networkHandler: GA4NetworkHandler
} = require("../v0/destinations/ga4/utils");
const {
  networkHandler: GoogleAdwordsOfflineConversionsNetworkHandler
} = require("../v0/destinations/google_adwords_offline_conversions/utils");
const {
  networkHandler: FbPixelNetworkHandler
} = require("../v0/destinations/facebook_pixel/network-handler");
const {
  networkHandler: SnapchatCustomAudienceNetworkHandler
} = require("../v0/destinations/snapchat_custom_audience/utils");

const handler = {
  generic: GenericNetworkHandler,
  braze: BrazeNetworkHandler,
  marketo: MarketoNetworkHandler,
  pardot: PardotNetworkHandler,
  google_adwords_remarketing_lists: GoogleAdwordsRemarketingListNetworkHandler,
  google_adwords_enhanced_conversions: GoogleAdwordsEnhancedConversions,
  ga4: GA4NetworkHandler,
  google_adwords_offline_conversions: GoogleAdwordsOfflineConversionsNetworkHandler,
  facebook_pixel: FbPixelNetworkHandler,
  snapchat_custom_audience: SnapchatCustomAudienceNetworkHandler
};

const getNetworkHandler = type => {
  const NetworkHandler = handler[type] || handler.generic;
  return new NetworkHandler();
};

module.exports = {
  getNetworkHandler
};
