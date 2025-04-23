import { ProcessorTestData } from '../../../testTypes';
import { generateSimplifiedIdentifyPayload, transformResultBuilder } from '../../../testUtils';
import { destination, headers, metadata } from '../commonConfig';

export const identifyTestData: ProcessorTestData[] = [
  {
    id: 'loops-identify-test-1',
    name: 'loops',
    description: 'Identify event with traits',
    scenario: 'Contact is created/updated in Loops',
    successCriteria: 'Test should pass successfully.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedIdentifyPayload({
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                },
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
            }),
            destination,
            metadata,
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
              JSON: {
                email: 'dummyuser@domain.com',
                firstName: 'Bob',
                lastName: 'Brown',
                phone: '099-999-9999',
                userId: 'dummy-user001',
              },
              endpoint: 'https://app.loops.so/api/v1/contacts/update',
              method: 'PUT',
              headers,
              userId: '',
            }),
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'loops-identify-test-2',
    name: 'loops',
    description: 'Identify event with mailing lists',
    scenario: 'Contact is created/updated in Loops with mailing lists',
    successCriteria: 'Test should pass successfully.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedIdentifyPayload({
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                  mailinglists: {
                    list_001: true,
                    list_002: false,
                  },
                },
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
            }),
            destination,
            metadata,
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
              JSON: {
                email: 'dummyuser@domain.com',
                firstName: 'Bob',
                lastName: 'Brown',
                phone: '099-999-9999',
                userId: 'dummy-user001',
                mailinglists: {
                  list_001: true,
                  list_002: false,
                },
              },
              endpoint: 'https://app.loops.so/api/v1/contacts/update',
              method: 'PUT',
              headers,
              userId: '',
            }),
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
