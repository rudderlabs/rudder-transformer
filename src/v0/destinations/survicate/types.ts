/**
 * TypeScript types for Survicate integration
 * Defines all type schemas using Zod for runtime validation
 */

import { z } from 'zod';
import { Destination, RouterTransformationRequestData } from '../../../types';

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
 * This validates the event data before processing
 */
export const SurvicateMessageSchema = z
  .object({
    type: z.enum(['identify', 'group', 'track']),
    userId: z.string().optional(),
    anonymousId: z.string().optional(),
    groupId: z.string().optional(),
    event: z.string().optional(),
    messageId: z.string().optional(),
    originalTimestamp: z.string().optional(),
    properties: z.record(z.any()).optional(),
    traits: z.record(z.any()).optional(),
    context: z
      .object({
        traits: z.record(z.any()).optional(),
        locale: z.string().optional(),
        campaign: z.record(z.any()).optional(),
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
  SurvicateDestination
>;

// Payload types for different event kinds
export interface IdentifyPayload {
  userId?: string;
  [key: string]: any;
}

export interface GroupPayload {
  userId?: string;
  groupId?: string;
  [key: string]: any;
}

export interface TrackPayload {
  userId?: string;
  event?: string;
  properties?: Record<string, any>;
  timestamp?: string;
  messageId?: string;
}
