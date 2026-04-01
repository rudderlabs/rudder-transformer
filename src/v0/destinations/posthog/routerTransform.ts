import { z, ZodType } from 'zod';
import {
  BatchDestination,
  TransformedEvent,
  BatchStrategy,
  chunk,
} from '../../../services/destination/nativeBatchingFramework/routerIntegration';
import { processEvent } from './transform';
import type { PostHogPayload, PostHogProcessorRequest } from './types';

class PostHogIntegration extends BatchDestination<PostHogPayload> {
  transformEvent(input: PostHogProcessorRequest): Omit<TransformedEvent<PostHogPayload>, 'jobId'> {
    const result = processEvent(input.message, input.destination);
    // Strip api_key from the body — it belongs in the wrapBody wrapper
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { api_key, ...eventBody } = result.body.JSON;
    return {
      body: eventBody,
      endpoint: result.endpoint,
      method: result.method,
      headers: result.headers,
    };
  }

  getBatchStrategy(): BatchStrategy<PostHogPayload> {
    return chunk({
      maxPayloadSize: '10MB',
      wrapBody: (bodies) => ({
        api_key: this.destination.Config.teamApiKey,
        batch: bodies,
      }),
    });
  }

  getInputSchema(): ZodType | null {
    return z
      .object({
        message: z
          .object({
            userId: z.union([z.string(), z.number()]).optional(),
            anonymousId: z.union([z.string(), z.number()]).optional(),
            type: z.string().refine((val) => val !== 'record', {
              message: 'message type should not be record',
            }),
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
