import { z } from 'zod';
import {
  BodyFormat,
  ChunkBatchStrategy,
  DestinationIntegration,
  makeRouterInputSchema,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import type { RudderMessage } from '../../../types';
import { base64Convertor } from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { BULK_EVENTS_PATH, MAX_BATCHES_PER_REQUEST } from './config';
import { roktDelivery } from './delivery';
import { RoktDestinationConfigSchema, RoktMessageSchema, type RoktBatch } from './types';
import { buildRoktBatch, resolveEndpoint, serializeRoktBatches } from './utils';

const roktInputSchema = makeRouterInputSchema({
  destinationConfig: RoktDestinationConfigSchema,
  message: RoktMessageSchema,
});

class RoktIntegration extends DestinationIntegration<RoktBatch, typeof roktInputSchema> {
  static readonly delivery = roktDelivery;

  // Same for every event of this destination, so resolved on first use.
  private endpoint?: string;

  private authorization?: string;

  transformEvent(input: z.infer<typeof roktInputSchema>): TransformedEvent<RoktBatch> {
    const { apiEndpoint, serverToServerKey, serverToServerSecret } = this.destination.Config;
    const body = buildRoktBatch(input.message as unknown as RudderMessage);
    this.endpoint ??= resolveEndpoint(apiEndpoint);
    this.authorization ??= `Basic ${base64Convertor(`${serverToServerKey}:${serverToServerSecret}`)}`;
    return {
      body,
      endpoint: this.endpoint,
      endpointPath: BULK_EVENTS_PATH,
      method: 'POST',
      headers: {
        Authorization: this.authorization,
        'Content-Type': JSON_MIME_TYPE,
      },
    };
  }

  getBatchStrategy(): BatchStrategy<RoktBatch> {
    return new ChunkBatchStrategy<RoktBatch>({
      maxItems: MAX_BATCHES_PER_REQUEST,
      bodyFormat: BodyFormat.JSON_ARRAY,
      wrapBody: (bodies) => ({ batch: serializeRoktBatches(bodies) }),
    });
  }

  getInputSchema() {
    return roktInputSchema;
  }
}

export const Integration = RoktIntegration;
