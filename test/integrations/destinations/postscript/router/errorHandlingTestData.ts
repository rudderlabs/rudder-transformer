import { generateTestMetadata, destination, destType } from '../common';
import { RouterTestData } from '../../../testTypes';

export const errorHandlingTestData: RouterTestData[] = [
  {
    id: 'postscript-router-error-handling-missing-phone',
    name: destType,
    description: 'Error: [Identify] Handling for missing required fields: phone',
    scenario: 'Business',
    successCriteria: 'Should return 400 error for missing phone number',
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
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                },
                timestamp: '2025-06-23T10:00:00.000Z',
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
              error: 'Phone is required for subscriber creation',
              statTags: {
                destType: 'POSTSCRIPT',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              metadata: [generateTestMetadata(1)],
              destination: destination,
              batched: false,
            },
          ],
        },
      },
    },
  },
  {
    id: 'postscript-router-error-handling-unsupported-event-type',
    name: destType,
    description: 'Error: Handling for unsupported RudderStack event type',
    scenario: 'Business',
    successCriteria: 'Should return 400 error for unsupported event type',
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
                type: 'page',
                userId: 'user123',
                name: 'Home Page',
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
              error:
                'Event type "page" is not supported. Only identify and track events are supported.',
              statTags: {
                destType: 'POSTSCRIPT',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              metadata: [generateTestMetadata(1)],
              destination: destination,
              batched: false,
            },
          ],
        },
      },
    },
  },
  {
    id: 'postscript-router-error-handling-missing-keyword',
    name: destType,
    description: 'Error: [Identify] Handling for missing required fields: keyword OR keyword_id',
    scenario: 'Business',
    successCriteria: 'Should return 400 error for missing keyword or keyword_id',
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
                    email: 'test@example.com',
                    phone: '+1234567890',
                    // Missing required keyword or keyword_id
                  },
                },
                timestamp: '2025-06-23T10:00:00.000Z',
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
              error: 'Either keyword or keyword_id is required for subscriber creation',
              statTags: {
                destType: 'POSTSCRIPT',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              metadata: [generateTestMetadata(1)],
              destination: destination,
              batched: false,
            },
          ],
        },
      },
    },
  },
  {
    id: 'postscript-router-error-handling-missing-event-name',
    name: destType,
    description: 'Error: [Track] Missing required fields: event name',
    scenario: 'Business',
    successCriteria: 'Should return 400 error for missing event name',
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
                type: 'track',
                userId: 'user123',
                // Missing event name
                properties: {
                  customProp1: 'value1',
                },
                context: {
                  library: {
                    name: 'rudderstack',
                    version: '1.0.0',
                  },
                  externalId: [
                    {
                      type: 'subscriber_id',
                      id: 'sub_12345',
                    },
                  ],
                },
                timestamp: '2025-06-23T10:00:00.000Z',
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
              error: 'Event name is required for track events',
              statTags: {
                destType: 'POSTSCRIPT',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              metadata: [generateTestMetadata(1)],
              destination: destination,
              batched: false,
            },
          ],
        },
      },
    },
  },
];
