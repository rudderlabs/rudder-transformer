import { ProcessorTestData } from '../../../testTypes';
import { Metadata, Destination, RudderMessage } from '../../../../../src/types';

const baseMetadata: Partial<Metadata> = {
  sourceId: 'default-sourceId',
  workspaceId: 'default-workspaceId',
  namespace: 'default-namespace',
  instanceId: 'default-instance',
  sourceType: 'default-source-type',
  sourceCategory: 'default-category',
  trackingPlanId: 'default-tracking-plan',
  trackingPlanVersion: 1,
  sourceTpConfig: {},
  mergedTpConfig: {},
  destinationId: 'default-destinationId',
  jobRunId: 'default-job-run',
  jobId: 1,
  sourceBatchId: 'default-batch',
  sourceJobId: 'default-source-job',
  sourceJobRunId: 'default-source-job-run',
  sourceTaskId: 'default-task',
  sourceTaskRunId: 'default-task-run',
  recordId: {},
  destinationType: 'default-destination-type',
  messageId: 'default-message-id',
  oauthAccessToken: 'default-token',
  messageIds: ['default-message-id'],
  rudderId: 'default-rudder-id',
  receivedAt: '2025-01-06T04:14:40.785Z',
  eventName: 'default-event',
  eventType: 'default-type',
  sourceDefinitionId: 'default-source-def',
  destinationDefinitionId: 'default-dest-def',
  transformationId: 'default-transform',
  dontBatch: false,
};

const baseDestination: Destination = {
  ID: '123',
  Name: 'iterable',
  DestinationDefinition: {
    ID: '123',
    Name: 'iterable',
    DisplayName: 'Iterable',
    Config: {},
  },
  Config: {
    apiKey: 'testApiKey',
    mapToSingleEvent: false,
    trackAllPages: false,
    trackCategorisedPages: true,
    trackNamedPages: false,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
  RevisionID: 'default-revision',
  IsProcessorEnabled: true,
  IsConnectionEnabled: true,
};

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'iterable-validation-test-1',
    name: 'iterable',
    description: "[Error]: Page call without it's required configuration",
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw configuration error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              userId: 'sajal12',
              anonymousId: 'abcdeeeeeeeexxxx102',
              context: {
                traits: {
                  email: 'abc@example.com',
                },
              },
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              type: 'page',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: baseDestination,
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
            error: 'Invalid page call',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-2',
    name: 'iterable',
    description: '[Error]: Identify call without userId and email',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              context: {},
              type: 'identify',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: baseDestination,
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
            error: 'userId or email is mandatory for this request',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-3',
    name: 'iterable',
    description: '[Error]: Message type is not supported',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              context: {},
              type: 'group',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: baseDestination,
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
            error: 'Message type group not supported',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-4',
    name: 'iterable',
    description: '[Error]: Missing required value for alias call',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              context: {},
              type: 'alias',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: baseDestination,
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
            error: 'Missing required value from "previousId"',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-5',
    name: 'iterable',
    description: '[Error]: Missing userId value for alias call',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              context: {},
              type: 'alias',
              previousId: 'old@email.com',
              anonymousId: 'anonId',
              properties: {
                url: 'https://dominos.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: baseDestination,
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
            error: 'Missing required value from "userId"',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-6',
    name: 'iterable',
    description: '[Error]: Missing message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              context: {},
              event: 'testEvent',
              properties: {
                url: 'https://nodominoes.com',
                title: 'Pizza',
                referrer: 'https://google.com',
              },
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: baseDestination,
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
            error: 'Event type is required',
            statTags: {
              destType: 'ITERABLE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
];
