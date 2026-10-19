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
  IDENTIFIERS_BY_FORMAT,
  MAX_RECORDS_PER_REQUEST,
  RECORD_FORMAT,
  RECORD_FORMATS,
  getEndpoint,
  type RecordFormat,
} from './config';
import {
  PinterestAudienceRouterRequestSchema,
  type PinterestAudiencePayload,
  type PinterestAudienceRequestBody,
  type PinterestAudienceRouterInput,
  type PinterestAudienceRouterRequest,
} from './types';
import { pinterestAudienceDelivery } from './delivery';
import { PINTEREST_FIELD_CONFIG, pickPinterestIdentifiers, toRecordRow } from './utils';

class PinterestAudienceIntegration extends DestinationIntegration<
  PinterestAudiencePayload,
  typeof PinterestAudienceRouterRequestSchema
> {
  static readonly delivery = pinterestAudienceDelivery;

  /** Spec D15: read at call time so tests can switch it with `jest.replaceProperty`. */
  // eslint-disable-next-line class-methods-use-this
  private get recordFormat(): RecordFormat {
    return RECORD_FORMAT;
  }

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
    const allowed = IDENTIFIERS_BY_FORMAT[this.recordFormat];
    const processed = processAudienceRecord(
      pickPinterestIdentifiers(message.identifiers ?? {}, allowed),
      {
        fieldConfigs: PINTEREST_FIELD_CONFIG,
        destination: {
          workspaceId: this.destination.WorkspaceID,
          id: this.destination.ID,
          type: DESTINATION_TYPE,
          config: { isHashRequired },
        },
      },
    );

    const row = toRecordRow(processed);
    if (Object.keys(row).length === 0) {
      // Permanent, per record: nothing Pinterest could match on. Siblings still deliver.
      throw new InstrumentationError(
        `No valid Pinterest identifier (${allowed.join(' / ')}) after normalization`,
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
      // cannot share a request. Identifier sets need no split in either format: records_v2 rows
      // are named fields and the classic string is flat.
      internalGroupKey: operationType,
    };
  }

  getBatchStrategy(): BatchStrategy<PinterestAudiencePayload> {
    const format = this.recordFormat;
    return new ChunkBatchStrategy<PinterestAudiencePayload>({
      maxItems: MAX_RECORDS_PER_REQUEST,
      // internalGroupKey makes every body in a group carry the same operationType.
      wrapBody: (bodies): PinterestAudienceRequestBody => {
        const { operationType } = bodies[0];
        if (format === RECORD_FORMATS.V2) {
          return { operation_type: operationType, records_v2: bodies.map((b) => b.row) };
        }
        // Classic: one flat string, one identifier per record — a row with email and MAID is two
        // records. Row order is kept so a failure can be read back against the chunk.
        return {
          operation_type: operationType,
          records: bodies.flatMap((b) => Object.values(b.row)).join(','),
        };
      },
    });
  }

  getInputSchema() {
    return PinterestAudienceRouterRequestSchema;
  }
}

export const Integration = PinterestAudienceIntegration;
