// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
// Batching is not required for this dummy destination — it is wired through the native batching
// framework purely as a worked reference for the recommended router-transform pattern.
import { z, ZodType } from 'zod';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { process as transformEvent } from './transform';
import type {
  TestDestinationProcessorRequest,
  TestDestinationRouterRequest,
  TestDestinationV1Payload,
} from './type';

class TestDestinationIntegration extends BatchDestination<TestDestinationV1Payload> {
  transformEvent(input: TestDestinationRouterRequest): TransformedEvent<TestDestinationV1Payload> {
    // Reuse the version-dispatching per-event transform (throws ConfigurationError on v2); the
    // framework wraps that throw into a per-event error response.
    const result = transformEvent({
      message: input.message,
      destination: input.destination,
    } as TestDestinationProcessorRequest);
    return {
      body: result.body.JSON as TestDestinationV1Payload,
      endpoint: result.endpoint,
      endpointPath: '/v1/events',
      method: result.method,
      headers: result.headers,
    };
  }

  getBatchStrategy(): BatchStrategy<TestDestinationV1Payload> {
    // No size/count limits — events that share endpoint + headers collapse into one request.
    return new ChunkBatchStrategy<TestDestinationV1Payload>({
      wrapBody: (bodies) => ({ batch: bodies }),
    });
  }

  getInputSchema(): ZodType {
    return z.object({ message: z.object({}).passthrough() }).passthrough();
  }
}

export const Integration = TestDestinationIntegration;
