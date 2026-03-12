/**
 * TypeScript types for Survicate integration
 * Defines all type schemas using Zod for runtime validation
 */

import { z } from 'zod';
import { Destination, RouterTransformationRequestData, Metadata } from '../../../types';

/**
 * Survicate destination configuration schema
 * Validates the API key configuration
 */
export const SurvicateDestinationConfigSchema = z
  .object({
    destinationKey: z.string().min(1, 'Destination Key is required'),
  })
  .passthrough();

/**
 * Message schema - defines the structure of incoming RudderStack events
 * This validates the event data before processing.  Note that the
 * transformer performs a normalization step so callers may supply either
 * snake_case (`user_id`, `message_id`, etc.) or camelCase; the schema
 * itself works against the normalized camelCase shape.
 */
export const SurvicateMessageSchema = z
  .object({
    type: z.enum(['identify', 'group', 'track']),
    userId: z.string().optional(),
    anonymousId: z.string().optional(),
    groupId: z.string().optional(),
    event: z.string().optional(),
    // audit fields must always be present
    messageId: z.string(),
    originalTimestamp: z.string(),
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

// TypeScript types derived from Zod schemas
export type SurvicateDestinationConfig = z.infer<typeof SurvicateDestinationConfigSchema>;
export type SurvicateMessage = z.infer<typeof SurvicateMessageSchema>;
export type SurvicateDestination = Destination<SurvicateDestinationConfig>;

// Request/response types for router (batch event processing)
export type SurvicateRouterRequest = RouterTransformationRequestData<
  SurvicateMessage,
  SurvicateDestination,
  undefined,
  Metadata
>;

// Payload types for different event kinds
export interface IdentifyPayload {
  user_id?: string;
  [key: string]: any;
}

export interface GroupPayload {
  user_id?: string;
  group_id?: string;
  [key: string]: any;
}

export interface TrackPayload {
  user_id?: string;
  event?: string;
  properties?: Record<string, any>;
  timestamp?: string;
  message_id?: string;
}
