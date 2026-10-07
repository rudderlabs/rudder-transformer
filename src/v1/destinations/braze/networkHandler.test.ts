jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
  counter: jest.fn(),
  gauge: jest.fn(),
}));

import stats from '../../../util/stats';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';
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

// Minimal proxy-request stub. The handler reads only endpointPath to dispatch
// its correlation branch.
const buildRequestFor = (endpointPath: string, metadata: ProxyMetdata[]): ProxyV1Request => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: `https://rest.example.braze.com/${endpointPath}`,
  endpointPath,
  userId: '',
  metadata,
  destinationConfig: {},
});

const trackRequestFor = (metadata: ProxyMetdata[]) => buildRequestFor('users/track', metadata);
const mergeRequestFor = (metadata: ProxyMetdata[]) => buildRequestFor('users/merge', metadata);

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('happy path — 2xx, message=success, no errors', () => {
    it('serializes the response once and reuses it for every job', () => {
      const response = { message: 'success', events_processed: 2, purchases_processed: 1 };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];
      const expectedResponseBody = JSON.stringify(response);
      const stringifySpy = jest.spyOn(JSON, 'stringify');

      const result = responseHandler({ destinationResponse, rudderJobMetadata });

      expect(result).toEqual({
        status: 200,
        message: 'Request for braze Processed Successfully',
        response: [
          { statusCode: 200, metadata: createMetadata(10), error: expectedResponseBody },
          { statusCode: 200, metadata: createMetadata(20), error: expectedResponseBody },
          { statusCode: 200, metadata: createMetadata(30), error: expectedResponseBody },
        ],
      });
      expect(result.response[1].error).toBe(result.response[0].error);
      expect(result.response[2].error).toBe(result.response[0].error);
      expect(stringifySpy).toHaveBeenCalledTimes(1);
      stringifySpy.mockRestore();
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
      const destinationRequest = trackRequestFor(rudderJobMetadata);

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
      // Nothing correlated → the abort counter does not fire.
      expectNoCounter('braze_delivery_aborted');
    });

    it('when SOME metadata lack destInfo (mixed batch), correlated jobs get 400 and uncorrelated jobs get 200', () => {
      // Job 10 has destInfo intersecting the rejected index → 400.
      // Job 20 lacks destInfo → nothing to correlate → defaults to 200.
      // Per-job correlation aborts the failure we can attribute without
      // changing the uncorrelated fallback.
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0] }), createMetadata(20)];
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0]).toEqual({
        statusCode: 400,
        metadata: rudderJobMetadata[0],
        error: SCHEMA_ERRORS.missingRequired,
      });
      expect(result.response[1]).toEqual({
        statusCode: 200,
        metadata: rudderJobMetadata[1],
        error: JSON.stringify(response),
      });
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 1, METRIC_LABELS);
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
      expectNoCounter('braze_delivery_aborted');
    });
  });

  describe('partial failure — per-job correlation', () => {
    it('emits 400 only for jobs whose destInfo indices intersect a rejected events index; other jobs get 200', () => {
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'events', index: 1 }],
      };
      const destinationResponse = { response, status: 200 };
      // Job 10 owns index 0 (clean), while job 20 owns index 1 (rejected).
      const rudderJobMetadata = [
        createMetadata(10, { eventsIndices: [0] }),
        createMetadata(20, { eventsIndices: [1] }),
      ];
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response).toEqual([
        { statusCode: 200, metadata: rudderJobMetadata[0], error: JSON.stringify(response) },
        {
          statusCode: 400,
          metadata: rudderJobMetadata[1],
          error: SCHEMA_ERRORS.typeMismatchPrice,
        },
      ]);
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure', METRIC_LABELS);
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 1, METRIC_LABELS);
    });

    it('aborts every correlated hit regardless of the track sub-array', () => {
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
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      // Jobs 10, 20, and 30 each correlate to a rejected item and abort.
      // Job 40 owns attributes[1], which Braze did not reject → 200.
      expect(result.response[0]).toEqual({
        statusCode: 400,
        metadata: rudderJobMetadata[0],
        error: SCHEMA_ERRORS.missingRequired,
      });
      expect(result.response[1]).toEqual({
        statusCode: 400,
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
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 3, METRIC_LABELS);
    });

    it('emits a single 400 (not multiple) when one job spans multiple rejected indices; concatenates all matching error.type strings', () => {
      // One job contributes 3 events and two are rejected. The job
      // emits exactly ONE abort entry whose `error` is a semicolon-separated
      // join of every matching Braze error.type verbatim (encounter order across
      // the job's declared indices, no deduplication).
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 },
          { type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'events', index: 2 },
        ],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0, 1, 2] })];
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response).toHaveLength(1);
      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toBe(
        `${SCHEMA_ERRORS.missingRequired}; ${SCHEMA_ERRORS.typeMismatchPrice}`,
      );
    });

    it('concatenates matches across events + attributes + purchases when a single job spans all three, and aborts', () => {
      // Job 10 contributes to every track sub-array and each contribution is
      // rejected. The `error` field carries every hit in order: events →
      // attributes → purchases.
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
      const destinationRequest = trackRequestFor(rudderJobMetadata);

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

    it('does NOT deduplicate identical error.type strings across a job’s rejected indices', () => {
      // Same error type on two event indices — both hits kept so the
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
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0].statusCode).toBe(400);
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
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response.map((r) => r.metadata.jobId)).toEqual([10, 20, 30]);
      expect(result.response.map((r) => r.statusCode)).toEqual([200, 400, 200]);
    });

    it('when destInfo has malformed indices field (non-array), that field is ignored and no outcome is emitted for that job', () => {
      const response = {
        message: 'success',
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      // Job 10's destInfo has a garbage `eventsIndices`; we must not throw
      // and must not falsely emit 400 for it. Job 20 with valid destInfo
      // still gets its 400.
      const rudderJobMetadata = [
        createMetadata(10, { eventsIndices: 'not-an-array' }),
        createMetadata(20, { eventsIndices: [0] }),
      ];
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[1].statusCode).toBe(400);
    });
  });

  describe('correlated failure classification', () => {
    const correlatedFailureCases = [
      {
        name: 'schema rejection for additional properties',
        errors: [{ type: SCHEMA_ERRORS.additionalProperty, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: SCHEMA_ERRORS.additionalProperty,
      },
      {
        name: 'schema rejection for an integer where a string was expected',
        errors: [{ type: SCHEMA_ERRORS.typeMismatchProductId, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: SCHEMA_ERRORS.typeMismatchProductId,
      },
      {
        name: 'schema rejection for a missing required property',
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: SCHEMA_ERRORS.missingRequired,
      },
      {
        name: 'schema rejection for a string where a number was expected',
        errors: [{ type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: SCHEMA_ERRORS.typeMismatchPrice,
      },
      {
        name: 'non-schema event failure',
        errors: [{ type: NON_SCHEMA_ERROR, input_array: 'events', index: 0 }],
        destInfo: { eventsIndices: [0] },
        expectedError: NON_SCHEMA_ERROR,
      },
      {
        name: 'schema rejection in the attributes array',
        errors: [{ type: SCHEMA_ERRORS.missingRequired, input_array: 'attributes', index: 0 }],
        destInfo: { attributesIndices: [0] },
        expectedError: SCHEMA_ERRORS.missingRequired,
      },
      {
        name: 'schema rejection in the purchases array',
        errors: [{ type: SCHEMA_ERRORS.typeMismatchPrice, input_array: 'purchases', index: 0 }],
        destInfo: { purchasesIndices: [0] },
        expectedError: SCHEMA_ERRORS.typeMismatchPrice,
      },
    ];

    it.each(correlatedFailureCases)(
      'emits 400 for $name',
      ({ errors, destInfo, expectedError }) => {
        const response = { message: 'success', errors };
        const rudderJobMetadata = [createMetadata(10, destInfo)];

        const result = responseHandler({
          destinationResponse: { response, status: 200 },
          rudderJobMetadata,
          destinationRequest: trackRequestFor(rudderJobMetadata),
        });

        expect(result.response).toEqual([
          { statusCode: 400, metadata: rudderJobMetadata[0], error: expectedError },
        ]);
        expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 1, METRIC_LABELS);
      },
    );

    it('aborts a job with mixed schema and non-schema hits, keeping both error types', () => {
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
        destinationRequest: trackRequestFor(rudderJobMetadata),
      });

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toBe(
        `${SCHEMA_ERRORS.missingRequired}; ${NON_SCHEMA_ERROR}`,
      );
    });

    it('counts every correlated job as aborted', () => {
      const response = {
        message: 'success',
        errors: [
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 0 },
          { type: SCHEMA_ERRORS.missingRequired, input_array: 'events', index: 1 },
        ],
      };
      const rudderJobMetadata = [
        createMetadata(10, { eventsIndices: [0] }),
        createMetadata(20, { eventsIndices: [1] }),
      ];

      const result = responseHandler({
        destinationResponse: { response, status: 200 },
        rudderJobMetadata,
        destinationRequest: trackRequestFor(rudderJobMetadata),
      });

      expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivery_aborted', 2, METRIC_LABELS);
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

    it('throws TransformerProxyError without eagerly building per-job entries at the 2xx HTTP status', () => {
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
          expect(thrown.response).toBeUndefined();
        }
      }
    });
  });

  describe('upstream 4xx — aborted error type', () => {
    it('throws TransformerProxyError without eagerly building per-job entries and keeps aborted statTag for 401', () => {
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
          expect(thrown.response).toBeUndefined();
        }
      }
    });
  });

  describe('upstream 5xx — retryable error type', () => {
    it('does not serialize an undefined response or eagerly build per-job entries', () => {
      const destinationResponse = { response: undefined, status: 500 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20)];
      const stringifySpy = jest.spyOn(JSON, 'stringify');

      let thrown: unknown;
      try {
        responseHandler({ destinationResponse, rudderJobMetadata });
      } catch (error: unknown) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(TransformerProxyError);
      if (thrown instanceof TransformerProxyError) {
        expect(thrown.response).toBeUndefined();
      }
      expect(stringifySpy).not.toHaveBeenCalled();
    });

    it('throws TransformerProxyError without eagerly building per-job entries and keeps retryable statTag for 500', () => {
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
          expect(thrown.response).toBeUndefined();
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
