import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, destination, traits, headers } from '../common';

export const identify: ProcessorTestData[] = [
  {
    id: 'MovableInk-identify-test-1',
    name: destType,
    description: 'Identify call with traits and anonymousId',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain the input payload with few additional mappings configured in transformer and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              userId: '',
              anonymousId: 'anonId123',
              traits,
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint: destination.Config.endpoint,
              headers,
              JSON: {
                type: 'identify',
                userId: traits.email,
                anonymousId: 'anonId123',
                traits,
                integrations: {
                  All: true,
                },
                originalTimestamp: '2024-03-04T15:32:56.409Z',
                timestamp: 1709566376409,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
