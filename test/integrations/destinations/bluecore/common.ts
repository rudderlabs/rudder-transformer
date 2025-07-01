import { Metadata, DestinationDefinition } from '../../../../src/types';

export const baseMetadata: Metadata = {
  sourceId: 'default-source',
  workspaceId: 'default-workspace',
  namespace: '',
  instanceId: 'default-instance',
  sourceType: '',
  sourceCategory: 'default-category',
  trackingPlanId: 'default-tracking-plan',
  trackingPlanVersion: 1,
  sourceTpConfig: {},
  mergedTpConfig: {},
  destinationId: '',
  jobRunId: 'default-job-run',
  jobId: 1,
  sourceBatchId: 'default-batch',
  sourceJobId: 'default-source-job',
  sourceJobRunId: 'default-source-job-run',
  sourceTaskId: 'default-task',
  sourceTaskRunId: 'default-task-run',
  recordId: {},
  destinationType: '',
  messageId: 'default-message-id',
  oauthAccessToken: 'default-token',
  messageIds: ['default-message-id'],
  rudderId: 'default-rudder-id',
  receivedAt: '2025-05-21T05:11:31.737Z',
  eventName: 'default-event',
  eventType: 'default-type',
  sourceDefinitionId: 'default-source-def',
  destinationDefinitionId: 'default-dest-def',
  transformationId: 'default-transform',
  dontBatch: false,
};

export const baseDestinationDefinition: DestinationDefinition = {
  ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
  Name: 'BLUECORE',
  DisplayName: 'Bluecore',
  Config: {
    cdkV2Enabled: true,
  },
};
