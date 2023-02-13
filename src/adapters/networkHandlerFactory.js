/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const { networkHandler: GenericNetworkHandler } = require('./networkhandler/genericNetworkHandler');
const { mockNetworkHandler } = require('./networkhandler/mockNetworkHandler');

const { SUPPORTED_VERSIONS } = require('../routes/utils/constants');
const { getIntegrations } = require('../routes/utils');

const shouldProxyBeMocked = process?.env?.MOCK_PROXY === 'true';

const handlers = {
  generic: GenericNetworkHandler,
};

// Dynamically import the network handlers for all
// the supported destinations
SUPPORTED_VERSIONS.forEach((version) => {
  const destinations = getIntegrations(path.resolve(__dirname, `../${version}/destinations`));
  destinations.forEach((dest) => {
    try {
      handlers[dest] = require(`../${version}/destinations/${dest}/networkHandler`).networkHandler;
    } catch {
      // Do nothing as exception indicates
      // network handler is not defined for that destination
    }
  });
});

const getNetworkHandler = (type) => {
  let NetworkHandler = handlers[type] || handlers.generic;
  if (shouldProxyBeMocked) {
    NetworkHandler = mockNetworkHandler(type, new NetworkHandler());
  }
  return new NetworkHandler();
};

module.exports = {
  getNetworkHandler,
};
