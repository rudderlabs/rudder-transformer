import { Integration } from './routerTransform';
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/batchDestination';
import type { Metadata, RudderMessage } from '../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import type { PostHogMessage, PostHogDestination } from './types';
import { MAX_EVENT_SIZE_BYTES } from './config';

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

      expect(result).toEqual({
        endpoint: 'https://app.posthog.com/batch',
        endpointPath: '/batch',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.objectContaining({ type: expect.any(String) }),
      });
      // api_key should be stripped — it belongs in the wrapBody wrapper
      expect(result.body).not.toHaveProperty('api_key');
    });

    it('throws for unsupported event type', () => {
      const input = makeInput(1, 'track');
      delete (input.message as Record<string, unknown>).type;
      expect(() => integration.transformEvent(input)).toThrow('Event type is required');
    });

    it('throws when event size exceeds PostHog 1 MB limit', () => {
      // Generate a large string that pushes the event body over 1 MB
      const largeValue = 'x'.repeat(MAX_EVENT_SIZE_BYTES + 1);
      const input = makeInput(1, 'track', {
        properties: { hugeField: largeValue },
      });
      expect(() => integration.transformEvent(input)).toThrow(/exceeds PostHog's 1 MB limit/);
    });

    it('accepts events just under the 1 MB limit', () => {
      // A moderately large payload that stays under 1 MB
      const value = 'x'.repeat(500_000);
      const input = makeInput(1, 'track', {
        properties: { largeField: value },
      });
      expect(() => integration.transformEvent(input)).not.toThrow();
    });
  });

  describe('getBatchStrategy', () => {
    it('returns a ChunkBatchStrategy', () => {
      const strategy = integration.getBatchStrategy();

      expect(strategy).toBeInstanceOf(ChunkBatchStrategy);
    });

    it('wraps bodies with api_key and batch array', async () => {
      const strategy = integration.getBatchStrategy();
      const testBodies = [
        { distinct_id: 'u1', event: 'click', type: 'capture' },
        { distinct_id: 'u2', event: 'view', type: 'capture' },
      ];

      const [result] = await strategy.batch(
        testBodies.map((body, i) => ({
          body,
          endpoint: '',
          endpointPath: '/batch',
          method: 'POST',
          jobId: i + 1,
        })),
      );

      expect(result.body).toEqual({
        api_key: 'dummyApiKey',
        batch: testBodies,
      });
      expect(result.jobIds).toEqual(new Set([1, 2]));
    });
  });

  describe('getInputSchema', () => {
    const schemaTestCases: {
      name: string;
      mutate: (msg: Record<string, unknown>) => void;
      expected: boolean;
    }[] = [
      {
        name: 'accepts valid track event with both userId and anonymousId',
        mutate: () => {},
        expected: true,
      },
      {
        name: 'accepts events with only userId',
        mutate: (msg) => delete msg.anonymousId,
        expected: true,
      },
      {
        name: 'accepts events with only anonymousId',
        mutate: (msg) => delete msg.userId,
        expected: true,
      },
      {
        name: 'accepts events with non-empty anonymousId and null userId',
        mutate: (msg) => {
          msg.userId = null;
        },
        expected: true,
      },
      {
        name: 'accepts events with non-empty userId and null anonymousId',
        mutate: (msg) => {
          msg.anonymousId = null;
        },
        expected: true,
      },
      {
        name: 'rejects events missing both userId and anonymousId',
        mutate: (msg) => {
          delete msg.userId;
          delete msg.anonymousId;
        },
        expected: false,
      },
      {
        name: 'rejects record event type',
        mutate: (msg) => {
          msg.type = 'record';
        },
        expected: false,
      },
      {
        name: 'rejects audiencelist event type',
        mutate: (msg) => {
          msg.type = 'audiencelist';
        },
        expected: false,
      },
      {
        name: 'rejects unknown event type',
        mutate: (msg) => {
          msg.type = 'unknown';
        },
        expected: false,
      },
    ];

    it.each(schemaTestCases)('$name', ({ mutate, expected }) => {
      const input = makeInput(1, 'track');
      mutate(input.message as Record<string, unknown>);
      const parseResult = integration.getInputSchema().safeParse(input);

      expect(parseResult.success).toBe(expected);
    });
  });
});
