import { ZodType } from 'zod';
import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import type { RouterTransformationRequestData } from '../../../types';
import { addExternalIdToTraits, adduserIdFromExternalId, removeUndefinedValues } from '../../util';
import { MappedToDestinationKey } from '../../../constants';
import { validateConfigFields } from './util';
import { buildEnvelope, buildRequestMeta } from './v2/util';
import { getV2InputSchema, CustomerIOV2Payload, CustomerIODestinationConfig } from './v2/types';
import { MAX_OBJECT_SIZE_BYTES, MAX_BATCH_PAYLOAD } from './v2/config';

class CustomerIOIntegration extends BatchDestination<
  CustomerIOV2Payload,
  CustomerIODestinationConfig
> {
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<CustomerIOV2Payload> {
    const { message } = input;
    validateConfigFields(this.destination);
    // For RETL/warehouse sources (mappedToDestination), derive userId from
    // context.externalId and fold externalId into traits, mirroring the v1 path.
    if (get(message, MappedToDestinationKey)) {
      addExternalIdToTraits(message);
      adduserIdFromExternalId(message);
    }
    const body = removeUndefinedValues(
      buildEnvelope(message, this.destination),
    ) as CustomerIOV2Payload;
    const size = Buffer.byteLength(JSON.stringify(body), 'utf8');
    if (size > MAX_OBJECT_SIZE_BYTES) {
      throw new InstrumentationError(
        `Event size (${size} bytes) exceeds CustomerIO's 32KB per-object limit.`,
      );
    }
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
