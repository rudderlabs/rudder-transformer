import { z } from 'zod';
import { RecordAction } from '../../../types/rudderEvents';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';
import { ATTRIBUTE_NAME_PATTERN, DATA_CENTERS } from './config';

/** Flattened account: apiKey (secret) + dataCenter (option). */
export const GainsightPxAudienceDestinationConfigSchema = z
  .object({
    apiKey: z.string().min(1),
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

/** One PUT /v1/users/update body. */
export type GainsightPxAudiencePayload = {
  identifyId: string;
  customAttributes: Record<string, boolean>;
};
