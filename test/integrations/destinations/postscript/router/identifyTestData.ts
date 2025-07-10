import { generateTestMetadata, postPatchHeader, destination, destType } from '../common';
import { RouterTestData } from '../../../testTypes';
import { envMock } from '../mocks';

envMock();
export const identifyTestData: RouterTestData[] = [
  {
    id: 'postscript-router-identify-new-subscriber-test',
    name: destType,
    description: 'Identify Call: New Subscriber creation with custom properties',
    scenario: 'Business',
    successCriteria: 'Should create a new subscriber with custom properties. Status 200.',
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
                context: {
                  library: {
                    name: 'rudderstack',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'john.doe@example.com',
                    phone: '+1234567890',
                    keyword: 'WELCOME',
                    shopifyCustomerId: 12345,
                    tags: ['premium', 'customer'],
                    origin: 'other',
                    customStringProperty: 'customValue',
                    customIntProperty: 101,
                  },
                },
                timestamp: '2025-06-23T10:00:00.000Z',
                originalTimestamp: '2025-06-23T10:00:00.000Z',
              },
              metadata: generateTestMetadata(1),
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
                files: {},
                body: {
                  JSON: {
                    email: 'john.doe@example.com',
                    phone_number: '+1234567890',
                    keyword: 'WELCOME',
                    shopify_customer_id: 12345,
                    origin: 'other',
                    tags: ['premium', 'customer'],
                    properties: {
                      customStringProperty: 'customValue',
                      customIntProperty: 101,
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
              },
              metadata: [generateTestMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'postscript-router-identify-existing-subscriber-test',
    name: destType,
    description: 'Identify Call: Existing Subscriber update with existing subscriber ID',
    scenario: 'Business',
    successCriteria: 'Should update the existing subscriber with new traits. Status 200.',
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
                context: {
                  library: {
                    name: 'rudderstack',
                    version: '1.0.0',
                  },
                  traits: {
                    phone: '+9876543210',
                    tags: ['general', 'updated'],
                    subscriberId: 'sub_existing_123',
                  },
                },
                timestamp: '2025-06-23T10:01:00.000Z',
                originalTimestamp: '2025-06-23T10:01:00.000Z',
              },
              metadata: generateTestMetadata(1),
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
                method: 'PATCH',
                endpoint: 'https://api.postscript.io/api/v2/subscribers/sub_existing_123',
                headers: postPatchHeader,
                params: {},
                files: {},
                body: {
                  JSON: {
                    phone_number: '+9876543210',
                    tags: ['general', 'updated'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
              },
              metadata: [generateTestMetadata(1)],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'postscript-router-identify-minimal-required-fields-test',
    name: destType,
    description:
      'Identify Call: New subscriber with minimal required traits (phone number and keyword id only)',
    scenario: 'Business',
    successCriteria: 'Should create a new subscriber with minimal required traits. Status 200.',
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
                userId: 'phone_user',
                context: {
                  library: {
                    name: 'rudderstack',
                    version: '1.0.0',
                  },
                  traits: {
                    phone: '+1555555555',
                    keywordId: 'keyword_123',
                  },
                },
                timestamp: '2025-06-23T10:05:00.000Z',
              },
              metadata: generateTestMetadata(1),
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
                files: {},
                body: {
                  JSON: {
                    phone_number: '+1555555555',
                    keyword_id: 'keyword_123',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
              },
              metadata: [generateTestMetadata(1)],
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
