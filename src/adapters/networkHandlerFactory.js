/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const { networkHandler: GenericNetworkHandler } = require('./networkhandler/genericNetworkHandler');

const { SUPPORTED_VERSIONS } = require('../routes/utils/constants');
const { getIntegrations } = require('../routes/utils');

const handlers = {
  generic: GenericNetworkHandler,
  v0: {},
  v1: {},
};

// Dynamically import the network handlers for all
// the supported destinations
SUPPORTED_VERSIONS.forEach((version) => {
  const destinations = getIntegrations(path.resolve(__dirname, `../${version}/destinations`));
  destinations.forEach((dest) => {
    try {
      // handles = {
      //   v0: {
      //     dest: handler
      //   },
      //   v1: {
      //     dest: handler
      //   },
      // generic: GenericNetworkHandler,
      // }
      handlers[version][dest] =
        require(`../${version}/destinations/${dest}/networkHandler`).networkHandler;
    } catch {
      // Do nothing as exception indicates
      // network handler is not defined for that destination
    }
  });
});

const getNetworkHandler = (type, version) => {
  let handlerVersion = version;
  let NetworkHandler = handlers[version][type] || handlers.generic;
  if (version === 'v1' && NetworkHandler === handlers.generic) {
    NetworkHandler = handlers.v0[type] || handlers.generic;
    handlerVersion = 'v0';
  }
  const networkHandler = new NetworkHandler();
  return { networkHandler, handlerVersion };
};

module.exports = {
  getNetworkHandler,
};
