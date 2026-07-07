import { z } from 'zod';
import { makeRouterInputSchema } from '../../../../services/destination/nativeBatching/batchDestination';
import { RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIODestinationConfigSchema, CustomerIOConnectionConfigSchema } from '../types';

export type CustomerIOV2Identifiers = {
  id?: string;
  email?: string;
  cio_id?: string;
  anonymous_id?: string;
  object_id?: unknown;
  object_type_id?: unknown;
};

export type CustomerIOV2Device = {
  token?: unknown;
  platform?: string;
  last_used?: number;
  attributes?: Record<string, unknown>;
};

export type CustomerIOV2Payload = {
  type: 'person' | 'object' | 'delivery';
  action: string;
  identifiers?: CustomerIOV2Identifiers;
  attributes?: Record<string, unknown>;
  name?: string;
  timestamp?: number;
  cio_relationships?: { identifiers: Record<string, unknown> }[];
  device?: CustomerIOV2Device;
  primary?: { id?: string; email?: string };
  secondary?: { id?: string; email?: string };
  anonymous_id?: string;
  [key: string]: unknown;
};

const emailTraitSchema = z.object({ email: z.unknown() }).passthrough().nullish();

const recordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.enum(['insert', 'update', 'delete']),
    identifiers: z.record(z.string(), z.unknown()),
  })
  .passthrough()
  .refine(
    (msg) =>
      RECORD_IDENTIFIER_KEYS.some(
        (key) => typeof msg.identifiers?.[key] === 'string' && msg.identifiers[key].length > 0,
      ),
    { message: 'A non-empty `id` or `email` identifier is required' },
  );

export type CustomerIOV2RecordMessage = z.infer<typeof recordMessageSchema>;

const eventStreamMessageSchema = z
  .object({
    type: z.enum(['identify', 'track', 'page', 'screen', 'alias', 'group']),
    userId: z.string().nullish(),
    anonymousId: z.string().nullish(),
    previousId: z.string().nullish(),
    groupId: z.string().nullish(),
    traits: emailTraitSchema,
    context: z
      .object({
        // RETL/warehouse sources set mappedToDestination and supply the identifier
        // via externalId. adduserIdFromExternalId (called in processV2, after this
        // validation) hydrates userId — so these events must pass the refine even
        // without a top-level userId/anonymousId/email.
        mappedToDestination: z.unknown(),
        traits: emailTraitSchema,
      })
      .passthrough()
      .nullish(),
  })
  .passthrough()
  .refine(
    (msg) => {
      if (msg.type === 'alias') {
        return !!msg.userId && !!msg.previousId;
      }
      if (msg.type === 'group') {
        return true;
      }
      const hasEmail = !!msg.traits?.email || !!msg.context?.traits?.email;
      const isMappedToDestination = !!msg.context?.mappedToDestination;
      return !!msg.userId || !!msg.anonymousId || hasEmail || isMappedToDestination;
    },
    { message: 'userId, email or anonymousId is required' },
  );

// Hybrid destination: record events validate connection.config.destination against the
// record-specific schema (which requires `object`); event-stream events may carry a
// connection lacking those record-only fields, so their connection is not enforced —
// validating it against the record schema would wrongly reject them (#5331). Both
// variants carry the shared destinationConfig via CustomerIODestinationConfigSchema.
export const recordInputSchema = makeRouterInputSchema({
  message: recordMessageSchema,
  destinationConfig: CustomerIODestinationConfigSchema,
  connectionConfig: z.object({ destination: CustomerIOConnectionConfigSchema }).passthrough(),
});

export const eventStreamInputSchema = makeRouterInputSchema({
  message: eventStreamMessageSchema,
  destinationConfig: CustomerIODestinationConfigSchema,
});

export {
  type CustomerIODestination,
  type CustomerIODestinationConfig,
  type CustomerIOConnectionConfig,
} from '../types';
