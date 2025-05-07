import { z } from 'zod';

import {
  Connection,
  Destination,
  DestinationConnectionConfig,
  RouterTransformationRequestData,
  Metadata,
} from '../../../types';

import {
  BatchedRequest,
  BatchedRequestBody,
  BatchRequestOutput,
} from '../../../types/destinationTransformation';

// Define event conversion types
export const EventConversionType = {
  WEB: 'WEB',
  MOBILE_APP: 'MOBILE_APP',
  OFFLINE: 'OFFLINE',
} as const;

export type EventConversionTypeValue =
  (typeof EventConversionType)[keyof typeof EventConversionType];

// Define API versions
export const ApiVersion = {
  V2: 'legacyApi',
  V3: 'newApi',
} as const;

export type ApiVersionValue = (typeof ApiVersion)[keyof typeof ApiVersion];

// Snapchat specific configuration types
export const SnapchatDestinationConfigSchema = z
  .object({
    apiKey: z.string(),
    pixelId: z.string().optional(),
    snapAppId: z.string().optional(),
    appId: z.string().optional(),
    enableDeduplication: z.boolean().optional(),
    deduplicationKey: z.string().optional(),
    apiVersion: z.string().optional(),
    rudderEventsToSnapEvents: z
      .array(
        z.object({
          from: z.string(),
          to: z.string(),
        }),
      )
      .optional(),
  })
  .passthrough();

export type SnapchatDestinationConfig = z.infer<typeof SnapchatDestinationConfigSchema>;
export type SnapchatDestination = Destination<SnapchatDestinationConfig>;
export type SnapchatConnection = Connection<DestinationConnectionConfig<Record<string, unknown>>>;

export type SnapchatMessage = {
  type?: string;
  event?: string;
  channel?: string;
  timestamp?: string;
  messageId?: string;
  properties?: Record<string, unknown>;
  context?: {
    device?: {
      type?: string;
      id?: string;
      advertisingId?: string;
      attTrackingStatus?: number;
      model?: string;
    };
    app?: {
      namespace?: string;
      build?: string;
      version?: string;
    };
    os?: {
      version?: string;
    };
    screen?: {
      width?: string | number;
      height?: string | number;
      density?: string | number;
    };
    locale?: string;
    timezone?: string;
    network?: {
      carrier?: string;
    };
    ip?: string;
  };
  request_ip?: string;
  traits?: Record<string, unknown>;
  statusCode?: number;
};

// Response type for API calls
export type SnapchatResponse = {
  endpoint: string;
  headers: {
    Authorization?: string;
    'Content-Type': string;
  };
  method: string;
  params?: Record<string, string | undefined>;
  body: {
    JSON: SnapchatPayloadV2 | SnapchatPayloadV3;
  };
};

// Type for event processing
export type EventProcessingInput = {
  message: SnapchatMessage;
  destination: SnapchatDestination;
};

// Type for batch processing
export type BatchEvent = {
  message: SnapchatResponse[] | SnapchatResponse;
  metadata: Partial<Metadata>;
  destination: SnapchatDestination;
};

// Type for batch response
export type BatchResponseItem = {
  batchedRequest: {
    batch: SnapchatPayloadV2[] | SnapchatPayloadV3[];
    endpoint: string;
    headers: SnapchatHeaders;
    params: SnapchatParams;
    method: string;
  };
  metadata: Partial<Metadata>[];
  destination: SnapchatDestination;
  statusCode: number;
};

export type SnapchatRouterRequest = RouterTransformationRequestData<
  SnapchatMessage,
  SnapchatDestination,
  SnapchatConnection
>;

// Snapchat Payload Types
export type SnapchatUserData = {
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
  idfv?: string;
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

export type SnapchatCustomData = {
  currency?: string;
  value?: string;
  price?: string;
  content_ids?: string[] | string;
  content_category?: string;
  content_name?: string;
  content_type?: string;
  num_items?: string;
  search_string?: string;
  order_id?: string;
  description?: string;
  status?: string;
  ext_info?: string;
  [key: string]: unknown;
};

export type SnapchatAppData = {
  app_id?: string;
  advertiser_tracking_enabled?: string;
  extinfo?: string | string[];
  [key: string]: unknown;
};

export type SnapchatEventData = {
  event_type?: string;
  event_name?: string;
  event_conversion_type?: string;
  event_tag?: string;
  timestamp?: string;
  event_id?: string;
  client_dedup_id?: string;
  item_ids?: string[];
  price?: number;
  data_use?: string[];
  user_data: SnapchatUserData;
  custom_data?: SnapchatCustomData;
  app_data?: SnapchatAppData;
  action_source?: string;
  event_time?: string;
  data_processing_options?: string[];
  event_source_url?: string;
  [key: string]: unknown;
};

export type SnapchatPayloadV2 = {
  event_type: string;
  event_conversion_type: string;
  event_tag?: string;
  timestamp?: string;
  client_dedup_id?: string;
  item_ids?: string[];
  price?: number;
  data_use?: string[];
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
  [key: string]: unknown;
};

export type SnapchatPayloadV3 = {
  data: SnapchatEventData[];
};

export type SnapchatHeaders = {
  'Content-Type': string;
  Authorization?: string;
};

export type SnapchatParams = {
  access_token?: string;
  [key: string]: string | undefined;
};

export type ProcessedEvent = {
  message: {
    body: {
      JSON: SnapchatPayloadV2 | SnapchatPayloadV3;
    };
    endpoint: string;
    headers: SnapchatHeaders;
    params: SnapchatParams;
    method: string;
  };
  metadata: Partial<Metadata>;
  destination: SnapchatDestination;
};

export type SnapchatBatchResponse = BatchRequestOutput<
  SnapchatPayloadV2 | SnapchatPayloadV3,
  SnapchatHeaders,
  SnapchatParams,
  SnapchatDestination
>;

export type SnapchatBatchedRequest = BatchedRequest<
  SnapchatPayloadV2 | SnapchatPayloadV3,
  SnapchatHeaders,
  SnapchatParams
>;

export type SnapchatBatchedRequestBody = BatchedRequestBody<SnapchatPayloadV2 | SnapchatPayloadV3>;
