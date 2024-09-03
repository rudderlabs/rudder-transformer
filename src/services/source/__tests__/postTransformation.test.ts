import {
  MetaTransferObject,
  RudderMessage,
  SourceTransformationResponse,
} from '../../../types/index';
import { SourcePostTransformationService } from '../../source/postTransformation';

const headers = {
  'x-rudderstack-source': 'test',
};

describe('Source PostTransformation Service', () => {
  test('should handleFailureEventsSource', async () => {
    const e = new Error('test error');
    const metaTo = { errorContext: 'error Context' } as MetaTransferObject;
    const resp = SourcePostTransformationService.handleFailureEventsSource(e, metaTo);

    const expected = {
      statusCode: 500,
      error: 'test error',
      statTags: { errorCategory: 'transformation' },
    } as SourceTransformationResponse;

    expect(resp).toEqual(expected);
  });

  test('should return the event as SourceTransformationResponse if it has outputToSource property', () => {
    const event = {
      outputToSource: {},
      output: { batch: [{ anonymousId: 'test' }] },
    } as SourceTransformationResponse;

    const postProcessedEvents = {
      outputToSource: {},
      output: { batch: [{ anonymousId: 'test', context: { headers } }] },
    } as SourceTransformationResponse;

    const result = SourcePostTransformationService.handleSuccessEventsSource(event, { headers });

    expect(result).toEqual(postProcessedEvents);
  });

  test('should return the events as batch in SourceTransformationResponse if it is an array', () => {
    const headers = {
      'x-rudderstack-source': 'test',
    };
    const events = [{ anonymousId: 'test' }, { anonymousId: 'test' }] as RudderMessage[];
    const postProcessedEvents = events.map((event) => ({ ...event, context: { headers } }));
    const result = SourcePostTransformationService.handleSuccessEventsSource(events, { headers });

    expect(result).toEqual({ output: { batch: postProcessedEvents } });
  });

  test('should return the event as batch in SourceTransformationResponse if it is a single object', () => {
    const event = { anonymousId: 'test' } as RudderMessage;

    const result = SourcePostTransformationService.handleSuccessEventsSource(event, { headers });

    expect(result).toEqual({ output: { batch: [{ ...event, context: { headers } }] } });
  });
});
