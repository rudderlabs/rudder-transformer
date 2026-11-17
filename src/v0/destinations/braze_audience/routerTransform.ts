import type { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  DestinationIntegration,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import {
  ACTION_ATTR_VALUE,
  BULK_MAX_BATCH_SIZE,
  MAX_PAYLOAD_SIZE,
  STANDARD_MAX_BATCH_SIZE,
  STANDARD_TRACK_PATH,
} from './config';
import { buildTrackBody, getTrackEndpoint, normalizeExternalId } from './utils';
import { brazeAudienceDelivery } from './delivery';
import {
  BrazeAudienceRouterRequestSchema,
  type BrazeAudienceAttributePayload,
  type BrazeAudienceConnectionConfig,
} from './types';

class BrazeAudienceIntegration extends DestinationIntegration<
  BrazeAudienceAttributePayload,
  typeof BrazeAudienceRouterRequestSchema
> {
  // Partial failure arrives on a 2xx keyed by index into `attributes`; see ./delivery.
  static readonly delivery = brazeAudienceDelivery;

  private readonly headers: Record<string, string>;

  private readonly track: { endpoint: string; endpointPath: string };

  constructor(...args: ConstructorParameters<typeof DestinationIntegration>) {
    super(...args);
    if (!this.connection) {
      throw new InstrumentationError(
        `Connection config is required for ${this.destination.DestinationDefinition.Name}`,
      );
    }

    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.destination.Config.restApiKey}`,
    };
    const { dataCenter, trackEndpoint } = this.destination.Config;
    this.track = getTrackEndpoint(dataCenter, trackEndpoint);
  }

  private get connectionConfig(): BrazeAudienceConnectionConfig {
    return this.connection!.config.destination;
  }

  transformEvent(
    input: z.infer<typeof BrazeAudienceRouterRequestSchema>,
  ): TransformedEvent<BrazeAudienceAttributePayload> {
    const { message } = input;
    const attrValue = ACTION_ATTR_VALUE[message.action];

    const { customAttributeName } = this.connectionConfig;
    if (!customAttributeName) {
      throw new InstrumentationError('customAttributeName is required on connection config');
    }

    const externalId = normalizeExternalId(message.identifiers?.external_id);
    if (!externalId) {
      // Abort this record (DestinationIntegration maps InstrumentationError → 400 per-item).
      throw new InstrumentationError('external_id is missing or empty after trim');
    }

    const body = {
      external_id: externalId,
      [customAttributeName]: attrValue,
    } as BrazeAudienceAttributePayload;

    return {
      body,
      ...this.track,
      method: 'POST',
      headers: this.headers,
    };
  }

  getBatchStrategy(): BatchStrategy<BrazeAudienceAttributePayload> {
    const { endpointPath } = this.track;
    return new ChunkBatchStrategy<BrazeAudienceAttributePayload>({
      maxItems:
        endpointPath === STANDARD_TRACK_PATH ? STANDARD_MAX_BATCH_SIZE : BULK_MAX_BATCH_SIZE,
      maxPayloadSize: MAX_PAYLOAD_SIZE,
      wrapBody: (bodies) => buildTrackBody(bodies, endpointPath),
    });
  }

  getInputSchema() {
    return BrazeAudienceRouterRequestSchema;
  }
}

export const Integration = BrazeAudienceIntegration;
