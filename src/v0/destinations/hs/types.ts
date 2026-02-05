import type { Destination, Metadata } from '../../../types';

/**
 * HubSpot Destination Configuration
 * Ref: https://developers.hubspot.com/docs/api/crm/contacts
 */
export interface HubSpotDestinationConfig {
  // API authorization type
  authorizationType: 'newPrivateAppApi' | 'legacyApiKey';
  // For newPrivateAppApi
  accessToken?: string;
  // For legacyApiKey
  apiKey?: string;
  hubID?: string;
  // API version
  apiVersion?: 'legacyApi' | 'newApi';
  // Contact lookup field
  lookupField?: string;
  // Event mappings for track calls
  hubspotEvents?: HubSpotEventMapping[];
}

/**
 * HubSpot Event Mapping from webapp config
 */
export interface HubSpotEventMapping {
  rsEventName?: string;
  hubspotEventName?: string;
  eventProperties?: { from?: string; to?: string }[];
}

/**
 * HubSpot Property Map - maps property names to their types
 */
export type HubSpotPropertyMap = Record<string, string>;

/**
 * HubSpot Property from API response
 */
export interface HubSpotProperty {
  name: string;
  type: string;
}

/**
 * HubSpot Contact Record for batch operations
 */
export interface HubSpotContactRecord {
  id: string;
  property: string;
  [key: string]: unknown;
}

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
 * HubSpot Identify Payload (Legacy API format)
 */
export interface HubSpotLegacyIdentifyProperty {
  property: string;
  value: unknown;
}

/**
 * HubSpot Transformed Message (internal)
 */
export interface HubSpotTransformedMessage {
  endpoint?: string;
  method?: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: {
    JSON?: Record<string, unknown>;
    JSON_ARRAY?: Record<string, unknown>;
    XML?: Record<string, unknown>;
    FORM?: Record<string, unknown>;
  };
  messageType?: string;
  source?: string;
  operation?: string;
}

/**
 * HubSpot Event Input for batch processing
 */
export interface HubSpotEventInput {
  message: HubSpotTransformedMessage & Record<string, unknown>;
  metadata: Metadata;
  destination: HubSpotDestination;
}

/**
 * HubSpot Lookup Field Info
 */
export interface HubSpotLookupFieldInfo {
  fieldName: string;
  value: unknown;
}

/**
 * Typed Destination for HubSpot
 */
export type HubSpotDestination = Destination<HubSpotDestinationConfig>;
