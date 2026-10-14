import { ConfigurationError } from '@rudderstack/integrations-lib';
import {
  DestinationIntegration,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import {
  ACTION_ATTR_VALUE,
  API_KEY_HEADER,
  DESTINATION_TYPE,
  ENDPOINT_PATH,
  usersUpdateEndpoint,
} from './config';
import { gainsightPxAudienceDelivery } from './delivery';
import {
  GainsightPxAudienceRouterRequestSchema,
  type GainsightPxAudiencePayload,
  type GainsightPxAudienceRouterRequest,
} from './types';
import { normalizeIdentifyId } from './utils';

class GainsightPxAudienceIntegration extends DestinationIntegration<
  GainsightPxAudiencePayload,
  typeof GainsightPxAudienceRouterRequestSchema
> {
  static readonly delivery = gainsightPxAudienceDelivery;

  transformEvent(
    input: GainsightPxAudienceRouterRequest,
  ): TransformedEvent<GainsightPxAudiencePayload> {
    // Per row, not this.connection: the framework constructs the class with the FIRST event's
    // connection, and one call may carry rows of two connections with different attributes.
    const connectionConfig = input.connection?.config.destination;
    if (!connectionConfig) {
      throw new ConfigurationError(`Connection config is required for ${DESTINATION_TYPE}`);
    }

    const { message, destination } = input;
    const identifyId = normalizeIdentifyId(message.identifiers?.identifyId);

    return {
      body: {
        identifyId,
        customAttributes: {
          [connectionConfig.customAttributeName]: ACTION_ATTR_VALUE[message.action],
        },
      },
      endpoint: usersUpdateEndpoint(destination.Config.dataCenter),
      endpointPath: ENDPOINT_PATH,
      method: 'PUT',
      // The input schema rejects a blank key but the framework hands transformEvent the raw
      // config, not the parsed value, so the trim is applied here too.
      headers: {
        'Content-Type': 'application/json',
        [API_KEY_HEADER]: destination.Config.apiKey.trim(),
      },
    };
  }

  getBatchStrategy(): BatchStrategy<GainsightPxAudiencePayload> {
    // PX has no bulk user endpoint: one record per request, so every verdict covers exactly one job.
    return new ChunkBatchStrategy<GainsightPxAudiencePayload>({
      maxItems: 1,
      wrapBody: ([body]) => body,
    });
  }

  getInputSchema() {
    return GainsightPxAudienceRouterRequestSchema;
  }
}

export const Integration = GainsightPxAudienceIntegration;
