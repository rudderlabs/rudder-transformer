const { getNetworkHandler } = require('./networkHandlerFactory');
const { networkHandler: GenericNetworkHandler } = require('./networkhandler/genericNetworkHandler');

describe(`Network Handler Tests`, () => {
  it('Should return v0 networkhandler', () => {
    let proxyHandler = getNetworkHandler('campaign_manager', `v0`);
    const cmProxy = require(`../v0/destinations/campaign_manager/networkHandler`).networkHandler;
    expect(proxyHandler).toEqual(new cmProxy());

    proxyHandler = getNetworkHandler('braze', `v0`);
    const brazeProxy = require(`../v0/destinations/braze/networkHandler`).networkHandler;
    expect(proxyHandler).toEqual(new brazeProxy());
  });

  it('Should return v1 networkhandler', () => {
    let proxyHandler = getNetworkHandler('campaign_manager', `v1`);
    const cmProxy = require(`../v1/destinations/campaign_manager/networkHandler`).networkHandler;
    expect(proxyHandler).toEqual(new cmProxy());
  });

  it('Should return genericHandler if v1 proxy and handler is not present for destination', () => {
    let proxyHandler = getNetworkHandler('braze', `v1`);
    expect(proxyHandler).toEqual(new GenericNetworkHandler());
  });
});
