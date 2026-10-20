import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';
import { IDENTIFIERS, PINTEREST_ID_PATTERN, type OperationType, type RecordKey } from './config';

// OAuth: no secret lives on the destination config. The access token arrives on
// `metadata.secret.accessToken`, minted and refreshed against DESTINATION_PINTEREST_AUDIENCE_OAUTH.
// `adAccountId` is NOT a destination field (spec §4): it travels in the connection config.
const PinterestAudienceDestinationConfigSchema = z
  .object({
    rudderAccountId: z.string().min(1),
  })
  .passthrough();

const pinterestId = (field: string) =>
  z.string().regex(PINTEREST_ID_PATTERN, `${field} must be a numeric Pinterest id`);

// `to` is the identifier name, so `message.identifiers` already arrives keyed by it.
const IdentifierMappingSchema = z.object({
  from: z.string().min(1),
  to: z.enum(IDENTIFIERS),
});

const PinterestAudienceConnectionConfigSchema = z
  .object({
    adAccountId: pinterestId('adAccountId'),
    customerListId: pinterestId('customerListId'),
    audienceId: z.string().min(1),
    // false => the warehouse already holds 64-hex SHA-256 values and we pass them through.
    isHashRequired: z.boolean(),
    identifierMappings: z.array(IdentifierMappingSchema).optional(),
  })
  .passthrough();

export type PinterestAudienceConnectionConfig = z.infer<
  typeof PinterestAudienceConnectionConfigSchema
>;

const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const PinterestAudienceRouterRequestSchema = makeRouterInputSchema({
  destinationConfig: PinterestAudienceDestinationConfigSchema,
  message: RecordMessageSchema,
  connectionConfig: z
    .object({ destination: PinterestAudienceConnectionConfigSchema })
    .passthrough(),
});

export type PinterestAudienceRouterRequest = z.infer<typeof PinterestAudienceRouterRequestSchema>;

/**
 * The router-input schema passes `metadata` through unvalidated (`inputSchema.ts`), so it is
 * runtime-present but untyped. The token is checked in `transformEvent` so that a missing one
 * fails as an OAuthSecretError, not as a schema violation (same as reddit_audience).
 */
export type PinterestAudienceRouterInput = PinterestAudienceRouterRequest & {
  metadata?: { secret?: { accessToken?: string } };
};

/** One `CustomerListRecordRow`: named fields, so rows with different identifier sets can mix. */
export type PinterestRecordRow = Partial<Record<RecordKey, string>>;

/** Per-event payload; `operationType` is identical across a group (internalGroupKey). */
export type PinterestAudiencePayload = {
  operationType: OperationType;
  row: PinterestRecordRow;
};

/** The PATCH body assembled by the batch strategy; `RECORD_FORMAT` (config.ts) picks the shape. */
export type PinterestAudienceRequestBody =
  | { operation_type: OperationType; records_v2: PinterestRecordRow[] }
  | { operation_type: OperationType; records: string };
