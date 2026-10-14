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
import { BULK_EVENTS_PATH, MAX_BATCHES_PER_REQUEST, ROKT_EVENTS_BASE_URL } from './config';
import { roktDelivery } from './delivery';
import { RoktDestinationConfigSchema, RoktMessageSchema, type RoktBatch } from './types';
import { buildRoktBatch, serializeRoktBatches } from './utils';

const roktInputSchema = makeRouterInputSchema({
  destinationConfig: RoktDestinationConfigSchema,
  message: RoktMessageSchema,
});

class RoktIntegration extends DestinationIntegration<RoktBatch, typeof roktInputSchema> {
  static readonly delivery = roktDelivery;

  transformEvent(input: z.infer<typeof roktInputSchema>): TransformedEvent<RoktBatch> {
    const { serverToServerKey, serverToServerSecret } = this.destination.Config;
    return {
      body: buildRoktBatch(input.message as unknown as RudderMessage),
      endpoint: `${ROKT_EVENTS_BASE_URL}${BULK_EVENTS_PATH}`,
      endpointPath: BULK_EVENTS_PATH,
      method: 'POST',
      headers: {
        Authorization: `Basic ${base64Convertor(`${serverToServerKey}:${serverToServerSecret}`)}`,
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
