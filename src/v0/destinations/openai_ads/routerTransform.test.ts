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

const deliveryAccount = {
  id: 'acct-1',
  options: { pixelId: 'pixel-123' },
  secret: { apiKey: 'test-api-key' },
  accountDefinitionName: 'DESTINATION_OPENAI_ADS_API_KEY',
};
const destination: OpenAIAdsDestination = {
  ID: 'openai-ads-dest-1',
  Config: {
    eventMapping: [
      { from: 'Product Viewed', to: 'contents_viewed' },
      { from: 'Lead Created', to: 'lead_created' },
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

describe('OpenAIAdsIntegration', () => {
  const integration = new Integration(destination);
  it('transforms a single event for native batching', () => {
    const transformed = integration.transformEvent(
      makeInput(1) as unknown as Parameters<InstanceType<typeof Integration>['transformEvent']>[0],
    );
    expect(transformed).toEqual({
      endpoint: 'https://api.openai.com/v1/events',
      endpointPath: '/v1/events',
      method: 'POST',
      headers: { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' },
      params: { pid: 'pixel-123' },
      body: expect.objectContaining({ id: 'msg-1', type: 'contents_viewed' }),
      internalGroupKey: 'click_id_absent',
    });
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
  it('splits batches by configured maxBatchSize', async () => {
    const smallBatchDestination = {
      ...destination,
      Config: { ...destination.Config, maxBatchSize: 2 },
    };
    const results = await processBatchedDestination(
      [
        makeInput(1, 'Product Viewed', smallBatchDestination),
        makeInput(2, 'Product Viewed', smallBatchDestination),
        makeInput(3, 'Product Viewed', smallBatchDestination),
      ],
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
});
