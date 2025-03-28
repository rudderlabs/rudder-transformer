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
export const RudderMessageSchema = <T extends z.ZodTypeAny>(integrationsSchema: T) =>
  z
    .object({
      userId: z.string().optional(),
      anonymousId: z.string().optional(),
      type: MessageTypeSchema,
      channel: z.string().optional(),
      context: z.record(z.string(), z.any()).optional(),
      originalTimestamp: z.string().optional(),
      sentAt: z.string().optional(),
      timestamp: z.string().optional(),
      event: z.string().optional(),
      integrations: integrationsSchema.optional(),
      messageId: z.string().optional(),
      properties: z.record(z.string(), z.any()).optional(),
      traits: z.record(z.string(), z.any()).optional(),
      statusCode: z.number().optional(),
    })
    .passthrough();

export type RudderMessage<T = Record<string, any>> = z.infer<
  ReturnType<typeof RudderMessageSchema<z.ZodType<T>>>
>;

export const RudderRecordV1Schema = z.object({
  type: z.literal('record'),
});

export type RudderRecordV1 = z.infer<typeof RudderRecordV1Schema>;

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

export type RequestMetadata = {
  namespace: string;
  cluster: string;
  features: Record<string, unknown>;
};
