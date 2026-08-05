import type { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  ChunkBatchStrategy,
  type TransformedEvent,
  type DeliveryContext,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { ACTION_ATTR_VALUE, MAX_BATCH_SIZE, MAX_PAYLOAD_SIZE } from './config';
import { buildBulkBody, getBulkTrackEndpoint, normalizeExternalId } from './utils';
import { brazeAudienceStatusOverrides, extractBrazeAudienceErrorMessage } from './delivery';
import {
  BrazeAudienceRouterRequestSchema,
  type BrazeAudienceAttributePayload,
  type BrazeAudienceConnectionConfig,
} from './types';

class BrazeAudienceIntegration extends BatchDestination<
  BrazeAudienceAttributePayload,
  typeof BrazeAudienceRouterRequestSchema
> {
  // Delivery: partial failure arrives on a 2xx keyed by index into `attributes`; see ./delivery.
  static readonly statusOverrides = brazeAudienceStatusOverrides;

  static failureReason(ctx: DeliveryContext): string {
    return extractBrazeAudienceErrorMessage(ctx.response);
  }

  private readonly headers: Record<string, string>;

  constructor(...args: ConstructorParameters<typeof BatchDestination>) {
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
      // Abort this record (BatchDestination maps InstrumentationError → 400 per-item).
      throw new InstrumentationError('external_id is missing or empty after trim');
    }

    const { endpoint, endpointPath } = getBulkTrackEndpoint(this.destination.Config.dataCenter);

    const body = {
      external_id: externalId,
      [customAttributeName]: attrValue,
    } as BrazeAudienceAttributePayload;

    return {
      body,
      endpoint,
      endpointPath,
      method: 'POST',
      headers: this.headers,
    };
  }

  getBatchStrategy(): BatchStrategy<BrazeAudienceAttributePayload> {
    return new ChunkBatchStrategy<BrazeAudienceAttributePayload>({
      maxItems: MAX_BATCH_SIZE,
      maxPayloadSize: MAX_PAYLOAD_SIZE,
      wrapBody: (bodies) => buildBulkBody(bodies),
    });
  }

  getInputSchema() {
    return BrazeAudienceRouterRequestSchema;
  }
}

export const Integration = BrazeAudienceIntegration;
