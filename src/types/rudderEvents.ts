import { z } from 'zod';

/**
 * Supported message types in the event specification
 */
export const MessageTypeSchema = z.enum([
  'identify',
  'track',
  'page',
  'screen',
  'group',
  'alias',
  'record',
  'audiencelist',
]);

export type MessageType = z.infer<typeof MessageTypeSchema>;

/**
 * Core event message structure following Rudder event spec
 */

export const RudderMessageSchema = z
  .object({
    userId: z.string().optional(),
    anonymousId: z.string().optional(),
    type: MessageTypeSchema,
    channel: z.string().optional(),
    context: z.object({}).optional(),
    originalTimestamp: z.string().optional(),
    sentAt: z.string().optional(),
    timestamp: z.string().optional(),
    event: z.string().optional(),
    integrations: z.object({}).optional(),
    messageId: z.string().optional(),
    properties: z.object({}).optional(),
    traits: z.object({}).optional(),
    statusCode: z.number().optional(),
    rudderId: z.string().optional(),
  })
  .passthrough();

export type RudderMessage = z.infer<typeof RudderMessageSchema>;

export const RudderRecordV1Schema = z.object({
  type: z.literal('record'),
});

export type RudderRecordV1 = z.infer<typeof RudderRecordV1Schema>;

/**
 * Enum for record actions
 */
export enum RecordAction {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const RudderRecordV2Schema = RudderMessageSchema.extend({
  type: z.literal('record'),
  action: z.nativeEnum(RecordAction),
  fields: z.record(z.string(), z.any()).optional(),
  identifiers: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  recordId: z.string().optional(),
  context: z
    .object({
      sources: z
        .object({
          job_id: z.string(),
          version: z.string(),
          job_run_id: z.string(),
          task_run_id: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export type RudderRecordV2 = z.infer<typeof RudderRecordV2Schema>;

/**
 * Metadata structure for messages
 */
export const MetadataSchema = z
  .object({
    sourceId: z.string(),
    workspaceId: z.string(),
    namespace: z.string().optional(),
    instanceId: z.string().optional(),
    sourceType: z.string(),
    sourceCategory: z.string(),
    trackingPlanId: z.string().optional(),
    trackingPlanVersion: z.number().optional(),
    sourceTpConfig: z.object({}).optional(),
    mergedTpConfig: z.object({}).optional(),
    destinationId: z.string(),
    jobRunId: z.string().optional(),
    jobId: z.number(),
    sourceBatchId: z.string().optional(),
    sourceJobId: z.string().optional(),
    sourceJobRunId: z.string().optional(),
    sourceTaskId: z.string().optional(),
    sourceTaskRunId: z.string().optional(),
    recordId: z.object({}).optional(),
    destinationType: z.string(),
    messageId: z.string(),
    oauthAccessToken: z.string().optional(),
    messageIds: z.array(z.string()).optional(),
    rudderId: z.string().optional(),
    receivedAt: z.string().optional(),
    eventName: z.string().optional(),
    eventType: z.string().optional(),
    sourceDefinitionId: z.string().optional(),
    destinationDefinitionId: z.string().optional(),
    transformationId: z.string().optional(),
    dontBatch: z.boolean().optional(),
  })
  .passthrough();

export type Metadata = z.infer<typeof MetadataSchema>;

export type MessageIdMetadataMap = Record<string, Partial<Metadata>>;
