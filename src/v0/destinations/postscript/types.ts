/**
 * Postscript Destination Type Definitions
 *
 * This file contains TypeScript type definitions for the Postscript destination.
 * It defines interfaces for configuration, API requests/responses, and internal
 * data structures following the patterns established in the codebase.
 */

import { z } from 'zod';
import {
  Destination,
  Metadata,
  RouterTransformationRequestData,
  RudderMessage,
} from '../../../types';
import { BatchedRequest, BatchRequestOutput } from '../../../types/destinationTransformation';

// ==================== Configuration Schema Definitions ====================

/**
 * Postscript destination configuration schema validation
 * Validates that the required API key is present and properly formatted
 */
export const PostscriptDestinationConfigSchema = z
  .object({
    apiKey: z.string().min(1, 'API key is required'),
  })
  .passthrough();

// ==================== Inferred Configuration Types ====================

export type PostscriptDestinationConfig = z.infer<typeof PostscriptDestinationConfigSchema>;

// ==================== External ID Types ====================

/**
 * External ID type used to identify subscribers in track calls
 */
export interface PostscriptExternalId {
  type: 'subscriber_id' | 'external_id' | 'shopify_customer_id';
  id: string | number;
}

// ==================== API Request/Response Types ====================

/**
 * Postscript API headers structure
 */
export interface PostscriptHeaders {
  'Content-type': string;
  Accept: string;
  Authorization: string;
  'X-Postscript-Partner-Key'?: string;
}

/**
 * Subscriber payload for create/update operations
 */
export interface PostscriptSubscriberPayload {
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  keyword?: string;
  keyword_id?: string;
  subscriber_id?: string;
  external_id?: string;
  shopify_customer_id?: number;
  tags?: string[];
  origin?: 'email' | 'sms' | 'web' | 'api' | 'other';
  properties?: Record<string, unknown>;
}

/**
 * Custom event payload for track operations
 */
export interface PostscriptCustomEventPayload {
  type: string; // Event name/type
  subscriber_id?: string;
  external_id?: string;
  email?: string;
  phone?: string;
  occurred_at?: string;
  properties?: Record<string, unknown>;
}

/**
 * Batch subscriber lookup request payload
 */
export interface PostscriptLookupPayload {
  emails?: string[];
  phone_numbers?: string[];
  external_ids?: string[];
}

/**
 * API response structure for subscriber operations
 */
export interface PostscriptSubscriberResponse {
  id: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * API response structure for subscriber lookup operations
 */
export interface PostscriptLookupResponse {
  subscribers: PostscriptSubscriberResponse[];
  meta?: {
    total_count: number;
    page: number;
    per_page: number;
  };
}

// ==================== Internal Processing Types ====================

/**
 * Processed event after initial validation and transformation
 */
export interface ProcessedEvent {
  eventType: 'identify' | 'track';
  payload: PostscriptSubscriberPayload | PostscriptCustomEventPayload;
  metadata: Partial<Metadata>;
  endpoint: string;
  method: 'POST' | 'PATCH';
  subscriberLookupNeeded?: boolean;
  identifierValue?: string;
  identifierType?: 'email' | 'phone' | 'subscriber_id' | 'external_id';
}

/**
 * Lookup result for subscriber existence check
 */
export interface SubscriberLookupResult {
  exists: boolean;
  subscriberId?: string;
  identifierValue: string;
  identifierType: 'email' | 'phone' | 'external_id';
}

/**
 * Response list type for batch operations
 */
export interface RespList {
  payload: PostscriptSubscriberPayload | PostscriptCustomEventPayload;
  metadata: Partial<Metadata>;
  endpoint: string;
  method: 'POST' | 'PATCH';
}

// ==================== Destination-Specific Types ====================

/**
 * Postscript destination type using generic Destination interface
 */
export type PostscriptDestination = Destination<PostscriptDestinationConfig>;

/**
 * Router request type specific to Postscript
 */
export type PostscriptRouterRequest = RouterTransformationRequestData<
  RudderMessage,
  PostscriptDestination
>;

// ==================== Batch Request Types ====================

/**
 * Postscript batched request type
 */
export type PostscriptBatchedRequest = BatchedRequest<
  PostscriptSubscriberPayload | PostscriptCustomEventPayload,
  PostscriptHeaders,
  Record<string, unknown> // params
>;

/**
 * Postscript batch response type
 */
export type PostscriptBatchResponse = BatchRequestOutput<
  PostscriptSubscriberPayload | PostscriptCustomEventPayload,
  PostscriptHeaders,
  Record<string, any>, // params
  PostscriptDestination
>;

// ==================== Error Response Types ====================

/**
 * Postscript API error response structure
 */
export interface PostscriptErrorResponse {
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  errors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
  message?: string;
}

/**
 * Network error context for better error handling
 */
export interface PostscriptNetworkError {
  status: number;
  response?: PostscriptErrorResponse;
  message: string;
  category: string;
}
