import { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { processEvent } from './transform';
import type { PostHogPayload } from './types';
import { PostHogDestinationConfigSchema } from './types';
import type { RudderMessage } from '../../../types';
import { MAX_EVENT_SIZE_BYTES } from './config';

const postHogInputSchema = z
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
    destination: z.object({ Config: PostHogDestinationConfigSchema }).passthrough(),
  })
  .passthrough();

class PostHogIntegration extends BatchDestination<PostHogPayload, typeof postHogInputSchema> {
  transformEvent(input: z.infer<typeof postHogInputSchema>): TransformedEvent<PostHogPayload> {
    // Schema-inferred message type is narrower than RudderMessage (e.g. userId
    // includes number|null from the Zod union). The runtime object is a full
    // RudderMessage — the schema only validates a subset of fields — so the cast
    // is safe.
    const result = processEvent(input.message as unknown as RudderMessage, this.destination);
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

  getInputSchema() {
    return postHogInputSchema;
  }
}

export const Integration = PostHogIntegration;
