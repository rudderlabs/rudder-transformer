import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import {
  destType,
  destination,
  traits,
  headers,
  endpoint,
  updateContactEmailEndpoint,
  updateContactIdEndpoint,
  context,
} from '../common';

export const identify: ProcessorTestData[] = [
  {
    id: 'cordial-identify-test-1',
    name: destType,
    description: 'Identify call to create contact',
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
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
              traits: { ...traits, email: 'abc@example.com' },
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
              endpoint,
              headers,
              JSON: {
                channels: {
                  email: {
                    address: 'abc@example.com',
                    subscribeStatus: 'subscribed',
                  },
                },
                first_name: 'John',
                last_name: 'Doe',
                phone: '1234567890',
                address: {
                  city: 'New York',
                  country: 'USA',
                  pin_code: '123456',
                },
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
    id: 'cordial-identify-test-2',
    name: destType,
    description: 'Identify call to update contact using email',
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
              type: 'identify',
              userId: 'userId123',
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
              method: 'PUT',
              userId: '',
              endpoint: updateContactEmailEndpoint,
              headers,
              JSON: {
                channels: {
                  email: {
                    address: 'johndoe@example.com',
                    subscribeStatus: 'subscribed',
                  },
                },
                first_name: 'John',
                last_name: 'Doe',
                phone: '1234567890',
                address: {
                  city: 'New York',
                  country: 'USA',
                  pin_code: '123456',
                },
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
    id: 'cordial-identify-test-3',
    name: destType,
    description: 'Identify call to update contact using contact id',
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
              type: 'identify',
              userId: 'userId123',
              anonymousId: 'anonId123',
              traits,
              integrations: {
                All: true,
              },
              context,
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
              method: 'PUT',
              userId: '',
              endpoint: updateContactIdEndpoint,
              headers,
              JSON: {
                channels: {
                  email: {
                    address: 'johndoe@example.com',
                    subscribeStatus: 'subscribed',
                  },
                },
                first_name: 'John',
                last_name: 'Doe',
                phone: '1234567890',
                address: {
                  city: 'New York',
                  country: 'USA',
                  pin_code: '123456',
                },
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
