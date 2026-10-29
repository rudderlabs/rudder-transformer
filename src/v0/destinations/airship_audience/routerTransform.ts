import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  ChunkBatchStrategy,
  DestinationIntegration,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import {
  ACCEPT_HEADER,
  ACTION_OPERATION,
  ENDPOINT_PATH,
  MAX_NAMED_USER_ID_LENGTH,
  MAX_NAMED_USERS,
  REASONS,
  tagsEndpoint,
} from './config';
import { airshipAudienceDelivery } from './delivery';
import {
  AirshipAudienceRouterRequestSchema,
  type AirshipAudiencePayload,
  type AirshipAudienceRouterRequest,
} from './types';

/**
 * A finite number becomes a string, then the value is trimmed. Never lowercased: named user IDs
 * are case-sensitive. Over 128 characters fails here, before a 400 sends the whole batch through
 * the dontBatch split.
 */
const normalizeNamedUserId = (raw: unknown): string => {
  if (raw === undefined || raw === null) throw new InstrumentationError(REASONS.noNamedUserId);
  if (typeof raw === 'number' && !Number.isFinite(raw)) {
    throw new InstrumentationError(REASONS.invalidNamedUserId);
  }
  if (typeof raw !== 'number' && typeof raw !== 'string') {
    throw new InstrumentationError(REASONS.invalidNamedUserId);
  }
  const value = String(raw).trim();
  if (value.length === 0) throw new InstrumentationError(REASONS.noNamedUserId);
  if (value.length > MAX_NAMED_USER_ID_LENGTH) {
    throw new InstrumentationError(REASONS.invalidNamedUserId);
  }
  return value;
};

/** `{ audience, add|remove }`: one block per call, so every item in a chunk shares it. */
const wrapBody = (items: AirshipAudiencePayload[]): Record<string, unknown> => {
  const [{ action, tagGroup, tagName }] = items;
  return {
    audience: { named_user_id: items.map((item) => item.named_user_id) },
    [action]: { [tagGroup]: [tagName] },
  };
};

class AirshipAudienceIntegration extends DestinationIntegration<
  AirshipAudiencePayload,
  typeof AirshipAudienceRouterRequestSchema
> {
  static readonly delivery = airshipAudienceDelivery;

  transformEvent(input: AirshipAudienceRouterRequest): TransformedEvent<AirshipAudiencePayload> {
    // Per row, not this.connection: the framework constructs the class with the FIRST row's
    // connection, and one call may carry rows of two connections with different tags.
    const connectionConfig = input.connection?.config.destination;
    if (!connectionConfig) {
      throw new ConfigurationError('Connection config is required for AIRSHIP_AUDIENCE');
    }

    const { message, destination } = input;
    const namedUserId = normalizeNamedUserId(message.identifiers?.named_user_id);
    const action = ACTION_OPERATION[message.action];
    const { tagName } = connectionConfig;

    return {
      // The input schema trims for validation only: the framework hands transformEvent the raw
      // config, so the trims are applied here too.
      body: {
        named_user_id: namedUserId,
        action,
        tagGroup: destination.Config.tagGroup.trim(),
        tagName,
      },
      endpoint: tagsEndpoint(destination.Config.dataCenter),
      endpointPath: ENDPOINT_PATH,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${destination.Config.apiKey.trim()}`,
        Accept: ACCEPT_HEADER,
        'Content-Type': 'application/json',
      },
      // Airship applies one add or remove block to every named user in a call, so adds and
      // removes, and rows of two connections with different tags, cannot share a request.
      internalGroupKey: `${action}:${tagName}`,
    };
  }

  getBatchStrategy(): BatchStrategy<AirshipAudiencePayload> {
    return new ChunkBatchStrategy<AirshipAudiencePayload>({ maxItems: MAX_NAMED_USERS, wrapBody });
  }

  getInputSchema() {
    return AirshipAudienceRouterRequestSchema;
  }
}

export const Integration = AirshipAudienceIntegration;
