import { z } from 'zod';
import type {
  Connection,
  Destination,
  Metadata,
  RouterTransformationRequestData,
  DestinationConnectionConfig,
} from '../../../types';

export const LinkedinAudienceMessageSchema = z
  .object({
    type: z.string().optional(),
    action: z.string().optional(),
    fields: z.record(z.string()).optional(),
    identifiers: z.record(z.string()).optional(),
  })
  .passthrough();
export type LinkedinAudienceMessage = z.infer<typeof LinkedinAudienceMessageSchema>;

export type LinkedinAudienceMetadata = Metadata & {
  secret?: {
    accessToken?: string;
  };
};

export const LinkedinAudienceConnectionConfigSchema = z
  .object({
    audienceId: z.string().optional(),
    audienceType: z.string().optional(),
    isHashRequired: z.boolean(),
  })
  .passthrough();
export type LinkedinAudienceConnectionConfig = z.infer<
  typeof LinkedinAudienceConnectionConfigSchema
>;
export type LinkedinAudienceConnection = Connection<
  DestinationConnectionConfig<LinkedinAudienceConnectionConfig>
>;

export type LinkedinAudienceConfigs = {
  audienceType: string;
  audienceId: string;
  accessToken: string;
  isHashRequired: boolean;
};

export type LinkedinAudienceRequest = RouterTransformationRequestData<
  LinkedinAudienceMessage,
  Destination,
  LinkedinAudienceConnection,
  LinkedinAudienceMetadata
>;
