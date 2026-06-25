import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import {
  destinationNoVersion,
  destinationV1,
  destinationV2,
  baseMessage,
  v1Endpoint,
} from '../common';

const v1BatchedRequest = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: v1Endpoint,
  headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'v1-secret-key' },
  params: {},
  body: { JSON: baseMessage, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
};

export const data: RouterTestData[] = [
  {
    id: 'test_destination-router-v1',
    name: 'test_destination',
    description: 'v1 + no-version destinations both route through the v1 branch',
    scenario: 'Integration-major dispatch',
    successCriteria: 'Both events return the v1 request shape',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            { message: baseMessage, metadata: generateMetadata(1), destination: destinationV1 },
            {
              message: baseMessage,
              metadata: generateMetadata(2),
              destination: destinationNoVersion,
            },
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
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: destinationV1,
            },
            {
              batchedRequest: v1BatchedRequest,
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination: destinationNoVersion,
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
              statTags: {
                destType: 'TEST_DESTINATION',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
            },
          ],
        },
      },
    },
  },
];
