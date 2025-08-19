import { generateTestMetadata, postPatchHeader, destination, destType } from '../common';
import { RouterTestData } from '../../../testTypes';
export const mixedEventsTestData: RouterTestData[] = [
  {
    id: 'postscript-router-mixed-events-test',
    name: destType,
    description: 'Mixed batch with identify and track events',
    scenario: 'Business',
    successCriteria:
      'Should create a new subscriber and fire custom events for the subscriber. Status 200.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: destination,
              message: {
                type: 'identify',
                userId: 'user123',
                traits: {
                  email: 'user@example.com',
                  phone: '+1234567890',
                  keyword: 'WELCOME',
                  firstName: 'John',
                  lastName: 'Doe',
                },
                context: {
                  library: {
                    name: 'rudderstack',
                    version: '1.0.0',
                  },
                },
                timestamp: '2025-06-23T10:00:00.000Z',
              },
              metadata: generateTestMetadata(1),
            },
            {
              destination: destination,
              message: {
                type: 'track',
                userId: 'user123',
                event: 'Product Viewed',
                properties: {
                  product_id: '12345',
                  category: 'Electronics',
                },
                context: {
                  library: {
                    name: 'rudderstack',
                    version: '1.0.0',
                  },
                },
                timestamp: '2025-06-23T10:01:00.000Z',
              },
              metadata: generateTestMetadata(2),
            },
          ],
          destType: 'postscript',
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
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.postscript.io/api/v2/subscribers',
                headers: postPatchHeader,
                params: {},
                body: {
                  JSON: {
                    email: 'user@example.com',
                    phone_number: '+1234567890',
                    keyword: 'WELCOME',
                    first_name: 'John',
                    last_name: 'Doe',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateTestMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.postscript.io/api/v2/events',
                headers: postPatchHeader,
                params: {},
                body: {
                  JSON: {
                    type: 'Product Viewed',
                    subscriber_id: 'user123',
                    occurred_at: '2025-06-23 10:01:00.000',
                    properties: {
                      product_id: '12345',
                      category: 'Electronics',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateTestMetadata(2)],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
];
