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
import { responseHandler as brazeResponseHandler } from '../../../v1/destinations/braze/networkHandler';
import { ErrorReportingService } from '../../errorReporting';
import { NativeIntegrationDestinationService } from '../nativeIntegration';
import { DestinationPostTransformationService } from '../postTransformation';

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
        jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
          handlerVersion: 'v0',
          networkHandler: {
            proxy: jest.fn().mockResolvedValue({}),
            processAxiosResponse: jest.fn().mockReturnValue({ status: 200, response: {} }),
            responseHandler: jest.fn().mockReturnValue(v0Response),
          },
        } as never);
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

  describe('deliver - v1 Braze whole-batch failure', () => {
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
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v1',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue(destinationResponse),
          responseHandler: brazeResponseHandler,
        },
      } as never);
      const stringifySpy = jest.spyOn(JSON, 'stringify');
      const service = new NativeIntegrationDestinationService();

      const result = (await service.deliver(request, 'braze', {}, 'v1')) as DeliveryV1Response;

      expect(result).toEqual({
        status: 500,
        message: 'Request failed for braze with status: 500',
        statTags: {
          errorCategory: 'network',
          errorType: 'retryable',
          destType: 'BRAZE',
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
