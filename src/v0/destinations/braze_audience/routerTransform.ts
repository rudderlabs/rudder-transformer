import type { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  DestinationIntegration,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import { ACTION_ATTR_VALUE, MAX_PAYLOAD_SIZE, type TrackEndpointSpec } from './config';
import { buildTrackBody, getTrackEndpointSpec, getTrackUrl, normalizeExternalId } from './utils';
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

  private readonly track: TrackEndpointSpec;

  private readonly endpoint: string;

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
    this.track = getTrackEndpointSpec(trackEndpoint);
    this.endpoint = getTrackUrl(dataCenter, this.track);
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
      endpoint: this.endpoint,
      endpointPath: this.track.path,
      method: 'POST',
      headers: this.headers,
    };
  }

  getBatchStrategy(): BatchStrategy<BrazeAudienceAttributePayload> {
    const { track } = this;
    return new ChunkBatchStrategy<BrazeAudienceAttributePayload>({
      maxItems: track.maxItems,
      maxPayloadSize: MAX_PAYLOAD_SIZE,
      wrapBody: (bodies) => buildTrackBody(bodies, track),
    });
  }

  getInputSchema() {
    return BrazeAudienceRouterRequestSchema;
  }
}

export const Integration = BrazeAudienceIntegration;
