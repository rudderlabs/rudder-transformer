import { z } from 'zod';
import {
  BatchDestination,
  ChunkBatchStrategy,
  makeRouterInputSchema,
  type TransformedEvent,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { openAIAdsDelivery } from './delivery';
import { processEvent } from './transform';
import {
  OpenAIAdsDestinationConfigSchema,
  OpenAIAdsMessageSchema,
  type OpenAIAdsEventPayload,
  type OpenAIAdsProcessorRequest,
} from './types';
import { getClickIdPresenceGroup, getMaxBatchSize, getMaxPayloadSize } from './utils';

const openAIAdsInputSchema = makeRouterInputSchema({
  destinationConfig: OpenAIAdsDestinationConfigSchema,
  message: OpenAIAdsMessageSchema,
});

class OpenAIAdsIntegration extends BatchDestination<
  OpenAIAdsEventPayload,
  typeof openAIAdsInputSchema
> {
  static readonly delivery = openAIAdsDelivery;

  transformEvent(
    input: z.infer<typeof openAIAdsInputSchema>,
  ): TransformedEvent<OpenAIAdsEventPayload> {
    const result = processEvent(input as unknown as OpenAIAdsProcessorRequest);
    const [eventBody] = result.body.JSON.events as OpenAIAdsEventPayload[];
    return {
      body: eventBody,
      endpoint: result.endpoint,
      endpointPath: result.endpointPath ?? '/v1/events',
      method: result.method,
      headers: result.headers,
      params: result.params,
      internalGroupKey: getClickIdPresenceGroup(
        input.message as OpenAIAdsProcessorRequest['message'],
      ),
    };
  }

  getBatchStrategy(): BatchStrategy<OpenAIAdsEventPayload> {
    return new ChunkBatchStrategy<OpenAIAdsEventPayload>({
      maxItems: getMaxBatchSize(this.destination.Config),
      maxPayloadSize: getMaxPayloadSize(this.destination.Config),
      wrapBody: (bodies) => ({ events: bodies }),
    });
  }

  getInputSchema() {
    return openAIAdsInputSchema;
  }
}

export const Integration = OpenAIAdsIntegration;
