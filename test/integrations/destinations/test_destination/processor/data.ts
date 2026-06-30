import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import {
  destinationNoVersion,
  destinationV1,
  destinationV2,
  baseMessage,
  v1RequestShape,
  v2StatTags,
} from '../common';

const v1Output = { ...v1RequestShape, userId: '' };

export const data: ProcessorTestData[] = [
  {
    id: 'test_destination-processor-v1',
    name: 'test_destination',
    description: 'v1 destination (version: 1) routes through the v1 branch',
    scenario: 'Integration-major dispatch',
    successCriteria:
      'Should return 200 with the v1 request shape (dataCenter endpoint, restApiKey header)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [{ message: baseMessage, metadata: generateMetadata(1), destination: destinationV1 }],
      },
    },
    output: {
      response: {
        status: 200,
        body: [{ output: v1Output, statusCode: 200, metadata: generateMetadata(1) }],
      },
    },
  },
  {
    id: 'test_destination-processor-no-version',
    name: 'test_destination',
    description: 'Destination without a stamped version falls to the v1 branch (defensive)',
    scenario: 'Integration-major dispatch — undefined version',
    successCriteria: 'Should behave identically to v1 when version is undefined',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: baseMessage,
            metadata: generateMetadata(2),
            destination: destinationNoVersion,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [{ output: v1Output, statusCode: 200, metadata: generateMetadata(2) }],
      },
    },
  },
  {
    id: 'test_destination-processor-v2-unimplemented',
    name: 'test_destination',
    description: 'v2 destination (version: 2) is rejected — only v1 is implemented',
    scenario: 'Integration-major dispatch — v2 not implemented',
    successCriteria: 'Should return an error indicating v2 is not yet implemented',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [{ message: baseMessage, metadata: generateMetadata(3), destination: destinationV2 }],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: 'test_destination v2 transformation is not yet implemented',
            metadata: generateMetadata(3),
            statTags: v2StatTags('processor'),
          },
        ],
      },
    },
  },
];
