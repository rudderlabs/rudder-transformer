const MockConfigBackend = require('../mocks/config-backend-server').default;

const SECRET = 'mock-config-backend-secret';
const TRANSFORMATION = { versionId: 'v-e2e', codeVersion: '0', name: 'x', code: 'return' };

// Real store -> real fetch -> wire -> mock. The mock enforces auth, so a dropped Authorization
// header shows up here as a 401 (surfaced as a retriable 503), not a silent pass.
describe('config backend fetch e2e (mock enforces auth)', () => {
  let mock;
  let getTransformationCode;
  const savedUrl = process.env.CONFIG_BACKEND_URL;
  const savedSecret = process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;

  beforeAll(async () => {
    mock = new MockConfigBackend({ authSecret: SECRET, transformationMocks: { 'v-e2e': TRANSFORMATION } });
    await mock.start();
    process.env.CONFIG_BACKEND_URL = mock.getBaseUrl();
    // The store builds its URL from CONFIG_BACKEND_URL at load, so require it fresh with the mock URL.
    jest.isolateModules(() => {
      ({ getTransformationCode } = require('../../src/util/customTransformationsStore'));
    });
  });

  afterAll(async () => {
    await mock.stop();
    if (savedUrl === undefined) delete process.env.CONFIG_BACKEND_URL;
    else process.env.CONFIG_BACKEND_URL = savedUrl;
    if (savedSecret === undefined) delete process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;
    else process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = savedSecret;
  });

  it('fetches successfully when the correct secret is sent, proving the header reaches the wire', async () => {
    process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET = SECRET;
    const res = await getTransformationCode('v-e2e');
    expect(res.versionId).toBe('v-e2e');
  });

  it('gets a 401 from the mock when the header is missing, surfaced as a retriable 503', async () => {
    delete process.env.CONFIG_BACKEND_TRANSFORMER_SERVICE_SECRET;
    await expect(getTransformationCode('v-missing')).rejects.toMatchObject({
      statusCode: 503,
      retryReason: 'config_backend_auth_failed',
    });
  });
});
