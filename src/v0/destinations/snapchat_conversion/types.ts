import { z } from 'zod';

import {
  Destination,
  RouterTransformationRequestData,
  Metadata,
  RudderMessage,
} from '../../../types';

import {
  BatchedRequest as BaseBatchedRequest,
  BatchRequestOutput as BaseBatchRequestOutput,
} from '../../../types/destinationTransformation';

/**
 * Event conversion types supported by Snapchat
 */
export const EventConversionType = {
  WEB: 'WEB',
  MOBILE_APP: 'MOBILE_APP',
  OFFLINE: 'OFFLINE',
} as const;

export type EventConversionTypeValue =
  (typeof EventConversionType)[keyof typeof EventConversionType];

/**
 * API versions supported by Snapchat
 */
export const ApiVersion = {
  V2: 'legacyApi',
  V3: 'newApi',
} as const;

export type ApiVersionValue = (typeof ApiVersion)[keyof typeof ApiVersion];

/**
 * Event mapping schema for Rudder to Snapchat events
 */
export const EventMappingSchema = z.object({
  from: z.string().min(1, 'Source event name cannot be empty'),
  to: z.string().min(1, 'Destination event name cannot be empty'),
});

export type EventMapping = z.infer<typeof EventMappingSchema>;

/**
 * Snapchat destination configuration schema with validation
 */
export const SnapchatDestinationConfigSchema = z
  .object({
    apiKey: z.string().min(1, 'API key is required'),
    pixelId: z.string().optional(),
    snapAppId: z.string().optional(),
    appId: z.string().optional(),
    enableDeduplication: z.boolean().optional(),
    deduplicationKey: z.string().optional(),
    apiVersion: z.enum([ApiVersion.V2, ApiVersion.V3]).optional(),
    rudderEventsToSnapEvents: z.array(EventMappingSchema).optional(),
  })
  .passthrough()
  .refine(
    (data) =>
      // At least one of pixelId, snapAppId, or appId must be provided
      Boolean(data.pixelId || data.snapAppId || data.appId),
    {
      message: 'At least one of pixelId, snapAppId, or appId must be provided',
      path: ['pixelId', 'snapAppId', 'appId'],
    },
  );

export type SnapchatDestinationConfig = z.infer<typeof SnapchatDestinationConfigSchema>;
export type SnapchatDestination = Destination<SnapchatDestinationConfig>;

/**
 * Common types for both API versions
 */

/**
 * Router request type for Snapchat
 */
export type CommonRouterRequest = RouterTransformationRequestData<
  RudderMessage,
  SnapchatDestination
>;

/**
 * Event processing input type
 */
export type CommonEventProcessingInput = {
  message: RudderMessage;
  destination: SnapchatDestination;
};

/**
 * Configuration for payload processing
 */
export type CommonProcessPayloadConfig = {
  actionSource: EventConversionTypeValue;
  pixelId?: string;
  snapAppId?: string;
  appId?: string;
  enableDeduplication?: boolean;
  deduplicationKey?: string;
};

// For backward compatibility
export type SnapchatRouterRequest = CommonRouterRequest;
export type EventProcessingInput = CommonEventProcessingInput;

/**
 * Types specific to Snapchat API V2 (Legacy API)
 */

/**
 * Headers for V2 API requests
 */
export type V2Headers = {
  'Content-Type': string;
  Authorization: string;
};

/**
 * Payload for V2 API requests
 */
export type V2Payload = {
  event_type?: string;
  event_conversion_type?: EventConversionTypeValue;
  event_tag?: string;
  timestamp?: string;
  client_dedup_id?: string; // Deduplication ID
  item_ids?: string[];
  price?: number | string;
  data_use?: string;
  pixel_id?: string;
  page_url?: string;
  snap_app_id?: string;
  app_id?: string;
  user_agent?: string;
  hashed_email?: string;
  hashed_phone_number?: string;
  hashed_ip_address?: string;
  hashed_mobile_ad_id?: string;
  hashed_idfv?: string; // iOS Vendor Identifier
  hashed_first_name_sha?: string;
  hashed_middle_name_sha?: string;
  hashed_last_name_sha?: string;
  hashed_city_sha?: string;
  hashed_state_sha?: string;
  hashed_zip?: string;
  [key: string]: unknown;
};

/**
 * Batched request for V2 API
 */
export type V2BatchedRequest = BaseBatchedRequest<V2Payload, V2Headers>;

/**
 * Batch request output for V2 API
 */
export type V2BatchRequestOutput = BaseBatchRequestOutput<
  V2Payload,
  V2Headers,
  Record<string, unknown>,
  SnapchatDestination
>;

/**
 * Response type for V2 API
 */
export type V2Response = {
  endpoint: string;
  headers: V2Headers;
  method: string;
  body: {
    JSON: V2Payload;
  };
};

