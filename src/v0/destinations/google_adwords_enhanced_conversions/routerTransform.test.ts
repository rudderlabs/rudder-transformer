import { Integration } from './routerTransform';
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/batchDestination';
import { processBatchedDestination } from '../../../services/destination/nativeBatching/processBatchedDestination';
import type { Destination } from '../../../types/controlPlaneConfig';
import type {
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const destination: Destination = {
  ID: 'gaec-dest-1',
  Config: {
    customerId: '1234567890',
    subAccount: true,
    loginCustomerId: '11',
    listOfConversions: [{ conversions: 'Page View' }, { conversions: 'Product Added' }],
    authStatus: 'active',
  },
  DestinationDefinition: {
    ID: 'destDef-1',
    Name: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
    DisplayName: 'Google Enhanced Conversions',
    Config: {},
  },
  Name: 'google_adwords_enhanced_conversions',
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

type EventOverrides = { event?: string; type?: string; traits?: Record<string, unknown> };

function makeInput(jobId: number, overrides?: EventOverrides): RouterTransformationRequestData {
  const message = {
    type: overrides?.type ?? 'track',
    event: overrides?.event ?? 'Page View',
    userId: '12345',
    context: {
      traits: overrides?.traits ?? { email: 'user@testmail.com' },
    },
    properties: {
      gclid: 'gclid1234',
      conversionDateTime: '2022-01-01 12:32:45-08:00',
      order_id: 10000,
      total: 1000,
    },
  };
  const metadata = {
    jobId,
    userId: 'u1',
    workspaceId: 'ws-1',
    destinationId: 'gaec-dest-1',
    destinationType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
    secret: {
      access_token: 'dummy-access-token',
      refresh_token: 'dummy-refresh-token',
      developer_token: 'dummy-developer-token',
    },
  };
  return { message, metadata, destination } as unknown as RouterTransformationRequestData;
}

// The framework returns batchedRequest as a single output, an array, or undefined. For this
// destination it is always a single output; narrow to it (and its JSON body) for assertions.
const singleBatch = (resp: RouterTransformationResponse): ProcessorTransformationOutput => {
  const { batchedRequest } = resp;
  if (!batchedRequest || Array.isArray(batchedRequest)) {
    throw new Error('expected a single batchedRequest');
  }
  return batchedRequest;
};

type EnhancedConversionsBody = { conversionAdjustments: unknown[]; partialFailure: boolean };

const batchBody = (resp: RouterTransformationResponse): EnhancedConversionsBody =>
  singleBatch(resp).body?.JSON as EnhancedConversionsBody;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GoogleAdwordsEnhancedConversions Integration', () => {
  const integration = new Integration(destination);

  describe('transformEvent', () => {
    it('reshapes a single track event into a TransformedEvent carrying one adjustment', () => {
      const result = integration.transformEvent(makeInput(1));

      expect(result.endpoint).toBe('');
      expect(result.method).toBe('POST');
      expect(result.headers).toMatchObject({
        Authorization: 'Bearer dummy-access-token',
        'Content-Type': 'application/json',
        'login-customer-id': '11',
      });
      expect(result.params).toMatchObject({
        event: 'Page View',
        customerId: '1234567890',
        loginCustomerId: '11',
        subAccount: true,
      });
      // body is the single conversion adjustment; the conversionAdjustments wrapper and
      // partialFailure flag are re-added by wrapBody at batch time.
      expect(result.body).toHaveProperty('adjustmentType', 'ENHANCEMENT');
      expect(result.body).toHaveProperty('userIdentifiers');
      expect(result.body).not.toHaveProperty('conversionAdjustments');
    });
  });

  describe('getBatchStrategy', () => {
    it('returns a ChunkBatchStrategy', () => {
      expect(integration.getBatchStrategy()).toBeInstanceOf(ChunkBatchStrategy);
    });

    it('wraps adjustments into conversionAdjustments with partialFailure', async () => {
      const strategy = integration.getBatchStrategy();
      const adjustments = [
        { adjustmentType: 'ENHANCEMENT', orderId: '1' },
        { adjustmentType: 'ENHANCEMENT', orderId: '2' },
      ];

      const [result] = await strategy.batch(
        adjustments.map((body, i) => ({ body, endpoint: '', method: 'POST', jobId: i + 1 })),
      );

      expect(result.body).toEqual({
        conversionAdjustments: adjustments,
        partialFailure: true,
      });
      expect(result.jobIds).toEqual(new Set([1, 2]));
    });
  });

  describe('getInputSchema', () => {
    const schema = integration.getInputSchema();
    const parse = (input: RouterTransformationRequestData) => schema.safeParse(input).success;

    it('accepts a valid track event', () => {
      expect(parse(makeInput(1))).toBe(true);
    });

    it('rejects non-track events', () => {
      expect(parse(makeInput(1, { type: 'identify' }))).toBe(false);
    });

    it('rejects track events without an event name', () => {
      expect(parse(makeInput(1, { event: '' }))).toBe(false);
    });
  });

  describe('processBatchedDestination', () => {
    it('batches events with the same conversion name + customer into one request', async () => {
      const inputs = [makeInput(1), makeInput(2), makeInput(3)];
      const results = await processBatchedDestination(inputs, Integration, {});

      expect(results).toHaveLength(1);
      const [batch] = results;
      expect(batch.batched).toBe(true);
      expect(batch.statusCode).toBe(200);
      const body = batchBody(batch);
      expect(body.conversionAdjustments).toHaveLength(3);
      expect(body.partialFailure).toBe(true);
      expect(singleBatch(batch).params).toMatchObject({ event: 'Page View' });
      expect(batch.metadata.map((m) => m.jobId)).toEqual([1, 2, 3]);
    });

    it('splits events with different conversion names into separate batches', async () => {
      const inputs = [
        makeInput(1, { event: 'Page View' }),
        makeInput(2, { event: 'Product Added' }),
        makeInput(3, { event: 'Page View' }),
      ];
      const results = await processBatchedDestination(inputs, Integration, {});

      expect(results).toHaveLength(2);
      const byEvent: Record<string, RouterTransformationResponse> = Object.fromEntries(
        results.map((r) => [singleBatch(r).params?.event as string, r]),
      );
      expect(batchBody(byEvent['Page View']).conversionAdjustments).toHaveLength(2);
      expect(batchBody(byEvent['Product Added']).conversionAdjustments).toHaveLength(1);
    });

    it('returns per-event errors for invalid events without poisoning the batch', async () => {
      const inputs = [
        makeInput(1),
        makeInput(2, { type: 'identify' }), // schema rejects → 400
        makeInput(3, { traits: {} }), // no user identifiers → transform throws → 400
      ];
      const results = await processBatchedDestination(inputs, Integration, {});

      const success = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode === 400);

      expect(success).toHaveLength(1);
      expect(batchBody(success[0]).conversionAdjustments).toHaveLength(1);
      expect(success[0].metadata.map((m) => m.jobId)).toEqual([1]);
      expect(errors.map((e) => e.metadata[0].jobId).sort()).toEqual([2, 3]);
    });
  });
});
