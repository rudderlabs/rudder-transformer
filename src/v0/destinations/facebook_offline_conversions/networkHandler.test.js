const { proxyRequest } = require('../../../adapters/network');
const { networkHandler: NetworkHandler } = require('./networkHandler');
const { facebookOfflineConversionsParamsSerializer } = require('./utils');

jest.mock('../../../adapters/network', () => ({
  proxyRequest: jest.fn(),
  prepareProxyRequest: jest.fn(),
}));

describe('facebookOfflineConversionsProxyRequest', () => {
  it('applies the integration-specific params serializer', async () => {
    const request = {
      endpoint: 'https://graph.facebook.com/v16.0/event-set-id/events',
      params: {
        upload_tag: 'rudderstack',
        data: '%5B%7B%22event_name%22%3A%22Purchase%22%7D%5D',
        access_token: 'access-token',
      },
    };
    const handler = new NetworkHandler();

    await handler.proxy(request, 'facebook_offline_conversions');

    expect(proxyRequest).toHaveBeenCalledWith(
      {
        ...request,
        paramsSerializer: facebookOfflineConversionsParamsSerializer,
      },
      'facebook_offline_conversions',
    );
  });
});
