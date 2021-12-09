const { BrazeNetworkHandler } = require("../v0/destinations/braze/util");
const {
  GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");

const handler = { generic: GenericNetworkHandler, braze: BrazeNetworkHandler };

module.exports = {
  getNetworkHandler(type) {
    const NetworkHandler = handler[type] || handler.generic;
    return new NetworkHandler();
  }
};
