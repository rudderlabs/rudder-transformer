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
  const sha256HashedValue = 'b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576ca48e1cb0d7d6267'; // sha256 of 'test'
  const md5HashedValue = '098f6bcd4621d373cade4e832627b4f6'; // md5 of 'test'
  const plaintextEmail = 'user@example.com';
  const mockStatsIncrement = stats.increment as jest.Mock;

  beforeEach(() => {
    mockStatsIncrement.mockClear();
  });

  it('Hashing ON + pre-hashed value → emits metric and returns failed response', () => {
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: sha256HashedValue,
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

  it('Hashing OFF + plaintext value → emits metric and returns failed response', () => {
    const event = buildBaseEvent(
      {
        identifiers: {
          EMAIL_SHA256: plaintextEmail,
        },
      },
      false,
    );

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);

    expect(failedResponses).toHaveLength(1);
    expect(successfulResponses).toHaveLength(0);
    expect(failedResponses[0].error).toContain(
      'Hashing is disabled but the value for field EMAIL_SHA256 appears to be unhashed. Either enable hashing or send pre-hashed data.',
    );
    expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
      propertyName: 'EMAIL_SHA256',
      type: 'unhashed_when_hash_disabled',
      workspaceId: TEST_WORKSPACE_ID,
      destinationId: TEST_DESTINATION_ID,
      destType: 'tiktok_audience',
    });
  });

  it('Hashing OFF + 64-char hex value → no error, one successful response', () => {
    const event = buildBaseEvent(
      {
        identifiers: {
          EMAIL_SHA256: sha256HashedValue,
        },
      },
      false,
    );

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
    expect(mockStatsIncrement).not.toHaveBeenCalled();
  });

  it('Hashing OFF + pre-hashed identifiers across SHA256/MD5 fields → no error', () => {
    const event = buildBaseEvent(
      {
        identifiers: {
          IDFA_SHA256: sha256HashedValue,
          AAID_SHA256: sha256HashedValue,
          IDFA_MD5: md5HashedValue,
          AAID_MD5: md5HashedValue,
          EMAIL_SHA256: sha256HashedValue,
        },
      },
      false,
    );

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
  });
});

describe('processTiktokAudienceRecords tiktok_audience record edge cases', () => {
  const mockStatsIncrement = stats.increment as jest.Mock;

  beforeEach(() => {
    mockStatsIncrement.mockClear();
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

  it('Invalid email → increments metric and returns failed response', () => {
    const event = buildBaseEvent({
      identifiers: {
        EMAIL_SHA256: ' Not-An-Email ',
      },
    });

    const { failedResponses, successfulResponses } = processTiktokAudienceRecords([event]);
    expect(successfulResponses).toHaveLength(0);
    expect(failedResponses).toHaveLength(1);
    expect(failedResponses[0].error).toContain('No identifiers found');
    expect(mockStatsIncrement).toHaveBeenCalledWith('tiktok_audience_invalid_email', {
      workspaceId: TEST_WORKSPACE_ID,
      destinationId: TEST_DESTINATION_ID,
    });
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
