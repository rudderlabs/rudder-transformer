import { z } from 'zod';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';

// The token is checked per row so a blank value becomes the static credential
// error. A Zod minimum here would replace that message.
export const HubSpotAudienceDestinationConfigSchema = z
  .object({
    accessToken: z.unknown().optional(),
  })
  .passthrough();

export type HubSpotAudienceDestinationConfig = z.infer<
  typeof HubSpotAudienceDestinationConfigSchema
>;

// `audienceId` stays loose on purpose. Missing, blank, and unsafe ids are
// reported from the row, not by a schema error that would hide which case it was.
// `identifierMappings` is control-plane metadata; rudder-sources already resolves
// it into `message.identifiers`.
export const HubSpotAudienceConnectionConfigSchema = z
  .object({
    audienceId: z.unknown().optional(),
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
      destination: HubSpotAudienceConnectionConfigSchema.optional(),
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
