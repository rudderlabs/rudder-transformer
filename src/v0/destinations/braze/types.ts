import {
  Destination,
  RouterTransformationRequestData,
  RudderMessage,
  Metadata,
} from '../../../types';
import {
  BatchedRequest,
  BatchRequestOutput,
  MultiBatchRequestOutput,
  ProcessorTransformationOutput,
  ProxyMetdata,
  ProxyV1Request,
} from '../../../types/destinationTransformation';

// Braze User Alias Object
interface BrazeUserAlias {
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

  custom_attributes?: Record<string, unknown>;

  // Custom attributes
  [key: string]: unknown;
}
// Braze Event Object (Complete API specification)
// Ref: https://www.braze.com/docs/api/objects_filters/event_object/
export interface BrazeEvent {
  // User identifiers - at least one is required per Braze API
  external_id?: string;
  user_alias?: BrazeUserAlias;
  braze_id?: string;
  email?: string;
  phone?: string;

  // Optional app identifier
  app_id?: string;

  // Required fields
  name: string; // Event name (required)
  time: string; // ISO 8601 datetime or 'yyyy-MM-dd'T'HH:mm:ss:SSSZ' format (required)

  // Optional event properties
  properties?: Record<string, unknown>;

  // Control flags
  // When using "user_alias", "Update Only" mode is always true
  _update_existing_only?: boolean;
}

// Braze Purchase Object (Complete API specification)
// Ref: https://www.braze.com/docs/api/objects_filters/purchase_object/
// Revenue from a purchase object is calculated as the product of quantity and price
export interface BrazePurchase {
  // User identifiers - at least one is required per Braze API
  external_id?: string;
  user_alias?: BrazeUserAlias;
  braze_id?: string;
  email?: string;
  phone?: string;

  // Optional app identifier
  // Ref: https://www.braze.com/docs/api/identifier_types/#app-identifier
  app_id?: string;

  // Required purchase fields
  // Identifier for the purchase (e.g., Product Name or Product Category)
  product_id: string;

  // ISO 4217 Alphabetic Currency Code (e.g., USD, EUR, JPY)
  currency: string;

  // Value in the base currency unit (e.g., Dollars for USD, Yen for JPY)
  price: number;

  // Time of purchase in ISO 8601 format
  time: string;

  // Optional: Quantity purchased (defaults to 1, must be <= 100)
  // Note: Braze treats a quantity X as X separate purchases with quantity 1
  quantity?: number;

  // Optional purchase properties for additional metadata
  properties?: Record<string, unknown>;

  // Control flags
  // Setting this flag to true puts the API in "Update Only" mode
  // When using "user_alias", "Update Only" mode is always true
  _update_existing_only?: boolean;
}

// Braze Track Request Body
export interface BrazeTrackRequestBody {
  partner?: string;
  attributes?: BrazeUserAttributes[];
  events?: BrazeEvent[];
  purchases?: BrazePurchase[];
}

/**
 * Alias to identify for user merging
 * NOTE: At least ONE of external_id, user_alias, or (alias_name + alias_label) is required
 */
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

// Single entry in Braze's per-item partial-failure array. Braze surfaces
// per-item validation failures inside an otherwise-2xx `/users/track`
// response as `errors[i] = { type, input_array, index }` — the network
// handler correlates each entry back to an originating job by looking up
// `input_array` + `index` against the per-metadata `destInfo` positional
// map populated on the router-transform side.
export interface BrazeError {
  type: string;
  input_array: string;
  index: number;
}

// Populated on the metadata of `/users/track` router outputs so the v1
// networkHandler can correlate Braze's per-item `errors[]` entries (keyed by
// input_array + index) back to the originating job. Set in `processBatch`
// when the outgoing chunk is assembled.
//
// Design-doc contract (Braze partial-error handling, Option 1, Section 4):
// - Every index field is an array. Length-1 arrays for the standard single-
//   contribution case; longer only when a job legitimately contributes
//   multiple entries to the same sub-array (e.g. order-completed with
//   multiple purchase items).
// - Fields live at the top of `destInfo` (no per-destination wrapper) — the
//   fields are populated only by Braze's router transform and read only by
//   Braze's network handler within a single destination's request flow.
export interface BrazeDestInfo {
  attributesIndices?: number[];
  eventsIndices?: number[];
  purchasesIndices?: number[];
}

