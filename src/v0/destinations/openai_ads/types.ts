import { z } from 'zod';
import type {
  Account,
  Destination,
  Metadata,
  ProcessorTransformationRequest,
  RudderMessage,
  RouterTransformationRequestData,
} from '../../../types';
import { ACTION_SOURCES, HASHED_MATCH_FIELDS, STANDARD_EVENTS } from './config';

export const OpenAIAdsEventMappingSchema = z
  .object({
    from: z.string().min(1),
    to: z.union([z.enum(STANDARD_EVENTS), z.literal('custom')]),
    customEventName: z.string().optional(),
    conversionIdentifier: z.string().optional(),
    deduplicationKey: z.string().optional(),
  })
  .passthrough();
export const OpenAIAdsDestinationConfigSchema = z
  .object({
    apiKey: z.string().optional(),
    pixelId: z.string().optional(),
    defaultCurrency: z.string().optional(),
    defaultActionSource: z.enum(ACTION_SOURCES).optional(),
    eventMapping: z.array(OpenAIAdsEventMappingSchema).optional(),
    maxBatchSize: z.number().int().positive().optional(),
    maxPayloadSize: z.string().optional(),
  })
  .passthrough();
export const OpenAIAdsMessageSchema = z
  .object({
    type: z.enum(['track', 'page', 'screen'], {
      required_error: 'Message Type is not present. Aborting message.',
    }),
  })
  .passthrough();
export type OpenAIAdsStandardEvent = (typeof STANDARD_EVENTS)[number];
export type OpenAIAdsActionSource = (typeof ACTION_SOURCES)[number];
export type OpenAIAdsEventMapping = z.infer<typeof OpenAIAdsEventMappingSchema>;
export type OpenAIAdsDestinationConfig = z.infer<typeof OpenAIAdsDestinationConfigSchema>;
export type OpenAIAdsAccount = Account<{ pixelId?: string }, { apiKey?: string }>;
export type OpenAIAdsDestination = Destination<OpenAIAdsDestinationConfig, OpenAIAdsAccount | null>;
export type OpenAIAdsProcessorRequest = ProcessorTransformationRequest<
  RudderMessage,
  Metadata,
  OpenAIAdsDestination
>;
export type OpenAIAdsRouterRequest = RouterTransformationRequestData<
  RudderMessage,
  OpenAIAdsDestination,
  undefined,
  Metadata
>;
export type HashMatchField = (typeof HASHED_MATCH_FIELDS)[number];
export type OpenAIAdsUser = Partial<Record<HashMatchField, string[]>> & {
  obref?: string;
  android_advertising_id?: string;
  ip_address?: string;
  user_agent?: string;
};
export type OpenAIAdsContent = {
  id?: string;
  name?: string;
  content_type?: string;
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
  action_source?: OpenAIAdsActionSource;
  source_url?: string;
  oppref?: string;
  user?: OpenAIAdsUser;
  data: OpenAIAdsEventData;
};
export type OpenAIAdsRequestBody = { events: OpenAIAdsEventPayload[] };
