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
  networkHandler: GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");
const {
  networkHandler: GoogleAdwordsRemarketingListNetworkHandler
} = require("../v0/destinations/google_adwords_remarketing_lists/util");

const {
  networkHandler: GoogleAdwordsEnhancedConversion
} = require("../v0/destinations/google_adwords_enhanced_conversion/util");

const handler = {
  generic: GenericNetworkHandler,
  braze: BrazeNetworkHandler,
  marketo: MarketoNetworkHandler,
  pardot: PardotNetworkHandler,
  google_adwords_remarketing_lists: GoogleAdwordsRemarketingListNetworkHandler,
  google_adwords_enhanced_conversion: GoogleAdwordsEnhancedConversion
};

const getNetworkHandler = type => {
  const NetworkHandler = handler[type] || handler.generic;
  return new NetworkHandler();
};

module.exports = {
  getNetworkHandler
};
