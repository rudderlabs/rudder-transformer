/**
 * CustomerIO Destination Type Definitions
 *
 * TypeScript type definitions for the CustomerIO destination, following the
 * patterns established in the codebase (see postscript/braze/hs types.ts).
 */

import { z } from 'zod';
import {
  Connection,
  Destination,
  Metadata,
  RouterTransformationRequestData,
  RudderMessage,
  RudderRecordV2,
} from '../../../types';
import { BatchedRequest, BatchRequestOutput } from '../../../types/destinationTransformation';

// ==================== Configuration Schema Definitions ====================

/**
 * CustomerIO destination configuration schema validation
 */
export const CustomerIODestinationConfigSchema = z
  .object({
    siteID: z.string().min(1, 'siteID is required'),
    apiKey: z.string().min(1, 'apiKey is required'),
    datacenter: z.enum(['US', 'EU']).optional(),
    deviceTokenEventName: z.string().optional(),
  })
  .passthrough();

export type CustomerIODestinationConfig = z.infer<typeof CustomerIODestinationConfigSchema>;

export const CustomerIORecordObjectSchema = z.enum(['person', 'event']);
export const CUSTOMERIO_RECORD_OBJECTS = CustomerIORecordObjectSchema.enum;
export type CustomerIORecordObject = z.infer<typeof CustomerIORecordObjectSchema>;

export const CustomerIOConnectionConfigSchema = z
  .object({
    object: CustomerIORecordObjectSchema,
    syncMode: z.string().optional(),
    identifierMappings: z.array(z.object({ from: z.string(), to: z.string() })).optional(),
    fieldMappings: z.array(z.object({ from: z.string(), to: z.string() })).optional(),
  })
  .passthrough();

export type CustomerIOConnectionConfig = z.infer<typeof CustomerIOConnectionConfigSchema>;

// ==================== Destination-Specific Types ====================

export type CustomerIODestination = Destination<CustomerIODestinationConfig>;

export type CustomerIOConnection = Connection<{
  destination: CustomerIOConnectionConfig;
}>;

export type CustomerIORouterRequest = RouterTransformationRequestData<
  RudderMessage | RudderRecordV2,
  CustomerIODestination,
  CustomerIOConnection
>;

// ==================== API Request Types ====================

/**
 * Headers for CustomerIO API requests.
 */
export type CustomerIOHeaders = {
  Authorization?: string;
  'Content-Type'?: string;
};

/**
 * Identify / Add or update a person.
 * PUT /api/v1/customers/:id
 * Ref: https://docs.customer.io/integrations/api/track/#tag/track-customers/identify
 *
 * Traits are spread as flat top-level keys; the fields below are the ones the
 * transformer sets explicitly, while the index signature covers the traits.
 */
export type CustomerIOIdentifyPayload = {
  created_at?: number;
  _timestamp?: number;
  anonymous_id?: string;
  [trait: string]: unknown;
};

/**
 * Merge people (alias).
 * POST /api/v1/merge_customers
 * Ref: https://docs.customer.io/integrations/api/track/#tag/track-customers/merge
 */
export type CustomerIOMergePayload = {
  primary: { id?: string; email?: string };
  secondary: { id?: string; email?: string };
};

/**
 * Track a customer/anonymous event.
 * POST /api/v1/customers/:id/events  |  POST /api/v1/events
 * Ref: https://docs.customer.io/integrations/api/track/#tag/track-customers/track
 */
export type CustomerIOEventPayload = {
  name: string;
  type?: unknown;
  data?: unknown;
  timestamp?: number;
  anonymous_id?: string;
};

/**
 * Add or update a device.
 * PUT /api/v1/customers/:id/devices
 * Ref: https://docs.customer.io/integrations/api/track/#tag/track-customers/add_device
 */
export type CustomerIODevicePayload = {
  device: {
    id?: unknown;
    platform?: string;
    last_used?: number;
    [key: string]: unknown;
  };
};

/**
 * Object/group event via the v2 batch endpoint.
 * POST /api/v2/batch
 * Ref: https://docs.customer.io/integrations/api/track/#tag/track-objects
 */
export type CustomerIOObjectPayload = {
  identifiers: { object_id: unknown; object_type_id: unknown };
  type: string;
  action: unknown;
  attributes: unknown;
  cio_relationships: { identifiers: Record<string, unknown> }[];
};

/**
 * Device-delete events send an empty body.
 * DELETE /api/v1/customers/:id/devices/:device_id
 */
export type CustomerIODeviceDeletePayload = Record<string, never>;

/**
 * Union of all raw payloads the transformer builds for CustomerIO.
 */
export type CustomerIOPayload =
  | CustomerIOIdentifyPayload
  | CustomerIOMergePayload
  | CustomerIOEventPayload
  | CustomerIODevicePayload
  | CustomerIOObjectPayload
  | CustomerIODeviceDeletePayload;

/**
 * Body JSON of a CustomerIO request: either a single event payload or, for the
 * v2 batch endpoint, a wrapper holding an array of object payloads.
 */
export type CustomerIORequestBody = CustomerIOPayload | { batch: CustomerIOObjectPayload[] };

/**
 * CustomerIO batched request, driven from the canonical BatchedRequest type.
 */
export type CustomerIOBatchedRequest = BatchedRequest<
  CustomerIORequestBody,
  CustomerIOHeaders,
  Record<string, unknown>
>;

/**
 * CustomerIO batch response, driven from the canonical BatchRequestOutput type.
 */
export type CustomerIOBatchResponse = BatchRequestOutput<
  CustomerIORequestBody,
  CustomerIOHeaders,
  Record<string, unknown>,
  CustomerIODestination
>;

// ==================== Internal Processing Types ====================

/**
 * Endpoint details resolved for a CustomerIO request.
 */
export type EndpointDetails = {
  endpoint: string;
  path: string;
};

/**
 * Intermediate response details returned by each *ResponseBuilder before the
 * final request config is assembled.
 */
export type ResponseDetails = {
  rawPayload: CustomerIOPayload;
  endpointDetails: EndpointDetails;
  requestConfig: { requestMethod: string };
};

/**
 * A successfully transformed event ready to be batched/sent for CustomerIO.
 */
export type CustomerIOSuccessfulEvent = {
  message: CustomerIOBatchedRequest;
  metadata: Partial<Metadata>;
  destination: CustomerIODestination;
};
