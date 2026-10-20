import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';
import { ATTRIBUTE_NAME_PATTERN, DATA_CENTERS, REASONS } from './config';
import type { TraitValue } from './traits';

/** Flattened account: apiKey (secret) + dataCenter (option). */
export const GainsightPxAudienceDestinationConfigSchema = z
  .object({
    apiKey: z.string().trim().min(1, REASONS.missingApiKey),
    dataCenter: z.enum(DATA_CENTERS),
  })
  .passthrough();

export type GainsightPxAudienceDestinationConfig = z.infer<
  typeof GainsightPxAudienceDestinationConfigSchema
>;

export const GainsightPxAudienceConnectionConfigSchema = z
  .object({
    customAttributeName: z
      .string()
      .regex(
        ATTRIBUTE_NAME_PATTERN,
        'customAttributeName must be 1-200 letters, digits or underscores',
      ),
    identifierMappings: z
      .array(z.object({ from: z.string().min(1), to: z.literal('identifyId') }))
      .optional(),
    // trait-mappings D17/D18. Deliberately unvalidated: a bad trait config must never block the flag,
    // so traits.sanitizeMappings drops invalid rows and caps the list instead of failing the row.
    fieldMappings: z.unknown().optional(),
  })
  .passthrough();

export type GainsightPxAudienceConnectionConfig = z.infer<
  typeof GainsightPxAudienceConnectionConfigSchema
>;

// identifyId is `unknown` here on purpose: utils.normalizeIdentifyId owns its messages.
const RecordMessageSchema = z
  .object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z.record(z.unknown()).optional(),
    // rudder-sources: fields[mapping.to] = column[mapping.from] for every fieldMappings row.
    // Unvalidated for the same reason: traits.collectTraits treats a non-object as no values.
    fields: z.unknown().optional(),
  })
  .passthrough();

export const GainsightPxAudienceRouterRequestSchema = makeRouterInputSchema({
  destinationConfig: GainsightPxAudienceDestinationConfigSchema,
  message: RecordMessageSchema,
  connectionConfig: z
    .object({ destination: GainsightPxAudienceConnectionConfigSchema })
    .passthrough(),
});

export type GainsightPxAudienceRouterRequest = z.infer<
  typeof GainsightPxAudienceRouterRequestSchema
>;

/** One PUT /v1/users/update body: the flag plus any converted traits. */
export type GainsightPxAudiencePayload = {
  identifyId: string;
  customAttributes: Record<string, TraitValue>;
};
