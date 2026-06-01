import { z } from 'zod';
import { Destination, RouterTransformationRequestData, Metadata } from '../../../types';
import type { ENDPOINT_CONFIG } from './config';

// Validation error messages for required tracing fields.
export const ERR_MISSING_MESSAGE_ID = 'messageId is required.';
export const ERR_MISSING_TIMESTAMP = 'originalTimestamp is required.';

export type EndpointEntry = (typeof ENDPOINT_CONFIG)[keyof typeof ENDPOINT_CONFIG];

export const SurvicateDestinationConfigSchema = z
  .object({
    destinationKey: z.string().min(1, 'Destination Key is required'),
  })
  .passthrough();

/**
 * Message schema for incoming RudderStack events.
 * Accepts both camelCase and snake_case field names; the transformer
 * normalizes to camelCase before validation.
 */
export const SurvicateMessageSchema = z
  .object({
    type: z.enum(['identify', 'group', 'track']),
    userId: z.string().optional(),
    groupId: z.string().optional(),
    event: z.string().optional(),
    // fields required for request tracing
    messageId: z.string(),
    originalTimestamp: z.string(),
    // snake_case aliases (present after normalization)
    user_id: z.string().optional(),
    group_id: z.string().optional(),
    message_id: z.string().optional(),
    original_timestamp: z.string().optional(),
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
  })
  .passthrough();

export type SurvicateDestinationConfig = z.infer<typeof SurvicateDestinationConfigSchema>;
export type SurvicateMessage = z.infer<typeof SurvicateMessageSchema>;
export type SurvicateDestination = Destination<SurvicateDestinationConfig>;

export type SurvicateRouterRequest = RouterTransformationRequestData<
  SurvicateMessage,
  SurvicateDestination,
  undefined,
  Metadata
>;

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
