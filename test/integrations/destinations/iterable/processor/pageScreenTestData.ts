import { ProcessorTestData } from '../../../testTypes';
import { Metadata } from '../../../../../src/types';

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
  receivedAt: '2025-01-06T04:03:53.932Z',
  eventName: 'default-event',
  eventType: 'default-type',
  sourceDefinitionId: 'default-source-def',
  destinationDefinitionId: 'default-dest-def',
  transformationId: 'default-transform',
  dontBatch: false,
};

export const pageScreenTestData: ProcessorTestData[] = [
  {
    id: 'iterable-page-test-1',
    name: 'iterable',
    description: 'Page call with name and properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain page name and all properties',
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
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              type: 'page',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
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
                dataCenter: 'USDC',
                preferUserId: false,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  userId: 'anonId',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                  },
                  email: 'sayan@gmail.com',
                  createdAt: 1598631966468,
                  eventName: 'ApplicationLoaded page',
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
    id: 'iterable-page-test-2',
    name: 'iterable',
    description: 'Page call with name and properties and mapToSingleEvent config set to true',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain page name and all properties',
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
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
                campaignId: '123456',
                templateId: '1213458',
              },
              type: 'page',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
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
                dataCenter: 'USDC',
                preferUserId: false,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: true,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  campaignId: 123456,
                  templateId: 1213458,
                  userId: 'anonId',
                  email: 'sayan@gmail.com',
                  createdAt: 1598631966468,
                  eventName: 'Loaded a Page',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                    campaignId: '123456',
                    templateId: '1213458',
                  },
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
    id: 'iterable-page-test-3',
    name: 'iterable',
    description: 'Page call with name and properties and trackNamedPages config set to true',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain page name and all properties',
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
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              type: 'page',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
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
                dataCenter: 'USDC',
                preferUserId: false,
                trackAllPages: false,
                trackNamedPages: true,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  userId: 'anonId',
                  email: 'sayan@gmail.com',
                  createdAt: 1598631966468,
                  eventName: 'ApplicationLoaded page',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                  },
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
    id: 'iterable-screen-test-1',
    name: 'iterable',
    description: 'Screen call with name and properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain screen name and all properties',
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
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              type: 'screen',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
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
                dataCenter: 'USDC',
                preferUserId: false,
                trackAllPages: false,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: true,
              },
              Enabled: true,
              WorkspaceID: '123',
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  userId: 'anonId',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                  },
                  email: 'sayan@gmail.com',
                  createdAt: 1598631966468,
                  eventName: 'ApplicationLoaded screen',
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
    id: 'iterable-screen-test-2',
    name: 'iterable',
    description: 'Screen call with name and properties and mapToSingleEvent config set to true',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain screen name and all properties',
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
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
                campaignId: '123456',
                templateId: '1213458',
              },
              type: 'screen',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
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
                dataCenter: 'USDC',
                preferUserId: false,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: true,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  campaignId: 123456,
                  templateId: 1213458,
                  userId: 'anonId',
                  email: 'sayan@gmail.com',
                  createdAt: 1598631966468,
                  eventName: 'Loaded a Screen',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                    campaignId: '123456',
                    templateId: '1213458',
                  },
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
    id: 'iterable-screen-test-3',
    name: 'iterable',
    description: 'Page call with name and properties and trackNamedPages config set to true',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain page name and all properties',
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
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              type: 'screen',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
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
                dataCenter: 'USDC',
                preferUserId: false,
                trackAllPages: false,
                trackNamedPages: true,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.iterable.com/api/events/track',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  userId: 'anonId',
                  email: 'sayan@gmail.com',
                  createdAt: 1598631966468,
                  eventName: 'ApplicationLoaded screen',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                  },
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
    id: 'iterable-page-test-4',
    name: 'iterable',
    description: 'Page call with dataCenter as EUDC',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain endpoint as pageEndpointEUDC',
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
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: {
                path: '/abc',
                referrer: '',
                search: '',
                title: '',
                url: '',
                category: 'test-category',
              },
              type: 'page',
              sentAt: '2020-08-28T16:26:16.473Z',
              originalTimestamp: '2020-08-28T16:26:06.468Z',
            },
            metadata: baseMetadata,
            destination: {
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
                dataCenter: 'EUDC',
                preferUserId: false,
                trackAllPages: true,
                trackNamedPages: false,
                mapToSingleEvent: false,
                trackCategorisedPages: false,
              },
              Enabled: true,
              WorkspaceID: '123',
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
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.eu.iterable.com/api/events/track',
              headers: {
                api_key: 'testApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  userId: 'anonId',
                  dataFields: {
                    path: '/abc',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                    category: 'test-category',
                  },
                  email: 'sayan@gmail.com',
                  createdAt: 1598631966468,
                  eventName: 'ApplicationLoaded page',
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
