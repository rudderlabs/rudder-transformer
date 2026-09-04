import sha256 from 'sha256';
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { ChunkBatchStrategy } from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { DestinationIntegrationConstructor } from '../../../services/destination/destinationIntegration/destinationIntegration';
import type {
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';
import type { Destination } from '../../../types';
import type { OpenAIAdsEventPayload } from './types';
import { Integration } from './routerTransform';
// OpenAI only ingests events from the last 7 days, so fixtures are stamped relative to now
// rather than at a fixed date that would age out of the window.
const EVENT_TIMESTAMP = new Date(Date.now() - 60_000).toISOString();
const EVENT_TIMESTAMP_MS = new Date(EVENT_TIMESTAMP).getTime();
const destination: Destination = {
  ID: 'openai-ads-dest-1',
  Config: {
    apiKey: 'test-api-key',
    pixelId: 'pixel-123',
    eventMapping: [
      { from: 'Product Viewed', to: 'contents_viewed' },
      { from: 'Lead Created', to: 'lead_created' },
      { from: 'Docs Page', to: 'page_viewed', deduplicationKey: 'properties.pageId' },
      { from: 'Trial Started', to: 'custom', customEventName: 'Trial Started' },
      { from: 'Subscription Created', to: 'subscription_created' },
    ],
    defaultCurrency: 'USD',
    defaultActionSource: 'offline',
  },
  DestinationDefinition: {
    ID: 'openai-ads-def-1',
    Name: 'OPENAI_ADS',
    DisplayName: 'OpenAI Ads',
    Config: {},
  },
  Name: 'OPENAI_ADS',
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};
const makeInput = (
  jobId: number,
  event = 'Product Viewed',
  destinationOverride = destination,
  properties: Record<string, unknown> = {},
): RouterTransformationRequestData => ({
  message: {
    type: 'track',
    event,
    messageId: `msg-${jobId}`,
    userId: `User-${jobId}`,
    timestamp: EVENT_TIMESTAMP,
    properties: { amount: jobId, currency: 'USD', ...properties },
  },
  metadata: {
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'openai-ads-dest-1',
    sourceId: 'src-1',
    sourceType: 'web',
    sourceCategory: 'cloud',
    destinationType: 'OPENAI_ADS',
    messageId: `msg-${jobId}`,
  },
  destination: destinationOverride,
});
const singleBatch = (response: RouterTransformationResponse): ProcessorTransformationOutput => {
  if (!response.batchedRequest || Array.isArray(response.batchedRequest))
    throw new Error('expected a single batched request');
  return response.batchedRequest;
};
const eventTypes = (response: RouterTransformationResponse): string[] => {
  const body = singleBatch(response).body?.JSON as { events: Array<{ type: string }> };
  return body.events.map((event) => event.type);
};
const payload = (
  id: string,
  type: 'contents_viewed' | 'lead_created',
  dataType: 'contents' | 'customer_action',
): OpenAIAdsEventPayload => ({ id, type, timestamp_ms: Number(id), data: { type: dataType } });
const transform = (
  input: RouterTransformationRequestData = makeInput(1),
  integration = new Integration(input.destination),
) =>
  integration.transformEvent(
    input as unknown as Parameters<InstanceType<typeof Integration>['transformEvent']>[0],
  );

describe('OpenAIAdsIntegration', () => {
  const integration = new Integration(destination);

  it('transforms a single event for native batching', () => {
    const transformed = transform(makeInput(1), integration);

    expect(transformed).toEqual({
      endpoint: 'https://bzr.openai.com/v1/events',
      endpointPath: '/v1/events',
      method: 'POST',
      headers: { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' },
      params: { pid: 'pixel-123' },
      body: expect.objectContaining({ id: 'msg-1', type: 'contents_viewed' }),
    });
  });

  it('builds a mapped standard event with hashed identifiers and raw match attributes', () => {
    const event = transform({
      ...makeInput(1),
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'msg-1',
        userId: 'User-1',
        timestamp: EVENT_TIMESTAMP,
        context: {
          ip: '203.0.113.10',
          userAgent: 'Mozilla/5.0',
          traits: {
            email: ' USER@EXAMPLE.COM ',
            phone: '001 (555) 123-4567',
            firstName: 'Jöhn!',
            lastName: "O'Connor",
            city: 'New York',
            region: 'NY',
            postalCode: '12345',
            country: 'US',
            obref: 'obref-value',
          },
          page: { url: 'https://example.com/path?secret=1#hash' },
        },
        properties: {
          amount: '12.50',
          currency: 'EUR',
          action_source: 'web',
          optOut: true,
          oppref: 'property-oppref',
          products: [
            {
              product_id: 'sku-1',
              name: 'Sample Product',
              groupId: 'bundle-1',
              variantDict: { color: 'red' },
              price: '10.25',
              quantity: 2,
            },
            {
              product_id: 'sku-no-amount',
              currency: 'US',
            },
          ],
        },
      },
    } as RouterTransformationRequestData).body;

    expect(event).toEqual({
      id: 'msg-1',
      type: 'contents_viewed',
      timestamp_ms: EVENT_TIMESTAMP_MS,
      opt_out: true,
      action_source: 'web',
      source_url: 'https://example.com/path?secret=1#hash',
      oppref: 'property-oppref',
      user: {
        obref: 'obref-value',
        emails_sha256: [sha256('user@example.com')],
        phone_numbers_sha256: [sha256('15551234567')],
        external_ids_sha256: [sha256('user-1')],
        first_names_sha256: [sha256('jöhn')],
        last_names_sha256: [sha256('oconnor')],
        regions: ['NY'],
        postal_codes: ['12345'],
        cities: ['New York'],
        countries: ['US'],
        ip_address: '203.0.113.10',
        user_agent: 'Mozilla/5.0',
      },
      data: {
        type: 'contents',
        currency: 'EUR',
        amount: 1250,
        contents: [
          {
            id: 'sku-1',
            name: 'Sample Product',
            group_id: 'bundle-1',
            variant_dict: { color: 'red' },
            quantity: 2,
            amount: 1025,
            currency: 'EUR',
          },
          {
            id: 'sku-no-amount',
          },
        ],
      },
    });
    expect(JSON.stringify(event)).not.toContain('USER@EXAMPLE.COM');
  });

  it('supports custom mappings and page deduplicationKey', () => {
    const custom = transform({
      ...makeInput(1),
      message: {
        type: 'track',
        event: 'Trial Started',
        messageId: 'msg-custom',
        timestamp: EVENT_TIMESTAMP,
        properties: {
          value: 1,
          source_url: 'https://example.com/custom',
          plan: 'pro',
          id: 'custom-id',
          name: 'Custom Name',
          click_id: 'click-123',
        },
      },
    } as RouterTransformationRequestData).body;
    expect(custom).toMatchObject({
      id: 'msg-custom',
      type: 'custom',
      custom_event_name: 'Trial Started',
      data: {
        type: 'custom',
        amount: 100,
        currency: 'USD',
        plan: 'pro',
        id: 'custom-id',
        name: 'Custom Name',
        click_id: 'click-123',
      },
    });
    expect(custom.data).not.toHaveProperty('source_url');

    const page = transform({
      ...makeInput(2),
      message: {
        type: 'page',
        name: 'Docs Page',
        messageId: 'msg-page',
        timestamp: EVENT_TIMESTAMP,
        properties: { pageId: 'page-dedupe', source_url: 'https://example.com/docs' },
      },
    } as RouterTransformationRequestData).body;
    expect(page).toMatchObject({ id: 'page-dedupe', type: 'page_viewed' });
  });

  it('maps plan enrollment events with contents', () => {
    const event = transform({
      ...makeInput(1),
      message: {
        type: 'track',
        event: 'Subscription Created',
        messageId: 'msg-subscription',
        timestamp: EVENT_TIMESTAMP,
        properties: {
          amount: '25.00',
          currency: 'USD',
          contents: [{ id: 'plan-pro', name: 'Pro plan', quantity: 1, variantDict: 'blue' }],
        },
      },
    } as RouterTransformationRequestData).body;

    expect(event).toMatchObject({
      id: 'msg-subscription',
      type: 'subscription_created',
      data: {
        type: 'plan_enrollment',
        amount: 2500,
        currency: 'USD',
        contents: [{ id: 'plan-pro', name: 'Pro plan', quantity: 1 }],
      },
    });
    expect((event.data.contents as Array<Record<string, unknown>>)[0]).not.toHaveProperty(
      'variant_dict',
    );
  });

  it('rejects exact standard event names when mapping is empty', () => {
    expect(() =>
      transform(
        makeInput(1, 'order_created', {
          ...destination,
          Config: {
            apiKey: 'test-api-key',
            pixelId: 'pixel-123',
            defaultActionSource: 'offline',
          },
        }),
      ),
    ).toThrow('OpenAI Ads event mapping not found for order_created');
  });

  it('uses destination.Config credentials', () => {
    const transformed = transform(
      makeInput(1, 'Product Viewed', {
        ...destination,
        Config: { ...destination.Config, apiKey: 'config-key', pixelId: 'config-pixel' },
      }),
    );

    expect(transformed.headers?.Authorization).toBe('Bearer config-key');
    expect(transformed.params).toEqual({ pid: 'config-pixel' });
  });

  it('returns a ChunkBatchStrategy and wraps event bodies', async () => {
    const strategy = integration.getBatchStrategy();
    expect(strategy).toBeInstanceOf(ChunkBatchStrategy);
    const [result] = await strategy.batch([
      {
        body: payload('1', 'contents_viewed', 'contents'),
        endpoint: '',
        endpointPath: '/v1/events',
        method: 'POST',
        jobId: 1,
      },
      {
        body: payload('2', 'lead_created', 'customer_action'),
        endpoint: '',
        endpointPath: '/v1/events',
        method: 'POST',
        jobId: 2,
      },
    ]);
    expect(result).toEqual({
      body: {
        events: [
          payload('1', 'contents_viewed', 'contents'),
          payload('2', 'lead_created', 'customer_action'),
        ],
      },
      jobIds: new Set([1, 2]),
    });
  });

  it('batches events by request-level endpoint, auth, and pixel id', async () => {
    const results = await processDestinationIntegration(
      [
        makeInput(1),
        makeInput(2, 'Lead Created', destination, { click_id: ' click-123 ' }),
        makeInput(3),
      ],
      Integration as DestinationIntegrationConstructor,
      {},
    );
    expect(results).toHaveLength(1);
    expect(results[0].metadata.map((metadata) => metadata.jobId)).toEqual([1, 2, 3]);
    expect(eventTypes(results[0])).toEqual(['contents_viewed', 'lead_created', 'contents_viewed']);
  });

  it('splits batches by the fixed maxBatchSize', async () => {
    const inputs = Array.from({ length: 1001 }, (_, index) =>
      makeInput(index + 1, 'Product Viewed', destination, { amount: undefined }),
    );
    const results = await processDestinationIntegration(
      inputs,
      Integration as DestinationIntegrationConstructor,
      {},
    );
    expect(results).toHaveLength(2);
  });

  it('isolates per-event transform errors', async () => {
    const results = await processDestinationIntegration(
      [makeInput(1), makeInput(2, 'Unmapped')],
      Integration as DestinationIntegrationConstructor,
      {},
    );
    expect(results.find((response) => response.statusCode === 400)?.error).toContain(
      'OpenAI Ads event mapping not found for Unmapped',
    );
  });

  it.each([
    {
      input: {
        ...makeInput(1, 'Signup'),
        message: {
          type: 'track',
          event: 'Signup',
          messageId: 'msg-err',
          timestamp: EVENT_TIMESTAMP,
        },
      },
      error: 'event mapping not found',
    },
    {
      input: {
        ...makeInput(1),
        message: { type: 'page', messageId: 'msg-err', timestamp: EVENT_TIMESTAMP },
      },
      error: 'source event name is required for page events',
    },
    {
      input: makeInput(
        1,
        'Product Viewed',
        {
          ...destination,
          Config: {
            apiKey: 'test-api-key',
            pixelId: 'pixel-123',
            eventMapping: [{ from: 'Product Viewed', to: 'contents_viewed' }],
          },
        },
        { amount: 12, currency: undefined },
      ),
      error: 'currency is required when amount is present',
    },
    {
      input: makeInput(1, 'Product Viewed', destination, {
        amount: '1.234',
        currency: 'USD',
        source_url: 'https://example.com/item',
      }),
      error: 'more precision than USD supports',
    },
    {
      input: {
        ...makeInput(1),
        message: {
          type: 'track',
          event: 'Product Viewed',
          messageId: 'msg-err',
          timestamp: EVENT_TIMESTAMP,
          context: { traits: { email: sha256('user@example.com') } },
          properties: { source_url: 'https://example.com/item' },
        },
      },
      error: 'already be hashed',
    },
    {
      input: makeInput(1, 'Product Viewed', destination, {
        optOut: 'true',
        source_url: 'https://example.com/item',
      }),
      error: 'opt_out must be a boolean',
    },
    {
      input: {
        ...makeInput(1),
        message: {
          type: 'track',
          event: 'Product Viewed',
          messageId: 'msg-err',
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
      error: 'timestamp must be within the last 7 days',
    },
    {
      input: {
        ...makeInput(1),
        message: {
          type: 'track',
          event: 'Product Viewed',
          messageId: 'msg-err',
          timestamp: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        },
      },
      error: 'timestamp must not be more than 600 seconds in the future',
    },
  ])('throws deterministic validation errors', ({ input, error }) => {
    expect(() => transform(input as RouterTransformationRequestData)).toThrow(error);
  });

  // The window edges are read off Date.now() inside the transform, so they are pinned with a fake
  // clock rather than by leaving slack in a wall-clock offset.
  describe('ingest window edges', () => {
    const NOW = Date.parse('2026-09-04T12:00:00.000Z');
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const MARGIN_MS = 60 * 1000;

    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(NOW);
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    const transformAt = (timestampMs: number) =>
      transform({
        ...makeInput(1),
        message: {
          type: 'track',
          event: 'Product Viewed',
          messageId: 'msg-window',
          timestamp: new Date(timestampMs).toISOString(),
        },
      } as RouterTransformationRequestData);

    it.each([
      { label: 'the oldest accepted instant', timestampMs: NOW - SEVEN_DAYS_MS + MARGIN_MS },
      { label: 'the furthest accepted future instant', timestampMs: NOW + 600 * 1000 },
      { label: 'now', timestampMs: NOW },
    ])('accepts $label', ({ timestampMs }) => {
      expect(transformAt(timestampMs).body.timestamp_ms).toBe(timestampMs);
    });

    it.each([
      {
        label: 'one millisecond older than the margin allows',
        timestampMs: NOW - SEVEN_DAYS_MS + MARGIN_MS - 1,
        error: 'timestamp must be within the last 7 days',
      },
      {
        label: 'one millisecond beyond the future skew',
        timestampMs: NOW + 600 * 1000 + 1,
        error: 'timestamp must not be more than 600 seconds in the future',
      },
    ])('rejects a timestamp $label', ({ timestampMs, error }) => {
      expect(() => transformAt(timestampMs)).toThrow(error);
    });
  });
});
