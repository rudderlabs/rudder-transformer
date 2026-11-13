import networkHandlerFactory from '../../../adapters/networkHandlerFactory';
import { FetchHandler } from '../../../helpers/fetchHandlers';
import {
  DeliveryV0Response,
  DeliveryV1Response,
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  ProxyMetdata,
  ProxyV1Request,
} from '../../../types/index';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { ErrorReportingService } from '../../errorReporting';
import { NativeIntegrationDestinationService } from '../nativeIntegration';
import stats from '../../../util/stats';
import { DestinationPostTransformationService } from '../postTransformation';

type NetworkHandlerFactoryResult = ReturnType<typeof networkHandlerFactory.getNetworkHandler>;

beforeEach(() => {
  jest.spyOn(ErrorReportingService, 'reportError').mockImplementation(jest.fn());
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe('NativeIntegration Service', () => {
  test('doProcessorTransformation - success', async () => {
    const destType = '__rudder_test__';
    const version = 'v0';
    const requestMetadata = {};
    const event = { message: { a: 'b' } } as unknown as ProcessorTransformationRequest;
    const events: ProcessorTransformationRequest[] = [event, event];

    const tevent = { version: 'v0', endpoint: 'http://abc' } as ProcessorTransformationOutput;
    const tresp = { output: tevent, statusCode: 200 } as ProcessorTransformationResponse;
    const tresponse: ProcessorTransformationResponse[] = [tresp, tresp];

    FetchHandler.getDestHandler = jest.fn().mockImplementation((d, v) => {
      expect(d).toEqual(destType);
      expect(v).toEqual(version);
      return {
        process: jest.fn(() => {
          return tevent;
        }),
      };
    });

    const postTransformSpy = jest
      .spyOn(DestinationPostTransformationService, 'handleProcessorTransformSucessEvents')
      .mockImplementation((e, p, d) => {
        expect(e).toEqual(event);
        expect(p).toEqual(tevent);
        return [tresp];
      });

    const service = new NativeIntegrationDestinationService();
    const resp = await service.doProcessorTransformation(
      events,
      destType,
      version,
      requestMetadata,
    );

    expect(resp).toEqual(tresponse);

    expect(postTransformSpy).toHaveBeenCalledTimes(2);
  });

  test('doProcessorTransformation - failure', async () => {
    const destType = '__rudder_test__';
    const version = 'v0';
    const requestMetadata = {};
    const event = { message: { a: 'b' } } as unknown as ProcessorTransformationRequest;
    const events: ProcessorTransformationRequest[] = [event, event];

    FetchHandler.getDestHandler = jest.fn().mockImplementation((d, v) => {
      expect(d).toEqual(destType);
      expect(v).toEqual(version);
      return {
        process: jest.fn(() => {
          throw new Error('test error');
        }),
      };
    });

    const service = new NativeIntegrationDestinationService();
    const resp = await service.doProcessorTransformation(
      events,
      destType,
      version,
      requestMetadata,
    );

    const expected = [
      {
        metadata: undefined,
        statusCode: 500,
        error: 'test error',
        statTags: { errorCategory: 'transformation' },
      },
      {
        metadata: undefined,
        statusCode: 500,
        error: 'test error',
        statTags: { errorCategory: 'transformation' },
      },
    ];

    console.log('resp:', resp);
    expect(resp).toEqual(expected);
  });

  test('processor rejects all outputs for a conflicting event, preserving its sibling', async () => {
    const report = jest.spyOn(ErrorReportingService, 'reportError');
    const increment = jest.spyOn(stats, 'increment').mockImplementation(jest.fn());
    const events = [1, 2].map(
      (jobId) =>
        ({
          message: { jobId },
          metadata: { jobId, destinationId: `dest-${jobId}`, workspaceId: `ws-${jobId}` },
        }) as unknown as ProcessorTransformationRequest,
    );
    const good = {
      version: 'v0',
      type: 'REST',
      method: 'POST',
      endpoint: '/ok',
      body: { JSON: { id: 1 } },
    };
    const bad = { ...good, body: { JSON: { id: 2 }, GZIP: { payload: 'compressed' } } };
    jest.spyOn(FetchHandler, 'getDestHandler').mockReturnValue({
      process: (event: ProcessorTransformationRequest) =>
        event.metadata.jobId === 1 ? good : [good, bad],
    } as any);

    const result = await new NativeIntegrationDestinationService().doProcessorTransformation(
      events,
      'example',
      'v0',
      {},
    );

    expect(result).toEqual([
      { output: { ...good, userId: '' }, metadata: events[0].metadata, statusCode: 200 },
      {
        metadata: events[1].metadata,
        statusCode: 400,
        error: 'delivery request has more than one non-empty body format: JSON, GZIP',
        statTags: {
          errorCategory: 'platform',
          destType: 'EXAMPLE',
          module: 'destination',
          implementation: 'native',
          feature: 'processor',
          destinationId: 'dest-2',
          workspaceId: 'ws-2',
        },
      },
    ]);
    expect(report).toHaveBeenCalledTimes(1);
    expect(increment).not.toHaveBeenCalled();
  });

  test('batch validation fails only its destination group and uses that group metadata', () => {
    const report = jest.spyOn(ErrorReportingService, 'reportError');
    const inputs = [1, 2, 3].map((jobId) => ({
      message: { jobId },
      destination: { ID: jobId === 3 ? 'group-b' : 'group-a' },
      metadata: { jobId, destinationId: `dest-${jobId}`, workspaceId: `ws-${jobId}` },
    }));
    const good = {
      version: 'v0',
      type: 'REST',
      method: 'POST',
      endpoint: '/ok',
      body: { JSON: { id: 1 } },
    };
    const bad = { ...good, body: { JSON: { id: 2 }, GZIP: { payload: 'compressed' } } };
    const makeResponse = (
      request: typeof good | (typeof good)[],
      input: (typeof inputs)[number],
    ) => ({
      batchedRequest: request,
      metadata: [input.metadata],
      batched: false,
      statusCode: 200,
      destination: input.destination,
    });
    jest.spyOn(FetchHandler, 'getDestHandler').mockReturnValue({
      batch: (destEvents: typeof inputs) =>
        destEvents[0].destination.ID === 'group-b'
          ? [makeResponse(good, destEvents[0])]
          : [makeResponse([good, bad], destEvents[0]), makeResponse(good, destEvents[1])],
    } as any);

    const result = new NativeIntegrationDestinationService().doBatchTransformation(
      inputs as any,
      'example',
      'v0',
      {},
    );

    expect(result).toEqual([
      {
        metadata: [inputs[0].metadata, inputs[1].metadata],
        batched: false,
        statusCode: 500,
        error: 'delivery request has more than one non-empty body format: JSON, GZIP',
        statTags: {
          errorCategory: 'platform',
          destType: 'EXAMPLE',
          module: 'destination',
          implementation: 'native',
          feature: 'batch',
          destinationId: 'dest-1',
          workspaceId: 'ws-1',
        },
      },
      makeResponse(good, inputs[2]),
    ]);
    expect(report).toHaveBeenCalledTimes(1);
  });

  describe('deliver - v0 handler adaptation for the v1 route', () => {
    const metadata = (jobId: number): ProxyMetdata => ({
      jobId,
      attemptNum: 0,
      userId: `user-${jobId}`,
      sourceId: 'source-1',
      destinationId: 'destination-1',
      workspaceId: 'workspace-1',
      secret: {},
      dontBatch: false,
    });

    const request = {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: 'https://example.com',
      userId: '',
      body: { JSON: { events: [] } },
      metadata: [metadata(1), metadata(2), metadata(3)],
      destinationConfig: {},
    } as ProxyV1Request;

    const cases = [
      {
        name: 'nested destination response body',
        destinationResponse: { status: 200, response: { accepted: true } },
        expectedBody: JSON.stringify({ accepted: true }),
      },
      {
        name: 'undefined nested response body',
        destinationResponse: { status: 200, response: undefined },
        expectedBody: JSON.stringify({ status: 200 }),
      },
    ];

    test.each(cases)(
      'serializes $name once for every job',
      async ({ destinationResponse, expectedBody }) => {
        const v0Response = {
          status: 200,
          message: 'success',
          destinationResponse,
        } as DeliveryV0Response;
        const handler: NetworkHandlerFactoryResult = {
          handlerVersion: 'v0',
          networkHandler: {
            proxy: jest.fn().mockResolvedValue({}),
            processAxiosResponse: jest.fn().mockReturnValue({ status: 200, response: {} }),
            responseHandler: jest.fn().mockReturnValue(v0Response),
          },
        };
        jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue(handler);
        const stringifySpy = jest.spyOn(JSON, 'stringify');
        const service = new NativeIntegrationDestinationService();

        const result = (await service.deliver(
          request,
          '__rudder_test__',
          {},
          'v1',
        )) as DeliveryV1Response;

        expect(result).toEqual({
          status: 200,
          message: 'success',
          authErrorCategory: undefined,
          response: request.metadata.map((jobMetadata) => ({
            error: expectedBody,
            statusCode: 200,
            metadata: jobMetadata,
          })),
        });
        expect(result.response[1].error).toBe(result.response[0].error);
        expect(result.response[2].error).toBe(result.response[0].error);
        expect(stringifySpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('deliver - v1 whole-batch failure', () => {
    const metadata = (jobId: number): ProxyMetdata => ({
      jobId,
      attemptNum: 0,
      userId: `user-${jobId}`,
      sourceId: 'source-1',
      destinationId: 'destination-1',
      workspaceId: 'workspace-1',
      secret: {},
      dontBatch: false,
    });

    it('serializes the destination response once across the real deliver failure path', async () => {
      const destinationResponse = { status: 500, response: { message: 'Internal Server Error' } };
      const expectedError = JSON.stringify(destinationResponse.response);
      const request = {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: 'https://example.com',
        userId: '',
        body: { JSON: { events: [] } },
        metadata: [metadata(1), metadata(2), metadata(3)],
        destinationConfig: {},
      } as ProxyV1Request;
      const handler: NetworkHandlerFactoryResult = {
        handlerVersion: 'v1',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue(destinationResponse),
          responseHandler: jest.fn(() => {
            throw new TransformerProxyError(
              'Request failed for test destination with status: 500',
              500,
              { errorType: 'retryable' },
              destinationResponse,
            );
          }),
        },
      };
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue(handler);
      const stringifySpy = jest.spyOn(JSON, 'stringify');
      const service = new NativeIntegrationDestinationService();

      const result = (await service.deliver(
        request,
        '__rudder_test__',
        {},
        'v1',
      )) as DeliveryV1Response;

      expect(result).toEqual({
        status: 500,
        message: 'Request failed for test destination with status: 500',
        statTags: {
          errorCategory: 'network',
          errorType: 'retryable',
          destType: '__RUDDER_TEST__',
          module: 'destination',
          implementation: 'native',
          feature: 'dataDelivery',
          destinationId: 'destination-1',
          workspaceId: 'workspace-1',
        },
        response: request.metadata.map((jobMetadata) => ({
          error: expectedError,
          statusCode: 500,
          metadata: jobMetadata,
        })),
      });
      expect(result.response[1].error).toBe(result.response[0].error);
      expect(result.response[2].error).toBe(result.response[0].error);
      expect(
        stringifySpy.mock.calls.filter(([value]) => value === destinationResponse.response),
      ).toHaveLength(1);
    });
  });
});
