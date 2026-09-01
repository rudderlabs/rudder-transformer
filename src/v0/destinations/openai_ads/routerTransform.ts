import { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  ChunkBatchStrategy,
  makeRouterInputSchema,
  type TransformedEvent,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { JSON_MIME_TYPE } from '../../util/constant';
import { ENDPOINT, ENDPOINT_PATH, MAX_BATCH_SIZE, MAX_PAYLOAD_SIZE } from './config';
import { openAIAdsDelivery } from './delivery';
import {
  OpenAIAdsDestinationConfigSchema,
  OpenAIAdsMessageSchema,
  type OpenAIAdsEventPayload,
} from './types';
import { buildOpenAIEvent } from './utils';

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
    if (!['track', 'page', 'screen'].includes(input.message?.type)) {
      throw new InstrumentationError(`Event type ${input.message?.type} is not supported`);
    }
    const { apiKey, pixelId } = this.destination.Config;
    return {
      body: buildOpenAIEvent(input.message, this.destination.Config),
      endpoint: ENDPOINT,
      endpointPath: ENDPOINT_PATH,
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': JSON_MIME_TYPE },
      params: { pid: pixelId },
    };
  }

  getBatchStrategy(): BatchStrategy<OpenAIAdsEventPayload> {
    return new ChunkBatchStrategy<OpenAIAdsEventPayload>({
      maxItems: MAX_BATCH_SIZE,
      maxPayloadSize: MAX_PAYLOAD_SIZE,
      wrapBody: (bodies) => ({ events: bodies }),
    });
  }

  getInputSchema() {
    return openAIAdsInputSchema;
  }
}

export const Integration = OpenAIAdsIntegration;
