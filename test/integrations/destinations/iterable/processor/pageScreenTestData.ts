import { generateMetadata, transformResultBuilder } from './../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

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
    preferUserId: false,
    trackAllPages: true,
    trackNamedPages: false,
    mapToSingleEvent: false,
    trackCategorisedPages: false,
  },
  Enabled: true,
};

const headers = {
  api_key: 'testApiKey',
  'Content-Type': 'application/json',
};

const properties = {
  path: '/abc',
  referrer: '',
  search: '',
  title: '',
  url: '',
  category: 'test-category',
};

const anonymousId = 'anonId';
const sentAt = '2020-08-28T16:26:16.473Z';
const originalTimestamp = '2020-08-28T16:26:06.468Z';

const pageEndpoint = 'https://api.iterable.com/api/events/track';

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
        body: [
          {
            destination,
            message: {
              anonymousId,
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties,
              type: 'page',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: pageEndpoint,
              JSON: {
                userId: anonymousId,
                dataFields: properties,
                email: 'sayan@gmail.com',
                createdAt: 1598631966468,
                eventName: 'ApplicationLoaded page',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
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
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, mapToSingleEvent: true },
            },
            message: {
              anonymousId,
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: { ...properties, campaignId: '123456', templateId: '1213458' },
              type: 'page',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: pageEndpoint,
              JSON: {
                campaignId: 123456,
                templateId: 1213458,
                userId: anonymousId,
                email: 'sayan@gmail.com',
                createdAt: 1598631966468,
                eventName: 'Loaded a Page',
                dataFields: { ...properties, campaignId: '123456', templateId: '1213458' },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
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
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, trackNamedPages: true, trackAllPages: false },
            },
            message: {
              anonymousId,
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties,
              type: 'page',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: pageEndpoint,
              JSON: {
                userId: anonymousId,
                email: 'sayan@gmail.com',
                createdAt: 1598631966468,
                eventName: 'ApplicationLoaded page',
                dataFields: properties,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
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
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, trackCategorisedPages: true, trackAllPages: false },
            },
            message: {
              anonymousId,
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties,
              type: 'screen',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: pageEndpoint,
              JSON: {
                userId: anonymousId,
                dataFields: properties,
                email: 'sayan@gmail.com',
                createdAt: 1598631966468,
                eventName: 'ApplicationLoaded screen',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
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
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, mapToSingleEvent: true },
            },
            message: {
              anonymousId,
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties: { ...properties, campaignId: '123456', templateId: '1213458' },
              type: 'screen',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: pageEndpoint,
              JSON: {
                campaignId: 123456,
                templateId: 1213458,
                userId: anonymousId,
                email: 'sayan@gmail.com',
                createdAt: 1598631966468,
                eventName: 'Loaded a Screen',
                dataFields: { ...properties, campaignId: '123456', templateId: '1213458' },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
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
        body: [
          {
            destination: {
              ...destination,
              Config: { ...destination.Config, trackNamedPages: true, trackAllPages: false },
            },
            message: {
              anonymousId,
              name: 'ApplicationLoaded',
              context: {
                traits: {
                  email: 'sayan@gmail.com',
                },
              },
              properties,
              type: 'screen',
              sentAt,
              originalTimestamp,
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: pageEndpoint,
              JSON: {
                userId: anonymousId,
                email: 'sayan@gmail.com',
                createdAt: 1598631966468,
                eventName: 'ApplicationLoaded screen',
                dataFields: properties,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
