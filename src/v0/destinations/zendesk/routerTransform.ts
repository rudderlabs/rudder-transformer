import stats from '../../../util/stats';
import { getDestinationVersion } from '../../../util/utils';
import {
  DestinationIntegration,
  ChunkBatchStrategy,
  type AlreadyDelivered,
  type TransformedEvent,
  type BatchStrategy,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { zendeskInputSchema, type ZendeskInput, type ZendeskMessage } from './types';
import { createClient } from './utils';
import { identify } from './identify';
import { group } from './group';
import { track } from './track';
import { zendeskDelivery } from './delivery';

class ZendeskIntegration extends DestinationIntegration<
  Record<string, unknown>,
  typeof zendeskInputSchema
> {
  static readonly delivery = zendeskDelivery;

  async transformEvent(input: ZendeskInput): Promise<TransformedEvent | AlreadyDelivered> {
    const client = createClient(input);
    const message = input.message as ZendeskMessage;
    switch (message.type) {
      case 'identify':
        stats.counter('zendesk_identify_transform_count', 1, {
          destVersion: String(getDestinationVersion(input.destination.version)),
        });
        return identify(client, message, input.destination.Config);
      case 'group':
        return group(client, message, input.destination.Config);
      case 'track':
        return track(client, message, input.destination.Config);
      default:
        throw new Error('Unsupported Zendesk event');
    }
  }

  getBatchStrategy(): BatchStrategy<Record<string, unknown>> {
    return new ChunkBatchStrategy({ maxItems: 1, wrapBody: ([body]) => body });
  }

  getInputSchema(): typeof zendeskInputSchema {
    return zendeskInputSchema;
  }
}

export const Integration = ZendeskIntegration;
