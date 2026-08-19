jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
  counter: jest.fn(),
  gauge: jest.fn(),
}));

import stats from '../../../util/stats';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import type { ProxyMetdata } from '../../../types';
import type { BrazeEvent, BrazeProxyV1Request } from '../../../v0/destinations/braze/types';
import { responseHandler } from './networkHandler';

const createMetadata = (jobId: number, destInfo?: Record<string, unknown>): ProxyMetdata => ({
  jobId,
  attemptNum: 0,
  userId: '',
  sourceId: 'source-1',
  destinationId: 'dest-1',
  workspaceId: 'workspace-1',
  secret: {},
  dontBatch: false,
  ...(destInfo !== undefined ? { destInfo } : {}),
});

// Braze event names emitted by the recommended-ecommerce path. Only these mark
// an item in the sent events[] as eligible for 296.
const ECOM_ORDER_PLACED = 'ecommerce.order_placed';
const ECOM_PRODUCT_VIEWED = 'ecommerce.product_viewed';
// A legacy custom event — reaches the same events[] after chunking, but never 296.
const LEGACY_EVENT = 'Some Custom Event';
// BrazeEvent requires `time`; the handler never reads it, so one value serves all.
const EVENT_TIME = '2026-08-18T00:00:00.000Z';
const eventNamed = (name: string): BrazeEvent => ({ name, time: EVENT_TIME });

// Verbatim ecommerce schema rejections observed on real /users/track responses.
const SCHEMA_ERRORS = {
  additionalProperty:
    'The property \'#/\' contains additional properties ["sku_abcd"] outside of the schema when none are allowed',
  typeMismatchProductId:
    "The property '#/product_id' of type integer did not match the following type: string",
  missingRequired: "The property '#/' did not contain a required property of 'product_id'",
  typeMismatchPrice:
    "The property '#/price' of type string did not match the following type: number",
};
// A track failure that is not a schema rejection — always aborts, whatever it hit.
const NON_SCHEMA_ERROR = "'external_id' is required";

const METRIC_LABELS = { destinationId: 'dest-1', workspaceId: 'workspace-1' };

// Minimal proxy-request stub. The handler reads endpointPath to dispatch its
// correlation branch and body.JSON.events to identify ecommerce items by name.
const buildRequestFor = (
  endpointPath: string,
  metadata: ProxyMetdata[],
  events: BrazeEvent[] = [],
): BrazeProxyV1Request => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: `https://rest.example.braze.com/${endpointPath}`,
  endpointPath,
  userId: '',
  metadata,
  destinationConfig: {},
  body: { JSON: { partner: 'RudderStack', ...(events.length > 0 ? { events } : {}) } },
});

const trackRequestFor = (metadata: ProxyMetdata[], events: BrazeEvent[] = []) =>
  buildRequestFor('users/track', metadata, events);
const mergeRequestFor = (metadata: ProxyMetdata[]) => buildRequestFor('users/merge', metadata);

// A sent events[] of `count` items all carrying the same Braze event name.
const eventsNamed = (name: string, count: number): BrazeEvent[] =>
  Array.from({ length: count }, () => eventNamed(name));

const mockStats = stats as jest.Mocked<typeof stats>;

const expectNoCounter = (metricName: string) =>
  expect(mockStats.counter).not.toHaveBeenCalledWith(
    metricName,
    expect.anything(),
    expect.anything(),
  );

