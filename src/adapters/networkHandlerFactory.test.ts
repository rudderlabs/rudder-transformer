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

  it('Should use exact destination networkhandler for aliases with their own handler', () => {
    const { networkHandler } = getNetworkHandler('salesforce_oauth', 'v0');
    const salesforceOAuthProxy =
      require('../v0/destinations/salesforce_oauth/networkHandler').networkHandler;
    expect(networkHandler).toEqual(new salesforceOAuthProxy());
  });

  it('Should not route network handlers through transform aliases', () => {
    const { networkHandler } = getNetworkHandler('ga360', 'v0');
    expect(networkHandler.constructor.name).toEqual(GenericNetworkHandler.name);
  });

  it('Should return generic handler for a valid destination without a custom handler', () => {
    const { networkHandler } = getNetworkHandler('am', 'v1');
    expect(networkHandler.constructor.name).toEqual(GenericNetworkHandler.name);
  });

  it('Should reject invalid destinations before handler lookup', () => {
    expect(() => getNetworkHandler('../abc', 'v1')).toThrow('Invalid destination: ../abc');
  });
});
