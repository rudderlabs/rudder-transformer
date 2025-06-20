import { ProcessorTestData } from '../../../testTypes';
import { MessageType } from '../../../../../src/types';
import { baseMetadata, baseDestinationDefinition } from '../common';

const outputStatTags = {
  destType: 'BLUECORE',
  destinationId: '',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  workspaceId: 'default-workspace',
};

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'bluecore-validation-test-1',
    name: 'bluecore',
    description: '[Error]: Check for unsupported message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by bluecore destination and the error message should be Event type random is not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'user123',
              type: 'random' as MessageType,
              groupId: 'XUepkK',
              traits: {
                subscribe: true,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                  consent: 'email',
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'BLUECORE',
              DestinationDefinition: baseDestinationDefinition,
              Config: {
                bluecoreNamespace: 'dummy_sandbox',
                eventsMapping: [
                  {
                    from: 'ABC Searched',
                    to: 'search',
                  },
                ],
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'message type random is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type random is not supported',
            statTags: outputStatTags,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-validation-test-2',
    name: 'bluecore',
    description: '[Error]: Check for not finding bluecoreNamespace',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as bluecoreNamespace is not found in the destination config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'user123',
              type: 'random' as MessageType,
              groupId: 'XUepkK',
              traits: {
                subscribe: true,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                  consent: 'email',
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'BLUECORE',
              DestinationDefinition: baseDestinationDefinition,
              Config: {
                eventsMapping: [
                  {
                    from: 'ABC Searched',
                    to: 'search',
                  },
                ],
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              'message type random is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type random is not supported',
            statTags: outputStatTags,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-validation-test-3',
    name: 'bluecore',
    description: '[Error]: invalid payload for subscription event, no email consent',
    scenario: 'Business',
    successCriteria:
      'Response should contain error message and status code should be 400, as no email consent is not found in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              type: 'track',
              event: 'subscription_event',
              userId: 'sajal12',
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '9112340375',
                },
              },
              properties: {
                p: 1,
                channel_consents: {},
              },
              anonymousId: '9c6bd77ea9da3e68',
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: baseMetadata,
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'BLUECORE',
              DestinationDefinition: baseDestinationDefinition,
              Config: {
                bluecoreNamespace: 'dummy_sandbox',
                eventsMapping: [
                  {
                    from: 'ABC Searched',
                    to: 'search',
                  },
                ],
              },
              Enabled: true,
              WorkspaceID: 'default-workspace',
              Transformations: [],
              RevisionID: 'default-revision',
              IsProcessorEnabled: true,
              IsConnectionEnabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: baseMetadata,
            statusCode: 400,
            error:
              '[Bluecore]:: email consent is required for subscription event: Workflow: procWorkflow, Step: handleSubscriptionEvent, ChildStep: preparePayload, OriginalError: [Bluecore]:: email consent is required for subscription event',
            statTags: outputStatTags,
          },
        ],
      },
    },
  },
];
