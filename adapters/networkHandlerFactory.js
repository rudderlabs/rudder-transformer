const {
  GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");
const { BrazeNetworkHandler } = require("../v0/destinations/braze/util");
const { MarketoNetworkHandler } = require("../v0/destinations/marketo/util");
const { BqStreamNetworkHandler } = require("../v0/destinations/bqstream/util");

// const handler = {
//   generic: GenericNetworkHandler,
//   braze: BrazeNetworkHandler,
//   marketo: MarketoNetworkHandler,
//   bqstream: BqStreamNetworkHandler
// };

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

// module.exports = {
//   getNetworkHandler(type) {
//     const NetworkHandler = handler[type] || handler.generic;
//     return new NetworkHandler();
//   }
// };

// Alternate option 1: expose the class and make the members as static
// Alternate option 2: export the class and initialize the
// singleton object inside versioned router

// directly exporting a singleton factory object
module.exports = new NetworkHandlerFactory();
