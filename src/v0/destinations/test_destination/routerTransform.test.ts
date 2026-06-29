import { Integration } from './routerTransform';
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/batchDestination';
import { processBatchedDestination } from '../../../services/destination/nativeBatching/processBatchedDestination';
import { TestDestination, TestDestinationRouterRequest } from './type';

const destinationDefinition = {
  ID: 'test-destination-def-id',
  Name: 'TEST_DESTINATION',
  DisplayName: 'Test Destination (dev-only fixture)',
  Config: {},
};

const destinationV1 = {
  ID: 'test-destination-v1',
  Name: 'TEST_DESTINATION',
  DestinationDefinition: destinationDefinition,
  Config: { restApiKey: 'v1-secret-key', dataCenter: 'eu' },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
  version: 1,
} as unknown as TestDestination;

const destinationNoVersion = { ...destinationV1, version: undefined } as TestDestination;
const destinationV2 = {
  ...destinationV1,
  Config: { apiKey: 'v2-secret-key', region: 'eu', accountId: 'acct-123' },
  version: 2,
} as unknown as TestDestination;

const message = {
  type: 'track',
  event: 'Test Event',
  userId: 'user-1',
  properties: { plan: 'pro' },
};

const v1Endpoint = 'https://eu.test-destination.invalid/v1/events';
const v1Headers = { 'Content-Type': 'application/json', 'X-Api-Key': 'v1-secret-key' };

const buildInput = (jobId: number, destination: TestDestination): TestDestinationRouterRequest =>
  ({
    message,
    metadata: { jobId, workspaceId: 'ws-1' },
    destination,
  }) as unknown as TestDestinationRouterRequest;

describe('test_destination batching framework Integration', () => {
  it('transformEvent reshapes a v1 event into the framework payload', () => {
    const integration = new Integration(destinationV1);
    expect(integration.transformEvent(buildInput(1, destinationV1))).toEqual({
      body: message,
      endpoint: v1Endpoint,
      endpointPath: '/v1/events',
      method: 'POST',
      headers: v1Headers,
    });
  });

  it('getBatchStrategy returns a ChunkBatchStrategy', () => {
    expect(new Integration(destinationV1).getBatchStrategy()).toBeInstanceOf(ChunkBatchStrategy);
  });

  it('batches v1 + no-version events (same endpoint/headers) into one request', async () => {
    const results = await processBatchedDestination(
      [buildInput(1, destinationV1), buildInput(2, destinationNoVersion)],
      Integration,
      {},
    );
    expect(results).toHaveLength(1);
    expect(results[0].batched).toBe(true);
    expect(results[0].statusCode).toBe(200);
    expect(results[0].metadata).toHaveLength(2);
    expect((results[0].batchedRequest as any).body.JSON).toEqual({ batch: [message, message] });
  });

  it('rejects a v2 event with a 400 — only v1 is implemented', async () => {
    const results = await processBatchedDestination(
      [buildInput(3, destinationV2)],
      Integration,
      {},
    );
    expect(results).toHaveLength(1);
    expect(results[0].batched).toBe(false);
    expect(results[0].statusCode).toBe(400);
    expect(results[0].error).toContain('v2 transformation is not yet implemented');
  });
});
