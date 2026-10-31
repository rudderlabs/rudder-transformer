import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';
import { DATA_CENTERS, REASONS, type TagOperation } from './config';

/** Flattened account: apiKey (secret), dataCenter and tagGroup (options). */
const DestinationConfigSchema = z
  .object({
    apiKey: z.string().trim().min(1, REASONS.missingApiKey),
    dataCenter: z.enum(DATA_CENTERS),
    tagGroup: z.string().trim().min(1, REASONS.missingTagGroup),
  })
  .passthrough();

/** Written by integrations-info /setup; a 129-character tag is refused by Airship (400 40006, P4). */
const ConnectionConfigSchema = z
  .object({
    tagName: z.string().min(1).max(128),
  })
  .passthrough();

// named_user_id is `unknown` here on purpose: routerTransform.normalizeNamedUserId owns its messages.
const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const AirshipAudienceRouterRequestSchema = makeRouterInputSchema({
  destinationConfig: DestinationConfigSchema,
  message: RecordMessageSchema,
  connectionConfig: z.object({ destination: ConnectionConfigSchema }).passthrough(),
});

export type AirshipAudienceRouterRequest = z.infer<typeof AirshipAudienceRouterRequestSchema>;

/** One row; a chunk of rows sharing operation, group and tag becomes one request body. */
export type AirshipAudiencePayload = {
  named_user_id: string;
  action: TagOperation;
  tagGroup: string;
  tagName: string;
};
