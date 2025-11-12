import { Destination } from '../../../../../src/types';
import { generateMetadata, transformResultBuilder, overrideDestination } from '../../../testUtils';
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
        blacklistPiiProperties: '',
        blacklistPiiHash: false,
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
    advancedMapping: true,
    whitelistPiiProperties: [
      {
        whitelistPiiProperties: '',
      },
    ],
  },
  Enabled: true,
};
const commonMessage = {
  channel: 'web',
  context: {
    traits: {
      name: 'Rudder Test',
      email: 'abc@gmail.com',
      firstname: 'Rudder',
      lastname: 'Test',
      phone: 9000000000,
      gender: 'female',
    },
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
    fbp: 'fbp_value',
  },
  properties: {
    plan: 'standard plan',
    name: 'rudder test',
    fbc: 'fbc_value',
  },
  type: 'identify' as const,
  messageId: '84e26acc-56a5-4835-8233-591137fca468',
  originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
  anonymousId: '00000000000000000000000000',
  userId: '123456',
  integrations: {
    All: true,
  },
  sentAt: '2019-10-14T09:03:22.563Z',
};
const commonStatTags = {
  errorCategory: 'dataValidation',
  errorType: 'configuration',
  destType: 'FACEBOOK_PIXEL',
  module: 'destination',
  implementation: 'native',
  feature: 'processor',
};

export const identifyTestData: ProcessorTestData[] = [
  {
    id: 'fbPixel-identify-test-1',
    name: 'facebook_pixel',
    description: '[Error]: Check if advancedMapping configuration is enabled',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, we are sending identify event with advancedMapping disabled',
    module: 'destination',
    feature: 'processor',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: commonMessage,
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, { advancedMapping: false }),
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
            statusCode: 400,
            error:
              'For identify events, "Advanced Mapping" configuration must be enabled on the RudderStack dashboard',
            statTags: {
              ...commonStatTags,
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'fbPixel-identify-test-2',
    name: 'facebook_pixel',
    description: 'Identify event happy flow : without integrations object hashed true',
    scenario: 'Business',
    successCriteria:
      ' Response should contain status code 200 and body should contain unhashed user traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: commonMessage,
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
                        '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      ph: '593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579',
                      ge: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                      ln: '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25',
                      fn: '2c2ccf28d806f6f9a34b67aa874d2113b7ac1444f1a4092541b8b75b84771747',
                      client_ip_address: '0.0.0.0',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                      fbc: 'fbc_value',
                      fbp: 'fbp_value',
                    },
                    event_name: 'identify',
                    event_time: 1697278611,
                    event_id: '84e26acc-56a5-4835-8233-591137fca468',
                    action_source: 'website',
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
