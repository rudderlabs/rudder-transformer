jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
  counter: jest.fn(),
  gauge: jest.fn(),
}));

import stats from '../../../util/stats';
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

const destinationRequest = {
  body: {
    JSON: {
      attributes: [{ external_id: 'u0' }, { external_id: 'u1' }, { external_id: 'u2' }],
    },
  },
};

describe('BRAZE_AUDIENCE networkHandler responseHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps indexed EXTERNAL_USER_ID_TOO_LARGE to aborted 400', () => {
    const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: {
          message: 'success',
          errors: [{ type: 'EXTERNAL_USER_ID_TOO_LARGE', index: 1 }],
        },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400, 200]);
    expect(result.response[1].error).toBe('EXTERNAL_USER_ID_TOO_LARGE');
    expect(mockStats.increment).toHaveBeenCalledWith('braze_audience_aborted', {
      destinationId: 'dest-1',
      workspaceId: 'workspace-1',
    });
  });

  it('maps live Braze human external_id length message to aborted 400', () => {
    const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: {
          message: 'success',
          errors: [{ type: "'external_id' must be fewer than 988 bytes", index: 1 }],
        },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400, 200]);
  });

  it('maps BLACKLISTED_EXTERNAL_USER_ID to aborted 400', () => {
    const rudderJobMetadata = [createMetadata(1)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: {
          message: 'success',
          errors: [{ type: 'BLACKLISTED_EXTERNAL_USER_ID', index: 0 }],
        },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response[0].statusCode).toBe(400);
  });

  it('marks unknown indexed error types retryable (not aborted)', () => {
    const rudderJobMetadata = [createMetadata(1), createMetadata(2)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: {
          message: 'success',
          errors: [{ type: 'SOME_TRANSIENT_ATTR_ERROR', index: 0 }],
        },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response.map((r) => r.statusCode)).toEqual([500, 200]);
    expect(mockStats.increment).toHaveBeenCalledWith('braze_audience_retryable', {
      destinationId: 'dest-1',
      workspaceId: 'workspace-1',
      reason: 'partial',
    });
  });

  it('does not abort when type looks like legacy regex but is not an allowlisted enum', () => {
    // Old regex matched /external_id|user.?not.?found/i — must not abort now.
    const rudderJobMetadata = [createMetadata(1)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: {
          message: 'success',
          errors: [{ type: 'user not found for external_id', index: 0 }],
        },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response[0].statusCode).toBe(500);
  });

  it('marks all unmapped jobs retryable when Braze returns an unindexed error', () => {
    const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: {
          message: 'success',
          errors: [{ type: 'UNINDEXED_FAILURE' }],
        },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500, 500]);
    expect(result.response[0].error).toBe('UNINDEXED_FAILURE');
    expect(mockStats.increment).toHaveBeenCalledWith('braze_audience_retryable', {
      destinationId: 'dest-1',
      workspaceId: 'workspace-1',
      reason: 'partial_unindexed',
    });
  });

  it('keeps indexed aborted and marks remaining jobs retryable when mix includes unindexed', () => {
    const rudderJobMetadata = [createMetadata(10), createMetadata(20), createMetadata(30)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: {
          message: 'success',
          errors: [{ type: 'EXTERNAL_USER_ID_TOO_LARGE', index: 0 }, { type: 'ORPHAN_ERROR' }],
        },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response.map((r) => r.statusCode)).toEqual([400, 500, 500]);
  });

  it('returns success for all jobs when 2xx with empty errors', () => {
    const rudderJobMetadata = [createMetadata(1), createMetadata(2)];
    const result = responseHandler({
      destinationResponse: {
        status: 201,
        response: { message: 'success', errors: [] },
      },
      rudderJobMetadata,
      destinationRequest,
    });

    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });
});
