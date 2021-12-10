const { BrazeNetworkHandler } = require("../v0/destinations/braze/util");
const { MarketoNetworkHandler } = require("../v0/destinations/marketo/util");
const { BqStreamNetworkHandler } = require("../v0/destinations/bqstream/util");
const {
  GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");

const handler = {
  generic: GenericNetworkHandler,
  braze: BrazeNetworkHandler,
  marketo: MarketoNetworkHandler,
  bqstream: BqStreamNetworkHandler
};

module.exports = {
  getNetworkHandler(type) {
    const NetworkHandler = handler[type] || handler.generic;
    return new NetworkHandler();
  }
};
