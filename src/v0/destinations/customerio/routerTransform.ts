import { ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import type { RouterTransformationRequestData } from '../../../types';
// `processV2` builds the single-event delivery request and is reused here so no
// transform logic is duplicated — the envelope is pulled back out of its
// one-element `{ batch: [...] }` body and re-batched by the framework.
import { processV2 } from './v2/transform';
import { getV2InputSchema, CustomerIOV2Payload, CustomerIODestinationConfig } from './v2/types';
import { MAX_OBJECT_SIZE_BYTES, MAX_BATCH_PAYLOAD } from './v2/config';

class CustomerIOIntegration extends BatchDestination<
  CustomerIOV2Payload,
  CustomerIODestinationConfig
> {
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<CustomerIOV2Payload> {
    const result = processV2({ message: input.message, destination: this.destination });
    const [body] = result.body.JSON!.batch;
    const size = Buffer.byteLength(JSON.stringify(body), 'utf8');
    if (size > MAX_OBJECT_SIZE_BYTES) {
      throw new InstrumentationError(
        `Event size (${size} bytes) exceeds CustomerIO's 32KB per-object limit.`,
      );
    }
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
