import { ZodType } from 'zod';
import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import { addExternalIdToTraits, adduserIdFromExternalId, removeUndefinedValues } from '../../util';
import { MappedToDestinationKey } from '../../../constants';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { getV2InputSchema, CustomerIOV2Payload, CustomerIODestinationConfig } from './v2/types';
import type { RudderRecordV2 } from '../../../types/rudderEvents';
import { MAX_OBJECT_SIZE_BYTES, MAX_BATCH_PAYLOAD } from './v2/config';
import { buildRecordEvent } from './v2/recordTransform';
import { validateConfigFields } from './util';
import { buildEnvelope, buildRequestMeta } from './v2/util';
import { CustomerIORouterRequest, CustomerIOConnection } from './types';

function isRecordMessage(msg: { type: string }): msg is RudderRecordV2 {
  return msg.type === 'record';
}

class CustomerIOIntegration extends BatchDestination<
  CustomerIOV2Payload,
  CustomerIODestinationConfig,
  CustomerIOConnection['config']
> {
  private assertObjectSize(body: unknown): void {
    const size = Buffer.byteLength(JSON.stringify(body), 'utf8');
    if (size > MAX_OBJECT_SIZE_BYTES) {
      throw new InstrumentationError(
        `Event size (${size} bytes) exceeds CustomerIO's 32KB per-object limit.`,
      );
    }
  }

  private buildBody(message: CustomerIORouterRequest['message']): CustomerIOV2Payload {
    if (isRecordMessage(message)) {
      return buildRecordEvent(message);
    }
    // For RETL/warehouse sources (mappedToDestination), derive userId from
    // context.externalId and fold externalId into traits, mirroring the v1 path.
    if (get(message, MappedToDestinationKey)) {
      addExternalIdToTraits(message);
      adduserIdFromExternalId(message);
    }
    return removeUndefinedValues(buildEnvelope(message, this.destination)) as CustomerIOV2Payload;
  }

  transformEvent(input: CustomerIORouterRequest): TransformedEvent<CustomerIOV2Payload> {
    validateConfigFields(this.destination);
    const body = this.buildBody(input.message);
    this.assertObjectSize(body);
    return { body, ...buildRequestMeta(this.destination) };
  }

  getBatchStrategy(): BatchStrategy<CustomerIOV2Payload> {
    return new ChunkBatchStrategy<CustomerIOV2Payload>({
      maxPayloadSize: MAX_BATCH_PAYLOAD,
      wrapBody: (bodies) => ({ batch: bodies }),
    });
  }

  getInputSchema(): ZodType {
    return getV2InputSchema();
  }
}

export const Integration = CustomerIOIntegration;
