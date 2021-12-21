const { CustomError } = require("../v0/util");
const {
  GenericNetworkHandler
} = require("./networkhandler/genericNetworkHandler");
const NetWorkHandlerClassMap = require("./networkHandlersMap");

class NetworkHandlerFactory {
  constructor() {
    this.info = "NetworkHandlerFactory";
    // intially map would contain only the generic handler
    this.factoryMap = new Map();
    this.factoryMap.set("generic", new GenericNetworkHandler());
  }

  getNetworkHandler(destination) {
    if (this.factoryMap.has(destination)) {
      return this.factoryMap[destination];
    }

    if (!NetWorkHandlerClassMap[destination]) {
      throw new CustomError(
        `NetworkHandler Class for ${destination} not found`,
        400
      );
    }

    // if not found in map, adds the networkHandler object
    // to factoryMap dynamically and returns it
    const Handler = NetWorkHandlerClassMap[destination];
    this.factoryMap.set(destination, new Handler());
    return this.factoryMap.get(destination);
  }
}

// Alternate option 1: expose the class and make the member method as static
// Alternate option 2: export the class and initialize the
// singleton object inside versioned router

// directly exporting a singleton factory object
module.exports = new NetworkHandlerFactory();
