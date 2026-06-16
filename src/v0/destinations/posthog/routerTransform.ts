import { z, ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { processEvent } from './transform';
import type { PostHogPayload, PostHogRouterRequest } from './types';
import { MAX_EVENT_SIZE_BYTES } from './config';

class PostHogIntegration extends BatchDestination<PostHogPayload> {
  transformEvent(input: PostHogRouterRequest): TransformedEvent<PostHogPayload> {
    const result = processEvent(input.message, input.destination);
    // Strip api_key from the body — it belongs in the wrapBody wrapper
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { api_key, ...eventBody } = result.body.JSON!;

    const eventSize = Buffer.byteLength(JSON.stringify(eventBody), 'utf8');
    if (eventSize > MAX_EVENT_SIZE_BYTES) {
      throw new InstrumentationError(
        `Event size (${eventSize} bytes) exceeds PostHog's 1 MB limit. PostHog will reject this event with "maximum event size exceeded". Please reduce the size of the event properties to stay within the limit.`,
      );
    }

    return {
      body: eventBody,
      endpoint: result.endpoint,
      endpointPath: '/batch',
      method: result.method,
      headers: result.headers,
    };
  }

  getBatchStrategy(): BatchStrategy<PostHogPayload> {
    return new ChunkBatchStrategy({
      maxPayloadSize: '10MB',
      wrapBody: (bodies) => ({
        api_key: this.destination.Config.teamApiKey,
        batch: bodies,
      }),
    });
  }

  getInputSchema(): ZodType {
    return z
      .object({
        message: z
          .object({
            userId: z.union([z.string(), z.number()]).nullish(),
            anonymousId: z.union([z.string(), z.number()]).nullish(),
            type: z.enum(['track', 'page', 'screen', 'identify', 'alias', 'group']),
          })
          .passthrough()
          .refine((msg) => !!msg.userId || !!msg.anonymousId, {
            message: 'Either userId or anonymousId must be provided',
          }),
      })
      .passthrough();
  }
}

export const Integration = PostHogIntegration;
