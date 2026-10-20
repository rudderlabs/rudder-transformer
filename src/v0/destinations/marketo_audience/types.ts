import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';

// The integrations-config account pattern `^[0-9A-Za-z]{3}-[0-9A-Za-z]{3}-[0-9A-Za-z]{3}$`. The
// Munchkin ID becomes the API host, and the token request sends the client secret there, so a
// free-form value could redirect it.
const MUNCHKIN_ID = /^(?:[\dA-Za-z]{3}-){2}[\dA-Za-z]{3}$/;

// Resolved from the DESTINATION_MARKETO_AUDIENCE_API_KEY account onto destination.Config.
const MarketoAudienceDestinationConfigSchema = z
  .object({
    accountId: z.string().regex(MUNCHKIN_ID, 'Marketo Munchkin ID must look like 123-ABC-456'),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
  })
  .passthrough();

// `audienceId` stays loose: utils.readListId reports a missing or non-numeric list per row.
const MarketoAudienceConnectionConfigSchema = z
  .object({
    destination: z.object({ audienceId: z.unknown().optional() }).passthrough().optional(),
  })
  .passthrough();

// `identifiers` stays loose: utils.resolveIdentifier owns their messages.
const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const MarketoAudienceRouterRequestSchema = makeRouterInputSchema({
  destinationConfig: MarketoAudienceDestinationConfigSchema,
  message: RecordMessageSchema,
  connectionConfig: MarketoAudienceConnectionConfigSchema,
});

export type MarketoAudienceRouterRequest = z.infer<typeof MarketoAudienceRouterRequestSchema>;

// One job's item in the membership body `{ "input": [{ "id": 101 }, ...] }`.
export type MarketoAudiencePayload = { id: number };
