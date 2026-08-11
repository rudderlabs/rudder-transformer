const { configBackendRequestOptions } = require('../../src/util/configBackend');

describe('configBackendRequestOptions', () => {
  const original = process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;
    } else {
      process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = original;
    }
  });

  const authFor = (secret) => `Basic ${Buffer.from(`${secret}:`).toString('base64')}`;

  it('returns empty options when the secret is unset', () => {
    delete process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;
    expect(configBackendRequestOptions()).toEqual({});
  });

  it('returns empty options (not { headers: {} }) when the secret is blank/whitespace', () => {
    process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = '   ';
    expect(configBackendRequestOptions()).toEqual({});
  });

  it('builds Basic auth with the secret as username and exactly one trailing colon', () => {
    process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = 'my-secret';
    expect(configBackendRequestOptions()).toEqual({
      headers: { Authorization: authFor('my-secret') },
    });
  });

  it('trims surrounding whitespace/newline so a k8s secret file does not 401', () => {
    process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = '  my-secret\n';
    expect(configBackendRequestOptions()).toEqual({
      headers: { Authorization: authFor('my-secret') },
    });
  });
});
