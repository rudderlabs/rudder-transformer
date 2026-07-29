import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { makeRouterInputSchema } from '../../../services/destination/nativeBatching/batchDestination';
import { DATA_CENTERS } from './config';

export const BrazeAudienceAccountConfigSchema = z
  .object({
    restApiKey: z.string().min(1),
    dataCenter: z.enum(DATA_CENTERS),
  })
  .passthrough();

export type BrazeAudienceAccountConfig = z.infer<typeof BrazeAudienceAccountConfigSchema>;
export const BrazeAudienceDestinationConfigSchema = BrazeAudienceAccountConfigSchema;
export type BrazeAudienceDestinationConfig = BrazeAudienceAccountConfig;

const IdentifierMappingSchema = z.object({
  from: z.string().min(1),
  to: z.literal('external_id'),
});

export const BrazeAudienceConnectionConfigSchema = z
  .object({
    customAttributeName: z
      .string()
      .min(1)
      .max(255)
      .regex(/^\w+$/, 'customAttributeName must be alphanumeric or underscore')
      .refine((value) => value !== 'external_id', {
        message: 'customAttributeName cannot be external_id',
      }),
    identifierMappings: z.array(IdentifierMappingSchema).optional(),
  })
  .passthrough();

export type BrazeAudienceConnectionConfig = z.infer<typeof BrazeAudienceConnectionConfigSchema>;

const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z
      .object({
        // Allow non-primitive IDs through so normalizeExternalId can soft-bounce per record.
        external_id: z.unknown().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const BrazeAudienceRouterRequestSchema = makeRouterInputSchema({
  destinationConfig: BrazeAudienceDestinationConfigSchema,
  message: RecordMessageSchema,
  connectionConfig: z.object({ destination: BrazeAudienceConnectionConfigSchema }).passthrough(),
});

/** One Braze user-attributes object (before wrapBody batches into `{ attributes: [...] }`). */
export type BrazeAudienceAttributePayload = {
  external_id: string;
  /** Dynamic custom attribute name → boolean membership */
  [attr: string]: string | boolean;
};
