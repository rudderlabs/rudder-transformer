import {
  generateSimplifiedPageOrScreenPayload,
  overrideDestination,
  generateMetadata,
  transformResultBuilder,
} from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
const commonDestination: Destination = {
  ID: '12335',
  Name: 'sample-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'facebook_pixel',
    DisplayName: 'Facebook Pixel',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    blacklistPiiProperties: [
      {
        blacklistPiiProperties: 'phone',
        blacklistPiiHash: true,
      },
    ],
    accessToken: '09876',
    pixelId: 'dummyPixelId',
    eventsToEvents: [
      {
        from: '',
        to: '',
      },
    ],
    eventCustomProperties: [
      {
        eventCustomProperties: '',
      },
    ],
    valueFieldIdentifier: '',
    advancedMapping: false,
    whitelistPiiProperties: [
      {
        whitelistPiiProperties: 'email',
      },
    ],
  },
  Enabled: true,
};
const commonMessage = {
  channel: 'web',
  context: {
    app: {
      build: '1.0.0',
      name: 'RudderLabs JavaScript SDK',
      namespace: 'com.rudderlabs.javascript',
      version: '1.0.0',
    },
    library: {
      name: 'RudderLabs JavaScript SDK',
      version: '1.0.0',
    },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
    locale: 'en-US',
    ip: '0.0.0.0',
    os: {
      name: '',
      version: '',
    },
    screen: {
      density: 2,
    },
  },
  type: 'page',
  messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
  timestamp: '2023-10-14T15:46:51.693229+05:30',
  anonymousId: '00000000000000000000000000',
  userId: '12345',
  properties: {
    path: '/abc',
    referrer: 'xyz',
    search: 'def',
    title: 'ghi',
    url: 'jkl',
  },
  integrations: {
    All: true,
  },
  name: 'ApplicationLoaded',
  sentAt: '2019-10-14T11:15:53.296Z',
};

const commonPageMessage = { ...commonMessage, type: 'page' };

const commonScreenMessage = { ...commonMessage, type: 'screen' };

const commonStatTags = {
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  destType: 'FACEBOOK_PIXEL',
  module: 'destination',
  implementation: 'native',
  feature: 'processor',
};

