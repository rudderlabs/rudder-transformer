import { z } from 'zod';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';

export const HubSpotAudienceDestinationConfigSchema = z
  .object({
    accessToken: z.string().min(1),
  })
  .passthrough();

export type HubSpotAudienceDestinationConfig = z.infer<
  typeof HubSpotAudienceDestinationConfigSchema
>;

// `identifierMappings` is control-plane metadata; rudder-sources already resolves
// it into `message.identifiers`.
export const HubSpotAudienceConnectionConfigSchema = z
  .object({
    audienceId: z.string().min(1),
    identifierMappings: z.unknown().optional(),
  })
  .passthrough();

export type HubSpotAudienceConnectionConfig = z.infer<typeof HubSpotAudienceConnectionConfigSchema>;

const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.unknown().optional(),
    identifiers: z.unknown().optional(),
  })
  .passthrough();

export const HubSpotAudienceRouterRequestSchema = makeRouterInputSchema({
  destinationConfig: HubSpotAudienceDestinationConfigSchema,
  message: RecordMessageSchema,
  connectionConfig: z
    .object({
      destination: HubSpotAudienceConnectionConfigSchema,
    })
    .passthrough(),
});

export type MembershipOperation = 'add' | 'remove';

// One source job. `ChunkBatchStrategy.wrapBody` later folds these into the
// add-only or remove-only membership body.
export type HubSpotAudiencePayload = {
  operation: MembershipOperation;
  recordId: string;
};
