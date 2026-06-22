import { z, ZodType } from 'zod';
import { BatchedRequestBody, ProcessorTransformationOutput } from '../../../../types';

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

export type CustomerIOV2ProcessorOutput = Omit<ProcessorTransformationOutput, 'body'> & {
  body: BatchedRequestBody<{ batch: CustomerIOV2Payload[] }>;
  statusCode: number;
};

const SUPPORTED_TYPES = ['identify', 'track', 'page', 'screen', 'alias', 'group'] as const;

const hasEmailTrait = (msg: Record<string, unknown>): boolean => {
  const traits = (msg.traits ?? (msg.context as Record<string, unknown> | undefined)?.traits) as
    | Record<string, unknown>
    | undefined;
  return !!traits?.email;
};

// RETL/warehouse sources supply the identifier via context.externalId and set
// context.mappedToDestination. The identifier is derived by adduserIdFromExternalId
// inside processV2, which runs *after* schema validation. Allow these events through
// so preprocessing can hydrate userId before the payload is built.
const isMappedToDestination = (msg: Record<string, unknown>): boolean => {
  const ctx = msg.context as Record<string, unknown> | undefined;
  return !!(ctx?.mappedToDestination);
};

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
            return !!msg.userId || !!msg.anonymousId || hasEmailTrait(msg) || isMappedToDestination(msg);
          },
          { message: 'userId, email or anonymousId is required' },
        ),
    })
    .passthrough();

export { type CustomerIODestination, type CustomerIODestinationConfig } from '../types';
