import { z } from 'zod';
import {
  Connection,
  Destination,
  DestinationConnectionConfig,
  Metadata,
  RouterTransformationRequestData,
  RudderRecordV2Schema,
} from '../../../types';
import {
  BatchedRequest,
  BatchedRequestBody,
  BatchRequestOutput,
} from '../../../types/destinationTransformation';

export const IterableAudienceDestinationConfigSchema = z
  .object({
    apiKey: z.string(),
    dataCenter: z.enum(['USDC', 'EUDC']).default('USDC'),
  })
  .passthrough();

export const IterableAudienceConnectionConfigSchema = z
  .object({
    audienceId: z.union([z.string().nonempty(), z.number()]),
    syncMode: z.enum(['upsert', 'mirror']),
    projectType: z.enum(['email', 'hybrid', 'userId']),
    identifierMappings: z.array(z.object({ from: z.string(), to: z.enum(['email', 'userId']) })).nonempty(),
  })
  .passthrough();

export const IterableAudienceMessageSchema = RudderRecordV2Schema.extend({
  identifiers: z.record(z.string().min(1), z.union([z.string(), z.number()])).optional().default({}),
});

export type IterableAudienceDestinationConfig = z.infer<typeof IterableAudienceDestinationConfigSchema>;
export type IterableAudienceConnectionConfig = z.infer<typeof IterableAudienceConnectionConfigSchema>;
export type IterableAudienceMessage = z.infer<typeof IterableAudienceMessageSchema>;

export type IterableAudienceDestination = Destination<IterableAudienceDestinationConfig>;
export type IterableAudienceConnection = Connection<
  DestinationConnectionConfig<IterableAudienceConnectionConfig>
>;

export type IterableAudienceRouterRequest = RouterTransformationRequestData<
  IterableAudienceMessage,
  IterableAudienceDestination,
  IterableAudienceConnection
>;

export type IterableSubscriber = {
  email?: string;
  userId?: string;
};

export type IterableAudiencePayload = {
  listId: string | number;
  subscribers: IterableSubscriber[];
  campaignId?: null;
  channelUnsubscribe?: boolean;
};

export type IterableAudienceBatchResponse = BatchRequestOutput<
  IterableAudiencePayload,
  Record<string, string>,
  Record<string, string>
>;

export type IterableAudienceBatchedRequest = BatchedRequest<
  IterableAudiencePayload,
  Record<string, string>,
  Record<string, string>
>;

export type IterableAudienceBatchedRequestBody = BatchedRequestBody<IterableAudiencePayload>;

export type RespList = {
  payload: IterableSubscriber;
  metadata: Partial<Metadata>;
};
