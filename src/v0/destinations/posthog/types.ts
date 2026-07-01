import { z } from 'zod';
import type { RudderMessage, Metadata } from '../../../types';
import type { Destination } from '../../../types/controlPlaneConfig';
import type {
  BatchedRequestBody,
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
} from '../../../types/destinationTransformation';

export const PostHogDestinationConfigSchema = z
  .object({
    teamApiKey: z.string().min(1),
    useV2Group: z.boolean().optional(),
    yourInstance: z.string().optional(),
  })
  .passthrough();

export type PostHogDestinationConfig = z.infer<typeof PostHogDestinationConfigSchema>;

// Properties directly accessed in transform.ts; remaining PHPropertiesConfig fields
// are populated implicitly by constructPayload and covered by the index signature.
export type PostHogProperties = {
  $os?: string;
  $current_url?: string;
  distinct_id?: string;
  $browser?: string;
  $browser_version?: string;
  $screen_name?: string;
  $host?: string;
  $set?: Record<string, unknown>;
  timestamp?: string;
  $group_set?: Record<string, unknown>;
  $group_type?: string;
  $group_key?: string;
  $groups?: Record<string, string>;
  [key: string]: unknown;
};

export type PostHogResponseBody = {
  distinct_id?: string;
  event?: string;
  timestamp?: string;
  properties?: PostHogProperties;
  api_key: string;
  type: string;
  [key: string]: unknown;
};

// Payload shape for each item in the PostHog /batch array
export type PostHogPayload = {
  distinct_id?: string;
  event?: string;
  timestamp?: string;
  properties?: PostHogProperties;
  type?: string;
};

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

export type PostHogTransformOutput = Omit<ProcessorTransformationOutput, 'body'> & {
  body: BatchedRequestBody<PostHogResponseBody>;
};
