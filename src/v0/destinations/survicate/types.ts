import { z } from 'zod';
import type { ENDPOINT_CONFIG } from './config';
import {
  ERR_MISSING_MESSAGE_ID,
  ERR_MISSING_TIMESTAMP,
  ERR_ANONYMOUS_IDENTIFY,
  ERR_ANONYMOUS_GROUP,
  ERR_ANONYMOUS_TRACK,
  ERR_MISSING_GROUP_ID,
  ERR_MISSING_EVENT,
} from './config';
import { MetadataSchema } from '../../../types/rudderEvents';

export type EndpointEntry = (typeof ENDPOINT_CONFIG)[keyof typeof ENDPOINT_CONFIG];

export const SurvicateDestinationSchema = z
  .object({
    Config: z
      .object({
        destinationKey: z.string().min(1, 'Destination Key is required'),
      })
      .passthrough(),
  })
  .passthrough();

// Fields shared by every supported event type.
const baseFields = {
  messageId: z.string({ required_error: ERR_MISSING_MESSAGE_ID }).min(1, ERR_MISSING_MESSAGE_ID),
  originalTimestamp: z
    .string({ required_error: ERR_MISSING_TIMESTAMP })
    .min(1, ERR_MISSING_TIMESTAMP),
  properties: z.record(z.string(), z.unknown()).optional(),
  traits: z.record(z.string(), z.unknown()).optional(),
  context: z
    .object({
      traits: z.record(z.string(), z.unknown()).optional(),
      locale: z.string().optional(),
      campaign: z.record(z.string(), z.unknown()).optional(),
      userAgent: z.string().optional(),
    })
    .passthrough()
    .optional(),
};

/**
 * Map snake_case aliases onto canonical camelCase keys before validation.
 * `||` (not `??`) preserves the behaviour of treating empty strings as absent.
 */
const normalizeRaw = (raw: unknown) => {
  if (typeof raw !== 'object' || raw === null) return raw;
  const r = raw as Record<string, unknown>;
  return {
    ...r,
    userId: r.userId || r.user_id,
    groupId: r.groupId || r.group_id,
    messageId: r.messageId || r.message_id,
    originalTimestamp: r.originalTimestamp || r.original_timestamp,
  };
};

/**
 * Message schema for incoming RudderStack events. Normalizes snake_case to
 * camelCase, then validates per-event-type required fields. All field
 * presence/anonymity checks live here so the transformer stays declarative.
 */
const SurvicateMessageSchema = z.preprocess(
  normalizeRaw,
  z.discriminatedUnion('type', [
    z
      .object({
        type: z.literal('identify'),
        userId: z.string({ required_error: ERR_ANONYMOUS_IDENTIFY }).min(1, ERR_ANONYMOUS_IDENTIFY),
        ...baseFields,
      })
      .passthrough(),
    z
      .object({
        type: z.literal('group'),
        userId: z.string({ required_error: ERR_ANONYMOUS_GROUP }).min(1, ERR_ANONYMOUS_GROUP),
        groupId: z.string({ required_error: ERR_MISSING_GROUP_ID }).min(1, ERR_MISSING_GROUP_ID),
        ...baseFields,
      })
      .passthrough(),
    z
      .object({
        type: z.literal('track'),
        userId: z.string({ required_error: ERR_ANONYMOUS_TRACK }).min(1, ERR_ANONYMOUS_TRACK),
        event: z.string({ required_error: ERR_MISSING_EVENT }).min(1, ERR_MISSING_EVENT),
        ...baseFields,
      })
      .passthrough(),
  ]),
);

type SurvicateMessage = z.infer<typeof SurvicateMessageSchema>;
export type SurvicateIdentifyMessage = Extract<SurvicateMessage, { type: 'identify' }>;
export type SurvicateGroupMessage = Extract<SurvicateMessage, { type: 'group' }>;
export type SurvicateTrackMessage = Extract<SurvicateMessage, { type: 'track' }>;

export const SurvicateRouterRequestSchema = z.object({
  message: SurvicateMessageSchema,
  destination: SurvicateDestinationSchema,
  metadata: MetadataSchema,
});

export type SurvicateRouterRequest = z.infer<typeof SurvicateRouterRequestSchema>;

export interface IdentifyPayload {
  user_id: string;
  timestamp: string;
  message_id: string;
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GroupPayload {
  user_id: string;
  group_id: string;
  timestamp: string;
  message_id: string;
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TrackPayload {
  user_id: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  message_id: string;
  context?: Record<string, unknown>;
}

export type SurvicatePayload = IdentifyPayload | GroupPayload | TrackPayload;
