import { ConfigurationError } from '@rudderstack/integrations-lib';
import logger from '../../../logger';
import {
  DestinationIntegration,
  ChunkBatchStrategy,
  type TransformedEvent,
  type TransformResult,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import {
  ACTION_ATTR_VALUE,
  API_KEY_HEADER,
  DESTINATION_TYPE,
  ENDPOINT_PATH,
  LOG_DEST_TYPE,
  usersUpdateEndpoint,
} from './config';
import { gainsightPxAudienceDelivery } from './delivery';
import { collectTraits, type LeftOutReason, type TraitMapping, type TraitValue } from './traits';
import {
  GainsightPxAudienceRouterRequestSchema,
  type GainsightPxAudiencePayload,
  type GainsightPxAudienceRouterRequest,
} from './types';
import { normalizeIdentifyId } from './utils';

type LeftOutCount = { attribute: string; reason: LeftOutReason; count: number };

const LEFT_OUT_MESSAGE = 'Gainsight PX Audience: trait left out of the write';

class GainsightPxAudienceIntegration extends DestinationIntegration<
  GainsightPxAudiencePayload,
  typeof GainsightPxAudienceRouterRequestSchema
> {
  static readonly delivery = gainsightPxAudienceDelivery;

  /** Traits left out during the current transformEvents call, one entry per (attribute, reason). */
  private leftOutTraits = new Map<string, LeftOutCount>();

  /**
   * No lookup and no I/O: this override only brackets the call so the left-out traits are counted
   * across every row and logged once per (attribute, reason) (trait-mappings D25).
   * The counter is per transformEvents pass: the framework runs one pass for the batchable rows
   * and one per row the router marks `dontBatch` (retries), so those log separately.
   */
  async transformEvents(
    inputs: GainsightPxAudienceRouterRequest[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<GainsightPxAudiencePayload>> {
    this.leftOutTraits = new Map();
    try {
      // Awaited so `finally` runs after every row was transformed.
      return await super.transformEvents(inputs, reqMetadata);
    } finally {
      this.logLeftOutTraits();
    }
  }

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
    // Before the traits: a row that fails here must not be counted as a left-out trait.
    const identifyId = normalizeIdentifyId(message.identifiers?.identifyId);
    const flag = connectionConfig.customAttributeName;
    const customAttributes = ACTION_ATTR_VALUE[message.action]
      ? this.memberAttributes(flag, connectionConfig.fieldMappings, message.fields)
      : // A leave writes only the flag; traits keep their last PX values (trait-mappings D23).
        { [flag]: false };

    return {
      body: { identifyId, customAttributes },
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

  /** `{ [flag]: true, ...traits }`, flag first; counts what was left out (trait-mappings §5.2). */
  private memberAttributes(
    flag: string,
    mappings: readonly TraitMapping[] | null | undefined,
    fields: Record<string, unknown> | null | undefined,
  ): Record<string, TraitValue> {
    const { traits, leftOut } = collectTraits(mappings, fields, flag);
    leftOut.forEach(({ attribute, reason }) => {
      const key = `${attribute}\u0000${reason}`;
      const entry = this.leftOutTraits.get(key);
      if (entry) entry.count += 1;
      else this.leftOutTraits.set(key, { attribute, reason, count: 1 });
    });
    return { [flag]: true, ...traits };
  }

  private logLeftOutTraits(): void {
    // The attribute API name and a count only: never a value, never an identifyId (D25).
    this.leftOutTraits.forEach(({ attribute, reason, count }) => {
      logger.warn(LEFT_OUT_MESSAGE, { destType: LOG_DEST_TYPE, attribute, reason, count });
    });
    this.leftOutTraits.clear();
  }
}

export const Integration = GainsightPxAudienceIntegration;
