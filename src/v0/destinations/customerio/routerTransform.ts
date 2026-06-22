import { ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { processV2 } from './v2/transform';
import { getV2InputSchema, CustomerIOV2Payload, CustomerIODestinationConfig } from './v2/types';
import type { RudderRecordV2 } from '../../../types/rudderEvents';
import { MAX_OBJECT_SIZE_BYTES, MAX_BATCH_PAYLOAD } from './v2/config';
import { buildRecordEvent } from './v2/recordTransform';
import { buildRequestMeta } from './v2/util';
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

  transformEvent(input: CustomerIORouterRequest): TransformedEvent<CustomerIOV2Payload> {
    if (isRecordMessage(input.message)) {
      const body = buildRecordEvent(input.message, this.connection?.config?.destination);
      this.assertObjectSize(body);
      const meta = buildRequestMeta(this.destination);
      return {
        body,
        endpoint: meta.endpoint,
        endpointPath: meta.endpointPath,
        method: meta.method,
        headers: meta.headers,
      };
    }

    const result = processV2({ message: input.message, destination: this.destination });
    const [body] = result.body.JSON!.batch;
    this.assertObjectSize(body);
    return {
      body,
      endpoint: result.endpoint,
      endpointPath: result.endpointPath!,
      method: result.method,
      headers: result.headers,
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
