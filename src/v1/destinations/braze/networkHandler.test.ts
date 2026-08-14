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

// Minimal ProxyV1Request stub carrying just the endpointPath — the handler
// only reads endpointPath to dispatch its 296-correlation branch.
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
        errors: [{ type: "'external_id' is required", input_array: 'events', index: 1 }],
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
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure', {
        destination_id: 'dest-1',
        workspace_id: 'workspace-1',
      });
      // No warnings correlated → braze_delivered_with_warning counter never fires.
      expect(mockStats.counter).not.toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        expect.anything(),
        expect.anything(),
      );
    });

    it('when SOME metadata lack destInfo (mixed batch), correlated jobs get 296 and uncorrelated jobs get 200', () => {
      // Job 10 has destInfo intersecting the warned index → 296.
      // Job 20 lacks destInfo → nothing to correlate → defaults to 200.
      // Under today's per-job semantics we surface the warning we can
      // attribute instead of losing it for the whole batch.
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: "'external_id' is required", input_array: 'events', index: 0 }],
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
        statusCode: 296,
        metadata: rudderJobMetadata[0],
        error: "'external_id' is required",
      });
      expect(result.response[1]).toEqual({
        statusCode: 200,
        metadata: rudderJobMetadata[1],
        error: JSON.stringify(response),
      });
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivered_with_warning', 1, {
        destination_id: 'dest-1',
        workspace_id: 'workspace-1',
      });
    });

    it('when the delivery endpoint is NOT /users/track (e.g. alias-merge), falls back to uniform-200 without inspecting destInfo', () => {
      // Merge/subscription responses can also surface an `errors[]` array,
      // but 296 correlation is reserved for /users/track only. Dispatch on
      // endpointPath, not error.input_array, so this case is handled
      // regardless of what Braze uses for the merge error shape.
      const response = {
        message: 'success',
        aliases_processed: 0,
        errors: [{ type: "'external_id' is required", input_array: 'user_identifiers', index: 0 }],
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
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure', {
        destination_id: 'dest-1',
        workspace_id: 'workspace-1',
      });
      expect(mockStats.counter).not.toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        expect.anything(),
        expect.anything(),
      );
    });

    it('when destinationRequest is missing entirely (framework contract broken), falls back to uniform-200', () => {
      const response = {
        message: 'success',
        errors: [{ type: 'oops', input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { eventsIndices: [0] })];

      const result = responseHandler({ destinationResponse, rudderJobMetadata });

      expect(result.response[0].statusCode).toBe(200);
      expect(mockStats.counter).not.toHaveBeenCalledWith(
        'braze_delivered_with_warning',
        expect.anything(),
        expect.anything(),
      );
    });
  });

  describe('partial failure — 2xx, message=success, errors present (296 correlation)', () => {
    it('emits 296 only for jobs whose destInfo indices intersect a warned events index; other jobs get 200', () => {
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: "'external_id' is required", input_array: 'events', index: 1 }],
      };
      const destinationResponse = { response, status: 200 };
      // Chunk contains 2 events at positions [0, 1]. Job 10 owns index 0
      // (clean), job 20 owns index 1 (warned).
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
        { statusCode: 296, metadata: rudderJobMetadata[1], error: "'external_id' is required" },
      ]);
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure', {
        destination_id: 'dest-1',
        workspace_id: 'workspace-1',
      });
      expect(mockStats.counter).toHaveBeenCalledWith('braze_delivered_with_warning', 1, {
        destination_id: 'dest-1',
        workspace_id: 'workspace-1',
      });
    });

    it('handles warnings across multiple input_arrays — events, attributes, and purchases', () => {
      const response = {
        message: 'success',
        errors: [
          { type: 'attributes error', input_array: 'attributes', index: 0 },
          { type: 'events error', input_array: 'events', index: 0 },
          { type: 'purchases error', input_array: 'purchases', index: 2 },
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

      // Jobs 10, 20, 30 each intersect a warned index → 296 with their
      // matching Braze error.type verbatim. Job 40 owns attributes[1] which
      // is not warned → 200.
      expect(result.response[0]).toEqual({
        statusCode: 296,
        metadata: rudderJobMetadata[0],
        error: 'attributes error',
      });
      expect(result.response[1]).toEqual({
        statusCode: 296,
        metadata: rudderJobMetadata[1],
        error: 'events error',
      });
      expect(result.response[2]).toEqual({
        statusCode: 296,
        metadata: rudderJobMetadata[2],
        error: 'purchases error',
      });
      expect(result.response[3]).toEqual({
        statusCode: 200,
        metadata: rudderJobMetadata[3],
        error: JSON.stringify(response),
      });
    });

    it('emits a single 296 (not multiple) when one job spans multiple warned indices; concatenates all matching error.type strings', () => {
      // Order-completed contributing 3 purchases; two of them get warned.
      // The job emits exactly ONE 296 entry whose `error` is a semicolon-
      // separated join of every matching Braze error.type verbatim (encounter
      // order across the job's declared indices, no deduplication).
      const response = {
        message: 'success',
        errors: [
          { type: 'first hit', input_array: 'purchases', index: 0 },
          { type: 'second hit', input_array: 'purchases', index: 2 },
        ],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { purchasesIndices: [0, 1, 2] })];
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response).toHaveLength(1);
      expect(result.response[0].statusCode).toBe(296);
      expect(result.response[0].error).toBe('first hit; second hit');
    });

    it('concatenates matches across events + attributes + purchases when a single job spans all three', () => {
      // Job 10 contributes to every track sub-array and each contribution is
      // warned. Verify the concatenation order: events → attributes → purchases.
      const response = {
        message: 'success',
        errors: [
          { type: 'events err', input_array: 'events', index: 0 },
          { type: 'attributes err', input_array: 'attributes', index: 0 },
          { type: 'purchases err', input_array: 'purchases', index: 0 },
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

      expect(result.response[0].statusCode).toBe(296);
      expect(result.response[0].error).toBe('events err; attributes err; purchases err');
    });

    it('does NOT deduplicate identical error.type strings across a job’s warned indices', () => {
      // Same error type on two purchase indices — both hits kept so the
      // downstream count remains informative.
      const response = {
        message: 'success',
        errors: [
          { type: "'external_id' is required", input_array: 'purchases', index: 0 },
          { type: "'external_id' is required", input_array: 'purchases', index: 1 },
        ],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10, { purchasesIndices: [0, 1] })];
      const destinationRequest = trackRequestFor(rudderJobMetadata);

      const result = responseHandler({
        destinationResponse,
        rudderJobMetadata,
        destinationRequest,
      });

      expect(result.response[0].statusCode).toBe(296);
      expect(result.response[0].error).toBe("'external_id' is required; 'external_id' is required");
    });

    it('preserves order and identity of rudderJobMetadata in the output response', () => {
      const response = {
        message: 'success',
        errors: [{ type: 'oops', input_array: 'events', index: 1 }],
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
      expect(result.response.map((r) => r.statusCode)).toEqual([200, 296, 200]);
    });

    it('when destInfo has malformed indices field (non-array), that field is ignored and no 296 is emitted for that job', () => {
      const response = {
        message: 'success',
        errors: [{ type: 'oops', input_array: 'events', index: 0 }],
      };
      const destinationResponse = { response, status: 200 };
      // Job 10's destInfo has a garbage `eventsIndices`; we must not throw
      // and must not falsely emit 296 for it. Job 20 with valid destInfo
      // still gets its 296.
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
      expect(result.response[1].statusCode).toBe(296);
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

    it('throws TransformerProxyError with per-job 400 entries for 2xx application failures', () => {
      const response = {
        message: "Valid data must be provided in the 'attributes' field.",
        errors: [{ type: "'external_id' is required", input_array: 'events', index: 0 }],
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
          expect(thrown.message).toContain('Request failed for braze with status: 400');
          expect(thrown.status).toBe(400);
          expect(thrown.response).toEqual([
            { statusCode: 400, metadata: createMetadata(10), error: JSON.stringify(response) },
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
