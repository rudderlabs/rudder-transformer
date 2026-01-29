import { Destination, RouterTransformationRequestData, RudderMessage } from '../../../types';
import { BatchedRequest } from '../../../types/destinationTransformation';

/**
 * Session Event configuration in destination config
 */
interface SingularSessionEvent {
  sessionEventName: string;
}

export interface SingularDestinationConfig {
  /**
   * Singular API Key (required)
   */
  apiKey: string;

  /**
   * List of custom session events to track
   */
  sessionEventList?: SingularSessionEvent[];

  /**
   * Match ID type for Unity platforms
   * Can be 'advertisingId' or custom match_id from properties
   */
  match_id?: 'advertisingId' | string;
}

/**
 * Product object for e-commerce events
 */
export interface SingularProduct {
  product_id?: string;
  sku?: string;
  name?: string;
  price?: number;
  quantity?: number;
  category?: string;
  url?: string;
  image_url?: string;
  currency?: string;
  purchase_receipt?: string;
  purchase_transaction_id?: string;
  receipt_signature?: string;
}

/**
 * Extended RudderMessage with Singular-specific properties
 */
export interface SingularMessage extends RudderMessage {
  properties?: {
    // E-commerce fields
    products?: SingularProduct[];
    currency?: string;
    price?: number;
    quantity?: number;
    revenue?: number;
    total?: number;
    value?: number;

    // Session event fields
    url?: string;
    referring_application?: string;
    install_receipt?: string;
    asid?: string;
    install_ref?: string;
    build?: string;
    install?: string;

    // Event fields
    purchase_receipt?: string;
    product_id?: string;
    sku?: string;
    purchase_transaction_id?: string;
    receipt_signature?: string;

    // iOS-specific fields
    userAgent?: string;
    attribution_token?: string;
    skan_conversion_value?: string;
    skan_first_call_timestamp?: string;
    skan_last_call_timestamp?: string;

    // Unity platforms
    match_id?: string;
  };
  context?: RudderMessage['context'] & {
    os?: {
      name?: string;
      version?: string;
    };
    device?: {
      advertisingId?: string;
      adTrackingEnabled?: boolean;
    };
    network?: {
      wifi?: boolean;
      carrier?: string;
    };
  };
}

/**
 * Common parameters for all Singular API endpoints
 *
 * These types document the Singular API based on official docs and mapping configs.
 * The mapping configs (*.json files) enforce required fields via constructPayload(),
 * which generates payloads conforming to these interfaces.
 *
 * Note: Runtime uses Record<string, unknown> due to TypeScript union type limitations
 * when conditionally adding properties (e.g., dnt only for SESSION, is_revenue_event only for EVENT).
 * The generated payloads structurally match these interfaces.
 *
 * Ref: https://support.singular.net/hc/en-us/articles/31496864868635 (EVENT)
 * Ref: https://support.singular.net/hc/en-us/articles/31394799175963 (SESSION)
 */
interface SingularCommonParams {
  // ==================== API Authentication (Required) ====================
  /** Singular SDK Key for API authentication */
  a: string;

  // ==================== Platform (Required) ====================
  /** Platform of the application. Allowed: Android, iOS, Web, PC, Xbox, Playstation, Nintendo, MetaQuest, CTV */
  p: 'Android' | 'iOS' | 'Web' | 'PC' | 'Xbox' | 'Playstation' | 'Nintendo' | 'MetaQuest' | 'CTV';

  // ==================== Device Identifiers (Platform-specific, at least one required) ====================
  /** iOS Identifier for Advertisers (IDFA). Required for iOS. Omit if unavailable (user denied ATT). */
  idfa?: string;

  /** iOS Identifier for Vendors (IDFV). Always required for iOS regardless of ATT status. */
  idfv?: string;

  /** Android Google Advertising ID (GAID). Required on Google Play devices. */
  aifa?: string;

  /** Android App Set ID. Always required on Google Play devices. */
  asid?: string;

  /** Amazon Advertising ID. Required for Amazon Fire devices. */
  amid?: string;

  /** Open Advertising Identifier (OAID). Required for Chinese OEM devices (Huawei, Xiaomi, OPPO, Vivo). */
  oaid?: string;

  /** Android ID. Restricted use - only for non-Google Play devices. */
  andi?: string;

  /** Singular Device ID. Required for Web, PC, Console, CTV platforms. */
  sdid?: string;

  /** Enterprise-only client-defined identifier. Requires special enablement. */
  sing?: string;

  // ==================== Device Parameters (Required) ====================
  /** Public IPv4 IP address of device. IPv6 supported but IPv4 recommended. */
  ip?: string;

  /** OS version of device at event/session time */
  ve: string;

  // ==================== Application Parameters (Required) ====================
  /** App identifier (case-sensitive). Android: Package Name, iOS: Bundle ID, PC/Console: Your identifier */
  i: string;

