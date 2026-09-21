import { z } from 'zod';
import {
  ChunkBatchStrategy,
  DestinationIntegration,
  makeRouterInputSchema,
  type BatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { HTTP_METHOD, MAX_BATCH_SIZE } from './config';
import { everflowDelivery } from './delivery';
import {
  EverflowDestinationConfigSchema,
  EverflowMessageSchema,
  type EverflowPostbackPayload,
} from './types';
import { buildEverflowParams, validatePostbackUrl } from './utils';

const everflowInputSchema = makeRouterInputSchema({
  destinationConfig: EverflowDestinationConfigSchema,
  message: EverflowMessageSchema,
});

class EverflowIntegration extends DestinationIntegration<
  EverflowPostbackPayload,
  typeof everflowInputSchema
> {
  static readonly delivery = everflowDelivery;

  transformEvent(
    input: z.infer<typeof everflowInputSchema>,
  ): TransformedEvent<EverflowPostbackPayload> {
    const { postbackUrl, networkId, verificationToken } = this.destination.Config;
    validatePostbackUrl(postbackUrl);

    return {
      body: {},
      endpoint: postbackUrl,
      endpointPath: new URL(postbackUrl).pathname,
      method: HTTP_METHOD,
      params: buildEverflowParams(input.message, { networkId, verificationToken }),
    };
  }

  getBatchStrategy(): BatchStrategy<EverflowPostbackPayload> {
    return new ChunkBatchStrategy<EverflowPostbackPayload>({
      maxItems: MAX_BATCH_SIZE,
      wrapBody: () => ({}),
    });
  }

  getInputSchema() {
    return everflowInputSchema;
  }
}

export const Integration = EverflowIntegration;
