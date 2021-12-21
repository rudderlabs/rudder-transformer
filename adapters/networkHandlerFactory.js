const { BrazeNetworkHandler } = require("../v0/destinations/braze/util");
const {
  networkHandler: MarketoNetworkHandler
} = require("../v0/destinations/marketo/util");
const {
  GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");
const {
  networkHandler: BqStreamNetworkHandler
} = require("../v0/destinations/bqstream/util");

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
      generic: GenericNetworkHandler,
      braze: new BrazeNetworkHandler(),
      marketo: MarketoNetworkHandler,
      bqstream: BqStreamNetworkHandler
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

// exporting a singleton factory object
// Alternate option: expose the class and make the members as static
module.exports = new NetworkHandlerFactory();
