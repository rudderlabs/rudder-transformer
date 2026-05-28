import { z } from 'zod';
import { EVENT_TYPES } from '../../util/recordUtils';
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

// ---------------------------------------------------------------------------
// Connection config (connection.config.destination)
// ---------------------------------------------------------------------------

// Identifier mapping uses the canonical `{ from, to }` shape:
//   `from` — the source column (warehouse column / record identifier key)
//   `to`   — the destination Iterable field (`email` or `userId`)
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
    action: z.enum([EVENT_TYPES.INSERT, EVENT_TYPES.UPDATE, EVENT_TYPES.DELETE]),
    identifiers: z.record(z.unknown()).optional(),
    fields: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const IterableAudienceRouterRequestSchema = z
  .object({
    message: RecordMessageSchema,
  })
  .passthrough();

// ---------------------------------------------------------------------------
// Subscriber + outbound payload shapes
// ---------------------------------------------------------------------------

// Iterable's list subscribe/unsubscribe accepts one identifier per subscriber.
// Modeled as a tagged union so call sites can never produce `{ email, userId }`.
export type IterableSubscriber = { email: string } | { userId: string };

// Per-event payload produced by `transformEvent`. Wrapping into the final
// request body happens later in `ChunkBatchStrategy.wrapBody`.
export type IterableAudiencePayload = {
  action: 'subscribe' | 'unsubscribe';
  subscriber: IterableSubscriber;
};
