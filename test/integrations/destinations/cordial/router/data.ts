import { generateMetadata } from '../../../testUtils';
import {
  destType,
  destination,
  traits,
  properties,
  headers,
  eventsEndpoint,
  updateContactEmailEndpoint,
} from '../common';

export const data = [
  {
    id: 'cordial-router-test-1',
    name: destType,
    description: 'Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
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
              destination,
            },
            {
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
              metadata: generateMetadata(2),
              destination,
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
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
                  FORM: {},
                },
                files: {},
                endpoint: updateContactEmailEndpoint,
                headers,
                version: '1',
                params: {},
                type: 'REST',
                method: 'PUT',
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    a: 'test event',
                    email: 'johndoe@example.com',
                    ats: '2024-03-04T15:32:56.409Z',
                    properties,
                  },
                  FORM: {},
                },
                files: {},
                endpoint: eventsEndpoint,
                headers,
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
];
