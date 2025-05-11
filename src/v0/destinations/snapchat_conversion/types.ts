import { z } from 'zod';

import {
  Destination,
  RouterTransformationRequestData,
  Metadata,
  RudderMessage,
} from '../../../types';

import { BatchedRequest, BatchRequestOutput } from '../../../types/destinationTransformation';

// COMMON ENUMS AND CONSTANTS

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

// CONFIGURATION TYPES

/**
 * Event mapping schema for Rudder to Snapchat events
 */
export const EventMappingSchema = z.object({
  from: z.string().min(1, 'Source event name cannot be empty'),
  to: z.string().min(1, 'Destination event name cannot be empty'),
});

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
      // Either pixelId OR (both appId AND snapAppId) must be provided
      Boolean(data.pixelId || (data.appId && data.snapAppId)),
    {
      message: 'Either pixelId OR (both appId AND snapAppId) must be provided',
      path: ['pixelId', 'snapAppId', 'appId'],
    },
  );

export type SnapchatDestinationConfig = z.infer<typeof SnapchatDestinationConfigSchema>;
export type SnapchatDestination = Destination<SnapchatDestinationConfig>;

// COMMON REQUEST TYPES

/**
 * Router request type for Snapchat
 */
export type SnapchatRouterRequest = RouterTransformationRequestData<
  RudderMessage,
  SnapchatDestination
>;

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

// SNAPCHAT V2 API TYPES

/**
 * Headers for V2 API requests
 */
export type SnapchatV2Headers = {
  'Content-Type': string;
  Authorization: string;
};

/**
 * Parameters for V2 API requests
 */
export type SnapchatV2Params = Record<string, unknown>;

/**
 * Payload for V2 API requests
 */
export type SnapchatV2Payload = {
  event_type?: string;
  event_conversion_type?: EventConversionTypeValue;
  event_tag?: string;
  timestamp?: string;
  client_dedup_id?: string;
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
  hashed_idfv?: string;
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
export type SnapchatV2BatchedRequest = BatchedRequest<
  SnapchatV2Payload,
  SnapchatV2Headers,
  SnapchatV2Params
>;

/**
 * Batch request output for V2 API
 */
export type SnapchatV2BatchRequestOutput = BatchRequestOutput<
  SnapchatV2Payload,
  SnapchatV2Headers,
  SnapchatV2Params,
  SnapchatDestination
>;

/**
 * Processed event for V2 API
 */
export type SnapchatV2ProcessedEvent = {
  message: SnapchatV2BatchedRequest[];
  metadata: Partial<Metadata>;
  destination: SnapchatDestination;
};

// SNAPCHAT V3 API TYPES

/**
 * Headers for V3 API requests
 */
export type SnapchatV3Headers = {
  'Content-Type': string;
};

/**
 * Parameters for V3 API requests
 */
export type SnapchatV3Params = {
  access_token: string;
};

/**
 * User data for V3 API
 */
export type SnapchatV3UserData = {
  em?: string; // Email
  ph?: string; // Phone
  fn?: string; // First name
  ln?: string; // Last name
  ge?: string; // Gender
  ct?: string; // City
  zp?: string; // Zip code
  st?: string; // State
  country?: string;
  madid?: string; // Mobile ad ID
  client_ip_address?: string;
  client_user_agent?: string;
  sc_click_id?: string;
  sc_cookie1?: string;
  idfv?: string;
  [key: string]: unknown;
};

/**
 * Custom data for V3 API
 */
export type SnapchatV3CustomData = {
  order_id?: string;
  currency?: string;
  num_items?: string;
  value?: string | number;
  content_ids?: string[];
  content_category?: string | string[];
  content_name?: string;
  content_type?: string;
  search_string?: string;
  [key: string]: unknown;
};

/**
 * App data for V3 API
 */
export type SnapchatV3AppData = {
  app_id?: string;
  advertiser_tracking_enabled?: boolean;
  extinfo?: string[];
  [key: string]: unknown;
};

/**
 * Event data for V3 API
 */
export type SnapchatV3EventData = {
  event_name?: string;
  event_time?: string;
  event_source_url?: string;
  event_id?: string;
  action_source?: EventConversionTypeValue;
  data_processing_options?: string;
  user_data?: SnapchatV3UserData;
  custom_data?: SnapchatV3CustomData;
  app_data?: SnapchatV3AppData;
  [key: string]: unknown;
};

/**
 * Payload for V3 API requests
 */
export type SnapchatV3Payload = {
  data: SnapchatV3EventData[];
};

/**
 * Batched request for V3 API
 */
export type SnapchatV3BatchedRequest = BatchedRequest<
  SnapchatV3Payload,
  SnapchatV3Headers,
  SnapchatV3Params
>;

/**
 * Batch request output for V3 API
 */
export type SnapchatV3BatchRequestOutput = BatchRequestOutput<
  SnapchatV3Payload,
  SnapchatV3Headers,
  SnapchatV3Params,
  SnapchatDestination
>;

/**
 * Processed event for V3 API
 */
export type SnapchatV3ProcessedEvent = {
  message: SnapchatV3BatchedRequest;
  metadata: Partial<Metadata>;
  destination: SnapchatDestination;
};
