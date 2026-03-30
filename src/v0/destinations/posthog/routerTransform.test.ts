import { processBatchedDestination } from '../../../services/destination/processBatchedDestination';
import { Integration as PostHogIntegration } from './routerTransform';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';

const destination = {
  ID: 'posthog-dest-1',
  Config: {
    teamApiKey: 'dummyApiKey',
    yourInstance: 'https://app.posthog.com/',
  },
  DestinationDefinition: { Name: 'POSTHOG' },
};

function makeEvent(
  jobId: number,
  type: string,
  overrides?: Record<string, unknown>,
): RouterTransformationRequestData {
  return {
    message: {
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
    } as any,
    metadata: {
      jobId,
      workspaceId: 'ws-1',
      destinationId: 'posthog-dest-1',
      sourceId: 'src-1',
      sourceType: 'web',
      sourceCategory: 'cloud',
      destinationType: 'POSTHOG',
      messageId: `msg-${jobId}`,
    } as any,
    destination: destination as any,
  } as RouterTransformationRequestData;
}

describe('PostHog Batching Framework Integration', () => {
  describe('single event', () => {
    it('produces a batch of 1 with wrapper envelope', async () => {
      const inputs = [makeEvent(1, 'track')];
      const results = await processBatchedDestination(inputs, PostHogIntegration as any);

      expect(results).toHaveLength(1);
      const resp = results[0];
      expect(resp.statusCode).toBe(200);
      expect(resp.batched).toBe(true);

      const req = resp.batchedRequest as any;
      expect(req.version).toBe('1');
      expect(req.type).toBe('REST');
      expect(req.method).toBe('POST');
      expect(req.endpoint).toBe('https://app.posthog.com/batch');
      expect(req.headers).toEqual({ 'Content-Type': 'application/json' });

      // Verify wrapper: api_key at top level, batch array
      const body = req.body.JSON;
      expect(body.api_key).toBe('dummyApiKey');
      expect(body.batch).toHaveLength(1);

      // api_key is in the wrapper, not in individual events
      expect(body.batch[0].api_key).toBeUndefined();
      // type (e.g. 'capture') belongs in each event
      expect(body.batch[0].type).toBeDefined();
    });
  });

  describe('multiple events batched', () => {
    it('batches multiple events into a single request', async () => {
      const inputs = [
        makeEvent(1, 'track', { event: 'click' }),
        makeEvent(2, 'track', { event: 'purchase' }),
        makeEvent(3, 'track', { event: 'signup' }),
      ];
      const results = await processBatchedDestination(inputs, PostHogIntegration as any);

      expect(results).toHaveLength(1);
      const body = (results[0].batchedRequest as any).body.JSON;
      expect(body.api_key).toBe('dummyApiKey');
      expect(body.batch).toHaveLength(3);
      expect(results[0].metadata).toHaveLength(3);
      expect(results[0].metadata.map((m) => m.jobId)).toEqual([1, 2, 3]);
    });
  });

  describe('event type coverage', () => {
    it('handles track events', async () => {
      const inputs = [makeEvent(1, 'track')];
      const results = await processBatchedDestination(inputs, PostHogIntegration as any);
      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(200);
      expect((results[0].batchedRequest as any).body.JSON.batch).toHaveLength(1);
    });

    it('handles page events', async () => {
      const inputs = [makeEvent(1, 'page')];
      const results = await processBatchedDestination(inputs, PostHogIntegration as any);
      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(200);
    });

    it('handles screen events', async () => {
      const inputs = [makeEvent(1, 'screen')];
      const results = await processBatchedDestination(inputs, PostHogIntegration as any);
      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(200);
    });

    it('handles alias events', async () => {
      const inputs = [makeEvent(1, 'alias', { previousId: 'prev-1' })];
      const results = await processBatchedDestination(inputs, PostHogIntegration as any);
      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(200);
    });
  });

  describe('validation errors', () => {
    it('rejects events missing both userId and anonymousId', async () => {
      const inputs = [
        {
          message: {
            type: 'track',
            event: 'test',
            properties: {},
          } as any,
          metadata: {
            jobId: 1,
            workspaceId: 'ws-1',
            destinationId: 'dest-1',
            sourceId: 'src-1',
            sourceType: 'web',
            sourceCategory: 'cloud',
            destinationType: 'POSTHOG',
            messageId: 'msg-1',
          } as any,
          destination: destination as any,
        } as RouterTransformationRequestData,
      ];

      const results = await processBatchedDestination(inputs, PostHogIntegration as any);

      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(400);
      expect(results[0].error).toContain('userId');
    });

    it('rejects record type events', async () => {
      const inputs = [makeEvent(1, 'record')];
      const results = await processBatchedDestination(inputs, PostHogIntegration as any);

      expect(results).toHaveLength(1);
      expect(results[0].statusCode).toBe(400);
      expect(results[0].error).toContain('record');
    });
  });

  describe('mixed valid and invalid events', () => {
    it('processes valid events and returns errors for invalid ones', async () => {
      const validEvent = makeEvent(1, 'track');
      // Invalid: missing both userId and anonymousId (fails integration schema)
      const invalidEvent = makeEvent(2, 'track');
      delete (invalidEvent.message as any).userId;
      delete (invalidEvent.message as any).anonymousId;

      const results = await processBatchedDestination(
        [validEvent, invalidEvent],
        PostHogIntegration as any,
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