export const pageScreenTestData: ProcessorTestData[] = [
  {
    id: 'facebook_pixel-page-test-1',
    name: 'facebook_pixel',
    description:
      'Page call : Happy flow without standard page switched on and with name and properties',
    scenario: 'Page',
    successCriteria: 'Response should contain status code 200 and no error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {
                    email: 'abc@example.com',
                  },
                },
                properties: {
                  path: '/abc',
                  referrer: 'xyz',
                  search: 'def',
                  title: 'ghi',
                  url: 'jkl',
                },
                name: 'ApplicationLoaded',
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'page',
            ),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '470582f368e5aeec2cf487decd1e125b7d265e8b0b06b74a25e999e93bfb699f',
                      em: '9eceb13483d7f187ec014fd6d4854d1420cfc634328af85f51d0323ba8622e21',
                    },
                    event_name: 'Viewed page ApplicationLoaded',
                    event_time: 1697297576,
                    event_source_url: 'jkl',
                    action_source: 'website',
                    custom_data: {
                      path: '/abc',
                      referrer: 'xyz',
                      search: 'def',
                      title: 'ghi',
                      url: 'jkl',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-page-test-2',
    name: 'facebook_pixel',
    description: 'Page call : with standard page switched on and no properties and no name',
    scenario: 'Page',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are not sending any other properties other than standard page properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {
                    email: 'abc@example.com',
                  },
                },
                properties: {},
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'page',
            ),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, { standardPageCall: true }),
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
              "After excluding opt_out,event_id,action_source, no fields are present in 'properties' for a standard event",
            metadata: generateMetadata(1),
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-page-test-3',
    name: 'facebook_pixel',
    description: 'Page call : with standard page switched on and properties',
    scenario: 'Page',
    successCriteria: 'Response should contain status code 200 and no error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {
                    email: 'abc@example.com',
                  },
                },
                properties: {
                  path: '/abc',
                  referrer: 'xyz',
                  search: 'def',
                  title: 'ghi',
                  url: 'jkl',
                },
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'page',
            ),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, { standardPageCall: true }),
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '470582f368e5aeec2cf487decd1e125b7d265e8b0b06b74a25e999e93bfb699f',
                      em: '9eceb13483d7f187ec014fd6d4854d1420cfc634328af85f51d0323ba8622e21',
                    },
                    event_name: 'PageView',
                    event_time: 1697297576,
                    event_source_url: 'jkl',
                    action_source: 'website',
                    custom_data: {
                      path: '/abc',
                      referrer: 'xyz',
                      search: 'def',
                      title: 'ghi',
                      url: 'jkl',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-page-test-4',
    name: 'facebook_pixel',
    description: 'Page call : with standard page switched off and with properties but no page name',
    scenario: 'Page',
    successCriteria: 'Response should contain status code 200 and no error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {},
                },
                properties: {
                  path: '/abc',
                  referrer: 'xyz',
                  search: 'def',
                  title: 'ghi',
                  url: 'jkl',
                },
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'page',
            ),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '470582f368e5aeec2cf487decd1e125b7d265e8b0b06b74a25e999e93bfb699f',
                    },
                    event_name: 'PageView',
                    event_time: 1697297576,
                    event_source_url: 'jkl',
                    action_source: 'website',
                    custom_data: {
                      path: '/abc',
                      referrer: 'xyz',
                      search: 'def',
                      title: 'ghi',
                      url: 'jkl',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-screen-test-1',
    name: 'facebook_pixel',
    description:
      'Screen call : Happy flow without standard page switched on and with name and properties',
    scenario: 'Screen',
    successCriteria: 'Response should contain status code 200 and no error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {},
                },
                properties: {
                  path: '/abc',
                  referrer: 'xyz',
                  search: 'def',
                  title: 'ghi',
                  url: 'jkl',
                },
                anonymousId: '9c6bd77ea9da3e68',
                name: 'ApplicationLoaded',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'screen',
            ),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '470582f368e5aeec2cf487decd1e125b7d265e8b0b06b74a25e999e93bfb699f',
                    },
                    event_name: 'PageView',
                    event_time: 1697297576,
                    event_source_url: 'jkl',
                    action_source: 'website',
                    custom_data: {
                      path: '/abc',
                      referrer: 'xyz',
                      search: 'def',
                      title: 'ghi',
                      url: 'jkl',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-screen-test-2',
    name: 'facebook_pixel',
    description: 'Screen call : with standard page switched on and no properties and no name',
    scenario: 'Screen',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are not sending any other properties other than standard page properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {},
                },
                properties: {},
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'screen',
            ),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, { standardPageCall: true }),
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
              "After excluding opt_out,event_id,action_source, no fields are present in 'properties' for a standard event",
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            metadata: generateMetadata(1),
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-screen-test-3',
    name: 'facebook_pixel',
    description: 'Screen call : with standard page switched on and properties',
    scenario: 'Screen',
    successCriteria: 'Response should contain status code 200 and no error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {},
                },
                properties: {
                  path: '/abc',
                  referrer: 'xyz',
                  search: 'def',
                  title: 'ghi',
                  url: 'jkl',
                },
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'screen',
            ),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, { standardPageCall: true }),
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '470582f368e5aeec2cf487decd1e125b7d265e8b0b06b74a25e999e93bfb699f',
                    },
                    event_name: 'PageView',
                    event_time: 1697297576,
                    event_source_url: 'jkl',
                    action_source: 'website',
                    custom_data: {
                      path: '/abc',
                      referrer: 'xyz',
                      search: 'def',
                      title: 'ghi',
                      url: 'jkl',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-screen-test-4',
    name: 'facebook_pixel',
    description:
      'Screen call : with standard page switched off and with properties but no page name',
    scenario: 'Screen',
    successCriteria: 'Response should contain status code 200 and no error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {},
                },
                properties: {
                  path: '/abc',
                  referrer: 'xyz',
                  search: 'def',
                  title: 'ghi',
                  url: 'jkl',
                },
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2023-10-14T15:32:56.409Z',
              },
              'screen',
            ),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '470582f368e5aeec2cf487decd1e125b7d265e8b0b06b74a25e999e93bfb699f',
                    },
                    event_name: 'PageView',
                    event_time: 1697297576,
                    event_source_url: 'jkl',
                    action_source: 'website',
                    custom_data: {
                      path: '/abc',
                      referrer: 'xyz',
                      search: 'def',
                      title: 'ghi',
                      url: 'jkl',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
