import { GoogleAdsSDK } from '@rudderstack/integrations-lib';
import { Integration } from './routerTransform';
import {
  ChunkBatchStrategy,
  type DestinationIntegrationConstructor,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';

import type { Destination } from '../../../types/controlPlaneConfig';
import type {
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';

type GAECInput = Parameters<InstanceType<typeof Integration>['transformEvent']>[0];

// The conversion action lookup goes through the Google Ads SDK (see ./utils), so the SDK client
// is what these tests stub — `getConversionActionId` returns the conversion action *resource
// name* despite its name.
const mockGetConversionActionId = jest.fn();

jest.mock('@rudderstack/integrations-lib', () => {
  const actual = jest.requireActual('@rudderstack/integrations-lib');
  return {
    ...actual,
    GoogleAdsSDK: {
      GoogleAds: jest.fn().mockImplementation(() => ({
        getConversionActionId: mockGetConversionActionId,
      })),
    },
  };
});

const MockGoogleAds = GoogleAdsSDK.GoogleAds as unknown as jest.Mock;

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const destination: Destination = {
  ID: 'gaec-dest-1',
  Config: {
    customerId: '1234567890',
    subAccount: true,
    loginCustomerId: '11',
    listOfConversions: [
      { conversions: 'Page View' },
      { conversions: 'Product Added' },
      { conversions: 'Purchase' },
      { conversions: 'Signup' },
      { conversions: 'Missing Conversion' },
      // The conversion-action cache is module-level and outlives individual tests, so every
      // transport-enabled test uses a name of its own; sharing one would let an earlier test's
      // cache entry swallow the lookup a later test asserts on.
      { conversions: 'Warm Cache Event' },
      { conversions: 'Direct Event' },
      { conversions: 'Repeated Event' },
    ],
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

type EventOverrides = {
  event?: string;
  type?: string;
  traits?: Record<string, unknown>;
  destination?: Destination;
};

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
  return {
    message,
    metadata,
    destination: overrides?.destination ?? destination,
  } as unknown as RouterTransformationRequestData;
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

const enableTransport = () => {
  process.env.GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS =
    'ws-1';
  process.env.GOOGLE_ADS_DEVELOPER_TOKEN = 'dummy-developer-token';
};

/**
 * Resolves each listed conversion name to a distinct resource name and any other name to `null`,
 * which is how the SDK reports "no such conversion action".
 */
const mockConversionActionLookup = (names: string[], customerId = '1234567890') => {
  mockGetConversionActionId.mockImplementation(async (event: string) => {
    const index = names.indexOf(event);
    return index === -1 ? null : `customers/${customerId}/conversionActions/${index + 100}`;
  });
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GoogleAdwordsEnhancedConversions Integration', () => {
  const integration = new Integration(destination);

  beforeEach(() => {
    mockGetConversionActionId.mockReset();
    MockGoogleAds.mockClear();
    delete process.env
      .GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS;
    delete process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  });

  describe('transformEvent', () => {
    it('reshapes a single track event into a TransformedEvent carrying one adjustment', async () => {
      const result = await integration.transformEvent(makeInput(1) as unknown as GAECInput);

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

    it('emits full endpoint, empty params and a resolved conversion action when transport is enabled', async () => {
      enableTransport();
      mockConversionActionLookup(['Direct Event']);

      const result = await integration.transformEvent(
        makeInput(1, { event: 'Direct Event' }) as unknown as GAECInput,
      );

      expect(result.endpoint).toBe(
        'https://googleads.googleapis.com/v23/customers/1234567890:uploadConversionAdjustments',
      );
      expect(result.endpointPath).toBe('/1234567890:uploadConversionAdjustments');
      expect(result.params).toEqual({});
      // The developer token is delivery-only; it must never reach persisted router output.
      expect(result.headers).not.toHaveProperty('developer-token');
      expect(result.body).toHaveProperty(
        'conversionAction',
        'customers/1234567890/conversionActions/100',
      );
    });

    it('fails only this event when its conversion name does not resolve', async () => {
      enableTransport();
      mockConversionActionLookup([]);

      await expect(
        integration.transformEvent(
          makeInput(1, { event: 'Missing Conversion' }) as unknown as GAECInput,
        ),
      ).rejects.toThrow('Conversion Action not found');
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
        adjustments.map((body, i) => ({
          body,
          endpoint: '',
          endpointPath: '/uploadConversionAdjustments',
          method: 'POST',
          jobId: i + 1,
        })),
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

  describe('processDestinationIntegration', () => {
    it('batches events with the same conversion name + customer into one request', async () => {
      const inputs = [makeInput(1), makeInput(2), makeInput(3)];
      const results = await processDestinationIntegration(
        inputs,
        Integration as DestinationIntegrationConstructor,
        {},
      );

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
      const results = await processDestinationIntegration(
        inputs,
        Integration as DestinationIntegrationConstructor,
        {},
      );

      expect(results).toHaveLength(2);
      const byEvent: Record<string, RouterTransformationResponse> = Object.fromEntries(
        results.map((r) => [singleBatch(r).params?.event as string, r]),
      );
      expect(batchBody(byEvent['Page View']).conversionAdjustments).toHaveLength(2);
      expect(batchBody(byEvent['Product Added']).conversionAdjustments).toHaveLength(1);
    });

    it('batches different conversion names into one full-endpoint request when transport is enabled', async () => {
      enableTransport();
      mockConversionActionLookup(['Page View', 'Product Added', 'Purchase']);
      const inputs = [
        makeInput(1, { event: 'Page View' }),
        makeInput(2, { event: 'Product Added' }),
        makeInput(3, { event: 'Purchase' }),
      ];

      const results = await processDestinationIntegration(
        inputs,
        Integration as DestinationIntegrationConstructor,
        {},
      );

      expect(results).toHaveLength(1);
      // One lookup per distinct conversion name, and the developer token is supplied to the SDK
      // client rather than carried on the transformed payload.
      expect(mockGetConversionActionId.mock.calls.map(([name]) => name)).toEqual([
        'Page View',
        'Product Added',
        'Purchase',
      ]);
      expect(MockGoogleAds.mock.calls[0][0]).toMatchObject({
        customerId: '1234567890',
        loginCustomerId: '11',
        developerToken: 'dummy-developer-token',
        accessToken: 'dummy-access-token',
      });
      const request = singleBatch(results[0]);
      expect(request.endpoint).toBe(
        'https://googleads.googleapis.com/v23/customers/1234567890:uploadConversionAdjustments',
      );
      expect(request.endpointPath).toBe('/1234567890:uploadConversionAdjustments');
      expect(request.params).toEqual({});
      expect(request.headers).not.toHaveProperty('developer-token');
      expect(batchBody(results[0]).conversionAdjustments).toEqual([
        expect.objectContaining({ conversionAction: 'customers/1234567890/conversionActions/100' }),
        expect.objectContaining({ conversionAction: 'customers/1234567890/conversionActions/101' }),
        expect.objectContaining({ conversionAction: 'customers/1234567890/conversionActions/102' }),
      ]);
    });

    it('keeps a job whose conversion name does not resolve out of the batch', async () => {
      enableTransport();
      mockConversionActionLookup(['Page View']);
      const inputs = [
        makeInput(1, { event: 'Page View' }),
        makeInput(2, { event: 'Missing Conversion' }),
      ];

      const results = await processDestinationIntegration(
        inputs,
        Integration as DestinationIntegrationConstructor,
        {},
      );

      const success = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode !== 200);
      expect(success).toHaveLength(1);
      expect(batchBody(success[0]).conversionAdjustments).toHaveLength(1);
      expect(success[0].metadata.map((m) => m.jobId)).toEqual([1]);
      expect(errors).toEqual([
        expect.objectContaining({
          metadata: [expect.objectContaining({ jobId: 2 })],
          error: expect.stringContaining('Conversion Action not found'),
        }),
      ]);
    });

    it('surfaces authErrorCategory on the failed job when the lookup auth fails', async () => {
      enableTransport();
      mockGetConversionActionId.mockResolvedValue({
        type: 'client-error',
        statusCode: 401,
        message: 'Request had invalid authentication credentials.',
        responseBody: {
          error: {
            message: 'Request had invalid authentication credentials.',
            status: 'UNAUTHENTICATED',
          },
        },
      });

      const results = await processDestinationIntegration(
        [makeInput(1, { event: 'Signup' })],
        Integration as DestinationIntegrationConstructor,
        {},
      );

      expect(results).toEqual([
        expect.objectContaining({
          statusCode: 401,
          authErrorCategory: 'REFRESH_TOKEN',
          metadata: [expect.objectContaining({ jobId: 1 })],
        }),
      ]);
    });

    it('serves a warm conversion-action cache without another lookup', async () => {
      enableTransport();
      mockConversionActionLookup(['Warm Cache Event']);
      await processDestinationIntegration(
        [makeInput(10, { event: 'Warm Cache Event' })],
        Integration as DestinationIntegrationConstructor,
        {},
      );
      expect(mockGetConversionActionId).toHaveBeenCalledTimes(1);
      mockGetConversionActionId.mockClear();

      const results = await processDestinationIntegration(
        [makeInput(11, { event: 'Warm Cache Event' })],
        Integration as DestinationIntegrationConstructor,
        {},
      );

      expect(mockGetConversionActionId).not.toHaveBeenCalled();
      expect(batchBody(results[0]).conversionAdjustments[0]).toMatchObject({
        conversionAction: 'customers/1234567890/conversionActions/100',
      });
    });

    it('looks a repeated conversion name up once per transform call', async () => {
      enableTransport();
      mockConversionActionLookup(['Repeated Event']);

      await processDestinationIntegration(
        [
          makeInput(20, { event: 'Repeated Event' }),
          makeInput(21, { event: 'Repeated Event' }),
          makeInput(22, { event: 'Repeated Event' }),
        ],
        Integration as DestinationIntegrationConstructor,
        {},
      );

      expect(mockGetConversionActionId).toHaveBeenCalledTimes(1);
    });

    it('returns per-event errors for invalid events without poisoning the batch', async () => {
      const inputs = [
        makeInput(1),
        makeInput(2, { type: 'identify' }), // schema rejects → 400
        makeInput(3, { traits: {} }), // no user identifiers → transform throws → 400
      ];
      const results = await processDestinationIntegration(
        inputs,
        Integration as DestinationIntegrationConstructor,
        {},
      );

      const success = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode === 400);

      expect(success).toHaveLength(1);
      expect(batchBody(success[0]).conversionAdjustments).toHaveLength(1);
      expect(success[0].metadata.map((m) => m.jobId)).toEqual([1]);
      expect(errors.map((e) => e.metadata[0].jobId).sort()).toEqual([2, 3]);
    });
  });
});
