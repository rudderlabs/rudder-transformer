import type { Destination, Metadata, RudderMessage } from '../../../types';
import type {
  RouterTransformationResponse,
  BatchedRequestBody,
  RouterTransformationRequestData,
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
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
export interface HubspotRudderMessage extends Omit<RudderMessage, 'context' | 'event'> {
  context: {
    externalId: HubSpotExternalIdObject[];
    hubspotOperation: 'createObject' | 'updateObject';
  };
  event: string;
}

/**
 * HubSpot Transformed Message (internal)
 */
export type HubspotProcessorTransformationRequest = ProcessorTransformationRequest<
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
