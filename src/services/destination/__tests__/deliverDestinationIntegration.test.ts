import { proxyRequest as frameworkProxyRequest } from '../../../adapters/network';
import networkHandlerFactory from '../../../adapters/networkHandlerFactory';
import { NativeIntegrationDestinationService } from '../nativeIntegration';
import {
  destinationIntegrationsMap,
  isBatchingFrameworkTransportEnabled,
} from '../../../constants/destinationIntegrationsMap';
import type { DeliveryV1Response, ProxyV1Request } from '../../../types';

jest.mock('../../../adapters/network', () => ({
  ...jest.requireActual('../../../adapters/network'),
  proxyRequest: jest.fn(),
}));

const DEST = 'customerio';
const WORKSPACE = 'ws-1';
const GAEC_DEST = 'google_adwords_enhanced_conversions';

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

const gaecProxyRequest = (
  endpoint = 'https://googleads.googleapis.com/v23/customers/123:uploadConversionAdjustments',
): ProxyV1Request =>
  ({
    ...proxyRequest(),
    endpoint,
    endpointPath: '/123:uploadConversionAdjustments',
    headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' },
    params: {},
    body: {
      JSON: {
        conversionAdjustments: [{ conversionAction: 'customers/123/conversionActions/456' }],
        partialFailure: true,
      },
    },
    metadata: [job(1)],
    destinationConfig: {},
  }) as unknown as ProxyV1Request;

const mockedFrameworkProxyRequest = frameworkProxyRequest as jest.MockedFunction<
  typeof frameworkProxyRequest
>;

/** Stub transport so no HTTP happens; the destination "responds" with `status` and `response`. */
const stubTransport = (status: number, response: unknown) => {
  const legacyResponseHandler = jest.fn(() => ({
    status: 999,
    message: 'from the legacy handler',
    response: [],
  }));
  const legacyProxy = jest.fn().mockResolvedValue({ success: true });
  const legacyProcessAxiosResponse = jest.fn().mockReturnValue({ status, response });
  Object.assign(legacyResponseHandler, {
    proxy: legacyProxy,
    processAxiosResponse: legacyProcessAxiosResponse,
  });
  jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
    networkHandler: {
      proxy: legacyProxy,
      processAxiosResponse: legacyProcessAxiosResponse,
      responseHandler: legacyResponseHandler,
      prepareProxy: jest.fn(),
    },
    handlerVersion: 'v1',
  } as never);
  return legacyResponseHandler as typeof legacyResponseHandler & {
    proxy: jest.Mock;
    processAxiosResponse: jest.Mock;
  };
};

/**
 * Stub the framework's *own* transport. The status has to be driven through the axios-shaped reply
 * `proxyRequest` returns, because the framework path normalizes with the shared
 * `processAxiosResponse` rather than the destination's handler.
 */
const stubFrameworkTransport = (status: number, data: unknown = {}) => {
  mockedFrameworkProxyRequest.mockResolvedValue({
    success: true,
    response: { status, data },
  } as never);
};

