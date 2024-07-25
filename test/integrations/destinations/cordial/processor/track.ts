import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import {
  destType,
  destination,
  traits,
  headers,
  eventsEndpoint,
  context,
  properties,
} from '../common';

export const track: ProcessorTestData[] = [
  {
    id: 'cordial-track-test-1',
    name: destType,
    description: 'Track event with exiting contact using email',
    scenario: 'Framework+Business',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              userId: 'userId123',
              anonymousId: 'anonId123',
              event: 'test event',
              properties,
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
              endpoint: eventsEndpoint,
              headers,
              JSON: {
                a: 'test event',
                email: 'johndoe@example.com',
                ats: '2024-03-04T15:32:56.409Z',
                properties,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'cordial-track-test-2',
    name: destType,
    description: 'Track event with existing contact using contact id',
    scenario: 'Framework+Business',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              userId: 'userId123',
              anonymousId: 'anonId123',
              event: 'test event',
              properties,
              traits,
              context,
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
              endpoint: eventsEndpoint,
              headers,
              JSON: {
                a: 'test event',
                cID: '6690fe3655e334d6270287b5',
                ats: '2024-03-04T15:32:56.409Z',
                properties,
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
