import {
  Destination,
  Metadata,
  RouterTransformationRequestData,
  RudderMessage,
} from '../../../types';
import {
  BatchedRequest,
  ProcessorTransformationRequest,
} from '../../../types/destinationTransformation';

/**
 * Custom session event configuration from destination settings
 * Used to determine if an event should be treated as a session event
 */
interface SingularSessionEvent {
  sessionEventName: string;
}

/**
 * Singular destination configuration
 */
export interface SingularDestinationConfig {
  /**
   * Singular SDK Key for API authentication (required)
   */
  apiKey: string;

  /**
   * List of custom session events
   * Combined with default session events: Application Installed, Application Updated, Application Opened
   */
  sessionEventList?: SingularSessionEvent[];

  /**
   * Match ID source for Unity platforms
   * Values: 'advertisingId' or custom identifier
   */
  match_id?: 'advertisingId' | string;
}

/**
 * Product object for e-commerce revenue events
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
 * RudderStack message extended with Singular-specific properties
 */
export interface SingularMessage extends RudderMessage {
  properties?: {
    // E-commerce revenue fields
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

    // Event revenue validation fields
    purchase_receipt?: string;
    product_id?: string;
    sku?: string;
    purchase_transaction_id?: string;
    receipt_signature?: string;

    // iOS-specific attribution fields
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
 * Common parameters shared by both SESSION and EVENT endpoints
 *
 * Based on Singular S2S API documentation:
 * - EVENT: https://support.singular.net/hc/en-us/articles/31496864868635
 * - SESSION: https://support.singular.net/hc/en-us/articles/31394799175963
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

  // ==================== Network Connection ====================
  /** Network connection type: wifi or carrier */
  c?: 'wifi' | 'carrier';

  // ==================== Unity Platforms ====================
  /** Match ID for Unity platforms */
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
  /** Install source package name or store identifier (Android only) */
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
  /** Do Not Track status. 1=enabled (tracking disabled), 0=disabled (tracking enabled) */
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
 * Union type representing Singular S2S API request parameters
 *
 * - SingularSessionParams: GET /api/v1/launch (SESSION events)
 * - SingularEventParams: GET /api/v1/evt (EVENT events)
 */
export type SingularRequestParams = SingularSessionParams | SingularEventParams;

/**
 * Payload structure for Singular transformation
 */
export interface SingularPayload {
  payload: SingularRequestParams;
  eventAttributes?: Record<string, unknown>;
}

/**
 * Supported platform types (lowercase)
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
 * Platform mapping categories
 * - ANDROID: Android devices
 * - IOS: iOS/iPadOS/watchOS/tvOS devices
 * - unity: Unity platforms (PC, Xbox, PlayStation, Nintendo, MetaQuest)
 */
export type SingularPlatformMapping = 'ANDROID' | 'IOS' | 'unity';

/**
 * Event type enumeration
 * - SESSION: /api/v1/launch endpoint
 * - EVENT: /api/v1/evt endpoint
 */
export type SingularEventType = 'SESSION' | 'EVENT';

/**
 * Destination type with Singular configuration
 */
export type SingularDestination = Destination<SingularDestinationConfig>;

/**
 * Batch request for Singular transformation
 * GET request with query parameters
 */
export type SingularBatchRequest = BatchedRequest<
  Record<string, unknown>,
  Record<string, unknown>,
  SingularRequestParams
>;

/**
 * Processor transformation request
 */
export type SingularProcessorRequest = ProcessorTransformationRequest<
  SingularMessage,
  Metadata,
  SingularDestination
>;

/**
 * Router transformation request
 */
export type SingularRouterRequest = RouterTransformationRequestData<
  SingularMessage,
  Metadata,
  SingularDestination
>;
