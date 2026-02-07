import type { Destination, Metadata, RudderMessage } from '../../../types';
import type {
  RouterTransformationResponse,
  BatchedRequestBody,
  RouterTransformationRequestData,
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  BatchedRequest,
} from '../../../types/destinationTransformation';

// ============================================================================
// Destination Configuration Types
// ============================================================================

/**
 * HubSpot Destination Configuration
 * Ref: https://developers.hubspot.com/docs/api/crm/contacts
 */
export interface HubSpotDestinationConfig {
  authorizationType: 'newPrivateAppApi' | 'legacyApiKey';
  accessToken?: string;
  apiKey?: string;
  hubID?: string;
  apiVersion?: 'legacyApi' | 'newApi';
  lookupField?: string;
  hubspotEvents?: HubSpotEventMapping[];
}

/**
 * HubSpot Event Mapping from webapp config
 */
export interface HubSpotEventMapping {
  rsEventName?: string;
  hubspotEventName?: string;
  eventProperties?: { from: string; to: string }[];
}

/**
 * Typed Destination for HubSpot
 */
export type HubSpotDestination = Destination<HubSpotDestinationConfig>;

// ============================================================================
// Property Types
// ============================================================================

/**
 * HubSpot Property Map - maps property names to their types
 */
export type HubSpotPropertyMap = Record<string, string>;

/**
 * HubSpot Property from API response
 * Ref: https://developers.hubspot.com/docs/api/crm/properties
 */
export interface HubSpotProperty {
  name: string;
  type: string;
}

/**
 * HubSpot Lookup Field Info
 */
export interface HubSpotLookupFieldInfo {
  fieldName: string;
  value: unknown;
}

// ============================================================================
// External ID Types (for rETL)
// ============================================================================

/**
 * HubSpot External ID Info for rETL
 */
export interface HubSpotExternalIdInfo {
  destinationExternalId: string | null;
  objectType: string | null;
  identifierType: string | null;
}

/**
 * HubSpot External ID Object for rETL (association)
 */
export interface HubSpotExternalIdObject {
  id?: string | number;
  type?: string;
  identifierType?: string;
  associationTypeId?: string;
  fromObjectType?: string;
  toObjectType?: string;
  hsSearchId?: string;
  useSecondaryObject?: boolean;
}

/**
 * HubSpot Contact Record for search results
 */
export interface HubSpotContactRecord {
  id: string;
  property: string;
}

// ============================================================================
// API Request Body Types (for body.JSON)
// ============================================================================

/**
 * HubSpot Identify Payload (Legacy API format)
 * Ref: https://legacydocs.hubspot.com/docs/methods/contacts/create_contact
 */
export interface HubSpotLegacyIdentifyProperty {
  property: string;
  value: unknown;
}

/**
 * Legacy API Identify Request Body
 * Used in body.JSON for legacy identify calls
 */
export interface HubSpotLegacyIdentifyPayload {
  properties: HubSpotLegacyIdentifyProperty[];
}

/**
 * New API Identify Request Body (single contact)
 * Ref: https://developers.hubspot.com/docs/api/crm/contacts
 */
export interface HubSpotIdentifyPayload {
  properties: Record<string, unknown>;
}

/**
 * Batch Input Item for CRM API
 * Ref: https://developers.hubspot.com/docs/api/crm/contacts
 */
export interface HubSpotBatchInputItem {
  id?: string;
  properties: Record<string, unknown>;
}

/**
 * Batch Request Body (for body.JSON in batch operations)
 * Ref: https://developers.hubspot.com/docs/api/crm/contacts
 */
export interface HubSpotBatchPayload {
  inputs: HubSpotBatchInputItem[];
}

/**
 * Track Event Request Body (New API v3)
 * Ref: https://developers.hubspot.com/docs/api/analytics/events
 */
export interface HubSpotTrackEventRequest {
  eventName?: string;
  email?: string;
  utk?: string;
  objectId?: string;
  occurredAt?: string;
  properties?: Record<string, unknown>;
}

/**
 * Legacy Track Event Params (query params)
 * Ref: https://legacydocs.hubspot.com/docs/methods/enterprise_events/http_api
 */
