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
      wrapBody: (bodies): RedditAudienceRequestBody => {
        const { actionType, columnOrder } = bodies[0];

        // Reddit does NOT validate row arity against `column_order` — verified
        // live against the API: a 2-value row under a 1-column order, and a
        // 1-value row under a 2-column order, are BOTH answered 204 rather than
        // 400. A misaligned matrix is therefore accepted, silently shifting
        // every value into the wrong column and matching nobody, with no error
        // anywhere to trace. Grouping already guarantees alignment, so a
        // mismatch here is a bug in this file, not bad customer data — fail
        // loudly instead of shipping garbage Reddit will happily accept.
        const misaligned = bodies.find((b) => b.row.length !== columnOrder.length);
        if (misaligned) {
          throw new InstrumentationError(
            `reddit_audience built a misaligned batch: a row has ${misaligned.row.length} value(s) but column_order declares ${columnOrder.length} (${columnOrder.join(', ')})`,
          );
        }

        return {
          data: {
            action_type: actionType,
            column_order: columnOrder,
            user_data: bodies.map((b) => b.row),
          },
        };
      },
    });
  }

  getInputSchema() {
    return RedditAudienceRouterRequestSchema;
  }
}

export const Integration = RedditAudienceIntegration;
