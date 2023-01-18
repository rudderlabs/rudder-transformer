/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const { networkHandler: GenericNetworkHandler } = require('./networkhandler/genericNetworkHandler');

const { SUPPORTED_VERSIONS } = require('../routes/utils/constants');
const { getIntegrations } = require('../routes/utils');

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
  const NetworkHandler = handlers[type] || handlers.generic;
  return new NetworkHandler();
};

module.exports = {
  getNetworkHandler,
};
