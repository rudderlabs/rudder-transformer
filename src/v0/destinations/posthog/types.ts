import type { RudderMessage, Metadata } from '../../../types';
import type { Destination } from '../../../types/controlPlaneConfig';
import type {
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
} from '../../../types/destinationTransformation';

export type PostHogDestinationConfig = {
  useV2Group?: boolean;
  teamApiKey: string;
  yourInstance?: string;
};

// Properties built by generatePropertyDefination — from PHPropertiesConfig mapping + code
export type PostHogProperties = {
  // From PHPropertiesConfig mapping
  $os?: string;
  $current_url?: string;
  $pathname?: string;
  $screen_height?: number;
  $screen_width?: number;
  $lib?: string;
  $lib_version?: string;
  $insert_id?: string;
  $time?: string;
  $device_id?: string;
  $ip?: string;
  $timestamp?: string;
  $anon_distinct_id?: string;
  distinct_id?: string;
  $screen_density?: number;
  $device_manufacturer?: string;
  $os_version?: string;
  $timezone?: string;
  $locale?: string;
  $useragent?: string;
  $app_version?: string;
  $device_name?: string;
  $network_carrier?: string;
  $app_name?: string;
  $device_model?: string;
  $app_namespace?: string;
  $app_build?: string;
  $viewport_height?: number;
  $viewport_width?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  $performance_page_loaded?: number;
  // Set explicitly in code
  $browser?: string;
  $browser_version?: string;
  $screen_name?: string;
  $host?: string;
  $set?: Record<string, unknown>;
  // Used as a user event property (non-standard PostHog field)
  timestamp?: string;
  // GROUP v2 specific
  $group_set?: Record<string, unknown>;
  $group_type?: string;
  $group_key?: string;
  $groups?: Record<string, string>;
};

export type PostHogResponseBody = {
  // Common across all event types
  distinct_id?: string;
  event?: string;
  timestamp?: string;
  messageId?: string;
  properties?: PostHogProperties & Record<string, unknown>;
  // IDENTIFY
  $set?: Record<string, unknown>;
  // GROUP (old)
  groupId?: string;
  traits?: Record<string, unknown>;
  // PAGE / SCREEN
  category?: string;
  name?: string;
  // Always present — added in responseBuilderSimple
  api_key: string;
  type: string;
};

// Payload shape before api_key and type are added
export type PostHogPayload = Omit<PostHogResponseBody, 'api_key' | 'type'>;

export type PostHogCategory = {
  name: string;
  type: string;
  event?: string;
};

export type PostHogDestination = Destination<PostHogDestinationConfig>;

export interface PostHogMessage extends RudderMessage {
  context?: {
    userAgent?: string;
    traits?: Record<string, unknown>;
  };
}

export type PostHogProcessorRequest = ProcessorTransformationRequest<
  PostHogMessage,
  Metadata,
  PostHogDestination
>;

export type PostHogRouterRequest = RouterTransformationRequestData<
  PostHogMessage,
  PostHogDestination,
  undefined,
  Metadata
>;
