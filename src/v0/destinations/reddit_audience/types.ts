import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { makeRouterInputSchema } from '../../../services/destination/nativeBatching/batchDestination';
import type { ActionType, RedditColumn } from './config';

// ---------------------------------------------------------------------------
// Destination config (Destination.Config)
// ---------------------------------------------------------------------------

// OAuth: no secret lives on the destination config. The access token arrives on
// `metadata.secret.accessToken`, minted and refreshed by the platform against
// the DESTINATION_REDDIT_AUDIENCE_OAUTH account definition.
// `adAccountId` is deliberately NOT declared here. It is discovery-only — the
// sync wizard uses it to list/create audiences via integrations-info, and it is
// optional on the destination (present only for the agentic/MCP path). The
// transform never reads it: the endpoint is keyed on `audienceId` alone. Making
// it required here rejected every record from a wizard-configured destination
// with `destination.Config.adAccountId: Required`, which the component tests
// missed because their fixtures happened to set it. `.passthrough()` still lets
// it flow through when present.
export const RedditAudienceDestinationConfigSchema = z
  .object({
    rudderAccountId: z.string().min(1),
  })
  .passthrough();

export type RedditAudienceDestinationConfig = z.infer<typeof RedditAudienceDestinationConfigSchema>;

// ---------------------------------------------------------------------------
// Connection config (connection.config.destination)
// ---------------------------------------------------------------------------

// `to` is the Reddit column name, so `message.identifiers` arrives already keyed
// by it. Kept in the schema to document the control-plane contract even though
// the transform reads the identifiers directly (same as iterable_audience).
const IdentifierMappingSchema = z.object({
  from: z.string().min(1),
  to: z.enum(['EMAIL_SHA256', 'MAID_SHA256']),
});

export type IdentifierMapping = z.infer<typeof IdentifierMappingSchema>;

export const RedditAudienceConnectionConfigSchema = z
  .object({
    // Reddit custom audience id — "ca." prefixed.
    audienceId: z.string().min(1),
    // false => the warehouse already holds 64-hex SHA-256 values and we pass
    // them through; true => we canonicalize and hash. `processAudienceRecord`
    // rejects the mismatch either way.
    isHashRequired: z.boolean(),
    identifierMappings: z.array(IdentifierMappingSchema).optional(),
  })
  .passthrough();

export type RedditAudienceConnectionConfig = z.infer<typeof RedditAudienceConnectionConfigSchema>;

// ---------------------------------------------------------------------------
// Router-transform request schema
// ---------------------------------------------------------------------------

const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z.record(z.unknown()).optional(),
    fields: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const RedditAudienceRouterRequestSchema = makeRouterInputSchema({
  destinationConfig: RedditAudienceDestinationConfigSchema,
  message: RecordMessageSchema,
  connectionConfig: z.object({ destination: RedditAudienceConnectionConfigSchema }).passthrough(),
});

/**
 * The framework's router-input schema validates `message` / `destination.Config` /
 * `connection.config` and deliberately passes the rest of the envelope through
 * unvalidated (`inputSchema.ts`), so `metadata` is runtime-present but not typed
 * by it — the same situation `google_adwords_enhanced_conversions` documents.
 *
 * The OAuth access token rides there, exactly as the event-stream Reddit
 * destination reads it (`cdk/v2/destinations/reddit/transformV3.ts`). It is
 * checked explicitly in `transformEvent` rather than schema-validated, so the
 * failure is an OAuthSecretError (a platform/credential problem) rather than a
 * generic schema violation.
 */
export type RedditAudienceRouterInput = z.infer<typeof RedditAudienceRouterRequestSchema> & {
  metadata?: { secret?: { accessToken?: string } };
};

// ---------------------------------------------------------------------------
// Outbound payload
// ---------------------------------------------------------------------------

/**
 * Per-event payload. Reddit's request body is a positional matrix — one
 * `column_order` for the whole request and rows aligned to it — so the
 * group-invariant fields travel on every item and `wrapBody` reads them off
 * the first. Grouping (see routerTransform) guarantees they are identical
 * across a batch.
 */
export type RedditAudiencePayload = {
  actionType: ActionType;
  columnOrder: RedditColumn[];
  row: string[];
};

/** The final request body assembled by the batch strategy. */
export type RedditAudienceRequestBody = {
  data: {
    action_type: ActionType;
    column_order: RedditColumn[];
    user_data: string[][];
  };
};
