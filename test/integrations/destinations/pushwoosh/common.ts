import type { Destination, Metadata } from '../../../../src/types';

export const appCode = 'ABCDE-12345';
export const apiToken = 'test-pushwoosh-api-token';

export const eventsEndpoint =
  'https://integration-segment.svc-nue.pushwoosh.com/integration-segment/v1/post-events';
export const setTagsEndpoint = 'https://api.pushwoosh.com/json/1.3/setTags';

export const eventsHeaders = {
  Authorization: `Token ${apiToken}`,
  'X-PW-Appcode': appCode,
  'Content-Type': 'application/json',
};
export const setTagsHeaders = {
  Authorization: `Token ${apiToken}`,
  'Content-Type': 'application/json',
};

export const destination: Destination = {
  ID: 'pushwoosh-dest-1',
  Name: 'PUSHWOOSH',
  DestinationDefinition: {
    ID: 'pushwoosh-def-1',
    Name: 'PUSHWOOSH',
    DisplayName: 'Pushwoosh',
    Config: {},
  },
  Config: { appCode, apiToken },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

export const metadata = (jobId: number): Metadata => ({
  jobId,
  attemptNum: 1,
  userId: `user-${jobId}`,
  sourceId: 'source-1',
  destinationId: 'pushwoosh-dest-1',
  workspaceId: 'ws-1',
  sourceType: 'android',
  sourceCategory: 'sdk',
  destinationType: 'PUSHWOOSH',
  messageId: `message-${jobId}`,
  secret: {},
  dontBatch: false,
});

export const timestamp = '2026-10-10T10:00:00.000Z';

export const pushwooshEvent = (userId: string, overrides: Record<string, unknown> = {}) => ({
  user_id: userId,
  device_id: '',
  device_platform: 'web',
  app_code: appCode,
  name: 'Purchase',
  timestamp,
  attributes: {},
  ...overrides,
});

export const setTagsBody = (userId: string, tags: Record<string, unknown>) => ({
  request: { application: appCode, userId, tags },
});

export const noApiTokenDestination: Destination = {
  ...destination,
  Config: { ...destination.Config, apiToken: '' },
};