describe('Braze v1 networkHandler responseHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('happy path — 2xx, message=success, no errors', () => {
    it('returns per-job entries with the HTTP status code and full response body as error field', () => {
      const response = { message: 'success', events_processed: 2, purchases_processed: 1 };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];

      const result = responseHandler({ destinationResponse, rudderJobMetadata });

      expect(result).toEqual({
        status: 200,
        message: 'Request for braze Processed Successfully',
        response: [
          { statusCode: 200, metadata: createMetadata(10), error: JSON.stringify(response) },
          { statusCode: 200, metadata: createMetadata(20), error: JSON.stringify(response) },
          { statusCode: 200, metadata: createMetadata(30), error: JSON.stringify(response) },
        ],
      });
      expect(mockStats.increment).not.toHaveBeenCalled();
    });

    it('preserves jobId correlation — order and identity match rudderJobMetadata', () => {
      const response = { message: 'success' };
      const destinationResponse = { response, status: 201 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];

      const result = responseHandler({ destinationResponse, rudderJobMetadata });

      expect(result.response).toHaveLength(3);
      expect(result.response[0].metadata.jobId).toBe(10);
      expect(result.response[1].metadata.jobId).toBe(20);
      expect(result.response[2].metadata.jobId).toBe(30);
    });
  });

  describe('partial failure — 2xx, message=success, errors present (defensive fallback)', () => {
    it('when NO metadata carries destInfo, correlation runs but yields no hits — every job stays 200 and only braze_partial_failure is emitted', () => {
      // A /users/track request completes with a partial failure. No job
      // carries destInfo, so the per-job correlation finds nothing to
      // attribute; every job defaults to 200 (the response body verbatim).
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 1 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20)];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 2),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result).toEqual({
        status: 200,
        message: 'Request for braze Processed Successfully',
        response: [
          { statusCode: 200, metadata: createMetadata(10), error: JSON.stringify(response) },
          { statusCode: 200, metadata: createMetadata(20), error: JSON.stringify(response) },
        ],
      });
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure', METRIC_LABELS);
      // Nothing correlated → neither per-outcome counter fires.
      expectNoCounter('braze_delivered_with_warning');
      expectNoCounter('braze_delivery_aborted');
    });

    it('when SOME metadata lack destInfo (mixed batch), correlated jobs get 296 and uncorrelated jobs get 200', () => {
      // Job 10 has destInfo intersecting the warned index → 296.
      // Job 20 lacks destInfo → nothing to correlate → defaults to 200.
      // Under today's per-job semantics we surface the warning we can
      // attribute instead of losing it for the whole batch.
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0] }), createMetadata(20)];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 1),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0]).toEqual({
        statusCode: 296,
        metadata: rudderJobMetadata[0],
        error: SCHEMA_ERRORS.missingRequired,
      });
      expect(result.response[1]).toEqual({
        statusCode: 200,
        metadata: rudderJobMetadata[1],
        error: JSON.stringify(response),
      });
      expect(mockStats.counter).toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        1,
        METRIC_LABELS,
      );
      expectNoCounter('braze_delivery_aborted');
    });

    it('when the delivery endpoint is NOT /users/track (e.g. alias-merge), falls back to uniform-200 without inspecting destInfo', () => {
      // Merge/subscription responses can also surface an `errors[]` array,
      // but per-item correlation is reserved for /users/track only. Dispatch on
      // endpointPath, not error.input_array, so this case is handled
      // regardless of what Braze uses for the merge error shape.
      const response = {
        message: 'success',
        aliases_processed: 0,
        errors: [{ type: NON_SCHEMA_ERROR, input_array: 'user_identifiers', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, {}), createMetadata(20, {})];
      const destinationRequest = mergeRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      for (const state of result.response) {
        expect(state.statusCode).toBe(200);
      }
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure', METRIC_LABELS);
      expectNoCounter('braze_delivered_with_warning');
      expectNoCounter('braze_delivery_aborted');
    });

    it('when destinationRequest is missing entirely (framework contract broken), falls back to uniform-200', () => {
      const response = {
        message: 'success',
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0] })];

      const result = responseHandler({ destinationResponse, rudderJobMetadata });

      expect(result.response[0].statusCode).toBe(200);
      expectNoCounter('braze_delivered_with_warning');
      expectNoCounter('braze_delivery_aborted');
    });
  });

  describe('partial failure — per-job correlation', () => {
    it('emits 296 only for jobs whose destInfo indices intersect a warned events index; other jobs get 200', () => {
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'events', index: 1 }],
      };
      const destinationResponse = { response, status: 200 };
      // Chunk contains 2 ecommerce events at positions [0, 1]. Job 10 owns
      // index 0 (clean), job 20 owns index 1 (warned).
      const rudderJobMetadata = [
        createMetadata(10, { eventsIndices: [0] }),
        createMetadata(20, { eventsIndices: [1] }),
      ];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 2),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response).toEqual([
        { statusCode: 200, metadata: rudderJobMetadata[0], error: JSON.stringify(response) },
        {
          statusCode: 296,
          metadata: rudderJobMetadata[1],
          error: SCHEMA_ERRORS.typeMismatchPrice,
        },
      ]);
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure', METRIC_LABELS);
      expect(mockStats.counter).toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        1,
        METRIC_LABELS,
      );
    });

    it('warns only the ecommerce events hit — attributes and purchases hits abort their jobs', () => {
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'attributes', index: 0 },
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 },
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'purchases', index: 2 },
        ],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [
        createMetadata(10, { attributesIndices: [0] }),
        createMetadata(20, { eventsIndices: [0] }),
        createMetadata(30, { purchasesIndices: [0, 1, 2] }),
        createMetadata(40, { attributesIndices: [1] }),
      ];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 1),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      // Only job 20's hit is an ecommerce schema rejection in events[]; jobs
      // 10 and 30 hit other sub-arrays and abort. Job 40 owns attributes[1],
      // which is not warned at all → 200.
      expect(result.response[0]).toEqual({
        statusCode: 400,
        metadata: rudderJobMetadata[0],
        error: SCHEMA_ERRORS.missingRequired,
      });
      expect(result.response[1]).toEqual({
        statusCode: 296,
        metadata: rudderJobMetadata[1],
        error: SCHEMA_ERRORS.missingRequired,
      });
      expect(result.response[2]).toEqual({
        statusCode: 400,
        metadata: rudderJobMetadata[2],
        error: SCHEMA_ERRORS.missingRequired,
      });
      expect(result.response[3]).toEqual({
        statusCode: 200,
        metadata: rudderJobMetadata[3],
        error: JSON.stringify(response),
      });
      expect(mockStats.counter).toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        1,
        METRIC_LABELS,
      );
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 2, METRIC_LABELS);
    });

    it('emits a single 296 (not multiple) when one job spans multiple warned indices; concatenates all matching error.type strings', () => {
      // One job contributing 3 ecommerce events; two of them get warned. The
      // job emits exactly ONE entry whose `error` is a semicolon-separated join
      // of every matching Braze error.type verbatim (encounter order across the
      // job's declared indices, no deduplication).
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 },
          { type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'events', index: 2 },
        ],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0, 1, 2] })];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_PRODUCT_VIEWED, 3),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response).toHaveLength(1);
      expect(result.response[0].statusCode).toBe(296);
      expect(result.response[0].error).toBe(
        `${SCHEMA_ERRORS.missingRequired}; ${SCHEMA_ERRORS.typeMismatchPrice}`,
      );
    });

    it('concatenates matches across events + attributes + purchases when a single job spans all three, and aborts', () => {
      // Job 10 contributes to every track sub-array and each contribution is
      // warned. Only the events hit qualifies for 296, so abort wins — but the
      // `error` field still carries every hit in order: events → attributes →
      // purchases.
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 },
          { type: NON_SCHEMA_ERROR, input_array: 'attributes', index: 0 },
          { type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'purchases', index: 0 },
        ],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [
        createMetadata(10, {
          eventsIndices: [0],
          attributesIndices: [0],
          purchasesIndices: [0],
        }),
      ];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 1),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toBe(
        `${SCHEMA_ERRORS.missingRequired}; ${NON_SCHEMA_ERROR}; ${SCHEMA_ERRORS.typeMismatchPrice}`,
      );
    });

    it('does NOT deduplicate identical error.type strings across a job’s warned indices', () => {
      // Same error type on two ecommerce event indices — both hits kept so the
      // downstream count remains informative.
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.additionalProperty, input_array: 'events', index: 0 },
          { type: SCHEMA_ERRORS.additionalProperty, input_array: 'events', index: 1 },
        ],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0, 1] })];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 2),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0].statusCode).toBe(296);
      expect(result.response[0].error).toBe(
        `${SCHEMA_ERRORS.additionalProperty}; ${SCHEMA_ERRORS.additionalProperty}`,
      );
    });

    it('preserves order and identity of rudderJobMetadata in the output response', () => {
      const response = {
        message: 'success',
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 1 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [
        createMetadata(10, { eventsIndices: [0] }),
        createMetadata(20, { eventsIndices: [1] }),
        createMetadata(30, { eventsIndices: [2] }),
      ];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 3),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response.map((r) => r.metadata.jobId)).toEqual([10, 20, 30]);
      expect(result.response.map((r) => r.statusCode)).toEqual([200, 296, 200]);
    });

    it('when destInfo has malformed indices field (non-array), that field is ignored and no outcome is emitted for that job', () => {
      const response = {
        message: 'success',
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      // Job 10's destInfo has a garbage `eventsIndices`; we must not throw
      // and must not falsely emit 296 for it. Job 20 with valid destInfo
      // still gets its 296.
      const rudderJobMetadata = [
        createMetadata(10, { eventsIndices: 'not-an-array' }),
        createMetadata(20, { eventsIndices: [0] }),
      ];
      const destinationRequest = trackRequestFor(
        rudderJobMetadata,
        eventsNamed(ECOM_ORDER_PLACED, 1),
      );

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[1].statusCode).toBe(296);
    });
  });

  describe('296 vs 400 classification', () => {
    // A hit warns only when it is a schema rejection (error.type prefixed with
    // the JSON pointer) of a recommended-ecommerce event in the sent events[].
    const warningCases = [
      { name: 'additional properties outside schema', type: SCHEMA_ERRORS.additionalProperty },
      { name: 'integer where string expected', type: SCHEMA_ERRORS.typeMismatchProductId },
      { name: 'missing required property', type: SCHEMA_ERRORS.missingRequired },
      { name: 'string where number expected', type: SCHEMA_ERRORS.typeMismatchPrice },
    ];

    const abortCases = [
      {
        name: 'schema rejection of a legacy custom event',
        sentEvents: [eventNamed(LEGACY_EVENT)],
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: SCHEMA_ERRORS.missingRequired,
      },
      {
        name: 'non-schema failure on an ecommerce event',
        sentEvents: [eventNamed(ECOM_ORDER_PLACED)],
        errors: [{ type: NON_SCHEMA_ERROR, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: NON_SCHEMA_ERROR,
      },
      {
        name: 'schema rejection when events[] is absent from the sent body',
        sentEvents: [],
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: SCHEMA_ERRORS.missingRequired,
      },
      {
        name: 'schema rejection in the attributes array',
        sentEvents: [eventNamed(ECOM_ORDER_PLACED)],
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'attributes', index: 0 }],
        destInfo: { attributesIndices: [0] },
        expectedError: SCHEMA_ERRORS.missingRequired,
      },
      {
        name: 'schema rejection in the purchases array',
        sentEvents: [eventNamed(ECOM_ORDER_PLACED)],
        errors: [{ type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'purchases', index: 0 }],
        destInfo: { purchasesIndices: [0] },
        expectedError: SCHEMA_ERRORS.typeMismatchPrice,
      },
    ];

    it.each(warningCases)('emits 296 for an ecommerce schema rejection: $name', ({ type }) => {
      const response = {
        message: 'success',
        errors: [{ type, input_array: 'events', index: 0 }],
      };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0] })];

      const result = responseHandler({
        destinationResponse: { response, status: 200 },
        rudderJobMetadata,
        destinationRequest: trackRequestFor(rudderJobMetadata, [eventNamed(ECOM_ORDER_PLACED)]),
      });

      expect(result.response).toEqual([
        { statusCode: 296, metadata: rudderJobMetadata[0], error: type },
      ]);
      expect(mockStats.counter).toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        1,
        METRIC_LABELS,
      );
      expectNoCounter('braze_delivery_aborted');
    });

    it.each(abortCases)(
      'emits 400 for $name',
      ({ sentEvents, errors, destInfo, expectedError }) => {
        const response = { message: 'success', errors };
        const rudderJobMetadata = [createMetadata(10, destInfo)];

        const result = responseHandler({
          destinationResponse: { response, status: 200 },
          rudderJobMetadata,
          destinationRequest: trackRequestFor(rudderJobMetadata, sentEvents),
        });

        expect(result.response).toEqual([
          { statusCode: 400, metadata: rudderJobMetadata[0], error: expectedError },
        ]);
        expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 1, METRIC_LABELS);
        expectNoCounter('braze_delivered_with_warning');
      },
    );

    it('aborts a job that mixes a qualifying and a non-qualifying hit, keeping both error types', () => {
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 },
          { type: NON_SCHEMA_ERROR, input_array: 'events', index: 1 },
        ],
      };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0, 1] })];

      const result = responseHandler({
        destinationResponse: { response, status: 200 },
        rudderJobMetadata,
        destinationRequest: trackRequestFor(rudderJobMetadata, eventsNamed(ECOM_ORDER_PLACED, 2)),
      });

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toBe(
        `${SCHEMA_ERRORS.missingRequired}; ${NON_SCHEMA_ERROR}`,
      );
    });

    it('emits both counters when a batch produces warned and aborted jobs together', () => {
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 },
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 1 },
        ],
      };
      // Index 0 holds an ecommerce event (warns); index 1 a legacy one (aborts).
      const rudderJobMetadata = [
        createMetadata(10, { eventsIndices: [0] }),
        createMetadata(20, { eventsIndices: [1] }),
      ];

      const result = responseHandler({
        destinationResponse: { response, status: 200 },
        rudderJobMetadata,
        destinationRequest: trackRequestFor(rudderJobMetadata, [
          eventNamed(ECOM_ORDER_PLACED),
          eventNamed(LEGACY_EVENT),
        ]),
      });

      expect(result.response.map((r) => r.statusCode)).toEqual([296, 400]);
      expect(mockStats.counter).toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        1,
        METRIC_LABELS,
      );
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 1, METRIC_LABELS);
    });
  });

  describe('application-level error — 2xx, message!=success', () => {
    it('throws when Braze returns 2xx with message="failure" and no errors[] array', () => {
      // Regression guard: a bare `message: 'failure'` (no errors) at 2xx
      // used to fall through as a success. Now surfaces as an application
      // error so downstream sees the failure instead of a silent 200.
      const response = { message: 'failure' };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10)];

      expect(() => responseHandler({ destinationResponse, rudderJobMetadata })).toThrow(
        TransformerProxyError,
      );
    });

    it('throws when Braze returns 2xx with no message field at all', () => {
      // A 2xx that omits `message` entirely is treated as a failure — the
      // v1 contract requires `message: "success"` to consider the batch
      // delivered.
      const response = {};
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10)];

      expect(() => responseHandler({ destinationResponse, rudderJobMetadata })).toThrow(
        TransformerProxyError,
      );
    });

    it('throws TransformerProxyError with per-job entries at the 2xx HTTP status', () => {
      const response = {
        message: "Valid data must be provided in the 'attributes' field.",
        errors: [{ type: NON_SCHEMA_ERROR, input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10)];

      expect(() => responseHandler({ destinationResponse, rudderJobMetadata })).toThrow(
        TransformerProxyError,
      );

      try {
        responseHandler({ destinationResponse, rudderJobMetadata });
      } catch (thrown: unknown) {
        expect(thrown).toBeInstanceOf(TransformerProxyError);
        if (thrown instanceof TransformerProxyError) {
          expect(thrown.message).toContain('Request failed for braze with status: 200');
          expect(thrown.status).toBe(200);
          expect(thrown.response).toEqual([
            { statusCode: 200, metadata: createMetadata(10), error: JSON.stringify(response) },
          ]);
        }
      }
    });
  });

  describe('upstream 4xx — aborted error type', () => {
    it('throws TransformerProxyError with per-job entries and aborted statTag for 401', () => {
      const response = { message: 'Invalid API Key' };
      const destinationResponse = { response, status: 401 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20)];

      expect(() => responseHandler({ destinationResponse, rudderJobMetadata })).toThrow(
        TransformerProxyError,
      );

      try {
        responseHandler({ destinationResponse, rudderJobMetadata });
      } catch (thrown: unknown) {
        expect(thrown).toBeInstanceOf(TransformerProxyError);
        if (thrown instanceof TransformerProxyError) {
          expect(thrown.message).toContain('Request failed for braze with status: 401');
          expect(thrown.status).toBe(401);
          expect(thrown.statTags).toMatchObject({ errorType: 'aborted' });
          expect(thrown.response).toEqual([
            { statusCode: 401, metadata: createMetadata(10), error: JSON.stringify(response) },
            { statusCode: 401, metadata: createMetadata(20), error: JSON.stringify(response) },
          ]);
        }
      }
    });
  });

  describe('upstream 5xx — retryable error type', () => {
    it('throws TransformerProxyError with per-job entries and retryable statTag for 500', () => {
      const response = { message: 'Internal Server Error' };
      const destinationResponse = { response, status: 500 };
      const rudderJobMetadata = [createMetadata(10)];

      expect(() => responseHandler({ destinationResponse, rudderJobMetadata })).toThrow(
        TransformerProxyError,
      );

      try {
        responseHandler({ destinationResponse, rudderJobMetadata });
      } catch (thrown: unknown) {
        expect(thrown).toBeInstanceOf(TransformerProxyError);
        if (thrown instanceof TransformerProxyError) {
          expect(thrown.message).toContain('Request failed for braze with status: 500');
          expect(thrown.status).toBe(500);
          expect(thrown.statTags).toMatchObject({ errorType: 'retryable' });
          expect(thrown.response).toEqual([
            { statusCode: 500, metadata: createMetadata(10), error: JSON.stringify(response) },
          ]);
        }
      }
    });
  });

  describe('jobId correlation', () => {
    it('response array has one entry per metadata and preserves identity', () => {
      const response = { message: 'success' };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];

      const result = responseHandler({ destinationResponse, rudderJobMetadata });

      expect(result.response).toHaveLength(3);
      rudderJobMetadata.forEach((meta, idx) => {
        expect(result.response[idx].metadata).toEqual(meta);
      });
    });
  });
});
