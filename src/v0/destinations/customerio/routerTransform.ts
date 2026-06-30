import { ZodType } from 'zod';
import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import {
  VDMV2ObjectDestination,
  type RecordInput,
} from '../../../services/destination/nativeBatching/vdmV2ObjectDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { removeUndefinedValues } from '../../util';
import { getV2InputSchema, CustomerIOV2Payload, CustomerIODestinationConfig } from './v2/types';
import { MAX_OBJECT_SIZE_BYTES, MAX_BATCH_PAYLOAD } from './v2/config';
import { buildRecordEvent } from './v2/recordTransform';
import { validateConfigFields } from './util';
import {
  buildIdentify,
  buildTrack,
  buildPage,
  buildScreen,
  buildMerge,
  buildObject,
  buildDevice,
  deviceActionFor,
  buildRequestMeta,
} from './v2/util';
import {
  CustomerIORouterRequest,
  CustomerIOConnection,
  CUSTOMERIO_RECORD_OBJECTS,
  type CustomerIORecordObject,
} from './types';

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
    input: RecordInput,
    objectType: CustomerIORecordObject,
  ): TransformedEvent<CustomerIOV2Payload> {
    validateConfigFields(this.destination);
    const body = buildRecordEvent(input.message, objectType);
    this.assertObjectSize(body);
    return { body, ...buildRequestMeta(this.destination) };
  }

  transformObjectRecord(input: RecordInput) {
    const person = () => this.buildRecord(input, CUSTOMERIO_RECORD_OBJECTS.person);
    const event = () => this.buildRecord(input, CUSTOMERIO_RECORD_OBJECTS.event);
    return {
      [CUSTOMERIO_RECORD_OBJECTS.person]: { insert: person, update: person, delete: person },
      [CUSTOMERIO_RECORD_OBJECTS.event]: { insert: event, update: event },
    };
  }

  private wrapEventStreamBody(payload: CustomerIOV2Payload): TransformedEvent<CustomerIOV2Payload> {
    const body = removeUndefinedValues(payload) as CustomerIOV2Payload;
    this.assertObjectSize(body);
    return { body, ...buildRequestMeta(this.destination) };
  }

  transformEventStream(input: CustomerIORouterRequest) {
    validateConfigFields(this.destination);
    const { message } = input;
    return {
      identify: () => this.wrapEventStreamBody(buildIdentify(message)),
      track: () => {
        const evName = get(message, 'event');
        const deviceAction = deviceActionFor(evName, this.destination);
        return this.wrapEventStreamBody(
          deviceAction ? buildDevice(message, deviceAction) : buildTrack(message, evName),
        );
      },
      page: () =>
        this.wrapEventStreamBody(
          buildPage(message, 'page', get(message, 'name') || get(message, 'properties.url')),
        ),
      screen: () =>
        this.wrapEventStreamBody(
          buildScreen(message, 'screen', get(message, 'event') || get(message, 'properties.name')),
        ),
      group: () => this.wrapEventStreamBody(buildObject(message)),
      alias: () => this.wrapEventStreamBody(buildMerge(message)),
    };
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
