import crypto from 'crypto';
import { processEvent } from './transform';
import type { OpenAIAdsDestination, OpenAIAdsProcessorRequest } from './types';

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const deliveryAccount = {
  id: 'acct-1',
  options: { pixelId: 'pixel-123' },
  secret: { apiKey: 'test-api-key' },
  accountDefinitionName: 'DESTINATION_OPENAI_ADS_API_KEY',
};
const destination: OpenAIAdsDestination = {
  ID: 'openai-ads-dest-1',
  Name: 'OPENAI_ADS',
  DestinationDefinition: {
    ID: 'openai-ads-def-1',
    Name: 'OPENAI_ADS',
    DisplayName: 'OpenAI Ads',
    Config: {},
  },
  Config: {
    eventMapping: [
      { from: 'Product Viewed', to: 'contents_viewed' },
      { from: 'Docs Page', to: 'page_viewed', conversionIdentifier: 'properties.pageId' },
      { from: 'Trial Started', to: 'custom', customEventName: 'Trial Started' },
    ],
    defaultCurrency: 'USD',
    defaultActionSource: 'web',
  },
  deliveryAccount,
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};
const buildEvent = (
  overrides: Partial<OpenAIAdsProcessorRequest> = {},
): OpenAIAdsProcessorRequest => ({
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
  metadata: {
    jobId: 1,
    workspaceId: 'ws-1',
    destinationId: 'openai-ads-dest-1',
    sourceId: 'src-1',
    sourceType: 'web',
    sourceCategory: 'cloud',
    destinationType: 'OPENAI_ADS',
    messageId: 'msg-1',
  },
  destination,
  ...overrides,
});

describe('OpenAI Ads processEvent', () => {
  it('builds a mapped standard cloud CAPI event with hashed match and geo fields', () => {
    const result = processEvent(buildEvent());
    expect(result).toMatchObject({
      endpoint: 'https://api.openai.com/v1/events',
      endpointPath: '/v1/events',
      method: 'POST',
      headers: { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' },
      params: { pid: 'pixel-123' },
    });
    expect(result.body.JSON.events[0]).toEqual({
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
        date_of_births_sha256: [sha256('19900102')],
        regions_sha256: [sha256('ny')],
        postal_codes_sha256: [sha256('12345')],
        cities_sha256: [sha256('newyork')],
        countries_sha256: [sha256('us')],
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
    expect(JSON.stringify(result.body.JSON)).not.toContain('USER@EXAMPLE.COM');
    expect(JSON.stringify(result.body.JSON)).not.toContain('New York');
    expect(JSON.stringify(result.body.JSON)).not.toContain('12345');
  });
  it('supports custom mappings and page conversionIdentifier', () => {
    const custom = processEvent(
      buildEvent({
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
      }),
    );
    expect(custom.body.JSON.events[0]).toMatchObject({
      id: 'msg-custom',
      type: 'custom',
      custom_event_name: 'Trial Started',
      data: { type: 'custom', amount: 100, currency: 'USD', plan: 'pro' },
    });
    expect(custom.body.JSON.events[0].data).not.toHaveProperty('email');
    const page = processEvent(
      buildEvent({
        message: {
          type: 'page',
          name: 'Docs Page',
          messageId: 'msg-page',
          timestamp: '2024-01-01T00:00:00.000Z',
          properties: { pageId: 'page-dedupe', source_url: 'https://example.com/docs' },
        },
      }),
    );
    expect(page.body.JSON.events[0]).toMatchObject({ id: 'page-dedupe', type: 'page_viewed' });
  });
  it('rejects exact standard event names when mapping is empty', () => {
    expect(() =>
      processEvent(
        buildEvent({
          destination: {
            ...destination,
            Config: { defaultActionSource: 'offline' },
            deliveryAccount,
          },
          message: {
            type: 'track',
            event: 'order_created',
            messageId: 'msg-standard',
            timestamp: '2024-01-01T00:00:00.000Z',
            properties: {},
          },
        }),
      ),
    ).toThrow('OpenAI Ads event mapping not found for order_created');
  });
  it('falls back to destination.Config credentials while config rollout is in progress', () => {
    const result = processEvent(
      buildEvent({
        destination: {
          ...destination,
          Config: { ...destination.Config, apiKey: 'config-key', pixelId: 'config-pixel' },
          deliveryAccount: null,
        },
      }),
    );
    expect(result.headers.Authorization).toBe('Bearer config-key');
    expect(result.params).toEqual({ pid: 'config-pixel' });
  });
  it.each([
    {
      message: {
        type: 'track',
        event: 'Signup',
        messageId: 'msg-err',
        timestamp: '2024-01-01T00:00:00.000Z',
      },
      error: 'event mapping not found',
    },
    {
      message: { type: 'page', messageId: 'msg-err', timestamp: '2024-01-01T00:00:00.000Z' },
      error: 'source event name is required for page events',
    },
    {
      destination: {
        ...destination,
        Config: { eventMapping: [{ from: 'Product Viewed', to: 'contents_viewed' }] },
        deliveryAccount,
      },
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'msg-err',
        timestamp: '2024-01-01T00:00:00.000Z',
        properties: { amount: 12 },
      },
      error: 'currency is required when amount is present',
    },
    {
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'msg-err',
        timestamp: '2024-01-01T00:00:00.000Z',
        properties: { amount: '1.234', currency: 'USD', source_url: 'https://example.com/item' },
      },
      error: 'more precision than USD supports',
    },
    {
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'msg-err',
        timestamp: '2024-01-01T00:00:00.000Z',
        context: { traits: { email: sha256('user@example.com') } },
        properties: { source_url: 'https://example.com/item' },
      },
      error: 'already be SHA-256 hashed',
    },
    {
      destination: {
        ...destination,
        Config: { eventMapping: destination.Config.eventMapping },
        deliveryAccount: { ...deliveryAccount, secret: {} },
      },
      error: 'apiKey is required',
    },
  ])('throws deterministic validation errors', ({ message, destination: destOverride, error }) => {
    expect(() =>
      processEvent(
        buildEvent({
          ...(message ? { message: message as OpenAIAdsProcessorRequest['message'] } : {}),
          ...(destOverride ? { destination: destOverride as OpenAIAdsDestination } : {}),
        }),
      ),
    ).toThrow(error);
  });
});
