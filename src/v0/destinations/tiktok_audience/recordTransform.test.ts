import { processTiktokAudienceRecords } from './recordTransform';
import stats from '../../../util/stats';
import type { TiktokAudienceRecordRequest } from './recordTypes';
import sha256 from 'sha256';
import md5 from 'md5';
import { RouterTransformationResponse } from '../../../types';

jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

const TEST_WORKSPACE_ID = 'ws-1';
const TEST_DESTINATION_ID = 'dest-1';

const buildBaseEvent = (
  overrides: Partial<TiktokAudienceRecordRequest['message']> = {},
  isHashRequired = true,
): TiktokAudienceRecordRequest => {
  const message: TiktokAudienceRecordRequest['message'] = {
    type: 'record',
    action: 'insert',
    userId: 'user-1',
    identifiers: {
      EMAIL_SHA256: 'user@example.com',
    },
    fields: {},
    ...overrides,
  };

  return {
    message,
    destination: {
      ID: TEST_DESTINATION_ID,
      Config: {
        advertiserId: 'dummyAdverTiserID',
      },
    },
    connection: {
      config: {
        destination: {
          schemaVersion: '1.1',
          isHashRequired,
          audienceId: '23856594064540489',
        },
      },
    },
    metadata: {
      workspaceId: TEST_WORKSPACE_ID,
      secret: {
        accessToken: 'dummyAccessToken',
      },
    },
  };
};

describe('processTiktokAudienceRecords hashing validation for tiktok_audience', () => {
  const hashedValue = 'b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576ca48e1cb0d7d6267'; // sha256 of 'test'
  const plaintextEmail = 'user@example.com';
  const mockStatsIncrement = stats.increment as jest.Mock;

  beforeEach(() => {
    mockStatsIncrement.mockClear();
  });

  afterEach(() => {
    delete process.env.AUDIENCE_HASHING_VALIDATION_ENABLED;
    delete process.env.TIKTOK_AUDIENCE_REJECT_INVALID_FIELDS;
  });

  it('Hashing ON + pre-hashed value → emits metric and returns failed response when validation enabled', () => {
    process.env.AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: hashedValue,
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);

    expect(successfulResponses).toHaveLength(0);
    expect(failedResponses).toHaveLength(1);
    expect(failedResponses[0].error).toContain(
      'Hashing is enabled but the value for field EMAIL_SHA256 appears to already be hashed. Either disable hashing or send unhashed data.',
    );
    expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
      propertyName: 'EMAIL_SHA256',
      type: 'hashed_when_hash_enabled',
      workspaceId: TEST_WORKSPACE_ID,
      destinationId: TEST_DESTINATION_ID,
      destType: 'tiktok_audience',
    });
  });

  it('Hashing ON + plaintext value → no error, no metric, one successful response', () => {
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: plaintextEmail,
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);

    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
    expect(mockStatsIncrement).not.toHaveBeenCalled();
  });

  it('Hashing OFF + plaintext value → emits metric and returns failed response when validation enabled', () => {
    process.env.AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
    const event = buildBaseEvent(
      {
        identifiers: {
          EMAIL_SHA256: hashedValue,
        },
      },
      false,
    );

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);

    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
  });

  it('Hashing OFF + 64-char hex value → no error, one successful response', () => {
    const event = buildBaseEvent(
      {
        identifiers: {
          EMAIL_SHA256: hashedValue,
        },
      },
      false,
    );

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);

    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
  });

  it('Validation disabled (default) + hashing ON + pre-hashed value → emits metric but no failed responses', () => {
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: hashedValue,
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);

    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
    expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
      propertyName: 'EMAIL_SHA256',
      type: 'hashed_when_hash_enabled',
      workspaceId: TEST_WORKSPACE_ID,
      destinationId: TEST_DESTINATION_ID,
      destType: 'tiktok_audience',
    });
  });

  it('Validation disabled (default) + hashing ON + plaintext value → emits metric but no failed responses', () => {
    const event = buildBaseEvent(
      {
        identifiers: {
          EMAIL_SHA256: plaintextEmail,
        },
      },
      false,
    );

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
    expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
      propertyName: 'EMAIL_SHA256',
      type: 'unhashed_when_hash_disabled',
      workspaceId: TEST_WORKSPACE_ID,
      destinationId: TEST_DESTINATION_ID,
      destType: 'tiktok_audience',
    });
  });
});

describe('processTiktokAudienceRecords tiktok_audience record edge cases', () => {
  const mockStatsIncrement = stats.increment as jest.Mock;

  beforeEach(() => {
    mockStatsIncrement.mockClear();
  });

  afterEach(() => {
    delete process.env.TIKTOK_AUDIENCE_REJECT_INVALID_FIELDS;
    delete process.env.AUDIENCE_HASHING_VALIDATION_ENABLED;
  });

  it('Unknown identifier key → returns failed response with invalid trait error', () => {
    const event = buildBaseEvent({
      identifiers: {
        PHONE_NUMBER: '1234567890',
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(successfulResponses).toHaveLength(0);
    expect(failedResponses).toHaveLength(1);
    expect(failedResponses[0].error).toContain(
      'Invalid identifier key PHONE_NUMBER for TikTok Audience.',
    );
  });

  it('All identifiers null/empty → returns failed response "No identifiers found"', () => {
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: null,
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(successfulResponses).toHaveLength(0);
    expect(failedResponses).toHaveLength(1);
    expect(failedResponses[0].error).toContain('No identifiers found, aborting event.');
  });

  it('Invalid email + reject disabled (default) → increments metric and hashes normalized value', () => {
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: ' Not-An-Email ',
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
    expect(successfulResponses[0]).toBeDefined();

    expect(mockStatsIncrement).toHaveBeenCalledWith('tiktok_audience_invalid_email', {
      workspaceId: TEST_WORKSPACE_ID,
      destinationId: TEST_DESTINATION_ID,
    });

    const output = (
      successfulResponses[0] as unknown as {
        batchedRequest: { body: { JSON: { batch_data: { id: string }[] } } };
      }
    ).batchedRequest;
    const id = output.body.JSON.batch_data[0][0].id;
    expect(id).toBe(sha256('not-an-email'));
  });

  it('Invalid email + reject enabled → returns failed response', () => {
    process.env.TIKTOK_AUDIENCE_REJECT_INVALID_FIELDS = 'true';
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: ' Not-An-Email ',
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(successfulResponses).toHaveLength(0);
    expect(failedResponses).toHaveLength(1);
    expect(failedResponses[0].error).toContain('No identifiers found');
  });

  it('MD5 traits are trimmed/lowercased before hashing when hashing enabled', () => {
    const event = buildBaseEvent({
      identifiers: {
        AAID_MD5: '  ABCDEF  ',
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);

    const output = (
      successfulResponses[0] as unknown as {
        batchedRequest: { body: { JSON: { batch_data: { id: string }[] } } };
      }
    ).batchedRequest;
    const id = output.body.JSON.batch_data[0][0].id;
    expect(id).toBe(md5('abcdef'));
  });
});
