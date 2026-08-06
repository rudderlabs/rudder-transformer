import networkHandlerFactory from '../../../adapters/networkHandlerFactory';
import { NativeIntegrationDestinationService } from '../nativeIntegration';
import type { DeliveryV1Response, ProxyV1Request } from '../../../types';

const DEST = 'customerio';
const WORKSPACE = 'ws-1';

const job = (jobId: number) =>
  ({
    jobId,
    attemptNum: 0,
    userId: `u${jobId}`,
    sourceId: 's1',
    destinationId: 'd1',
    workspaceId: WORKSPACE,
    secret: {},
    dontBatch: false,
  }) as never;

const proxyRequest = (): ProxyV1Request =>
  ({
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: 'https://track.customer.io/api/v2/batch',
    userId: '',
    body: { JSON: { batch: [{ event: 'a' }, { event: 'b' }] } },
    metadata: [job(1), job(2)],
    destinationConfig: {},
  }) as unknown as ProxyV1Request;

/** Stub transport so no HTTP happens; the destination "responds" with `status` and `response`. */
const stubTransport = (status: number, response: unknown) => {
  const legacyResponseHandler = jest.fn(() => ({
    status: 999,
    message: 'from the legacy handler',
    response: [],
  }));
  jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
    networkHandler: {
      proxy: jest.fn().mockResolvedValue({ success: true }),
      processAxiosResponse: jest.fn().mockReturnValue({ status, response }),
      responseHandler: legacyResponseHandler,
      prepareProxy: jest.fn(),
    },
    handlerVersion: 'v1',
  } as never);
  return legacyResponseHandler;
};

describe('deliver() — batching-framework delivery flag', () => {
  const ORIGINAL_ENV = process.env;
  const service = new NativeIntegrationDestinationService();

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = WORKSPACE;
    delete process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('uses the legacy networkHandler when the flag is unset', async () => {
    const legacy = stubTransport(207, { errors: [{ batch_index: 1, reason: 'invalid' }] });

    const result = await service.deliver(proxyRequest(), DEST, {}, 'v1');

    expect(legacy).toHaveBeenCalledTimes(1);
    expect((result as DeliveryV1Response).message).toBe('from the legacy handler');
  });

  it('uses the framework when the flag names the workspace', async () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = WORKSPACE;
    const legacy = stubTransport(207, {
      errors: [{ batch_index: 1, reason: 'invalid', field: 'email' }],
    });

    const result = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;

    expect(legacy).not.toHaveBeenCalled();
    expect(result.status).toBe(207);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400]);
    expect(result.response[1].error).toBe('reason: invalid, field: email');
    expect(result.response.map((r) => r.metadata.jobId)).toEqual([1, 2]);
  });

  it('stays on the legacy handler for a workspace the flag does not name', async () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = 'some-other-ws';
    const legacy = stubTransport(200, { ok: true });

    await service.deliver(proxyRequest(), DEST, {}, 'v1');

    expect(legacy).toHaveBeenCalledTimes(1);
  });

  it('stays on the legacy handler for a v0 proxy request even with the flag on', async () => {
    // The bridge only produces a v1 response, so v0 delivery must not take the new path.
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = WORKSPACE;
    const legacy = stubTransport(200, { ok: true });
    const v0Request = { ...proxyRequest(), metadata: job(1) } as never;

    await service.deliver(v0Request, DEST, {}, 'v0');

    expect(legacy).toHaveBeenCalledTimes(1);
  });

  it('emits the same statTags for a returned failure as for a thrown one', async () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = WORKSPACE;
    // A 207 where every posted item failed: a uniform whole-response failure that is *returned*
    // (2xx status, so the throw path is excluded) rather than thrown.
    stubTransport(207, {
      errors: [
        { batch_index: 0, reason: 'invalid' },
        { batch_index: 1, reason: 'invalid' },
      ],
    });

    const returned = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;
    expect(returned.response.map((r) => r.statusCode)).toEqual([400, 400]);

    stubTransport(400, { msg: 'bad request' });
    const thrown = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;

    // Same keys either way: a counter carrying only `errorType` could not be attributed to a
    // destination or a workspace.
    expect(Object.keys(returned.statTags ?? {}).sort()).toEqual(
      Object.keys(thrown.statTags ?? {}).sort(),
    );
    expect(returned.statTags).toEqual({
      destType: 'CUSTOMERIO',
      errorCategory: 'network',
      errorType: 'aborted',
      feature: 'dataDelivery',
      implementation: 'native',
      module: 'destination',
      destinationId: 'd1',
      workspaceId: WORKSPACE,
    });
  });

  it('leaves statTags off a partially-succeeded batch', async () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = WORKSPACE;
    stubTransport(207, { errors: [{ batch_index: 1, reason: 'invalid' }] });

    const result = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;

    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400]);
    expect(result).not.toHaveProperty('statTags');
  });

  it('routes a whole-batch failure through the framework error path', async () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = WORKSPACE;
    stubTransport(400, { msg: 'bad request' });

    const result = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;

    // The bridge throws, and deliver()'s existing catch turns it into a v1 failure response.
    expect(result.status).toBe(400);
    expect(result.response).toHaveLength(2);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
  });
});