  // ==================== iOS-specific Parameters ====================
  /**
   * App Tracking Transparency (ATT) status code (iOS 14.5+).
   * 0=Undetermined, 1=Restricted, 2=Denied, 3=Authorized.
   * Always required for iOS even if ATT not implemented.
   */
  att_authorization_status?: 0 | 1 | 2 | 3;

  // ==================== Optional Device Parameters ====================
  /** Device make (manufacturer name). Must be used with mo (model). */
  ma?: string;

  /** Device model. Must be used with ma (make). */
  mo?: string;

  /** IETF locale tag (e.g., en_US) */
  lc?: string;

  /** Device build identifier, URL-encoded */
  bd?: string;

  // ==================== Timestamp Parameters ====================
  /** 10-digit Unix timestamp */
  utime?: number;

  /** 13-digit Unix timestamp with milliseconds */
  umilisec?: number;

  // ==================== Network Parameters ====================
  /** Instructs Singular to extract IP from HTTP request instead of ip parameter */
  use_ip?: boolean;

  /** ISO 3166-1 alpha-2 two-letter country code. Required when IP not available or use_ip=true */
  country?: string;

  // ==================== Data Privacy ====================
  /** JSON URL-encoded end-user consent for data sharing */
  data_sharing_options?: string;

  // ==================== Cross-Device Support ====================
  /** Your internal user ID for cross-device tracking */
  custom_user_id?: string;

  // ==================== SKAdNetwork Support (iOS) ====================
  /** Latest SKAdNetwork conversion value */
  skan_conversion_value?: number;

  /** Unix timestamp of first call to SKAdNetwork API */
  skan_first_call_timestamp?: number;

  /** Unix timestamp of most recent call to SKAdNetwork API */
  skan_last_call_timestamp?: number;

  // ==================== Custom Properties ====================
  /** JSON URL-encoded object with custom key-value pairs. Max 5 pairs, 200 chars per key/value */
  global_properties?: string;

  // ==================== Network Connection (Common to both SESSION and EVENT) ====================
  /** Network connection type: wifi or carrier. Added by implementation for both SESSION and EVENT. */
  c?: 'wifi' | 'carrier';

  // ==================== Unity Platforms ====================
  /** Match ID for Unity platforms. Used for both SESSION and EVENT. */
  match_id?: string;
}

/**
 * SESSION Endpoint Request Parameters
 * Ref: https://support.singular.net/hc/en-us/articles/31394799175963
 * Endpoint: GET https://s2s.singular.net/api/v1/launch
 */
export interface SingularSessionParams extends SingularCommonParams {
  // ==================== Application Parameters (Required) ====================
  /** Application version */
  app_v: string;

  /** Indicates if session represents first session after install or reinstall */
  install: boolean | 'true' | 'false';

  /** Unix timestamp of first app install */
  install_time?: number;

  /** Unix timestamp of last app update */
  update_time?: number;

  // ==================== Fraud Prevention Parameters ====================
  /** Install source package name or store identifier (Android, PC) */
  install_source?: string;

  /** Base64-encoded iOS install receipt for fraud validation */
  install_receipt?: string;

  // ==================== Deep Linking Parameters ====================
  /** URL-encoded deep link, Universal Link, or App Link that opened the app */
  openuri?: string;

  /** Indicates if app expects deferred deep link URL in response */
  ddl_enabled?: boolean | 'true' | 'false';

  /** Requests resolution of Singular short link to long link. Use with openuri */
  singular_link_resolve_required?: boolean | 'true' | 'false';

  // ==================== Advanced Attribution Parameters ====================
  /** JSON URL-encoded Google Install Referrer information (Android Google Play) */
  install_ref?: string;

  /** JSON URL-encoded Meta Install Referrer (Android Google Play). Not recommended if AMM enabled */
  meta_ref?: string;

  /** Apple Search Ads attribution token from AdServices framework (iOS 14.3+) */
  attribution_token?: string;

  // ==================== Network Parameters ====================
  /** URL-encoded User Agent string */
  ua?: string;

  /** Carrier name of internet provider */
  cn?: string;

  // ==================== Uninstall Tracking Support ====================
  /** Hex-encoded Apple Push Notification Service (APNs) device token (iOS) */
  apns_token?: string;

  /** Firebase Cloud Messaging device token (Android) */
  fcm?: string;

  // ==================== Data Privacy ====================
  /** Do Not Track status. 1=enabled, 0=disabled */
  dnt?: 0 | 1;

  /** Indicates if Do Not Track is OFF. 0=DNT enabled, 1=DNT disabled */
  dntoff?: 0 | 1;

  // ==================== Google Ads ICM Support (Beta) ====================
  /** Required for Google Ads Integrated Conversion Measurement (iOS) */
  odm_info?: string;

  /** Required for Google Ads Integrated Conversion Measurement (iOS) */
  odm_error?: string;

  // ==================== Legacy Parameters (used in current implementation) ====================
  /** App name */
  n?: string;

  /** Session notification name */
  sessionNotificationName?: string;

