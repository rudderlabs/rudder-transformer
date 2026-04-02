import { processBatchedDestination } from '../../../services/destination/nativeBatching/processBatchedDestination';
import { Integration as PostHogIntegration } from './routerTransform';
import type {
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
} from '../../../types/destinationTransformation';
import type { Destination } from '../../../types/controlPlaneConfig';
import type { MessageType, Metadata, RudderMessage } from '../../../types/rudderEvents';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

interface PostHogTestMessage extends RudderMessage {
  previousId?: string;
}

const destination: Destination = {
  ID: 'posthog-dest-1',
  Config: {
    teamApiKey: 'dummyApiKey',
    yourInstance: 'https://app.posthog.com/',
  },
  DestinationDefinition: { ID: 'destDef-1', Name: 'POSTHOG', DisplayName: 'PostHog', Config: {} },
  Name: 'posthog',
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

function makeEvent(
  jobId: number,
  type: MessageType,
  overrides?: Partial<PostHogTestMessage>,
): RouterTransformationRequestData<PostHogTestMessage> {
  const message: PostHogTestMessage = {
    type,
    userId: 'uid-1',
    anonymousId: 'anon-1',
    messageId: `msgid-${jobId}`,
    timestamp: '2024-01-01T00:00:00.000Z',
    context: {
      ip: '1.2.3.4',
      traits: { name: 'Test User' },
    },
    event: 'test-event',
    properties: { key: 'value' },
    ...overrides,
  };
  const metadata: Metadata = {
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'posthog-dest-1',
    sourceId: 'src-1',
    sourceType: 'web',
    sourceCategory: 'cloud',
    destinationType: 'POSTHOG',
    messageId: `msg-${jobId}`,
  };
  return { message, metadata, destination };
}

function getBatchBody(result: {
  batchedRequest?: ProcessorTransformationOutput | ProcessorTransformationOutput[];
}) {
  const req = Array.isArray(result.batchedRequest)
    ? result.batchedRequest[0]
    : result.batchedRequest;
  return req?.body?.JSON ?? {};
}

function getBatchItems(result: {
  batchedRequest?: ProcessorTransformationOutput | ProcessorTransformationOutput[];
}): Record<string, unknown>[] {
  const body = getBatchBody(result);
  return Array.isArray(body.batch) ? body.batch : [];
}

function getBatchedRequest(result: {
  batchedRequest?: ProcessorTransformationOutput | ProcessorTransformationOutput[];
}): ProcessorTransformationOutput {
  if (Array.isArray(result.batchedRequest)) {
    return result.batchedRequest[0];
  }
  return result.batchedRequest!;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('PostHog Batching Framework Integration', () => {
  describe('single event', () => {
    it('produces a batch of 1 with wrapper envelope', async () => {
      const inputs = [makeEvent(1, 'track')];
      const results = await processBatchedDestination(inputs, PostHogIntegration, {});

      expect(results).toHaveLength(1);
      const resp = results[0];
      expect(resp.statusCode).toBe(200);
      expect(resp.batched).toBe(true);

      const req = getBatchedRequest(resp);
      expect(req.version).toBe('1');
      expect(req.type).toBe('REST');
      expect(req.method).toBe('POST');
      expect(req.endpoint).toBe('https://app.posthog.com/batch');
      expect(req.headers).toEqual({ 'Content-Type': 'application/json' });

      const body = getBatchBody(resp);
      const batchItems = getBatchItems(resp);
      expect(body.api_key).toBe('dummyApiKey');
      expect(batchItems).toHaveLength(1);
      expect(batchItems[0].api_key).toBeUndefined();
      expect(batchItems[0].type).toBeDefined();
    });
  });

  describe('multiple events batched', () => {
    it('batches multiple events into a single request', async () => {
      const inputs = [
        makeEvent(1, 'track', { event: 'click' }),
        makeEvent(2, 'track', { event: 'purchase' }),
        makeEvent(3, 'track', { event: 'signup' }),
      ];
      const results = await processBatchedDestination(inputs, PostHogIntegration, {});

      expect(results).toHaveLength(1);
      const body = getBatchBody(results[0]);
      expect(body.api_key).toBe('dummyApiKey');
      expect(getBatchItems(results[0])).toHaveLength(3);
      expect(results[0].metadata).toHaveLength(3);
      expect(results[0].metadata.map((m) => m.jobId)).toEqual([1, 2, 3]);
    });
  });

  describe('event type coverage', () => {
    it.each<{ type: MessageType; overrides: Partial<PostHogTestMessage> }>([
      { type: 'track', overrides: {} },
      { type: 'page', overrides: {} },
      { type: 'screen', overrides: {} },
      { type: 'alias', overrides: { previousId: 'prev-1' } },
    ])('handles $type events', async ({ type, overrides }) => {
      const inputs = [makeEvent(1, type, overrides)];
      const results = await processBatchedDestination(inputs, PostHogIntegration, {});
      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(200);
      expect(getBatchItems(results[0])).toHaveLength(1);
    });
  });

  describe('validation errors', () => {
    it.each([
      {
        description: 'rejects events missing both userId and anonymousId',
        makeInputFn: () => {
          const input = makeEvent(1, 'track');
          Reflect.deleteProperty(input.message, 'userId');
          Reflect.deleteProperty(input.message, 'anonymousId');
          return input;
        },
        expectedError: 'userId',
      },
      {
        description: 'rejects record type events',
        makeInputFn: () => makeEvent(1, 'record'),
        expectedError: 'record',
      },
    ])('$description', async ({ makeInputFn, expectedError }) => {
      const results = await processBatchedDestination([makeInputFn()], PostHogIntegration, {});
      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(400);
      expect(results[0].error).toContain(expectedError);
    });
  });

  describe('mixed valid and invalid events', () => {
    it('processes valid events and returns errors for invalid ones', async () => {
      const validEvent = makeEvent(1, 'track');
      const invalidEvent = makeEvent(2, 'track');
      Reflect.deleteProperty(invalidEvent.message, 'userId');
      Reflect.deleteProperty(invalidEvent.message, 'anonymousId');

      const results = await processBatchedDestination(
        [validEvent, invalidEvent],
        PostHogIntegration,
        {},
      );

      const successes = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode === 400);

      expect(successes).toHaveLength(1);
      expect(errors).toHaveLength(1);
      expect(successes[0].metadata[0].jobId).toBe(1);
      expect(errors[0].metadata[0].jobId).toBe(2);
    });
  });
});
