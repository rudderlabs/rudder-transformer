import { FetchHandler } from '../../../helpers/fetchHandlers';
import {
  SourceTransformationResponse,
  SourceTransformationSuccessResponse,
} from '../../../types/index';
import stats from '../../../util/stats';
import { NativeIntegrationSourceService } from '../nativeIntegration';
import { SourcePostTransformationService } from '../postTransformation';

afterEach(() => {
  jest.clearAllMocks();
});

const headers = {
  'x-rudderstack-source': 'test',
};

describe('NativeIntegration Source Service', () => {
  test('sourceTransformRoutine - success', async () => {
    const sourceType = '__rudder_test__';
    const requestMetadata = {};

    const event = {
      request: { body: JSON.stringify({ message: { a: 'b' } }) },
      headers,
    };
    const events = [event, event];

    const tevent = { anonymousId: 'test', context: { headers } };
    const tresp = {
      output: { batch: [tevent] },
      statusCode: 200,
    } as unknown as SourceTransformationSuccessResponse;

    const tresponse = [tresp, tresp];

    FetchHandler.getSourceHandler = jest.fn().mockImplementationOnce((d) => {
      expect(d).toEqual(sourceType);
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
    const resp = await service.sourceTransformRoutine(events, sourceType, requestMetadata);

    expect(resp).toEqual(tresponse);

    expect(postTransformSpy).toHaveBeenCalledTimes(2);
  });

  describe('sourceTransformRoutine - failure', () => {
    test('integration failure', async () => {
      const sourceType = '__rudder_test__';
      const requestMetadata = {};

      const event = {
        request: { body: JSON.stringify({ message: { a: 'b' } }) },
        headers,
      };
      const events = [event, event];

      const tresp = { error: 'error' } as SourceTransformationResponse;

      const tresponse = [{ error: 'error' }, { error: 'error' }];

      FetchHandler.getSourceHandler = jest.fn().mockImplementationOnce((d) => {
        expect(d).toEqual(sourceType);
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
      const resp = await service.sourceTransformRoutine(events, sourceType, requestMetadata);

      expect(resp).toEqual(tresponse);

      expect(postTransformSpy).toHaveBeenCalledTimes(2);
    });

    test('invalid source events', async () => {
      const sourceType = '__rudder_test__';
      const requestMetadata = {};

      const service = new NativeIntegrationSourceService();
      await expect(
        service.sourceTransformRoutine({} as any, sourceType, requestMetadata),
      ).rejects.toThrow('Invalid source events');
    });
  });
});
