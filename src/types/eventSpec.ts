/**
 * Supported message types in the event specification
 */
export enum MessageType {
  IDENTIFY = 'identify',
  TRACK = 'track',
  PAGE = 'page',
  SCREEN = 'screen',
  GROUP = 'group',
  ALIAS = 'alias',
  AUDIENCE_LIST = 'audiencelist',
}

/**
 * Core event message structure following Rudder event spec
 */
export type RudderMessage = {
  userId?: string;
  anonymousId: string;
  type: MessageType;
  channel: string;
  context: object;
  originalTimestamp: Date;
  sentAt: Date;
  timestamp: Date;
  event?: string;
  integrations?: object;
  messageId: string;
  properties?: object;
  traits?: object;
};

/**
 * Metadata structure for messages
 */
export type Metadata = {
  sourceId: string;
  workspaceId: string;
  namespace: string;
  instanceId: string;
  sourceType: string;
  sourceCategory: string;
  trackingPlanId: string;
  trackingPlanVersion: number;
  sourceTpConfig: object;
  mergedTpConfig: object;
  destinationId: string;
  jobRunId: string;
  jobId: number;
  sourceBatchId: string;
  sourceJobId: string;
  sourceJobRunId: string;
  sourceTaskId: string;
  sourceTaskRunId: string;
  recordId: object;
  destinationType: string;
  messageId: string;
  oauthAccessToken: string;
  messageIds: string[];
  rudderId: string;
  receivedAt: string;
  eventName: string;
  eventType: string;
  sourceDefinitionId: string;
  destinationDefinitionId: string;
  transformationId: string;
  dontBatch?: boolean;
};

export type MessageIdMetadataMap = {
  [key: string]: Metadata;
};
