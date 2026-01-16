import {
  Destination,
  RouterTransformationRequestData,
  RudderMessage,
  Metadata,
} from '../../../types';
import {
  BatchedRequest,
  MultiBatchRequestOutput,
  ProcessorTransformationOutput,
} from '../../../types/destinationTransformation';

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
interface BrazeEvent {
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

export interface BrazeResponseHandlerParams {
  destinationResponse: {
    response?: {
      message?: string;
      errors?: unknown[];
    };
    status: number;
  };
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
  // Legacy field for backward compatibility (tests use this)
  alias_name?: string;
}

export interface BrazeDestinationConfig {
  restApiKey: string;
  dataCenter: string;
  appKey?: string;
  enableSubscriptionGroupInGroupCall?: boolean;
  sendPurchaseEventWithExtraProperties?: boolean;
  enableNestedArrayOperations?: boolean;
  supportDedup?: boolean;
  trackAnonymousUser?: boolean;
  enableIdentifyForAnonymousUser?: boolean;
  blacklistedEvents?: string[];
  whitelistedEvents?: string[];
}

export interface RudderBrazeMessage extends RudderMessage {
  properties?: {
    mergeObjectsUpdateOperation?: boolean;
  };
  traits?: {
    phone?: string;
    email?: string;
    subscriptionState?: string;
  };
}

export type BrazeDestination = Destination<BrazeDestinationConfig>;
export type BrazeRouterRequest = RouterTransformationRequestData<
  RudderBrazeMessage,
  BrazeDestination
>;

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

// Braze Track API request body structure
export interface BrazeTrackBatchPayload {
  partner?: string;
  attributes?: unknown[];
  events?: unknown[];
  purchases?: unknown[];
}

// Braze Subscription Group request body structure
export interface BrazeSubscriptionBatchPayload {
  subscription_groups?: unknown[];
}

// Braze Merge Users request body structure
export interface BrazeMergeBatchPayload {
  merge_updates?: unknown[];
}

// Union of all possible Braze batch payload types
export type BrazeBatchPayload =
  | BrazeTrackBatchPayload
  | BrazeSubscriptionBatchPayload
  | BrazeMergeBatchPayload;

// Headers type for Braze API requests
export type BrazeBatchHeaders = {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
};

// Params type for Braze API requests (typically empty)
export type BrazeBatchParams = Record<string, unknown>;

export type BrazeBatchRequest = BatchedRequest<
  BrazeBatchPayload,
  BrazeBatchHeaders,
  BrazeBatchParams
>;

export type BrazeTransformedEvent = {
  statusCode: number;
  batchedRequest?: ProcessorTransformationOutput;
  metadata?: Partial<Metadata>[];
  destination: BrazeDestination;
  error?: string;
  statTags?: object;
  authErrorCategory?: string;
};

export type BrazeBatchResponse =
  | MultiBatchRequestOutput<
      BrazeBatchPayload,
      BrazeBatchHeaders,
      BrazeBatchParams,
      BrazeDestination
    >
  | BrazeTransformedEvent;

// Type for individual transformed event that goes into processBatch

// Delete user types
export interface BrazeDeleteUserEvent {
  userAttributes: Array<{
    userId: string;
    email: string;
    phone: string;
  }>;
  config: BrazeDestinationConfig;
}