  [key: string]: unknown;
}

/**
 * EVENT Endpoint Request Parameters
 * Ref: https://support.singular.net/hc/en-us/articles/31496864868635
 * Endpoint: GET https://s2s.singular.net/api/v1/evt
 */
export interface SingularEventParams extends SingularCommonParams {
  // ==================== Event Parameters (Required) ====================
  /** Name of the event being tracked. Maximum 32 ASCII characters */
  n: string;

  // ==================== Event Attributes ====================
  /** JSON URL-encoded string specifying custom event attributes. Max 500 ASCII chars per key/value */
  e?: string | Record<string, unknown>;

  // ==================== Revenue Tracking ====================
  /** Specifies whether event is revenue event. Can be omitted if event name is __iap__ or non-zero amt provided */
  is_revenue_event?: boolean | 'true' | 'false';

  /** Currency amount of transaction. Use with cur parameter */
  amt?: number;

  /** ISO 4217 three-letter uppercase currency code. Use with amt parameter */
  cur?: string;

  // ==================== Revenue Validation Parameters ====================
  /** Receipt received from purchase transaction (iOS: StoreKit receipt, Android: Google Play Purchase object) */
  purchase_receipt?: string;

  /** Signature used to sign purchase receipt (Android only) */
  receipt_signature?: string;

  /** Product SKU identifier */
  purchase_product_id?: string;

  /** Transaction identifier */
  purchase_transaction_id?: string;

  // ==================== Legacy Parameters (used in current implementation) ====================
  /** Product Name/ID */
  pn?: string;

  /** Product SKU */
  psku?: string;

  /** Price */
  prc?: number;

  /** Quantity */
  q?: number;
}

/**
 * Union type representing all Singular API request parameters
 *
 * Payloads generated by constructPayload() structurally conform to one of these types:
 * - SingularSessionParams: for /api/v1/launch (SESSION) endpoint
 * - SingularEventParams: for /api/v1/evt (EVENT) endpoint
 *
 * The mapping configs (SINGULAR*Config.json) enforce required fields that match these interfaces.
 *
 * Note: Due to TypeScript union type restrictions with conditional property assignment,
 * the runtime code uses Record<string, unknown>. However, the generated payloads are
 * guaranteed to conform to these interfaces structurally via constructPayload() and
 * the mapping configs.
 *
 * Use this type for:
 * - Documentation of the complete API surface
 * - Type reference when understanding payload structure
 * - Validation utilities (with type guards/narrowing)
 */
export type SingularRequestParams = SingularSessionParams | SingularEventParams;

/**
 * Singular processor output (GET request with params)
 * Always uses EVENT endpoint parameters since processor creates event requests (not session requests)
 */
export interface SingularProcessorOutput {
  version: string;
  type: string;
  method: string;
  endpoint: string;
  params: SingularEventParams;
  headers?: Record<string, unknown>;
  body?: Record<string, unknown>;
  files?: Record<string, unknown>;
}

/**
 * Union type for Singular transformation response
 * Can be a single output or an array of outputs (for products)
 */
export type SingularTransformationOutput = SingularProcessorOutput | SingularProcessorOutput[];

/**
 * Payload structure returned by platformWisePayloadGenerator
 *
 * The payload is generated by constructPayload() using mapping configs (*.json) that enforce
 * required fields, then additional properties are conditionally added based on event type:
 * - SESSION events: adds dnt, openuri, install_source, c
 * - EVENT events: adds is_revenue_event, e (event attributes)
 *
 * Uses SingularRequestParams to maintain type safety - the function overloads ensure
 * the correct type (SingularSessionParams or SingularEventParams) is returned based on
 * the sessionEvent boolean parameter.
 */
export interface SingularPayload {
  payload: SingularRequestParams;
  eventAttributes?: Record<string, unknown>;
}

/**
 * Platform type (lowercase for internal use)
 */
export type SingularPlatform =
  | 'android'
  | 'ios'
  | 'pc'
  | 'xbox'
  | 'playstation'
  | 'nintendo'
  | 'metaquest';

/**
 * Platform mapping values (uppercase for config)
 */
export type SingularPlatformMapping = 'ANDROID' | 'IOS' | 'unity';

/**
 * Event type enumeration
 */
export type SingularEventType = 'SESSION' | 'EVENT';

/**
 * Exclusion list type for extracting custom fields
 */
export type SingularExclusionList = string[];

/**
 * Strongly typed Destination with Singular config
 */
export type SingularDestination = Destination<SingularDestinationConfig>;

/**
 * Batch request type with properly typed params
 * Params are typed as SingularRequestParams (union of SingularSessionParams | SingularEventParams)
 */
export type SingularBatchRequest = BatchedRequest<
  Record<string, unknown>,
  Record<string, unknown>,
  SingularRequestParams
>;

/**
 * Router transformation request with Singular-specific types
 */
export type SingularRouterRequest = RouterTransformationRequestData<
  SingularMessage,
  SingularDestination
>;
