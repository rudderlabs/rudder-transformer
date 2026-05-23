import { z, ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { EVENT_TYPES } from '../../util/recordUtils';
import { processAudienceRecord } from '../../util/audienceUtils';
import {
  ACTION_RECORD_MAP,
  DESTINATION_TYPE,
  MAX_BATCH_SIZE,
  getSubscribeEndpoint,
  getUnsubscribeEndpoint,
} from './config';
import {
  IDENTIFIER_FIELD_CONFIG,
  buildSubscribeBody,
  buildUnsubscribeBody,
  remapToIterableFields,
  selectIdentifierForRow,
  validateProjectTypeMappings,
} from './utils';
import type {
  IterableAccountConfig,
  IterableAudiencePayload,
  IterableConnectionConfig,
} from './types';

class IterableAudienceIntegration extends BatchDestination<
  IterableAudiencePayload,
  IterableAccountConfig,
  { destination: IterableConnectionConfig }
> {
  // Headers are constant per (destination + connection) — build once.
  private readonly headers: Record<string, string>;

  constructor(
    destination: Destination<IterableAccountConfig>,
    connection?: Connection<{ destination: IterableConnectionConfig }>,
  ) {
    super(destination, connection);
    if (!this.connection) {
      throw new InstrumentationError('Connection config is required for iterable_audience');
    }
    // Cross-field validation across Destination.Config.projectType and the
    // connection's identifierMappings — throws ConfigurationError if the
    // combination is invalid (e.g. email-based project paired with userId
    // mapping). Surfaces at integration construction, before any event is
    // transformed.
    validateProjectTypeMappings(
      this.destination.Config.projectType,
      this.connection.config.destination.identifierMappings,
    );

    this.headers = {
      'Content-Type': 'application/json',
      // Per conventions.md — header auth only; query-string auth incurs
      // stricter rate limiting from Iterable.
      'Api-Key': this.destination.Config.apiKey,
    };
  }

  private get accountConfig(): IterableAccountConfig {
    return this.destination.Config;
  }

  private get connectionConfig(): IterableConnectionConfig {
    // `connection` is non-null past the constructor (validated above).
    return this.connection!.config.destination;
  }

  transformEvent(
    input: RouterTransformationRequestData,
  ): TransformedEvent<IterableAudiencePayload> {
    const { message, metadata } = input;
    const messageAction = (message as { action?: string }).action;
    if (!messageAction) {
      throw new InstrumentationError('record event is missing action');
    }
    const action = ACTION_RECORD_MAP[messageAction];
    if (!action) {
      throw new InstrumentationError(`Unsupported record action: ${messageAction}`);
    }

    const identifiers = (message as { identifiers?: Record<string, unknown> }).identifiers ?? {};
    const remapped = remapToIterableFields(identifiers, this.connectionConfig.identifierMappings);

    // `processAudienceRecord` is shared with custom_audience and other
    // audience destinations — it normalises + validates each field per the
    // supplied `fieldConfigs`. `config: { isHashRequired: false }` is required
    // by the destructure even when no field is hashable (see mistakes.md).
    const processed = processAudienceRecord(remapped, {
      fieldConfigs: IDENTIFIER_FIELD_CONFIG,
      destination: {
        workspaceId:
          (metadata as { workspaceId?: string }).workspaceId ?? this.destination.WorkspaceID,
        id: this.destination.ID,
        type: DESTINATION_TYPE,
        config: { isHashRequired: false },
      },
    }) as Partial<Record<'email' | 'userId', string>>;

    if (Object.keys(processed).length === 0) {
      throw new InstrumentationError('All identifier values are empty after normalization');
    }

    const subscriber = selectIdentifierForRow(processed, this.accountConfig.projectType);

    const endpoint =
      action === 'subscribe'
        ? getSubscribeEndpoint(this.accountConfig.dataCenter)
        : getUnsubscribeEndpoint(this.accountConfig.dataCenter);

    return {
      body: { action, subscriber },
      endpoint,
      method: 'POST',
      headers: this.headers,
    };
  }

  getBatchStrategy(endpoint: string): BatchStrategy<IterableAudiencePayload> {
    // listId + subscribe/unsubscribe branch are captured in the closure here.
    // `ChunkBatchStrategy.wrapBody(bodies)` receives only the bodies array
    // (no endpoint, no group key), so this state cannot be passed at call-time.
    const { listId } = this.connectionConfig;
    const isSubscribe = endpoint.endsWith('/api/lists/subscribe');
    return new ChunkBatchStrategy<IterableAudiencePayload>({
      maxItems: MAX_BATCH_SIZE,
      wrapBody: (bodies) => {
        const subscribers = bodies.map((b) => b.subscriber);
        return isSubscribe
          ? buildSubscribeBody(listId, subscribers)
          : buildUnsubscribeBody(listId, subscribers);
      },
    });
  }

  getInputSchema(): ZodType {
    return z
      .object({
        message: z
          .object({
            type: z.literal('record'),
            action: z.enum([EVENT_TYPES.INSERT, EVENT_TYPES.UPDATE, EVENT_TYPES.DELETE]),
            identifiers: z.record(z.unknown()).optional(),
          })
          .passthrough(),
      })
      .passthrough();
  }
}

export const Integration = IterableAudienceIntegration;