export interface HubSpotLegacyTrackParams {
  _a: string;
  _n: string;
  _m?: number | string;
  id?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Association Request Body
 * Ref: https://developers.hubspot.com/docs/api/crm/associations
 */
export interface HubSpotAssociationPayload {
  from?: { id: string };
  to?: { id: string };
  type?: string;
  [key: string]: unknown;
}

// ============================================================================
// Search API Types
// ============================================================================

/**
 * HubSpot Search API Request Body
 * Ref: https://developers.hubspot.com/docs/api/crm/search
 */
export interface HubSpotSearchRequest {
  filterGroups: {
    filters: {
      propertyName: string;
      operator: string;
      value?: unknown;
      values?: string[];
    }[];
  }[];
  properties?: string[];
  sorts?: string[];
  limit?: number;
  after?: number;
}

/**
 * HubSpot Search API Result Item
 */
export interface HubSpotSearchResult {
  id: string;
  properties: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

/**
 * HubSpot Search API Response
 */
export interface HubSpotSearchResponse {
  total?: number;
  results?: HubSpotSearchResult[];
  paging?: {
    next?: {
      after?: string | number;
      link?: string;
    };
  };
}

// ============================================================================
// Transformer Internal Types
// ============================================================================

/**
 * Union of all possible body.JSON payloads for HubSpot
 */
export type HubSpotRequestBodyJSON =
  | HubSpotIdentifyPayload
  | HubSpotIdentifyPayload[]
  | HubSpotLegacyIdentifyPayload
  | HubSpotLegacyIdentifyPayload[]
  | HubSpotBatchPayload
  | HubSpotBatchPayload[]
  | HubSpotTrackEventRequest
  | HubSpotTrackEventRequest[]
  | HubSpotAssociationPayload
  | HubSpotAssociationPayload[];

/**
 * HubSpot specific BatchedRequestBody with typed JSON
 */
export type HubSpotBatchedRequestBody = BatchedRequestBody<HubSpotRequestBodyJSON>;
export interface HubSpotBatchRequestOutput {
  batchedRequest: BatchedRequest<
    HubSpotRequestBodyJSON,
    Record<string, unknown>, // headers
    Record<string, unknown> // params
  >;
  // These are the only fields we actually set before passing to getSuccessRespEvents
  metadata?: Partial<Metadata>[];
  destination?: HubSpotDestination;
}
export interface HubspotRudderMessage extends Omit<RudderMessage, 'context' | 'event'> {
  context: {
    externalId: HubSpotExternalIdObject[];
    hubspotOperation: 'createObject' | 'updateObject';
  };
  event: string;
}

/**
 * Router input where message may be raw (HubspotRudderMessage) or already transformed (statusCode set)
 */
export type HubspotRouterInput =
  | { message: HubspotRudderMessage; metadata: Metadata; destination: HubSpotDestination }
  | {
      message: HubspotProcessorTransformationOutput;
      metadata: Metadata;
      destination: HubSpotDestination;
    };

/**
 * Type guard: message has already been transformed (processor output shape)
 */
export function isProcessorOutput(
  msg: HubspotRudderMessage | HubspotProcessorTransformationOutput,
): msg is HubspotProcessorTransformationOutput {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'statusCode' in msg &&
    'body' in msg &&
    typeof (msg as Record<string, unknown>).statusCode === 'number' &&
    (msg as Record<string, unknown>).body !== undefined
  );
}

/**
 * Type guard: JSON payload has properties as Record (not array) - for create/update contact
 */
export function hasPropertiesRecord(
  json: unknown,
): json is { properties: Record<string, unknown> } {
  if (!json || Array.isArray(json)) return false;
  const obj = json as Record<string, unknown>;
  return (
    'properties' in obj && typeof obj.properties === 'object' && !Array.isArray(obj.properties)
  );
}

/**
 * Type guard: JSON payload is association shape (from, to, type)
 */
export function hasAssociationShape(
  json: unknown,
): json is { from: { id: string }; to: { id: string }; type: string } {
  if (!json || Array.isArray(json)) return false;
  const obj = json as Record<string, unknown>;
  return 'from' in obj && 'to' in obj && 'type' in obj;
}

/**
 * Type guard: value is valid for date conversion
 */
export function isDateLike(value: unknown): value is string | number | Date {
  return typeof value === 'string' || typeof value === 'number' || value instanceof Date;
}

/**
 * Type guard: valid record (object, not array, not null)
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Type guard: value is HubSpotExternalIdInfo shape
 */
export function isHubSpotExternalIdInfo(value: unknown): value is HubSpotExternalIdInfo {
  return (
    isRecord(value) &&
    'destinationExternalId' in value &&
    'objectType' in value &&
    'identifierType' in value
  );
}

/**
 * Type guard: value is HubSpotSearchResponse shape
 */
export function isHubSpotSearchResponse(value: unknown): value is HubSpotSearchResponse {
  return isRecord(value) && ('results' in value || 'total' in value || 'paging' in value);
}

/**
 * HubSpot Transformed Message (internal)
 */
export type HubspotProcessorRequest = ProcessorTransformationRequest<
  HubspotRudderMessage,
  Metadata,
  HubSpotDestination,
  undefined
>;

export type HubspotRouterRequest = RouterTransformationRequestData<
  HubspotRudderMessage,
  HubSpotDestination,
  undefined,
  Metadata
>;

export interface HubspotProcessorTransformationOutput
  extends Omit<ProcessorTransformationOutput, 'body'> {
  body: HubSpotBatchedRequestBody;
  operation?:
    | 'createObject'
    | 'updateObject'
    | 'createContacts'
    | 'updateContacts'
    | 'createAssociation';
  messageType?: 'track' | 'identify';
  source?: string;
  id?: string;
}

export type HubSpotBatchProcessingItem = {
  message: HubspotProcessorTransformationOutput;
  metadata: Metadata;
  destination: HubSpotDestination;
};

/**
 * HubSpot Router Transformation Response (typed version)
 */
export interface HubSpotRouterTransformationOutput
  extends Omit<RouterTransformationResponse, 'batchedRequest' | 'destination' | 'metadata'> {
  destination: HubSpotDestination;
  batchedRequest?: HubspotProcessorTransformationOutput | HubspotProcessorTransformationOutput[];
  metadata: Metadata[] | Partial<Metadata>[];
}

export interface HubSpotBatchRouterResult {
  batchedResponseList: HubSpotRouterTransformationOutput[];
  errorRespList: HubSpotRouterTransformationOutput[];
  dontBatchEvents: HubSpotRouterTransformationOutput[];
}
