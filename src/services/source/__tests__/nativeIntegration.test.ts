import { FetchHandler } from '../../../helpers/fetchHandlers';
import { RudderMessage, SourceTransformationResponse } from '../../../types/index';
import stats from '../../../util/stats';
import { NativeIntegrationSourceService } from '../nativeIntegration';
import { SourcePostTransformationService } from '../postTransformation';

afterEach(() => {
  jest.clearAllMocks();
});

describe('NativeIntegration Source Service', () => {
  test('sourceTransformRoutine - success', async () => {
    const sourceType = '__rudder_test__';
    const version = 'v0';
    const requestMetadata = {};

    const event = { message: { a: 'b' } };
    const events = [event, event];

    const tevent = { anonymousId: 'test' } as RudderMessage;
    const tresp = { output: { batch: [tevent] }, statusCode: 200 } as SourceTransformationResponse;

    const tresponse = [
      { output: { batch: [{ anonymousId: 'test' }] }, statusCode: 200 },
      { output: { batch: [{ anonymousId: 'test' }] }, statusCode: 200 },
    ];

    FetchHandler.getSourceHandler = jest.fn().mockImplementationOnce((d, v) => {
      expect(d).toEqual(sourceType);
      expect(v).toEqual(version);
      return {
        process: jest.fn(() => {
          return tevent;
        }),
      };
    });

    const postTransformSpy = jest
      .spyOn(SourcePostTransformationService, 'handleSuccessEventsSource')
      .mockImplementation((e) => {
        expect(e).toEqual(tevent);
        return tresp;
      });

    const service = new NativeIntegrationSourceService();
    const resp = await service.sourceTransformRoutine(events, sourceType, version, requestMetadata);

    expect(resp).toEqual(tresponse);

    expect(postTransformSpy).toHaveBeenCalledTimes(2);
  });

  test('sourceTransformRoutine - failure', async () => {
    const sourceType = '__rudder_test__';
    const version = 'v0';
    const requestMetadata = {};

    const event = { message: { a: 'b' } };
    const events = [event, event];

    const tresp = { error: 'error' } as SourceTransformationResponse;

    const tresponse = [{ error: 'error' }, { error: 'error' }];

    FetchHandler.getSourceHandler = jest.fn().mockImplementationOnce((d, v) => {
      expect(d).toEqual(sourceType);
      expect(v).toEqual(version);
      return {
        process: jest.fn(() => {
          throw new Error('test error');
        }),
      };
    });

    const postTransformSpy = jest
      .spyOn(SourcePostTransformationService, 'handleFailureEventsSource')
      .mockImplementation((e, m) => {
        return tresp;
      });
    jest.spyOn(stats, 'increment').mockImplementation(() => {});

    const service = new NativeIntegrationSourceService();
    const resp = await service.sourceTransformRoutine(events, sourceType, version, requestMetadata);

    expect(resp).toEqual(tresponse);

    expect(postTransformSpy).toHaveBeenCalledTimes(2);
  });
});
