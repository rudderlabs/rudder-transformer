import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { destinationV1, destinationV2, baseMessage, v1Endpoint, v2StatTags } from '../common';

// Routed through the native batching framework: events sharing endpoint + headers collapse into a
// single request whose body wraps the per-event payloads under `batch`.
const v1BatchedRequest = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: v1Endpoint,
  endpointPath: '/v1/events',
  headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'v1-secret-key' },
  params: {},
  body: { JSON: { batch: [baseMessage, baseMessage] }, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
};

export const data: RouterTestData[] = [
  {
    id: 'test_destination-router-v1',
    name: 'test_destination',
    description:
      'Multiple v1 events on the same destination batch into a single request via the framework',
    scenario: 'Integration-major dispatch + native batching',
    successCriteria: 'Both events collapse into one batched v1 request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            { message: baseMessage, metadata: generateMetadata(1), destination: destinationV1 },
            { message: baseMessage, metadata: generateMetadata(2), destination: destinationV1 },
          ],
          destType: 'test_destination',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: v1BatchedRequest,
              metadata: [generateMetadata(1), generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination: destinationV1,
            },
          ],
        },
      },
    },
  },
  {
    id: 'test_destination-router-v2-unimplemented',
    name: 'test_destination',
    description: 'v2 destination is rejected per-event — only v1 is implemented',
    scenario: 'Integration-major dispatch — v2 not implemented',
    successCriteria: 'Should return an error indicating v2 is not yet implemented',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            { message: baseMessage, metadata: generateMetadata(3), destination: destinationV2 },
          ],
          destType: 'test_destination',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(3)],
              batched: false,
              statusCode: 400,
              error: 'test_destination v2 transformation is not yet implemented',
              destination: destinationV2,
              statTags: v2StatTags('router'),
            },
          ],
        },
      },
    },
  },
];
