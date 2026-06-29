import { ZodType } from 'zod';
import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import { VDMV2ObjectDestination } from '../../../services/destination/nativeBatching/vdmV2ObjectDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { addExternalIdToTraits, adduserIdFromExternalId, removeUndefinedValues } from '../../util';
import { MappedToDestinationKey } from '../../../constants';
import {
  getV2InputSchema,
  CustomerIOV2Payload,
  CustomerIODestinationConfig,
  type CustomerIOV2RecordMessage,
} from './v2/types';
import { MAX_OBJECT_SIZE_BYTES, MAX_BATCH_PAYLOAD } from './v2/config';
import { buildRecordEvent } from './v2/recordTransform';
import { validateConfigFields } from './util';
import { buildEnvelope, buildRequestMeta } from './v2/util';
import {
  CustomerIORouterRequest,
  CustomerIOConnection,
  CUSTOMERIO_RECORD_OBJECTS,
  type CustomerIORecordObject,
} from './types';

function isRecordMessage(msg: { type: string }): msg is CustomerIOV2RecordMessage {
  return msg.type === 'record';
}

class CustomerIOIntegration extends VDMV2ObjectDestination<
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

  private buildRecord(
    input: RouterTransformationRequestData,
    objectType: CustomerIORecordObject,
  ): TransformedEvent<CustomerIOV2Payload> {
    validateConfigFields(this.destination);
    if (!isRecordMessage(input.message)) {
      throw new InstrumentationError('Expected record message');
    }
    const body = buildRecordEvent(input.message, objectType);
    this.assertObjectSize(body);
    return { body, ...buildRequestMeta(this.destination) };
  }

  transformObjectRecord() {
    const person = (input: RouterTransformationRequestData) =>
      this.buildRecord(input, CUSTOMERIO_RECORD_OBJECTS.person);
    const event = (input: RouterTransformationRequestData) =>
      this.buildRecord(input, CUSTOMERIO_RECORD_OBJECTS.event);
    return {
      [CUSTOMERIO_RECORD_OBJECTS.person]: { insert: person, update: person, delete: person },
      [CUSTOMERIO_RECORD_OBJECTS.event]: { insert: event, update: event },
    };
  }

  transformEventStream(input: CustomerIORouterRequest): TransformedEvent<CustomerIOV2Payload> {
    validateConfigFields(this.destination);
    const { message } = input;
    if (get(message, MappedToDestinationKey)) {
      addExternalIdToTraits(message);
      adduserIdFromExternalId(message);
    }
    const body = removeUndefinedValues(
      buildEnvelope(message, this.destination),
    ) as CustomerIOV2Payload;
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
