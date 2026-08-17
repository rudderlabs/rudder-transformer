jest.mock('../../src/util/fetch', () => ({ fetchWithProxy: jest.fn() }));

const { fetchWithProxy } = require('../../src/util/fetch');
const { getTransformationCode } = require('../../src/util/customTransformationsStore');
const { getTrackingPlan } = require('../../src/util/trackingPlan');

const okResponse = (body) => ({ status: 200, json: async () => body });
const authHeaderFor = (secret) => `Basic ${Buffer.from(`${secret}:`).toString('base64')}`;

describe('config backend fetch: auth header on the wire and retry on 401/403', () => {
  const originalSecret = process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;

  beforeEach(() => {
    fetchWithProxy.mockReset();
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;
    } else {
      process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = originalSecret;
    }
  });

  it('sends the Authorization header on the transformation fetch when the secret is set', async () => {
    process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = 'sekret';
    fetchWithProxy.mockResolvedValue(okResponse({ versionId: 'v-auth', code: 'x' }));

    await getTransformationCode('v-auth');

    expect(fetchWithProxy).toHaveBeenCalledWith(
      expect.stringContaining('/transformation/getByVersionId?versionId=v-auth'),
      { headers: { Authorization: authHeaderFor('sekret') } },
    );
  });

  it('sends no auth header when the secret is unset (self-hosted)', async () => {
    delete process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;
    fetchWithProxy.mockResolvedValue(okResponse({ versionId: 'v-noauth', code: 'x' }));

    await getTransformationCode('v-noauth');

    expect(fetchWithProxy).toHaveBeenCalledWith(expect.any(String), {});
  });

  it('sends the Authorization header on the tracking-plan fetch', async () => {
    process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = 'sekret';
    fetchWithProxy.mockResolvedValue(okResponse({ id: 'tp-auth', version: 1 }));

    await getTrackingPlan('tp-auth', 1, 'ws1');

    expect(fetchWithProxy).toHaveBeenCalledWith(
      expect.stringContaining('/workspaces/ws1/tracking-plans/tp-auth'),
      { headers: { Authorization: authHeaderFor('sekret') } },
    );
  });

  it('retries with 503 config_backend_auth_failed when config backend returns 401', async () => {
    fetchWithProxy.mockResolvedValue({ status: 401, json: async () => ({}) });

    await expect(getTransformationCode('v-401')).rejects.toMatchObject({
      statusCode: 503,
      retryReason: 'config_backend_auth_failed',
    });
  });

  it('retries with 503 config_backend_forbidden when the public route is blocked (403)', async () => {
    fetchWithProxy.mockResolvedValue({ status: 403, json: async () => ({}) });

    await expect(getTransformationCode('v-403')).rejects.toMatchObject({
      statusCode: 503,
      retryReason: 'config_backend_forbidden',
    });
  });
});
