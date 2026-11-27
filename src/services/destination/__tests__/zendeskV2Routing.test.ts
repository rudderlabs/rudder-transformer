import { proxyRequest as frameworkProxyRequest } from '../../../adapters/network';
import networkHandlerFactory from '../../../adapters/networkHandlerFactory';
import { destinationIntegrationsMap } from '../../../constants/destinationIntegrationsMap';
import { FetchHandler } from '../../../helpers/fetchHandlers';
import type {
  DeliveryV0Response,
  DeliveryV1Response,
  ProxyRequest,
  ProxyV1Request,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types';
import { ErrorReportingService } from '../../errorReporting';
import { NativeIntegrationDestinationService } from '../nativeIntegration';

jest.mock('../../../adapters/network', () => ({
  ...jest.requireActual('../../../adapters/network'),
  proxyRequest: jest.fn(),
}));

const service = new NativeIntegrationDestinationService();
const workspaceId = 'zendesk-v2-unenrolled-ws';
const error = 'Zendesk v2 requires batching framework enrollment';

const routerInput = (jobId: number, version?: number): RouterTransformationRequestData => ({
  message: { type: 'track', event: 'Test' },
  destination: { ID: 'zendesk-dest', version, Config: {}, hasDynamicConfig: false } as never,
  metadata: { jobId, workspaceId, destinationId: 'zendesk-dest' } as never,
});

const proxyInput = (destinationVersion?: number, v1 = false): ProxyRequest =>
  ({
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: 'https://example.com',
    userId: '',
    destinationConfig: {},
    destinationVersion,
    metadata: v1
      ? [
          { jobId: 1, workspaceId, destinationId: 'zendesk-dest' },
          { jobId: 2, workspaceId, destinationId: 'zendesk-dest' },
        ]
      : { jobId: 1, workspaceId, destinationId: 'zendesk-dest' },
  }) as ProxyRequest;

const originalZendeskEnrollment = destinationIntegrationsMap.ZENDESK;
const originalWorkspaceRollout = process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;

beforeEach(() => {
  delete destinationIntegrationsMap.ZENDESK;
  delete process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
  jest.clearAllMocks();
  (frameworkProxyRequest as jest.Mock).mockReset();
  jest.spyOn(ErrorReportingService, 'reportError').mockImplementation(jest.fn());
});

afterEach(() => {
  if (originalZendeskEnrollment) destinationIntegrationsMap.ZENDESK = originalZendeskEnrollment;
  else delete destinationIntegrationsMap.ZENDESK;
  if (originalWorkspaceRollout !== undefined) {
    process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = originalWorkspaceRollout;
  } else {
    delete process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
  }
  jest.restoreAllMocks();
});

describe('unenrolled Zendesk v2 routing boundary', () => {
  it('rejects each v2 job before the legacy router, without rejecting v1 siblings in the same group', async () => {
    const legacyResponse = (
      input: RouterTransformationRequestData,
    ): RouterTransformationResponse => ({
      destination: input.destination,
      metadata: [input.metadata],
      statusCode: 200,
      batched: false,
    });
    const processRouterDest = jest.fn(async (inputs: RouterTransformationRequestData[]) =>
      inputs.map(legacyResponse),
    );
    const getHandler = jest.spyOn(FetchHandler, 'getDestHandler').mockReturnValue({
      processRouterDest,
    } as never);
    const inputs = [routerInput(1, 2), routerInput(2, 0), routerInput(3, 3), routerInput(4)];

    const result = await service.doRouterTransformation(inputs, 'zendesk', 'v0', {});

    expect(getHandler).toHaveBeenCalledTimes(1);
    expect(processRouterDest).toHaveBeenCalledWith([inputs[1], inputs[3]], {});
    expect(result).toEqual(
      expect.arrayContaining([
        legacyResponse(inputs[1]),
        legacyResponse(inputs[3]),
        ...[inputs[0], inputs[2]].map((input) => ({
          metadata: [input.metadata],
          destination: input.destination,
          batched: false,
          statusCode: 400,
          error,
          statTags: expect.objectContaining({
            errorCategory: 'dataValidation',
            errorType: 'configuration',
          }),
        })),
      ]),
    );
    expect(result).toHaveLength(inputs.length);
  });

  it('keeps v2 rejection per job even when the legacy router fails for its v1 sibling', async () => {
    const inputs = [routerInput(1, 2), routerInput(2, 1)];
    const processRouterDest = jest.fn().mockRejectedValue(new Error('legacy failed'));
    jest.spyOn(FetchHandler, 'getDestHandler').mockReturnValue({ processRouterDest } as never);

    const result = await service.doRouterTransformation(inputs, 'zendesk', 'v0', {});

    expect(processRouterDest).toHaveBeenCalledWith([inputs[1]], {});
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metadata: [inputs[0].metadata],
          statusCode: 400,
          error,
          statTags: expect.objectContaining({ errorType: 'configuration' }),
        }),
        expect.objectContaining({ metadata: [inputs[1].metadata], error: 'legacy failed' }),
      ]),
    );
    expect(result).toHaveLength(2);
  });

  it('never loads or calls the legacy router when every job is v2', async () => {
    const getHandler = jest.spyOn(FetchHandler, 'getDestHandler');
    const inputs = [routerInput(1, 2), routerInput(2, 2)];

    const result = await service.doRouterTransformation(inputs, 'ZENDESK', 'v0', {});

    expect(getHandler).not.toHaveBeenCalled();
    expect(
      result.map(({ statusCode, metadata, statTags }) => ({
        statusCode,
        metadata,
        statTags,
      })),
    ).toEqual(
      inputs.map((input) => ({
        statusCode: 400,
        metadata: [input.metadata],
        statTags: expect.objectContaining({ errorType: 'configuration' }),
      })),
    );
  });

  it('partitions same-ID jobs by workspace and integration major before choosing a route', async () => {
    process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = workspaceId;
    const processRouterDest = jest.fn(async (inputs: RouterTransformationRequestData[]) =>
      inputs.map((input) => ({
        metadata: [input.metadata],
        destination: input.destination,
        batched: false,
        statusCode: 200,
      })),
    );
    jest.spyOn(FetchHandler, 'getDestHandler').mockReturnValue({ processRouterDest } as never);
    const enrolled = routerInput(1, 1);
    const other = routerInput(2, 2);
    other.metadata.workspaceId = 'other-ws';
    // Invalid enrolled config yields a per-job validation error without network I/O.
    const result = await service.doRouterTransformation([enrolled, other], 'zendesk', 'v0', {});
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ metadata: [other.metadata], statusCode: 400, error }),
        expect.objectContaining({
          metadata: [enrolled.metadata],
          destination: enrolled.destination,
        }),
      ]),
    );
    expect(processRouterDest).not.toHaveBeenCalled();
  });

  it('routes enrolled mixed-major same-ID jobs through separate framework integrations', async () => {
    process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = workspaceId;
    const v1 = routerInput(11, 1);
    const v2 = routerInput(12, 2);
    const response = await service.doRouterTransformation([v1, v2], 'zendesk', 'v0', {});
    expect(response).toHaveLength(2);
    for (const input of [v1, v2]) {
      expect(response).toContainEqual(
        expect.objectContaining({
          metadata: [input.metadata],
          destination: input.destination,
          statusCode: 400,
        }),
      );
    }
  });

  it('routes unenrolled v1 alongside enrolled v2 in another workspace without legacy OAuth I/O', async () => {
    process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = workspaceId;
    const legacy = routerInput(11, 1);
    legacy.metadata.workspaceId = 'other-ws';
    const enrolled = routerInput(12, 2);
    const processRouterDest = jest.fn(async () => [
      {
        metadata: [legacy.metadata],
        destination: legacy.destination,
        statusCode: 200,
        batched: false,
      },
    ]);
    jest.spyOn(FetchHandler, 'getDestHandler').mockReturnValue({ processRouterDest } as never);
    const response = await service.doRouterTransformation([legacy, enrolled], 'zendesk', 'v0', {});
    expect(processRouterDest).toHaveBeenCalledWith([legacy], {});
    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metadata: [legacy.metadata],
          destination: legacy.destination,
          statusCode: 200,
        }),
        expect.objectContaining({
          metadata: [enrolled.metadata],
          destination: enrolled.destination,
          statusCode: 400,
        }),
      ]),
    );
    expect(response).toHaveLength(2);
  });

  it('rejects an unversioned bearer proxy without selecting a legacy handler', async () => {
    const request = { ...proxyInput(undefined), headers: { Authorization: 'Bearer token' } };
    const getHandler = jest.spyOn(networkHandlerFactory, 'getNetworkHandler');
    const result = await service.deliver(request, 'zendesk', {}, 'v0');
    expect(getHandler).not.toHaveBeenCalled();
    expect((result as DeliveryV0Response).message).toBe(
      'Zendesk OAuth proxy request requires destinationVersion',
    );
  });

  it('rejects a mixed-workspace proxy batch before selecting a handler', async () => {
    const request = proxyInput(2, true) as ProxyV1Request;
    request.metadata[1].workspaceId = 'other-ws';
    const getHandler = jest.spyOn(networkHandlerFactory, 'getNetworkHandler');
    const result = await service.deliver(request, 'zendesk', {}, 'v1');
    expect(getHandler).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      status: 400,
      message: 'Zendesk proxy request must contain one workspace',
    });
  });

  it('does not reject enrolled Zendesk v2 before the proxy route selects its handler', async () => {
    process.env.ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = workspaceId;
    const getHandler = jest
      .spyOn(networkHandlerFactory, 'getNetworkHandler')
      .mockImplementation(() => {
        throw new Error('handler selected');
      });

    const result = await service.deliver(proxyInput(2), 'zendesk', {}, 'v0');

    expect(getHandler).toHaveBeenCalledWith('zendesk', 'v0');
    expect((result as DeliveryV0Response).message).toBe('handler selected');
  });

  it.each(['v0', 'v1'])(
    'rejects a v2 proxy on the %s route before resolving the legacy network handler or sending HTTP',
    async (route) => {
      const getHandler = jest.spyOn(networkHandlerFactory, 'getNetworkHandler');
      const request = proxyInput(2, route === 'v1');
      const result = await service.deliver(request, 'zendesk', {}, route);

      expect(getHandler).not.toHaveBeenCalled();
      expect(frameworkProxyRequest).not.toHaveBeenCalled();
      if (route === 'v1') {
        const v1 = result as DeliveryV1Response;
        expect(v1.status).toBe(400);
        expect(v1.response).toEqual(
          (request as ProxyV1Request).metadata.map((metadata) => ({
            metadata,
            statusCode: 400,
            error,
          })),
        );
        expect(v1.statTags).toEqual(expect.objectContaining({ errorType: 'configuration' }));
      } else {
        const v0 = result as DeliveryV0Response;
        expect(v0.status).toBe(400);
        expect(v0.message).toBe(error);
        expect(v0.statTags).toEqual(expect.objectContaining({ errorType: 'configuration' }));
      }
    },
  );

  it.each([undefined, 0, 1])(
    'keeps normalized v1 proxy version %s on legacy HTTP',
    async (major) => {
      const proxy = jest.fn().mockResolvedValue({});
      const response = { status: 200, message: 'legacy succeeded' } as DeliveryV0Response;
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v0',
        networkHandler: {
          proxy,
          processAxiosResponse: jest.fn().mockReturnValue({ status: 200 }),
          responseHandler: jest.fn().mockReturnValue(response),
        },
      } as never);
      const request = proxyInput(major);

      expect(await service.deliver(request, 'zendesk', {}, 'v0')).toEqual(response);
      expect(proxy).toHaveBeenCalledWith(request, 'zendesk');
    },
  );

  it('keeps normalized v1 router inputs on the legacy path', async () => {
    const inputs = [routerInput(1, 0), routerInput(2)];
    const processRouterDest = jest.fn().mockResolvedValue(
      inputs.map((input) => ({
        metadata: [input.metadata],
        destination: input.destination,
        batched: false,
        statusCode: 200,
      })),
    );
    jest.spyOn(FetchHandler, 'getDestHandler').mockReturnValue({ processRouterDest } as never);

    const result = await service.doRouterTransformation(inputs, 'zendesk', 'v0', {});

    expect(processRouterDest).toHaveBeenCalledWith(inputs, {});
    expect(result.map((response) => response.statusCode)).toEqual([200, 200]);
  });
});
