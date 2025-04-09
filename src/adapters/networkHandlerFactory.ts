/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as path from 'path';
import { BaseNetworkHandler } from './networkhandler/baseNetworkHandler';

import { SUPPORTED_VERSIONS } from '../routes/utils/constants';
import { getIntegrations } from '../routes/utils';

type NetworkHandlerConstructor = new () => BaseNetworkHandler;

interface HandlersMap {
  base: NetworkHandlerConstructor;
  v0: Record<string, NetworkHandlerConstructor>;
  v1: Record<string, NetworkHandlerConstructor>;
}

const handlers: HandlersMap = {
  base: BaseNetworkHandler,
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
      // base: BaseNetworkHandler,
      // }'
      const networkHandler = require(`../${version}/destinations/${dest}/networkHandler`);
      handlers[version as 'v0' | 'v1'][dest] =
        networkHandler.networkHandler || networkHandler.NetworkHandler;
    } catch {
      // Do nothing as exception indicates
      // network handler is not defined for that destination
    }
  });
});

interface NetworkHandlerResult {
  networkHandler: BaseNetworkHandler;
  handlerVersion: string;
}

/**
 * Gets the appropriate network handler for a destination
 *
 * @param type - The destination type
 * @param version - The version (v0 or v1)
 * @returns The network handler and handler version
 */
export const getNetworkHandler = (type: string, version: string): NetworkHandlerResult => {
  let handlerVersion = version;
  let NetworkHandler: NetworkHandlerConstructor | undefined =
    handlers[version as 'v0' | 'v1'][type];

  // For v1 destinations, use BaseNetworkHandler as fallback
  if (version === 'v1' && !NetworkHandler) {
    // Try to use v0 handler if available
    NetworkHandler = handlers.v0[type];
    if (NetworkHandler) {
      handlerVersion = 'v0';
    } else {
      // Use BaseNetworkHandler for v1 destinations without a specific handler
      NetworkHandler = handlers.base;
      handlerVersion = 'v1';
    }
  } else if (!NetworkHandler) {
    // For v0 destinations, use BaseNetworkHandler as fallback
    NetworkHandler = handlers.base;
  }

  const networkHandler = new NetworkHandler();
  return { networkHandler, handlerVersion };
};

export default { getNetworkHandler };
