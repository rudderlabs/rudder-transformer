import { FetchHandler } from '../../../helpers/fetchHandlers';
import {
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
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
    const event = { message: { a: 'b' } } as ProcessorTransformationRequest;
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
    const event = { message: { a: 'b' } } as ProcessorTransformationRequest;
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
});
