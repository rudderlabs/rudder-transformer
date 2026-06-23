import { z, ZodType } from 'zod';

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

const SUPPORTED_TYPES = ['identify', 'track', 'page', 'screen', 'alias', 'group'] as const;

const emailTraitSchema = z.object({ email: z.unknown() }).passthrough().nullish();

export const getV2InputSchema = (): ZodType =>
  z
    .object({
      message: z
        .object({
          type: z.enum(SUPPORTED_TYPES),
          userId: z.string().nullish(),
          anonymousId: z.string().nullish(),
          previousId: z.string().nullish(),
          groupId: z.string().nullish(),
          traits: emailTraitSchema,
          // Declaring the fields the refine inspects so no runtime casts are needed.
          context: z
            .object({
              // RETL/warehouse sources set mappedToDestination and supply the identifier
              // via externalId. adduserIdFromExternalId (called in transformEvent, after
              // this validation) hydrates userId — so these events must pass the refine even
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
        ),
    })
    .passthrough();

export { type CustomerIODestination, type CustomerIODestinationConfig } from '../types';
