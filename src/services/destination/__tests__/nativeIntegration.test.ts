import { FetchHandler } from '../../../helpers/fetchHandlers';
import {
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/index';
import { NativeIntegrationDestinationService } from '../nativeIntegration';
import { DestinationPostTransformationService } from '../postTransformation';

afterEach(() => {
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

    expect(resp).toEqual(expected);
  });

  describe('doRouterTransformation', () => {
    const destType = '__rudder_test__';
    const version = 'v0';
    const requestMetadata = { source: 'event-tester' };
    const metadata = {
      workspaceId: 'ws-router-fallback',
      destinationId: 'dest-router-fallback',
      jobId: 1,
      sourceId: 'source-id',
      sourceType: 'javascript',
      sourceCategory: 'web',
      destinationType: destType,
      messageId: 'message-id',
    };
    const destination = {
      ID: 'dest-router-fallback',
      Name: destType,
      DestinationDefinition: { ID: 'def-id', Name: destType, DisplayName: destType, Config: {} },
      Config: {},
      Enabled: true,
      WorkspaceID: 'ws-router-fallback',
      Transformations: [],
      hasDynamicConfig: false,
    };
    const event = {
      message: { type: 'track', event: 'Product Viewed', userId: 'user-1' },
      metadata,
      destination,
    } as unknown as RouterTransformationRequestData;

    it('uses processRouterDest when handler implements router transform', async () => {
      const routerResponse = [
        {
          batchedRequest: {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: 'https://api.example.com/router',
            headers: {},
            params: {},
            body: { JSON: { routed: true }, JSON_ARRAY: {}, XML: {}, FORM: {} },
            files: {},
          },
          metadata: [metadata],
          batched: false,
          statusCode: 200,
          destination,
        },
      ] as RouterTransformationResponse[];
      const processRouterDest = jest.fn().mockResolvedValue(routerResponse);
      const process = jest.fn();

      FetchHandler.getDestHandler = jest.fn().mockReturnValue({ processRouterDest, process });

      const service = new NativeIntegrationDestinationService();
      const resp = await service.doRouterTransformation(
        [event],
        destType,
        version,
        requestMetadata,
      );

      expect(processRouterDest).toHaveBeenCalledWith([event], requestMetadata);
      expect(process).not.toHaveBeenCalled();
      expect(resp).toEqual(routerResponse);
    });
  });
});
