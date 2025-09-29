import { generateMetadata, generateTrackPayload } from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { apiKey } from './maskedSecrets';

const commonDestination: Destination = {
  ID: '12335',
  Name: 'dub-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'dub',
    DisplayName: 'Dub',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    apiKey: apiKey,
    eventMapping: [
      {
        from: 'User Signed Up',
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Product Added to Cart',
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Newsletter Subscribed',
        to: 'LEAD_CONVERSION',
      },
      {
        from: 'Order Completed',
        to: 'SALES_CONVERSION',
      },
      {
        from: 'Subscription Started',
        to: 'SALES_CONVERSION',
      },
      {
        from: 'Plan Upgraded',
        to: 'SALES_CONVERSION',
      },
    ],
  },
  Enabled: true,
};

const commonTimestamp = '2023-10-14T10:00:00.000Z';

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'dub-validation-test-1',
    name: 'dub',
    description: 'Track call: Missing API Key in destination config',
    scenario: 'Business',
    successCriteria: 'Should return configuration error when API key is missing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'User Signed Up',
              properties: {
                email: 'test@example.com',
              },
              context: {
                dubClickId: 'dub_click_12345',
                externalId: [
                  {
                    type: 'userId',
                    id: 'user_12345',
                  },
                ],
              },
              anonymousId: 'anon_12345',
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: {
              ...commonDestination,
              Config: {
                ...commonDestination.Config,
                apiKey: '', // Missing API key
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'API Key not found',
            statTags: {
              destType: 'DUB',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'dub-validation-test-2',
    name: 'dub',
    description: 'Track call: Lead event missing required dubClickId',
    scenario: 'Business',
    successCriteria: 'Should return validation error when dubClickId is missing for lead events',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'User Signed Up',
              properties: {
                email: 'test@example.com',
              },
              context: {
                // Missing dubClickId
                externalId: [
                  {
                    type: 'userId',
                    id: 'user_12345',
                  },
                ],
              },
              anonymousId: 'anon_12345',
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(2),
            destination: commonDestination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from \"context.dubClickId\"',
            statTags: {
              destType: 'DUB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
  {
    id: 'dub-validation-test-3',
    name: 'dub',
    description: 'Track call: Sales event missing required customerExternalId',
    scenario: 'Business',
    successCriteria:
      'Should return validation error when customerExternalId is missing for sales events',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              properties: {
                total: 99.99,
              },
              context: {
                // Missing externalId
              },
              // Missing anonymousId as fallback
              timestamp: commonTimestamp,
            },
            metadata: generateMetadata(3),
            destination: commonDestination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'customerExternalId is required for SALES_CONVERSIONs',
            statTags: {
              destType: 'DUB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(3),
          },
        ],
      },
    },
  },
  {
    id: 'dub-validation-test-4',
    name: 'dub',
    description: 'Track call: Sales event missing required amount',
    scenario: 'Business',
    successCriteria: 'Should return validation error when amount is missing for sales events',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'Order Completed',
              properties: {
                // Missing amount/total
                currency: 'USD',
              },
              context: {
                externalId: [
                  {
                    type: 'userId',
                    id: 'user_12345',
                  },
                ],
              },
              anonymousId: 'anon_12345',
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(4),
            destination: commonDestination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from [\"properties.total\",\"properties.amount\"]',
            statTags: {
              destType: 'DUB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
  {
    id: 'dub-validation-test-5',
    name: 'dub',
    description: 'Track call: Event not mapped in destination config',
    scenario: 'Business',
    successCriteria: 'Should skip unmapped events and return success with no transformation',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'Unmapped Event', // Not in eventMapping config
              properties: {
                some_property: 'value',
              },
              context: {
                externalId: [
                  {
                    type: 'userId',
                    id: 'user_12345',
                  },
                ],
              },
              anonymousId: 'anon_12345',
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(5),
            destination: commonDestination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Event \"Unmapped Event\" is not mapped to any DUB event type. Aborting message.',
            statTags: {
              destType: 'DUB',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(5),
          },
        ],
      },
    },
  },
  {
    id: 'dub-validation-test-6',
    name: 'dub',
    description: 'Track call: Invalid amount format for sales event',
    scenario: 'Business',
    successCriteria: 'Should return validation error for non-numeric amount',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'Order Completed',
              properties: {
                total: 'invalid_amount', // Invalid amount format
                currency: 'USD',
              },
              context: {
                externalId: [
                  {
                    type: 'userId',
                    id: 'user_12345',
                  },
                ],
              },
              anonymousId: 'anon_12345',
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(6),
            destination: commonDestination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from [\"properties.total\",\"properties.amount\"]',
            statTags: {
              destType: 'DUB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(6),
          },
        ],
      },
    },
  },
  {
    id: 'dub-validation-test-7',
    name: 'dub',
    description: 'Track call: Unsupported message type (non-track event)',
    scenario: 'Business',
    successCriteria: 'Should return error for unsupported message types like identify, page, etc.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify', // Unsupported message type
              userId: 'user_12345',
              traits: {
                email: 'test@example.com',
                name: 'Test User',
              },
              context: {},
              timestamp: commonTimestamp,
            },
            metadata: generateMetadata(7),
            destination: commonDestination,
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type \"identify\" is  not supported',
            statTags: {
              destType: 'DUB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(7),
          },
        ],
      },
    },
  },
];
