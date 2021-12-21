const { BqStreamNetworkHandler } = require("../v0/destinations/bqstream/util");
const { BrazeNetworkHandler } = require("../v0/destinations/braze/util");
const { MarketoNetworkHandler } = require("../v0/destinations/marketo/util");

module.exports = {
  braze: BrazeNetworkHandler,
  marketo: MarketoNetworkHandler,
  bqstream: BqStreamNetworkHandler
};
