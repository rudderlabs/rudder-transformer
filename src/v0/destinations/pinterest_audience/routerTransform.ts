import {
  ConfigurationError,
  InstrumentationError,
  OAuthSecretError,
} from '@rudderstack/integrations-lib';
import {
  DestinationIntegration,
  ChunkBatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import { processAudienceRecord } from '../../util/audienceUtils';
import {
  ACTION_RECORD_MAP,
  DESTINATION_TYPE,
  ENDPOINT_PATH,
  MAX_RECORDS_PER_REQUEST,
  getEndpoint,
} from './config';
import {
  PinterestAudienceRouterRequestSchema,
  type PinterestAudiencePayload,
  type PinterestAudienceRequestBody,
  type PinterestAudienceRouterInput,
  type PinterestAudienceRouterRequest,
} from './types';
import { PINTEREST_FIELD_CONFIG, pickPinterestIdentifiers, toRecordRow } from './utils';

class PinterestAudienceIntegration extends DestinationIntegration<
  PinterestAudiencePayload,
  typeof PinterestAudienceRouterRequestSchema
> {
  transformEvent(
    input: PinterestAudienceRouterRequest,
  ): TransformedEvent<PinterestAudiencePayload> {
    // Per row, not this.connection: the framework constructs the class with the FIRST event's
    // connection, and one router call may carry rows of two connections (two lists).
    const connectionConfig = input.connection?.config.destination;
    if (!connectionConfig) {
      throw new ConfigurationError(`Connection config is required for ${DESTINATION_TYPE}`);
    }

    const { message, metadata } = input as PinterestAudienceRouterInput;
    const accessToken = metadata?.secret?.accessToken;
    if (!accessToken) {
      throw new OAuthSecretError('Secret or accessToken is not present in the metadata');
    }

    const { adAccountId, customerListId, isHashRequired } = connectionConfig;
    const processed = processAudienceRecord(pickPinterestIdentifiers(message.identifiers ?? {}), {
      fieldConfigs: PINTEREST_FIELD_CONFIG,
      destination: {
        workspaceId: this.destination.WorkspaceID,
        id: this.destination.ID,
        type: DESTINATION_TYPE,
        config: { isHashRequired },
      },
    });

    const row = toRecordRow(processed);
    if (Object.keys(row).length === 0) {
      // Permanent, per record: nothing Pinterest could match on. Siblings still deliver.
      throw new InstrumentationError(
        'No valid Pinterest identifier (EMAIL / MAID / PHONE) after normalization',
      );
    }

    const operationType = ACTION_RECORD_MAP[message.action];
    return {
      body: { operationType, row },
      endpoint: getEndpoint(adAccountId, customerListId),
      endpointPath: ENDPOINT_PATH,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      // ADD and REMOVE share one URL and the body carries a single `operation_type`, so they
      // cannot share a request. Identifier sets need no split: records_v2 rows are named fields.
      internalGroupKey: operationType,
    };
  }

  getBatchStrategy(): BatchStrategy<PinterestAudiencePayload> {
    return new ChunkBatchStrategy<PinterestAudiencePayload>({
      maxItems: MAX_RECORDS_PER_REQUEST,
      // internalGroupKey makes every body in a group carry the same operationType.
      wrapBody: (bodies): PinterestAudienceRequestBody => ({
        operation_type: bodies[0].operationType,
        records_v2: bodies.map((b) => b.row),
      }),
    });
  }

  getInputSchema() {
    return PinterestAudienceRouterRequestSchema;
  }
}

export const Integration = PinterestAudienceIntegration;
