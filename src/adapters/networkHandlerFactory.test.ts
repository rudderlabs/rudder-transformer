import { getNetworkHandler } from './networkHandlerFactory';
import { BaseNetworkHandler } from './networkhandler/baseNetworkHandler';

describe('Network Handler Tests', () => {
  it('Should return v0 networkhandler', () => {
    const { networkHandler, handlerVersion } = getNetworkHandler('campaign_manager', 'v0');
    const cmProxy = require('../v0/destinations/campaign_manager/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new cmProxy());
    expect(handlerVersion).toBe('v0');
  });

  it('Should return v0 networkhandler braze', () => {
    const { networkHandler, handlerVersion } = getNetworkHandler('braze', 'v0');
    const brazeProxy = require('../v0/destinations/braze/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new brazeProxy());
    expect(handlerVersion).toBe('v0');
  });

  it('Should return v1 networkhandler', () => {
    const { networkHandler, handlerVersion } = getNetworkHandler('campaign_manager', 'v1');
    const cmProxy = require('../v1/destinations/campaign_manager/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new cmProxy());
    expect(handlerVersion).toBe('v1');
  });

  it('Should return v0 handler if v1 version and handler is present for destination in v0', () => {
    const { networkHandler, handlerVersion } = getNetworkHandler('braze', 'v1');
    const brazeProxy = require('../v0/destinations/braze/networkHandler').networkHandler;
    expect(handlerVersion).toBe('v0');
    expect(networkHandler).toEqual(new brazeProxy());
  });

  it('Should return base handler', () => {
    const { networkHandler, handlerVersion } = getNetworkHandler('abc', 'v1');
    expect(handlerVersion).toBe('v1');
    expect(networkHandler).toEqual(new BaseNetworkHandler());
  });
});