export interface BrazeResponseHandlerParams {
  destinationResponse: {
    response?: any;
    status: number;
  };
  rudderJobMetadata: ProxyMetdata[];
  // The framework's `deliver` step (nativeIntegration.ts) always forwards the
  // original ProxyV1Request as `destinationRequest`. The v1 networkHandler
  // uses its `endpointPath` (e.g. `'users/track'`) to decide whether to run
  // the 296 per-item correlation logic — Braze's `/users/track` is the only
  // endpoint that returns per-entry `errors[]`. Optional so unit-test call
  // sites that don't need endpoint-dispatch can omit it; when absent the
  // handler skips correlation and falls back to uniform per-job outcomes.
  destinationRequest?: ProxyV1Request;
}

export interface BrazeUser extends BrazeUserAttributes {
  user_aliases?: BrazeUserAlias[];
}

// Braze /users/export/ids API Response
export interface BrazeUserExportResponse {
  users: BrazeUser[];
  message: string;
  invalid_user_ids?: string[];
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
  // When true, RS ecommerce track events are mapped to Braze recommended
  // `ecommerce.*` events instead of legacy custom/purchase events.
  // Single toggle gates both cloud and device-mode SDKs.
  useEcommerceRecommendedEvents?: boolean;
}

// Product object structure for e-commerce events
interface BrazeProduct {
  product_id?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  [key: string]: unknown; // Allow additional properties
}

export interface RudderBrazeMessage extends RudderMessage {
  properties?: {
    mergeObjectsUpdateOperation?: boolean;
    products?: BrazeProduct[]; // Array of products for e-commerce events
    currency?: string; // Currency at the order level
    [key: string]: unknown; // Allow additional properties
  };
  traits?: {
    phone?: string;
    email?: string;
    subscriptionState?: string;
    [key: string]: unknown; // Allow additional traits
  };
  previousId?: string;
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

// Braze Subscription Group request body structure
export interface BrazeSubscriptionBatchPayload {
  subscription_groups?: BrazeSubscriptionGroup[];
}

// Braze Merge Update Object
export interface BrazeMergeUpdate {
  identifier_to_merge: {
    external_id?: string;
  };
  identifier_to_keep: {
    external_id?: string;
  };
}

// Braze Merge Users request body structure
export interface BrazeMergeBatchPayload {
  merge_updates?: BrazeMergeUpdate[];
}

// Union of all possible Braze batch payload types. Each outgoing HTTP request
// populates fields for exactly one endpoint (`/users/track` OR subscription-
// groups OR alias-merge), so a body is one of these three shapes at runtime.
// Consumers reading `body.JSON` must narrow (via `in` guards or a boundary
// cast to a specific member) before accessing member-specific fields.
export type BrazeBatchPayload =
  | BrazeTrackRequestBody
  | BrazeSubscriptionBatchPayload
  | BrazeMergeBatchPayload;

// Headers type for Braze API requests
export type BrazeBatchHeaders = {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
};

type BrazeBatchParams = Record<string, unknown>;

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
  statTags?: Record<string, unknown>;
  authErrorCategory?: string;
};

// `processBatch` emits either shape depending on `BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS`:
// - OFF (default): a single `MultiBatchRequestOutput` per invocation, its
//   `batchedRequest` an array of every outgoing HTTP request across track/
//   subscription/merge, and a flat success-metadata list — matches the
//   pre-INT-6808 shape callers still expect.
// - ON: one `BatchRequestOutput` per outgoing HTTP request, each carrying
//   its scoped metadata slice and (for track chunks) per-metadata `destInfo`
//   positional maps consumed by the v1 networkHandler.
export type BrazeBatchResponse =
  | BatchRequestOutput<BrazeBatchPayload, BrazeBatchHeaders, BrazeBatchParams, BrazeDestination>
  | MultiBatchRequestOutput<
      BrazeBatchPayload,
      BrazeBatchHeaders,
      BrazeBatchParams,
      BrazeDestination
    >
  | BrazeTransformedEvent;

// Delete user types
export interface BrazeDeleteUserEvent {
  userAttributes: Array<{
    userId?: string;
    email?: string;
    phone?: string;
  }>;
  config: BrazeDestinationConfig;
}
