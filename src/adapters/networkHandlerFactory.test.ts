import { getNetworkHandler } from './networkHandlerFactory';
import { networkHandler as GenericNetworkHandler } from './networkhandler/genericNetworkHandler';

describe('Network Handler Tests', () => {
  it('Should return v0 networkhandler', () => {
    const { networkHandler } = getNetworkHandler('campaign_manager', 'v0');
    const cmProxy = require('../v0/destinations/campaign_manager/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new cmProxy());
  });

  it('Should return v0 networkhandler braze', () => {
    const { networkHandler } = getNetworkHandler('braze', 'v0');
    const brazeProxy = require('../v0/destinations/braze/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new brazeProxy());
  });

  it('Should return v1 networkhandler', () => {
    const { networkHandler } = getNetworkHandler('campaign_manager', 'v1');
    const cmProxy = require('../v1/destinations/campaign_manager/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new cmProxy());
  });

  it('Should return v0 handler if v1 version and handler is present for destination in v0', () => {
    const { networkHandler } = getNetworkHandler('braze', 'v1');
    const brazeProxy = require('../v0/destinations/braze/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new brazeProxy());
  });

  it('Should return generic handler', () => {
    const { networkHandler } = getNetworkHandler('abc', 'v1');
    expect(networkHandler).toEqual(new GenericNetworkHandler());
  });
});
