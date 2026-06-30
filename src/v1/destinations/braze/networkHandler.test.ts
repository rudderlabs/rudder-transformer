jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
  gauge: jest.fn(),
}));

import stats from '../../../util/stats';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import type { ProxyMetdata } from '../../../types';
import { responseHandler } from './networkHandler';

const createMetadata = (jobId: number): ProxyMetdata => ({
  jobId,
  attemptNum: 0,
  userId: '',
  sourceId: 'source-1',
  destinationId: 'dest-1',
  workspaceId: 'workspace-1',
  secret: {},
  dontBatch: false,
});

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

  describe('partial failure — 2xx, message=success, errors present', () => {
    it('increments braze_partial_failure stat and returns statusCode 200 per job', () => {
      const response = {
        message: 'success',
        events_processed: 1,
        errors: [{ type: "'external_id' is required", input_array: 'events', index: 1 }],
      };
      const destinationResponse = { response, status: 200 };
      const rudderJobMetadata = [createMetadata(10), createMetadata(20)];

      const result = responseHandler({ destinationResponse, rudderJobMetadata });

      expect(result).toEqual({
        status: 200,
        message: 'Request for braze Processed Successfully',
        response: [
          { statusCode: 200, metadata: createMetadata(10), error: JSON.stringify(response) },
          { statusCode: 200, metadata: createMetadata(20), error: JSON.stringify(response) },
        ],
      });
      expect(mockStats.increment).toHaveBeenCalledTimes(1);
      expect(mockStats.increment).toHaveBeenCalledWith('braze_partial_failure');
    });
  });

  describe('application-level error — 2xx, message!=success, errors present', () => {
    it('throws TransformerProxyError with per-job entries at the 2xx HTTP status', () => {
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
