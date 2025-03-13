import { ProcessorTestData } from '../../../testTypes';
import { Destination, Metadata } from '../../../../../src/types';
import { overrideDestination } from '../../../testUtils';

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
  receivedAt: '2025-01-06T04:12:38.713Z',
  eventName: 'default-event',
  eventType: 'default-type',
  sourceDefinitionId: 'default-source-def',
  destinationDefinitionId: 'default-dest-def',
  transformationId: 'default-transform',
  dontBatch: false,
};

const destination: Destination = {
  ID: '123',
  Name: 'iterable',
  DestinationDefinition: {
    ID: '123',
    Name: 'iterable',
    DisplayName: 'Iterable',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    apiKey: 'testApiKey',
    dataCenter: 'USDC',
    preferUserId: false,
    trackAllPages: true,
    trackNamedPages: false,
    mapToSingleEvent: false,
    trackCategorisedPages: false,
  },
  Enabled: true,
};

export const aliasTestData: ProcessorTestData[] = [
  {
    id: 'iterable-alias-test-1',
    name: 'iterable',
    description: 'Alias call with userId and previousId',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update email payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'anonId',
              userId: 'new@email.com',
              previousId: 'old@email.com',
              name: 'ApplicationLoaded',
              context: {},
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              type: 'alias',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/users/updateEmail',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  currentEmail: 'old@email.com',
                  newEmail: 'new@email.com',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'iterable-alias-test-1',
    name: 'iterable',
    description: 'Alias call with dataCenter as EUDC',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update email payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'anonId',
              userId: 'new@email.com',
              previousId: 'old@email.com',
              name: 'ApplicationLoaded',
              context: {},
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              type: 'alias',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: overrideDestination(destination, { dataCenter: 'EUDC' }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.eu.iterable.com/api/users/updateEmail',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  currentEmail: 'old@email.com',
                  newEmail: 'new@email.com',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata: baseMetadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
