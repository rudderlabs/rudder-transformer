import type { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { ACTION_ATTR_VALUE, DESTINATION_TYPE, MAX_BATCH_SIZE, MAX_PAYLOAD_SIZE } from './config';
import { buildBulkBody, getBulkTrackEndpoint, normalizeExternalId } from './utils';
import {
  BrazeAudienceRouterRequestSchema,
  type BrazeAudienceAttributePayload,
  type BrazeAudienceConnectionConfig,
} from './types';

class BrazeAudienceIntegration extends BatchDestination<
  BrazeAudienceAttributePayload,
  typeof BrazeAudienceRouterRequestSchema
> {
  private readonly headers: Record<string, string>;

  constructor(...args: ConstructorParameters<typeof BatchDestination>) {
    super(...args);
    if (!this.connection) {
      throw new InstrumentationError(`Connection config is required for ${DESTINATION_TYPE}`);
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
    const messageAction = message.action;
    if (!messageAction) {
      throw new InstrumentationError('record event is missing action');
    }

    const attrValue = ACTION_ATTR_VALUE[messageAction];
    if (typeof attrValue !== 'boolean') {
      throw new InstrumentationError(`Unsupported record action: ${messageAction}`);
    }

    const { customAttributeName } = this.connectionConfig;
    if (!customAttributeName) {
      throw new InstrumentationError('customAttributeName is required on connection config');
    }

    const externalId = normalizeExternalId(message.identifiers?.external_id);
    if (!externalId) {
      // Soft-bounce this record (BatchDestination maps InstrumentationError per-item).
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
