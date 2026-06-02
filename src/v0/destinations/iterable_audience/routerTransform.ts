import type { ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
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
  selectIdentifierForRow,
} from './utils';
import {
  IterableAudienceRouterRequestSchema,
  type IterableAccountConfig,
  type IterableAudiencePayload,
  type IterableConnectionConfig,
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

    // `message.identifiers` already arrives keyed by the Iterable field
    // (`email` / `userId`) — rudder-sources resolves the mapping upstream — so
    // it is passed straight through. `processAudienceRecord` normalises +
    // validates the `email`/`userId` fields per `IDENTIFIER_FIELD_CONFIG` and
    // drops null/empty values; any other key passes through untouched and is
    // then ignored by `selectIdentifierForRow`, which only reads email/userId.
    // `config: { isHashRequired: false }` is required by the destructure even
    // though no identifier field is hashable.
    const processed = processAudienceRecord(identifiers, {
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
    // Iterable's API expects a numeric listId; VDM Next supplies it as
    // `audienceId` (string) on the connection config.
    const { audienceId, updateExistingUsersOnly } = this.connectionConfig;
    const listId = typeof audienceId === 'number' ? audienceId : Number(audienceId);
    const isSubscribe = endpoint.endsWith('/api/lists/subscribe');
    return new ChunkBatchStrategy<IterableAudiencePayload>({
      maxItems: MAX_BATCH_SIZE,
      wrapBody: (bodies) => {
        const subscribers = bodies.map((b) => b.subscriber);
        return isSubscribe
          ? buildSubscribeBody(listId, subscribers, updateExistingUsersOnly)
          : buildUnsubscribeBody(listId, subscribers);
      },
    });
  }

  getInputSchema(): ZodType {
    return IterableAudienceRouterRequestSchema;
  }
}

export const Integration = IterableAudienceIntegration;
