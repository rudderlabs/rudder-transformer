import { z } from 'zod';

/**
 * Supported message types in the event specification
 */
export const MessageType = z.enum([
  'identify',
  'track',
  'page',
  'screen',
  'group',
  'alias',
  'record',
  'audiencelist',
]);

/**
 * Core event message structure following Rudder event spec
 */

export const RudderMessageSchema = z.object({
  userId: z.string().optional(),
  anonymousId: z.string(),
  type: MessageType,
  channel: z.string(),
  context: z.object({}),
  originalTimestamp: z.date(),
  sentAt: z.date(),
  timestamp: z.date(),
  event: z.string().optional(),
  integrations: z.object({}).optional(),
  messageId: z.string(),
  properties: z.object({}).optional(),
  traits: z.object({}).optional(),
});

export type RudderMessage = z.infer<typeof RudderMessageSchema>;

export const RudderRecordV1Schema = z.object({
  type: z.literal('record'),
  
});

export type RudderRecordV1 = z.infer<typeof RudderRecordV1Schema>;

/**
 * Metadata structure for messages
 */
export const MetadataSchema = z.object({
  sourceId: z.string(),
  workspaceId: z.string(),
  namespace: z.string(),
  instanceId: z.string(),
  sourceType: z.string(),
  sourceCategory: z.string(),
  trackingPlanId: z.string(),
  trackingPlanVersion: z.number(),
  sourceTpConfig: z.object({}),
  mergedTpConfig: z.object({}),
  destinationId: z.string(),
  jobRunId: z.string(),
  jobId: z.number(),
  sourceBatchId: z.string(),
  sourceJobId: z.string(),
  sourceJobRunId: z.string(),
  sourceTaskId: z.string(),
  sourceTaskRunId: z.string(),
  recordId: z.object({}),
  destinationType: z.string(),
  messageId: z.string(),
  oauthAccessToken: z.string(),
  messageIds: z.array(z.string()),
  rudderId: z.string(),
  receivedAt: z.string(),
  eventName: z.string(),
  eventType: z.string(),
  sourceDefinitionId: z.string(),
  destinationDefinitionId: z.string(),
  transformationId: z.string(),
  dontBatch: z.boolean().optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;

export type MessageIdMetadataMap = Record<string, Metadata>;