/**
 * Batch event for V2 API
 */
export type V2BatchEvent = {
  message:
    | V2Response[]
    | V2Response
    | V2BatchedRequest[]
    | V2BatchedRequest
    | (V2BatchedRequest | V3BatchedRequest)[];
  metadata: Partial<Metadata>;
  destination: SnapchatDestination;
};

/**
 * Types specific to Snapchat API V3 (New API)
 */

/**
 * Parameters for V3 API requests
 */
export type V3Params = {
  access_token?: string;
  [key: string]: string | undefined;
};

/**
 * User data for V3 API
 */
export type V3UserData = {
  email?: string;
  phone?: string;
  external_id?: string;
  ip_address?: string;
  user_agent?: string;
  hashed_email?: string;
  hashed_phone?: string;
  hashed_ip_address?: string;
  hashed_mobile_ad_id?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  sc_click_id?: string;
  sc_cookie1?: string;
  idfv?: string; // iOS Vendor Identifier
  em?: string; // Hashed email
  ph?: string; // Hashed phone
  madid?: string; // Mobile ad ID
  fn?: string; // First name
  ln?: string; // Last name
  ge?: string; // Gender
  ct?: string; // City
  zp?: string; // Zip code
  st?: string; // State
  country?: string;
  [key: string]: unknown;
};

/**
 * Custom data for V3 API
 */
export type V3CustomData = {
  currency?: string;
  value?: string | number;
  price?: string | number;
  content_ids?: string[] | string;
  content_category?: string;
  content_name?: string;
  content_type?: string;
  num_items?: string | number;
  search_string?: string;
  order_id?: string;
  description?: string;
  status?: string;
  ext_info?: string;
  [key: string]: unknown;
};

/**
 * App data for V3 API
 */
export type V3AppData = {
  app_id?: string;
  advertiser_tracking_enabled?: string | boolean;
  extinfo?: string | string[]; // Extended information
  [key: string]: unknown;
};

/**
 * Event data for V3 API
 */
export type V3EventData = {
  event_type?: string;
  event_name?: string;
  event_conversion_type?: EventConversionTypeValue;
  event_tag?: string;
  timestamp?: string;
  event_id?: string;
  client_dedup_id?: string; // Deduplication ID
  item_ids?: string[];
  price?: number;
  data_use?: string[];
  user_data: V3UserData;
  custom_data?: V3CustomData;
  app_data?: V3AppData;
  action_source?: EventConversionTypeValue;
  event_time?: string;
  data_processing_options?: string[];
  event_source_url?: string;
  [key: string]: unknown;
};

/**
 * Payload for V3 API requests
 */
export type V3Payload = {
  data: V3EventData[];
};

/**
 * Batched request for V3 API
 */
export type V3BatchedRequest = BaseBatchedRequest<V3Payload, Record<string, unknown>, V3Params>;

/**
 * Batch request output for V3 API
 */
export type V3BatchRequestOutput = BaseBatchRequestOutput<
  V3Payload,
  Record<string, unknown>,
  V3Params,
  SnapchatDestination
>;

/**
 * Response type for V3 API
 */
export type V3Response = {
  endpoint: string;
  headers: {
    Authorization?: string;
    'Content-Type': string;
  };
  method: string;
  params?: V3Params;
  body: {
    JSON: V3Payload;
  };
};

/**
 * Processed event for V3 API
 */
export type V3ProcessedEvent = {
  message: BaseBatchedRequest<V3Payload, Record<string, unknown>, V3Params>;
  metadata: Partial<Metadata>;
  destination: SnapchatDestination;
};

/**
 * Common response type for API calls (used for both V2 and V3)
 */
export type SnapchatResponse = V2Response | V3Response;

/**
 * Type for batch response item
 */
export type BatchResponseItem = {
  batchedRequest: {
    batch: V2Payload[] | V3Payload[];
    endpoint: string;
    headers: V2Headers;
    params: V3Params;
    method: string;
  };
  metadata: Partial<Metadata>[];
  destination: SnapchatDestination;
  statusCode: number;
};

// For backward compatibility
export type SnapchatUserData = V3UserData;
export type SnapchatCustomData = V3CustomData;
export type SnapchatAppData = V3AppData;
export type SnapchatEventData = V3EventData;
export type SnapchatPayloadV2 = V2Payload;
export type SnapchatPayloadV3 = V3Payload;
export type SnapchatV2Headers = V2Headers;
export type SnapchatV3Params = V3Params;
export type ProcessedEvent = V3ProcessedEvent;
export type SnapchatV2BatchedRequest = V2BatchedRequest;
export type SnapchatV2BatchRequestOutput = V2BatchRequestOutput;
export type SnapchatV3BatchedRequest = V3BatchedRequest;
export type SnapchatV3BatchRequestOutput = V3BatchRequestOutput;
export type BatchEvent = V2BatchEvent;
