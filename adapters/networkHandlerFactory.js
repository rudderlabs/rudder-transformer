const {
  GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");
const { BrazeNetworkHandler } = require("../v0/destinations/braze/util");
const { MarketoNetworkHandler } = require("../v0/destinations/marketo/util");
const { BqStreamNetworkHandler } = require("../v0/destinations/bqstream/util");

class NetworkHandlerFactory {
  constructor() {
    this.info = "NetworkHandlerFactory";
    this.factoryMap = {
      generic: new GenericNetworkHandler(),
      braze: new BrazeNetworkHandler(),
      marketo: new MarketoNetworkHandler(),
      bqstream: new BqStreamNetworkHandler()
    };
  }

  getNetworkHandler(type) {
    return this.factoryMap[type] || this.factoryMap.generic;
  }
}

// Alternate option 1: expose the class and make the members as static
// Alternate option 2: export the class and initialize the
// singleton object inside versioned router

// directly exporting a singleton factory object
module.exports = new NetworkHandlerFactory();
