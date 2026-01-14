import { z } from 'zod';
import { Destination, RouterTransformationRequestData, RudderMessage } from '../../../types';

// Braze User Alias Object
export interface BrazeUserAlias {
  alias_name: string;
  alias_label: string;
}

// Braze User Attributes Object
// Ref: https://www.braze.com/docs/api/objects_filters/user_attributes_object/
export interface BrazeUserAttributes {
  external_id?: string;
  user_alias?: BrazeUserAlias;
  braze_id?: string;
  _update_existing_only?: boolean;

  // Standard attributes
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  dob?: string | null;
  country?: string | null;
  home_city?: string | null;
  language?: string | null;
  phone?: string | null;
  email_subscribe?: string | null;
  push_subscribe?: string | null;
  image_url?: string | null;
  gender?: 'M' | 'F' | 'O' | 'N' | 'P' | null;

  // Custom attributes
  [key: string]: unknown;
}

// Braze Event Object
// Ref: https://www.braze.com/docs/api/objects_filters/event_object/
export interface BrazeEvent {
  external_id?: string;
  user_alias?: BrazeUserAlias;
  braze_id?: string;
  app_id?: string;
  name: string;
  time: string;
  properties?: Record<string, unknown>;
  _update_existing_only?: boolean;
}

// Braze Purchase Object
// Ref: https://www.braze.com/docs/api/objects_filters/purchase_object/
export interface BrazePurchase {
  external_id?: string;
  user_alias?: BrazeUserAlias;
  braze_id?: string;
  app_id?: string;
  product_id: string;
  currency: string;
  price: number;
  quantity: number;
  time: string;
  properties?: Record<string, unknown>;
  _update_existing_only?: boolean;
}

// Braze Track Request Body
export interface BrazeTrackRequestBody {
  partner?: string;
  attributes?: BrazeUserAttributes[];
  events?: BrazeEvent[];
  purchases?: BrazePurchase[];
}

export interface BrazeAliasToIdentify {
  external_id?: string;
  user_alias?: BrazeUserAlias;
  alias_name?: string;
  alias_label?: string;
}
// Braze Identify Request Body
export interface BrazeIdentifyRequestBody {
  aliases_to_identify: Array<BrazeAliasToIdentify>;
  merge_behavior: 'merge';
}

// Braze Subscription Group
export interface BrazeSubscriptionGroup {
  subscription_group_id: string;
  subscription_state: 'subscribed' | 'unsubscribed';
  external_ids?: string[];
  emails?: string[];
  phones?: string[];
}

// Braze Alias Merge
export interface BrazeAliasMerge {
  identifier_to_merge: {
    external_id: string;
  };
  identifier_to_keep: {
    external_id: string;
  };
}

// Braze API Responses
export interface BrazeApiResponse {
  message: string;
  errors?: Array<{
    type: string;
    input_array?: string;
    index?: number;
  }>;
  attributes_processed?: number;
  events_processed?: number;
  purchases_processed?: number;
  aliases_processed?: number;
}

// Braze User Export Response
export interface BrazeUserExportResponse {
  users: BrazeUser[];
  message: string;
  invalid_user_ids?: string[];
}

export interface BrazeUser {
  external_id?: string;
  user_aliases?: BrazeUserAlias[];
  braze_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  dob?: string;
  country?: string;
  home_city?: string;
  language?: string;
  phone?: string;
  gender?: string;
  time_zone?: string;
  created_at?: string;
  custom_attributes?: Record<string, unknown>;
}

// Braze Configuration Schema using Zod
export const BrazeDestinationConfigSchema = z
  .object({
    restApiKey: z.string(),
    dataCenter: z.string(),
    appKey: z.string().optional(),
    enableSubscriptionGroupInGroupCall: z.boolean().optional().default(false),
    sendPurchaseEventWithExtraProperties: z.boolean().optional().default(false),
    enableNestedArrayOperations: z.boolean().optional().default(false),
    supportDedup: z.boolean().optional().default(false),
    trackAnonymousUser: z.boolean().optional().default(false),
    enableIdentifyForAnonymousUser: z.boolean().optional().default(false),
    blacklistedEvents: z.array(z.string()).optional().default([]),
    whitelistedEvents: z.array(z.string()).optional().default([]),
  })
  .passthrough();

export type BrazeDestinationConfig = z.infer<typeof BrazeDestinationConfigSchema>;
export type BrazeDestination = Destination<BrazeDestinationConfig>;
export type BrazeRouterRequest = RouterTransformationRequestData<RudderMessage, BrazeDestination>;

// Process params for router transformation
export interface BrazeProcessParams {
  userStore: Map<string, BrazeUser>;
  identifyCallsArray?: BrazeIdentifyCall[];
  failedLookupIdentifiers: Set<string>;
}

// Identity resolution types
export interface BrazeIdentifyCall {
  identifyPayload: BrazeIdentifyRequestBody;
  destination: BrazeDestination;
  metadata: unknown;
}

// Endpoint response type
export interface BrazeEndpointDetails {
  endpoint: string;
  path: string;
}

// Batch response structure
export interface BrazeBatchResponse {
  batchedRequest: unknown[];
  metadata: unknown[];
  batched: boolean;
  statusCode: number;
  destination: BrazeDestination;
}

// Delete user types
export interface BrazeDeleteUserEvent {
  userAttributes: Array<{
    userId: string;
    email?: string;
    phone?: string;
  }>;
  config: BrazeDestinationConfig;
}
