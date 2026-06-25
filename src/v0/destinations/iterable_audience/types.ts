import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { PROJECT_TYPES } from './config';

// ---------------------------------------------------------------------------
// Account-level destination config (Destination.Config)
// ---------------------------------------------------------------------------

export const IterableAccountConfigSchema = z
  .object({
    apiKey: z.string().min(1),
    dataCenter: z.enum(['US', 'EU']),
    projectType: z.enum([
      PROJECT_TYPES.EMAIL_BASED,
      PROJECT_TYPES.HYBRID,
      PROJECT_TYPES.USERID_BASED,
    ]),
  })
  .passthrough();

export type IterableAccountConfig = z.infer<typeof IterableAccountConfigSchema>;

// Aliased as `IterableDestinationConfig` to match the `<Dest>DestinationConfig`
// convention used by the other audience destinations.
export const IterableDestinationConfigSchema = IterableAccountConfigSchema;

export type IterableDestinationConfig = z.infer<typeof IterableDestinationConfigSchema>;

// ---------------------------------------------------------------------------
// Connection config (connection.config.destination)
// ---------------------------------------------------------------------------

// Identifier mapping uses the canonical `{ from, to }` shape:
//   `from` — the source column (warehouse column / record identifier key)
//   `to`   — the destination Iterable field (`email` or `userId`)
// The control plane always sends this. rudder-sources resolves the mappings
// before emitting the record, so `message.identifiers` already arrives keyed by
// the destination field — this destination reads `email`/`userId` directly and
// does not consult the mapping at transform time. It stays in the schema to
// document the connection contract.
const IdentifierMappingSchema = z.object({
  from: z.string().min(1),
  to: z.enum(['email', 'userId']),
});

export type IdentifierMapping = z.infer<typeof IdentifierMappingSchema>;

export const IterableConnectionConfigSchema = z
  .object({
    audienceId: z.union([z.string(), z.number()]),
    identifierMappings: z.array(IdentifierMappingSchema),
    // Forwarded into the subscribe request body. Iterable defaults to false
    // when omitted, so we only include it when explicitly set on the
    // connection. Only respected for userID-based and hybrid projects.
    updateExistingUsersOnly: z.boolean().optional(),
  })
  .passthrough();

export type IterableConnectionConfig = z.infer<typeof IterableConnectionConfigSchema>;

// ---------------------------------------------------------------------------
// Router-transform request schema (consumed by `getInputSchema()`)
// ---------------------------------------------------------------------------

const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z.record(z.unknown()).optional(),
    fields: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const IterableAudienceRouterRequestSchema = z
  .object({
    message: RecordMessageSchema,
    destination: z.object({ Config: IterableDestinationConfigSchema }).passthrough(),
    connection: z
      .object({
        config: z.object({ destination: IterableConnectionConfigSchema }).passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

// ---------------------------------------------------------------------------
// Subscriber + outbound payload shapes
// ---------------------------------------------------------------------------

// A subscriber carries at least one identifier. Hybrid projects send BOTH
// `email` and `userId` when a row has both (gives Iterable both keys to match
// on); single-identifier projects send only their configured field.
export type IterableSubscriber =
  | { email: string; userId?: string }
  | { email?: string; userId: string };

// Per-event payload produced by `transformEvent`. Wrapping into the final
// request body happens later in `ChunkBatchStrategy.wrapBody`.
export type IterableAudiencePayload = {
  action: 'subscribe' | 'unsubscribe';
  subscriber: IterableSubscriber;
};