describe('deliver() — batching-framework delivery', () => {
  const service = new NativeIntegrationDestinationService();

  beforeEach(() => {
    jest.restoreAllMocks();
    mockedFrameworkProxyRequest
      .mockReset()
      .mockResolvedValue({ success: true, response: {} } as never);
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN = 'dummy-developer-token';
  });

  afterEach(() => {
    delete process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    delete process.env
      .GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS;
  });

  it('uses framework transport with the prepared request without mutating the persisted job request', async () => {
    process.env.GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS =
      WORKSPACE;
    const legacy = stubTransport(200, {});
    stubFrameworkTransport(200);
    const request = gaecProxyRequest();

    const result = (await service.deliver(request, GAEC_DEST, {}, 'v1')) as DeliveryV1Response;

    expect(legacy).not.toHaveBeenCalled();
    // The framework sent the request, so it also read the reply — the destination's handler is
    // bypassed end to end, not just for the send.
    expect(legacy.processAxiosResponse).not.toHaveBeenCalled();
    expect(mockedFrameworkProxyRequest).toHaveBeenCalledTimes(1);
    const [sentRequest, sentDestType] = mockedFrameworkProxyRequest.mock.calls[0];
    expect(sentDestType).toBe(GAEC_DEST);
    expect(sentRequest.headers).toMatchObject({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
      'developer-token': 'dummy-developer-token',
    });
    expect(request.headers).not.toHaveProperty('developer-token');
    expect(result.response.map((r) => r.statusCode)).toEqual([200]);
  });

  it('falls back to the legacy proxy when the transport flag is disabled', async () => {
    const legacy = stubTransport(200, {});

    await service.deliver(gaecProxyRequest(), GAEC_DEST, {}, 'v1');

    expect((legacy as typeof legacy & { proxy: jest.Mock }).proxy).toHaveBeenCalledTimes(1);
    expect(mockedFrameworkProxyRequest).not.toHaveBeenCalled();
  });

  it('does not enable transport unless the batching framework transform is enabled', async () => {
    delete destinationIntegrationsMap.CUSTOMERIO;
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS = WORKSPACE;
    try {
      expect(isBatchingFrameworkTransportEnabled('customerio', WORKSPACE)).toBe(false);
      const legacy = stubTransport(200, {});

      await service.deliver(proxyRequest(), DEST, {}, 'v1');

      expect(legacy).toHaveBeenCalledTimes(1);
      expect(mockedFrameworkProxyRequest).not.toHaveBeenCalled();
    } finally {
      delete process.env.CUSTOMERIO_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS;
      destinationIntegrationsMap.CUSTOMERIO = true;
    }
  });

  it('returns a retryable shape-mismatch failure before posting an old-shape payload to framework transport', async () => {
    process.env.GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS =
      WORKSPACE;
    stubTransport(200, {});

    const result = (await service.deliver(
      gaecProxyRequest(''),
      GAEC_DEST,
      {},
      'v1',
    )) as DeliveryV1Response;

    expect(mockedFrameworkProxyRequest).not.toHaveBeenCalled();
    expect(result.status).toBe(500);
    expect(result.message).toContain('old-shape payload reached framework transport');
    expect(result.statTags).toMatchObject({
      errorType: 'retryable',
      meta: 'gaec_transport_flag_shape_mismatch_old_to_framework',
    });
  });

  it('uses the framework for a destination declaring batching in features.ts', async () => {
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

  it('stays on the legacy networkHandler for a destination that has not declared batching', async () => {
    // No `batching: true` in features.ts → the destination keeps its own handler, and the
    // workspace has no say in it.
    const legacy = stubTransport(207, { errors: [{ batch_index: 1, reason: 'invalid' }] });

    const result = await service.deliver(proxyRequest(), 'klaviyo', {}, 'v1');

    expect(legacy).toHaveBeenCalledTimes(1);
    expect((result as DeliveryV1Response).message).toBe('from the legacy handler');
  });

  it('follows a pre-GA workspace rollout onto the framework', async () => {
    // Delivery is gated on the same predicate as the transform, so a workspace enrolled by the
    // env var gets both halves. Drop customerio out of the GA map to reach the pre-GA branch.
    delete destinationIntegrationsMap.CUSTOMERIO;
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = WORKSPACE;
    try {
      const legacy = stubTransport(207, { errors: [{ batch_index: 1, reason: 'invalid' }] });

      const result = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;

      expect(legacy).not.toHaveBeenCalled();
      expect(result.response.map((r) => r.statusCode)).toEqual([200, 400]);
    } finally {
      delete process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
      destinationIntegrationsMap.CUSTOMERIO = true;
    }
  });

  it('stays on the legacy handler for a workspace outside a pre-GA rollout', async () => {
    delete destinationIntegrationsMap.CUSTOMERIO;
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'some-other-ws';
    try {
      const legacy = stubTransport(207, { errors: [{ batch_index: 1, reason: 'invalid' }] });

      const result = await service.deliver(proxyRequest(), DEST, {}, 'v1');

      expect(legacy).toHaveBeenCalledTimes(1);
      expect((result as DeliveryV1Response).message).toBe('from the legacy handler');
    } finally {
      delete process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
      destinationIntegrationsMap.CUSTOMERIO = true;
    }
  });

  it('stays on the legacy handler for a v0 proxy request', async () => {
    // The bridge only produces a v1 response, so v0 delivery must not take the new path.
    const legacy = stubTransport(200, { ok: true });
    const v0Request = { ...proxyRequest(), metadata: job(1) } as never;

    await service.deliver(v0Request, DEST, {}, 'v0');

    expect(legacy).toHaveBeenCalledTimes(1);
  });

  it('emits the same statTags for a returned failure as for a thrown one', async () => {
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
    stubTransport(207, { errors: [{ batch_index: 1, reason: 'invalid' }] });

    const result = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;

    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400]);
    expect(result).not.toHaveProperty('statTags');
  });

  it('routes a whole-batch failure through the framework error path', async () => {
    stubTransport(400, { msg: 'bad request' });

    const result = (await service.deliver(proxyRequest(), DEST, {}, 'v1')) as DeliveryV1Response;

    // The bridge throws, and deliver()'s existing catch turns it into a v1 failure response.
    expect(result.status).toBe(400);
    expect(result.response).toHaveLength(2);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
  });
});
