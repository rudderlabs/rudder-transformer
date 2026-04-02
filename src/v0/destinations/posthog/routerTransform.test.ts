import { Integration } from './routerTransform';
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/batchDestination';
import type { Metadata, RudderMessage } from '../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import type { PostHogMessage, PostHogDestination } from './types';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const destination: PostHogDestination = {
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

function makeInput(
  jobId: number,
  type: RudderMessage['type'],
  overrides?: Partial<PostHogMessage>,
): RouterTransformationRequestData<PostHogMessage, PostHogDestination, undefined, Metadata> {
  const message: PostHogMessage = {
    type,
    userId: 'uid-1',
    anonymousId: 'anon-1',
    messageId: `msgid-${jobId}`,
    timestamp: '2024-01-01T00:00:00.000Z',
    context: {
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Integration', () => {
  const integration = new Integration(destination);

  describe('transformEvent', () => {
    it.each<{ type: RudderMessage['type']; overrides?: Partial<PostHogMessage> }>([
      { type: 'track' },
      { type: 'page' },
      { type: 'screen' },
      { type: 'alias', overrides: { previousId: 'prev-1' } },
    ])('transforms $type event correctly', ({ type, overrides }) => {
      const input = makeInput(1, type, overrides);
      const result = integration.transformEvent(input);

      expect(result.endpoint).toBe('https://app.posthog.com/batch');
      expect(result.method).toBe('POST');
      expect(result.headers).toEqual({ 'Content-Type': 'application/json' });
      // api_key should be stripped from the event body
      expect(result.body).not.toHaveProperty('api_key');
      // type (e.g. 'capture', 'alias') should remain in the event body
      expect(result.body.type).toBeDefined();
    });

    it('throws for unsupported event type', () => {
      const input = makeInput(1, 'track');
      Reflect.deleteProperty(input.message, 'type');

      expect(() => integration.transformEvent(input)).toThrow('Event type is required');
    });
  });

  describe('getBatchStrategy', () => {
    it('returns a ChunkBatchStrategy', () => {
      const strategy = integration.getBatchStrategy();

      expect(strategy).toBeInstanceOf(ChunkBatchStrategy);
    });

    it('wraps bodies with api_key and batch array', () => {
      const strategy = integration.getBatchStrategy();
      const testBodies = [
        { distinct_id: 'u1', event: 'click', type: 'capture' },
        { distinct_id: 'u2', event: 'view', type: 'capture' },
      ];

      const [result] = strategy.batch(
        testBodies.map((body, i) => ({ body, endpoint: '', method: 'POST', jobId: i + 1 })),
      );

      expect(result.body).toEqual({
        api_key: 'dummyApiKey',
        batch: testBodies,
      });
      expect(result.jobIds).toEqual(new Set([1, 2]));
    });
  });

  describe('getInputSchema', () => {
    it('accepts valid track event', () => {
      const input = makeInput(1, 'track');
      const schema = integration.getInputSchema();
      const parseResult = schema.safeParse(input);

      expect(parseResult.success).toBe(true);
    });

    it.each(['record', 'audiencelist', 'unknown'] as const)('rejects %s event type', (type) => {
      const input = makeInput(1, 'track');
      (input.message as Record<string, unknown>).type = type;
      const schema = integration.getInputSchema();
      const parseResult = schema.safeParse(input);

      expect(parseResult.success).toBe(false);
    });

    it('rejects events missing both userId and anonymousId', () => {
      const input = makeInput(1, 'track');
      Reflect.deleteProperty(input.message, 'userId');
      Reflect.deleteProperty(input.message, 'anonymousId');
      const schema = integration.getInputSchema();
      const parseResult = schema.safeParse(input);

      expect(parseResult.success).toBe(false);
    });

    it('accepts events with only userId', () => {
      const input = makeInput(1, 'track');
      Reflect.deleteProperty(input.message, 'anonymousId');
      const schema = integration.getInputSchema();
      const parseResult = schema.safeParse(input);

      expect(parseResult.success).toBe(true);
    });

    it('accepts events with only anonymousId', () => {
      const input = makeInput(1, 'track');
      Reflect.deleteProperty(input.message, 'userId');
      const schema = integration.getInputSchema();
      const parseResult = schema.safeParse(input);

      expect(parseResult.success).toBe(true);
    });
  });
});
