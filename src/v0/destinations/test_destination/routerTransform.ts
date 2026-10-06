// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
// Batching is not required for this dummy destination — it is wired through the native batching
// framework purely as a worked reference for the recommended router-transform pattern.
import { z, ZodType } from 'zod';
import { ConfigurationError } from '@rudderstack/integrations-lib';
import {
  DestinationIntegration,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type {
  BatchStrategy,
  DeliverySpec,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { getDestinationVersion } from '../../../util/utils';
import { process as transformEvent } from './transform';
import { V2_MAJOR } from './config';
import type {
  TestDestinationProcessorRequest,
  TestDestinationRouterRequest,
  TestDestinationV1Payload,
} from './type';

class TestDestinationIntegration extends DestinationIntegration<TestDestinationV1Payload> {
  static readonly delivery: DeliverySpec = {
    prepareRequest: (request) => {
      if (getDestinationVersion(request.destinationVersion) >= V2_MAJOR) {
        throw new ConfigurationError('test_destination v2 delivery is not yet implemented');
      }
      return request;
    },
  };

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
