import { z } from 'zod';
import {
  DestinationIntegration,
  TransformedEvent,
  CustomBatchStrategy,
  makeRouterInputSchema,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { chunkPayloads } from '../../../services/destination/destinationIntegration/chunkPayloads';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import { buildTopsortEvents } from './transform';
import { ENDPOINT, MAX_BATCH_SIZE } from './config';
import {
  TopsortDestinationConfigSchema,
  TopsortMessageSchema,
  type TopsortEventType,
  type TopsortPayload,
} from './types';
import { JSON_MIME_TYPE } from '../../util/constant';

const topsortInputSchema = makeRouterInputSchema({
  destinationConfig: TopsortDestinationConfigSchema,
  message: TopsortMessageSchema.refine((msg) => msg.type?.toLowerCase() === 'track', {
    message: 'Only "track" events are supported. Dropping event.',
  }),
});

class TopsortIntegration extends DestinationIntegration<TopsortPayload, typeof topsortInputSchema> {
  transformEvent(input: z.infer<typeof topsortInputSchema>): TransformedEvent<TopsortPayload>[] {
    const headers = {
      'content-type': JSON_MIME_TYPE,
      Authorization: `Bearer ${this.destination.Config.apiKey}`,
    };

    // One message can map to several Topsort events: an impression or click
    // carrying a `products` array fans out to one event per product.
    return buildTopsortEvents(input.message, this.destination).map(({ event, topsortPayload }) => ({
      body: topsortPayload,
      endpoint: ENDPOINT,
      endpointPath: '/v2/events',
      method: 'POST',
      headers,
      // The API caps each of impressions/clicks/purchases at 50 independently,
      // so each type has to be chunked and sent as its own array.
      internalGroupKey: event,
    }));
  }

  getBatchStrategy(): BatchStrategy<TopsortPayload> {
    return new CustomBatchStrategy<TopsortPayload>((payloads) => {
      // The framework has already split groups on internalGroupKey, so every
      // payload here is the same event type.
      const eventType = payloads[0].internalGroupKey as TopsortEventType;
      const wrapBody = (bodies: TopsortPayload[]) => ({ [eventType]: bodies });

      return chunkPayloads(payloads, { maxItems: MAX_BATCH_SIZE, wrapBody }).map((chunk) => ({
        body: wrapBody(chunk.bodies),
        jobIds: chunk.jobIds,
      }));
    });
  }

  getInputSchema() {
    return topsortInputSchema;
  }
}

export const Integration = TopsortIntegration;
