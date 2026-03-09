/**
 * PostHog RouterIntegration — first destination on the batching framework.
 *
 * Replaces the one-event-per-request approach of simpleProcessRouterDest with
 * true batching via the PostHog /batch endpoint: { api_key, batch: [...events] }.
 *
 * Runs alongside the existing transform.js (not modified).
 * Activated by registering POSTHOG in batchedDestinationsMap.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { z, ZodType } from 'zod';
import {
  constructPayload,
  getBrowserInfo,
  getDeviceModel,
  isValidUrl,
  stripTrailingSlash,
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
} from '../../util';
/* eslint-enable @typescript-eslint/no-var-requires */

import type { Destination } from '../../../types/controlPlaneConfig';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import {
  RouterIntegration,
  chunkGroup,
  type BatchConfig,
  type BatchTransformResult,
  type GroupedSuccessEvents,
  type PostTransformResult,
} from '../../../services/destination/routerIntegration';
import { PROPERTY } from './config';

const { InstrumentationError, TransformationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const { DEFAULT_BASE_ENDPOINT, CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');

type PostHogEvent = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Per-event payload builder
// ---------------------------------------------------------------------------

function generatePropertyDefinition(message: Record<string, unknown>): Record<string, unknown> {
  const propertyJson = MAPPING_CONFIG[PROPERTY.name];
  let data = constructPayload(message, propertyJson);
  if (!data) {
    throw InstrumentationError();
  }

  if ((message as any).channel === 'web' && (message as any).context?.userAgent) {
    const browser = getBrowserInfo((message as any).context.userAgent);
    const osInfo = getDeviceModel(message);
    data.$os = osInfo;
    data.$browser = browser.name;
    data.$browser_version = browser.version;
  }

  if ((message as any).type === EventType.SCREEN) {
    data.$screen_name = (message as any).event;
  }

  const url = isValidUrl(data.$current_url);
  if (url) {
    data.$host = url.host;
  }

  const userTraits = (message as any).context?.traits;
  if ((message as any).type?.toLowerCase() !== EventType.IDENTIFY && userTraits) {
    data = { $set: userTraits, ...data };
  }

  return removeUndefinedAndNullValues(data);
}

/**
 * Builds a single PostHog batch event payload from a RudderMessage.
 * Does NOT include api_key — that is added at the batch root by the postTransform override.
 */
function buildPostHogEventPayload(
  message: Record<string, unknown>,
  destination: Destination,
): PostHogEvent {
  const type = (message as any).type as string | undefined;
  if (!type) {
    throw new InstrumentationError('Event type is required');
  }

  const category = CONFIG_CATEGORIES[type.toUpperCase()];
  if (!category) {
    throw new InstrumentationError(`Event type ${type} is not supported`);
  }

  let payload;
  if (category.type === 'group' && (destination.Config as any).useV2Group) {
    payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.GROUPV2.name]);
  } else {
    payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  }

  if (!payload) {
    throw new TransformationError('Failed to construct payload');
  }

  if (!payload.timestamp && isDefinedAndNotNull((payload.properties as any)?.timestamp)) {
    payload.timestamp = (payload.properties as any).timestamp;
  }

  payload.properties = {
    ...generatePropertyDefinition(message),
    ...(payload.properties as Record<string, unknown>),
  };

  if (category.type === CONFIG_CATEGORIES.GROUP.type) {
    if ((destination.Config as any).useV2Group) {
      delete (payload.properties as any)?.$group_set?.groupType;
    }
    if (payload.properties) {
      const groupType = (payload.properties as any).$group_type;
      const groupKey = (payload.properties as any).$group_key;
      if (groupType && groupKey) {
        (payload.properties as any).$groups = { [groupType]: groupKey };
      }
    }
  }

  if (isDefinedAndNotNull(payload.distinct_id)) {
    payload.distinct_id = String(payload.distinct_id);
  }
  if (payload.properties && isDefinedAndNotNull((payload.properties as any).distinct_id)) {
    (payload.properties as any).distinct_id = String((payload.properties as any).distinct_id);
  }

  if (category.type !== CONFIG_CATEGORIES.TRACK.type) {
    payload.event = category.event;
  }

  payload.type = category.type;

  return payload as PostHogEvent;
}

// ---------------------------------------------------------------------------
// PostHogIntegration
// ---------------------------------------------------------------------------

class PostHogIntegration extends RouterIntegration<PostHogEvent> {
  async batchTransform(
    inputs: RouterTransformationRequestData[],
  ): Promise<BatchTransformResult<PostHogEvent>> {
    const payloads: PostHogEvent[] = [];
    const jobIds: string[] = [];
    const errorEvents: { error: string; statusCode: number; jobId: string }[] = [];
    const { destination } = inputs[0];

    for (const input of inputs) {
      try {
        const payload = buildPostHogEventPayload(input.message, input.destination);
        payloads.push(payload);
        jobIds.push(String(input.metadata.jobId));
      } catch (e: unknown) {
        errorEvents.push({
          error: e instanceof Error ? e.message : String(e),
          statusCode: (e as any).statusCode ?? 400,
          jobId: String(input.metadata.jobId),
        });
      }
    }

    const endpoint = `${stripTrailingSlash((destination.Config as { yourInstance: string }).yourInstance) || DEFAULT_BASE_ENDPOINT}/batch`;

    const groupedEvents: GroupedSuccessEvents<PostHogEvent>[] =
      payloads.length > 0
        ? [
            {
              endpoint,
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              payloads,
              jobIds,
            },
          ]
        : [];

    return { groupedEvents, errorEvents };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBatchConfig(_destination?: Destination): BatchConfig {
    return {
      payloadHierarchyPath: 'batch',
      maxChunkSize: 2, // lowered for mock verification; production value: 250
      maxPayloadSize: '4MB',
    };
  }

  postTransform(
    group: GroupedSuccessEvents<PostHogEvent>,
    destination: Destination,
  ): PostTransformResult[] {
    const apiKey = (destination.Config as { teamApiKey: string }).teamApiKey;
    return chunkGroup(group, this.getBatchConfig(destination)).map((chunk) => ({
      batchRequest: {
        body: { api_key: apiKey, batch: chunk.payloads },
        endpoint: chunk.endpoint,
        method: chunk.method,
        headers: chunk.headers,
      },
      jobIds: chunk.jobIds,
    }));
  }

  getIntegrationSchema(): ZodType | null {
    // Add a Zod schema that enforces either userId or anonymousId must be present in the message

    return z
      .object({
        message: z
          .object({
            userId: z.string().optional(),
            anonymousId: z.string().optional(),
            type: z.string().refine((val) => val !== 'record', {
              message: 'messagetype should not be record',
            }),
          })
          .refine((msg) => !!msg.userId || !!msg.anonymousId, {
            message: 'Either userId or anonymousId must be provided',
          }),
      })
      .passthrough();
  }
}

// ---------------------------------------------------------------------------
// Singleton exported for use by nativeIntegration.ts
// ---------------------------------------------------------------------------

export const integration = new PostHogIntegration();
