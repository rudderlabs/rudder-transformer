const {
  networkHandler: BrazeNetworkHandler
} = require("../v0/destinations/braze/util");
const {
  networkHandler: MarketoNetworkHandler
} = require("../v0/destinations/marketo/util");
const {
  networkHandler: GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");
const {
  networkHandler: GoogleAdwordsRemaketingListNetwoekHandler
} = require("../v0/destinations/google_adwords_remarketing_lists/util");

const handler = {
  generic: GenericNetworkHandler,
  braze: BrazeNetworkHandler,
  marketo: MarketoNetworkHandler,
  google_adwords_remarketing_lists: GoogleAdwordsRemaketingListNetwoekHandler
};

module.exports = {
  getNetworkHandler(type) {
    const NetworkHandler = handler[type] || handler.generic;
    return new NetworkHandler();
  }
};
