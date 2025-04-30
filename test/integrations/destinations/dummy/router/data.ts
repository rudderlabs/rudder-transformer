import { generateMetadata } from '../../../testUtils';
import { getDestination, destType, routerInstrumentationErrorStatTags } from '../common';

export const data: any = [
  {
    id: 'dummy-router-test-1',
    name: destType,
    description: 'Basic Router Test for identify call',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200, and the output should correctly map the properties.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: getDestination(1),
              metadata: generateMetadata(1),
              message: {
                type: 'identify',
                userId: 'test-user-id',
                anonymousId: 'test-anonymous-id',
                context: {
                  traits: {
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '1234567890',
                  },
                },
                traits: {
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  phone: '1234567890',
                },
                messageId: 'test-message-id',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
            {
              destination: getDestination(1),
              metadata: generateMetadata(2),
              message: {
                type: 'identify',
                userId: 'test-user-id',
                anonymousId: 'test-anonymous-id',
                context: {
                  traits: {
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '1234567890',
                  },
                },
                traits: {
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  phone: '1234567890',
                },
                messageId: 'test-message-id',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
            {
              destination: getDestination(2),
              metadata: generateMetadata(3),
              message: {
                type: 'identify',
                userId: 'test-user-id',
                anonymousId: 'test-anonymous-id',
                context: {
                  traits: {
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '1234567890',
                  },
                },
                traits: {
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  phone: '1234567890',
                },
                messageId: 'test-message-id',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
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
              metadata: [generateMetadata(1), generateMetadata(2)],
              destination: getDestination(1),
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                params: {},
                endpoint: 'https://dummy-destination.example.com/api',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Dummy-Destination': 'true',
                },
                body: {
                  JSON: {
                    events: [
                      {
                        type: 'identify',
                        userId: 'test-user-id',
                        traits: {
                          email: 'test@example.com',
                          firstName: 'Test',
                          lastName: 'User',
                          phone: '1234567890',
                        },
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id',
                        email: 'test@example.com',
                        firstName: 'Test',
                        lastName: 'User',
                        phone: '1234567890',
                      },
                      {
                        type: 'identify',
                        userId: 'test-user-id',
                        traits: {
                          email: 'test@example.com',
                          firstName: 'Test',
                          lastName: 'User',
                          phone: '1234567890',
                        },
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id',
                        email: 'test@example.com',
                        firstName: 'Test',
                        lastName: 'User',
                        phone: '1234567890',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              statusCode: 200,
            },
            {
              metadata: [generateMetadata(3)],
              destination: getDestination(2),
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                params: {},
                endpoint: 'https://dummy-destination.example.com/api',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Dummy-Destination': 'true',
                },
                body: {
                  JSON: {
                    events: [
                      {
                        type: 'identify',
                        userId: 'test-user-id',
                        traits: {
                          email: 'test@example.com',
                          firstName: 'Test',
                          lastName: 'User',
                          phone: '1234567890',
                        },
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id',
                        email: 'test@example.com',
                        firstName: 'Test',
                        lastName: 'User',
                        phone: '1234567890',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'dummy-router-test-2',
    name: destType,
    description: 'Basic Router Test for track call',
    scenario: 'Business',
    successCriteria:
      'The response should have a status code of 200, and the output should correctly map the properties.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: getDestination(1),
              metadata: generateMetadata(4),
              message: {
                type: 'track',
                userId: 'test-user-id',
                anonymousId: 'test-anonymous-id',
                event: 'Test Event',
                properties: {
                  revenue: 100,
                  currency: 'USD',
                  products: [
                    {
                      id: 'product-1',
                      name: 'Product 1',
                      price: 50,
                    },
                    {
                      id: 'product-2',
                      name: 'Product 2',
                      price: 50,
                    },
                  ],
                },
                messageId: 'test-message-id',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
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
              metadata: [generateMetadata(4)],
              destination: getDestination(1),
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                params: {},
                endpoint: 'https://dummy-destination.example.com/api',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Dummy-Destination': 'true',
                },
                body: {
                  JSON: {
                    events: [
                      {
                        type: 'track',
                        event: 'Test Event',
                        userId: 'test-user-id',
                        properties: {
                          revenue: 100,
                          currency: 'USD',
                          products: [
                            {
                              id: 'product-1',
                              name: 'Product 1',
                              price: 50,
                            },
                            {
                              id: 'product-2',
                              name: 'Product 2',
                              price: 50,
                            },
                          ],
                        },
                        timestamp: '2023-01-01T00:00:00.000Z',
                        messageId: 'test-message-id',
                        revenue: 100,
                        currency: 'USD',
                        products: [
                          {
                            id: 'product-1',
                            name: 'Product 1',
                            price: 50,
                          },
                          {
                            id: 'product-2',
                            name: 'Product 2',
                            price: 50,
                          },
                        ],
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'dummy-router-test-3',
    name: destType,
    description: 'Validation Test - Missing Message Type',
    scenario: 'Framework',
    successCriteria: 'Instrumentation Error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: getDestination(1),
              metadata: generateMetadata(1),
              message: {
                userId: 'test-user-id',
                anonymousId: 'test-anonymous-id',
                messageId: 'test-message-id',
                timestamp: '2023-01-01T00:00:00.000Z',
              },
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
              metadata: [generateMetadata(1)],
              destination: getDestination(1),
              batched: false,
              error: 'Message Type is not present. Aborting message.',
              statTags: routerInstrumentationErrorStatTags,
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
];
