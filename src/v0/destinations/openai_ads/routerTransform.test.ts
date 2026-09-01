import crypto from 'crypto';
import { processBatchedDestination } from '../../../services/destination/nativeBatching/processBatchedDestination';
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchDestinationConstructor } from '../../../services/destination/nativeBatching/batchDestination';
import type {
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';
import type { OpenAIAdsDestination, OpenAIAdsEventPayload } from './types';
import { Integration } from './routerTransform';

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const deliveryAccount = {
  id: 'acct-1',
  options: { pixelId: 'pixel-123' },
  secret: { apiKey: 'test-api-key' },
  accountDefinitionName: 'DESTINATION_OPENAI_ADS_API_KEY',
};
const destination: OpenAIAdsDestination = {
  ID: 'openai-ads-dest-1',
  Config: {
    apiKey: 'test-api-key',
    pixelId: 'pixel-123',
    eventMapping: [
      { from: 'Product Viewed', to: 'contents_viewed' },
      { from: 'Lead Created', to: 'lead_created' },
      { from: 'Docs Page', to: 'page_viewed', deduplicationKey: 'properties.pageId' },
      { from: 'Trial Started', to: 'custom', customEventName: 'Trial Started' },
    ],
    defaultCurrency: 'USD',
    defaultActionSource: 'offline',
  },
  deliveryAccount,
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
  destinationOverride: OpenAIAdsDestination = destination,
  properties: Record<string, unknown> = {},
): RouterTransformationRequestData => ({
  message: {
    type: 'track',
    event,
    messageId: `msg-${jobId}`,
    userId: `User-${jobId}`,
    timestamp: '2024-01-01T00:00:00.000Z',
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
  integration = new Integration(input.destination as OpenAIAdsDestination),
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
      internalGroupKey: 'click_id_absent',
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
        timestamp: '2024-01-01T00:00:00.000Z',
        context: {
          ip: '203.0.113.10',
          userAgent: 'Mozilla/5.0',
          traits: {
            email: ' USER@EXAMPLE.COM ',
            phone: '001 (555) 123-4567',
            firstName: 'Jöhn!',
            lastName: "O'Connor",
            dateOfBirth: '1990-01-02',
            city: 'New York',
            state: 'NY',
            zip: '12345',
            country: 'US',
            obref: 'obref-value',
          },
          page: { url: 'https://example.com/path?secret=1#hash' },
        },
        properties: {
          amount: '12.50',
          currency: 'EUR',
          action_source: 'web',
          oppref: 'property-oppref',
          products: [{ product_id: 'sku-1', name: 'Sample Product', price: '10.25', quantity: 2 }],
        },
      },
    } as RouterTransformationRequestData).body;

    expect(event).toEqual({
      id: 'msg-1',
      type: 'contents_viewed',
      timestamp_ms: 1704067200000,
      action_source: 'web',
      source_url: 'https://example.com/path',
      oppref: 'property-oppref',
      user: {
        obref: 'obref-value',
        emails_sha256: [sha256('user@example.com')],
        phone_numbers_sha256: [sha256('15551234567')],
        external_ids_sha256: [sha256('user-1')],
        first_names_sha256: [sha256('jöhn')],
        last_names_sha256: [sha256('oconnor')],
        date_of_births: ['1990-01-02'],
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
          { id: 'sku-1', name: 'Sample Product', quantity: 2, amount: 1025, currency: 'EUR' },
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
        timestamp: '2024-01-01T00:00:00.000Z',
        properties: {
          value: 1,
          source_url: 'https://example.com/custom',
          plan: 'pro',
          email: 'drop@example.com',
        },
      },
    } as RouterTransformationRequestData).body;
    expect(custom).toMatchObject({
      id: 'msg-custom',
      type: 'custom',
      custom_event_name: 'Trial Started',
      data: { type: 'custom', amount: 100, currency: 'USD', plan: 'pro' },
    });
    expect(custom.data).not.toHaveProperty('email');

    const page = transform({
      ...makeInput(2),
      message: {
        type: 'page',
        name: 'Docs Page',
        messageId: 'msg-page',
        timestamp: '2024-01-01T00:00:00.000Z',
        properties: { pageId: 'page-dedupe', source_url: 'https://example.com/docs' },
      },
    } as RouterTransformationRequestData).body;
    expect(page).toMatchObject({ id: 'page-dedupe', type: 'page_viewed' });
  });

  it('rejects exact standard event names when mapping is empty', () => {
    expect(() =>
      transform(
        makeInput(1, 'order_created', {
          ...destination,
          Config: { pixelId: 'pixel-123', defaultActionSource: 'offline' },
          deliveryAccount,
        }),
      ),
    ).toThrow('OpenAI Ads event mapping not found for order_created');
  });

  it('falls back to destination.Config credentials when no delivery account is present', () => {
    const transformed = transform(
      makeInput(1, 'Product Viewed', {
        ...destination,
        Config: { ...destination.Config, apiKey: 'config-key', pixelId: 'config-pixel' },
        deliveryAccount: null,
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

  it('batches events by request-level endpoint, auth, pixel id, and click_id presence', async () => {
    const results = await processBatchedDestination(
      [
        makeInput(1),
        makeInput(2, 'Lead Created', destination, { click_id: ' click-123 ' }),
        makeInput(3),
      ],
      Integration as BatchDestinationConstructor,
      {},
    );
    expect(results).toHaveLength(2);
    expect(results.map((result) => result.metadata.map((metadata) => metadata.jobId))).toEqual([
      [1, 3],
      [2],
    ]);
    expect(results.map(eventTypes)).toEqual([
      ['contents_viewed', 'contents_viewed'],
      ['lead_created'],
    ]);
  });

  it('splits batches by the fixed maxBatchSize', async () => {
    const inputs = Array.from({ length: 1001 }, (_, index) =>
      makeInput(index + 1, 'Product Viewed', destination, { amount: undefined }),
    );
    const results = await processBatchedDestination(
      inputs,
      Integration as BatchDestinationConstructor,
      {},
    );
    expect(results).toHaveLength(2);
  });

  it('isolates per-event transform errors', async () => {
    const results = await processBatchedDestination(
      [makeInput(1), makeInput(2, 'Unmapped')],
      Integration as BatchDestinationConstructor,
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
          timestamp: '2024-01-01T00:00:00.000Z',
        },
      },
      error: 'event mapping not found',
    },
    {
      input: {
        ...makeInput(1),
        message: { type: 'page', messageId: 'msg-err', timestamp: '2024-01-01T00:00:00.000Z' },
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
            pixelId: 'pixel-123',
            eventMapping: [{ from: 'Product Viewed', to: 'contents_viewed' }],
          },
          deliveryAccount,
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
          timestamp: '2024-01-01T00:00:00.000Z',
          context: { traits: { email: sha256('user@example.com') } },
          properties: { source_url: 'https://example.com/item' },
        },
      },
      error: 'already be SHA-256 hashed',
    },
    {
      input: makeInput(1, 'Product Viewed', {
        ...destination,
        Config: { ...destination.Config, apiKey: undefined },
        deliveryAccount: { ...deliveryAccount, secret: {} },
      }),
      error: 'apiKey is required',
    },
  ])('throws deterministic validation errors', ({ input, error }) => {
    expect(() => transform(input as RouterTransformationRequestData)).toThrow(error);
  });
});
