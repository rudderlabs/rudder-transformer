import { z } from 'zod';

import {
  Connection,
  Destination,
  DestinationConnectionConfig,
  RouterTransformationRequestData,
} from '../../../types';

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
export type SnapchatConnection = Connection<DestinationConnectionConfig<Record<string, any>>>;

export type SnapchatRouterRequest = RouterTransformationRequestData<
  Record<string, any>,
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
  [key: string]: any;
};

export type SnapchatCustomData = {
  currency?: string;
  value?: string;
  price?: string;
  content_ids?: string;
  content_category?: string;
  content_name?: string;
  content_type?: string;
  num_items?: string;
  search_string?: string;
  order_id?: string;
  description?: string;
  status?: string;
  ext_info?: string;
  [key: string]: any;
};

export type SnapchatAppData = {
  app_id?: string;
  advertiser_tracking_enabled?: string;
  extinfo?: string | string[];
  [key: string]: any;
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
  [key: string]: any;
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
  [key: string]: any;
};

export type SnapchatPayloadV3 = {
  data: SnapchatEventData[];
};

export type ProcessedEvent = {
  message: any;
  metadata: any;
  destination: SnapchatDestination;
};
