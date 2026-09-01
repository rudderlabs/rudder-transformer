import { z } from 'zod';
import {
  ACTION_SOURCES,
  HASHED_MATCH_FIELDS,
  STANDARD_EVENTS,
  STANDARD_EVENT_DATA_TYPES,
} from './config';

const OpenAIAdsEventMappingSchema = z
  .object({
    from: z.string().min(1),
    to: z.union([z.enum(STANDARD_EVENTS), z.literal('custom')]),
    customEventName: z.string().optional(),
    deduplicationKey: z.string().optional(),
  })
  .passthrough();
export const OpenAIAdsDestinationConfigSchema = z
  .object({
    apiKey: z.string(),
    pixelId: z.string(),
    defaultCurrency: z.string().optional(),
    defaultActionSource: z.enum(ACTION_SOURCES).optional(),
    eventMapping: z.array(OpenAIAdsEventMappingSchema).optional(),
  })
  .passthrough();
export const OpenAIAdsMessageSchema = z
  .object({
    type: z.enum(['track', 'page', 'screen'], {
      required_error: 'Message Type is not present. Aborting message.',
    }),
  })
  .passthrough();
export type OpenAIAdsStandardEvent = keyof typeof STANDARD_EVENT_DATA_TYPES;
export type OpenAIAdsActionSource = (typeof ACTION_SOURCES)[number];
export type OpenAIAdsEventMapping = z.infer<typeof OpenAIAdsEventMappingSchema>;
export type OpenAIAdsDestinationConfig = z.infer<typeof OpenAIAdsDestinationConfigSchema>;
export type HashMatchField = (typeof HASHED_MATCH_FIELDS)[number];
export type PlainMatchField =
  | 'regions'
  | 'postal_codes'
  | 'cities'
  | 'countries'
  | 'obref'
  | 'android_advertising_id'
  | 'ip_address'
  | 'user_agent';
export type OpenAIAdsUser = Partial<Record<HashMatchField | PlainMatchField, string | string[]>>;
export type OpenAIAdsContent = {
  id?: string;
  name?: string;
  content_type?: string;
  group_id?: string;
  variant_dict?: Record<string, unknown>;
  quantity?: number;
  amount?: number;
  currency?: string;
};
export type OpenAIAdsEventData = {
  type: 'contents' | 'customer_action' | 'plan_enrollment' | 'custom';
  currency?: string;
  amount?: number;
  contents?: OpenAIAdsContent[];
  [key: string]: unknown;
};
export type OpenAIAdsEventPayload = {
  id: string;
  type: OpenAIAdsStandardEvent | 'custom';
  custom_event_name?: string;
  timestamp_ms: number;
  opt_out?: boolean;
  action_source?: OpenAIAdsActionSource;
  source_url?: string;
  oppref?: string;
  user?: OpenAIAdsUser;
  data: OpenAIAdsEventData;
};
