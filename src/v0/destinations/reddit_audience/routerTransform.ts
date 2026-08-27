import { z } from 'zod';
import { InstrumentationError, OAuthSecretError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { processAudienceRecord } from '../../util/audienceUtils';
import {
  ACTION_RECORD_MAP,
  DESTINATION_TYPE,
  MAX_BATCH_SIZE,
  USER_AGENT,
  getEndpoint,
  getEndpointPath,
} from './config';
import { IDENTIFIER_FIELD_CONFIG, buildGroupKey, buildRow, columnsFor } from './utils';
import { redditAudienceDelivery } from './delivery';
import {
  RedditAudienceRouterRequestSchema,
  type RedditAudienceConnectionConfig,
  type RedditAudiencePayload,
  type RedditAudienceRequestBody,
  type RedditAudienceRouterInput,
} from './types';

class RedditAudienceIntegration extends BatchDestination<
  RedditAudiencePayload,
  typeof RedditAudienceRouterRequestSchema
> {
  // 204 carries no body, so there is no partial-failure envelope to parse; the
  // spec exists only to refine auth and to surface Reddit's error shape.
  static readonly delivery = redditAudienceDelivery;

  constructor(...args: ConstructorParameters<typeof BatchDestination>) {
    super(...args);
    if (!this.connection) {
      throw new InstrumentationError('Connection config is required for reddit_audience');
    }
  }

  private get connectionConfig(): RedditAudienceConnectionConfig {
    return this.connection!.config.destination;
  }

  transformEvent(
    input: z.infer<typeof RedditAudienceRouterRequestSchema>,
  ): TransformedEvent<RedditAudiencePayload> {
    const { message, metadata } = input as RedditAudienceRouterInput;

    const accessToken = metadata?.secret?.accessToken;
    if (!accessToken) {
      throw new OAuthSecretError('Secret or accessToken is not present in the metadata');
    }

    const actionType = ACTION_RECORD_MAP[message.action];
    if (!actionType) {
      throw new InstrumentationError(`Unsupported record action: ${message.action}`);
    }

    const { audienceId, isHashRequired } = this.connectionConfig;

    // `identifiers` already arrives keyed by the Reddit column name — the webapp
    // mapper writes EMAIL_SHA256 / MAID_SHA256 as `to` and rudder-sources
    // resolves the mapping upstream. Any other key is dropped by `columnsFor`.
    const processed = processAudienceRecord(message.identifiers ?? {}, {
      fieldConfigs: IDENTIFIER_FIELD_CONFIG,
      destination: {
        workspaceId: this.destination.WorkspaceID,
        id: this.destination.ID,
        type: DESTINATION_TYPE,
        config: { isHashRequired },
      },
    });

    const columnOrder = columnsFor(processed);
    if (columnOrder.length === 0) {
      // Permanent, per-record: nothing Reddit could match on. Aborting this one
      // record leaves its siblings in the batch deliverable.
      throw new InstrumentationError(
        'No valid Reddit identifier (EMAIL_SHA256 / MAID_SHA256) after normalization',
      );
    }

    return {
      body: { actionType, columnOrder, row: buildRow(processed, columnOrder) },
      endpoint: getEndpoint(audienceId),
      endpointPath: getEndpointPath(),
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Reddit treats a missing/generic UA as a cause of 403 and 429.
        'User-Agent': USER_AGENT,
      },
      // ADD and REMOVE share one URL, and rows must align to a single
      // `column_order`, so neither dimension can be allowed to merge. The
      // composite grouping key covers endpoint/method/headers/params only —
      // this is the discriminator the framework provides for exactly this case.
      internalGroupKey: buildGroupKey(actionType, columnOrder),
    };
  }

  getBatchStrategy(): BatchStrategy<RedditAudiencePayload> {
    return new ChunkBatchStrategy<RedditAudiencePayload>({
      maxItems: MAX_BATCH_SIZE,
      // `wrapBody` receives only the bodies, and `getBatchStrategy` only the
      // endpoint — neither is told the action or the columns. Reading them off
      // bodies[0] is safe because `internalGroupKey` makes every body in a
      // group carry the same pair.
      wrapBody: (bodies): RedditAudienceRequestBody => ({
        data: {
          action_type: bodies[0].actionType,
          column_order: bodies[0].columnOrder,
          user_data: bodies.map((b) => b.row),
        },
      }),
    });
  }

  getInputSchema() {
    return RedditAudienceRouterRequestSchema;
  }
}

export const Integration = RedditAudienceIntegration;
