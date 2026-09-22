import { live } from './live';

describe('Everflow live config', () => {
  it('removes partner-provided query parameters from the postback URL', () => {
    const config = live.resolveConfig({
      authType: 'apiKey',
      config: {
        postbackUrl: 'https://example.com/postback?nid=123#details',
        networkId: '123',
      },
    });

    expect(config).toEqual({
      postbackUrl: 'https://example.com/postback',
      networkId: '123',
    });
  });
});
