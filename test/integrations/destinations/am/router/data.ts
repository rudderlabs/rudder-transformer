import { Destination } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { secret2 } from '../maskedSecrets';
import { defaultMockFns } from '../mocs';

const destination: Destination = {
  ID: '123',
  Name: 'am',
  DestinationDefinition: {
    ID: '123',
    Name: 'am',
    DisplayName: 'am',
    Config: {},
  },
  Config: {
    apiKey: secret2,
    groupTypeTrait: 'email',
    groupValueTrait: 'age',
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const data: RouterTestData[] = [
  {
    name: 'am',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    anonymousId: '123456',
                    email: 'test@rudderstack.com',
                    address: {
                      city: 'kolkata',
                      country: 'India',
                      postalCode: 712136,
                      state: 'WB',
                      street: '',
                    },
                    ip: '0.0.0.0',
                    age: 26,
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: {
                    path: '/destinations/amplitude',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/amplitude',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                },
                type: 'identify',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                userId: '123456',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: { email: 'test@rudderstack.com', anonymousId: '12345' },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: {
                    path: '/destinations/amplitude',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/amplitude',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                },
                request_ip: '1.1.1.1',
                type: 'page',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                integrations: { All: true },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: {
                ...destination,
                Config: {
                  apiKey: secret2,
                },
              },
            },
          ],
          destType: 'am',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api2.amplitude.com/2/httpapi',
                  endpointPath: '2/httpapi',
                  headers: { 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      api_key: secret2,
                      events: [
                        {
                          os_name: 'Chrome',
                          os_version: '77.0.3865.90',
                          device_model: 'Mac',
                          library: 'rudderstack',
                          platform: 'Web',
                          device_id: '123456',
                          app_name: 'RudderLabs JavaScript SDK',
                          app_version: '1.0.0',
                          language: 'en-US',
                          session_id: -1,
                          insert_id: '84e26acc-56a5-4835-8233-591137fca468',
                          city: 'kolkata',
                          country: 'India',
                          user_properties: {
                            initial_referrer: 'https://docs.rudderstack.com',
                            initial_referring_domain: 'docs.rudderstack.com',
                            anonymousId: '123456',
                            email: 'test@rudderstack.com',
                            postalCode: 712136,
                            state: 'WB',
                            street: '',
                            ip: '0.0.0.0',
                            age: 26,
                          },
                          event_type: '$identify',
                          time: 1571043797562,
                          user_id: '123456',
                          ip: '0.0.0.0',
                        },
                      ],
                      options: { min_id_length: 1 },
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                  userId: '123456',
                },
              ],
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api2.amplitude.com/2/httpapi',
                  endpointPath: '2/httpapi',
                  headers: { 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      api_key: secret2,
                      events: [
                        {
                          os_name: 'Chrome',
                          os_version: '77.0.3865.90',
                          device_model: 'Mac',
                          library: 'rudderstack',
                          platform: 'Web',
                          device_id: '00000000000000000000000000',
                          app_name: 'RudderLabs JavaScript SDK',
                          app_version: '1.0.0',
                          language: 'en-US',
                          event_type: 'Viewed ApplicationLoaded Page',
                          event_properties: {
                            path: '/destinations/amplitude',
                            referrer: '',
                            search: '',
                            title: '',
                            url: 'https://docs.rudderstack.com/destinations/amplitude',
                            category: 'destination',
                            initial_referrer: 'https://docs.rudderstack.com',
                            initial_referring_domain: 'docs.rudderstack.com',
                            name: 'ApplicationLoaded',
                          },
                          session_id: -1,
                          insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                          ip: '1.1.1.1',
                          user_properties: {
                            initial_referrer: 'https://docs.rudderstack.com',
                            initial_referring_domain: 'docs.rudderstack.com',
                            email: 'test@rudderstack.com',
                            anonymousId: '12345',
                          },
                          user_id: '12345',
                          time: 1571051718299,
                        },
                      ],
                      options: { min_id_length: 1 },
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                  userId: '00000000000000000000000000',
                },
              ],
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                ...destination,
                Config: {
                  apiKey: secret2,
                },
              },
            },
          ],
        },
      },
    },
    id: '',
    scenario: '',
    successCriteria: '',
    mockFns: defaultMockFns,
  },
  {
    name: 'am',
    description: 'Test 1: Test case to test the router with multiple events of differnt userIds',
    scenario:
      'The input contains 8 events distributed across 2 different user IDs - 7 events belong to userId=123456 and 1 event belongs to userId=123. Among these, there is 1 failure event and 1 alias event, both of which should not be batched as they need to be processed separately. The mock configuration sets the maximum batch limit to 3 events per batch. Based on these constraints, the expected output should have 5 batches: the first batch contains the isolated failure event, the second batch contains the isolated alias event, the third and fourth batches contain the batchable events from userId=123456 (split into 2 batches due to the limit of 3), and the fifth batch contains the single event from userId=123.',
    successCriteria:
      'We should have 5 batches and all events should be transformed successfully and batched correctly as per userIds and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '123456',
                    email: 'test@rudderstack.com',
                    trait1: 'value1',
                  },
                },
                type: 'identify',
                anonymousId: '123456',
                userId: '123456',
              },
              metadata: { jobId: 1, userId: '123456' },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '123',
                    email: 'test@rudderstack.com',
                    trait2: 'value2',
                  },
                },
                type: 'identify',
                anonymousId: '123',
                userId: '123',
              },
              metadata: { jobId: 2, userId: '123' },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '123456',
                    email: 'test@rudderstack.com',
                    trait3: 'value3',
                  },
                },
                type: 'identify',
                anonymousId: '123456',
                userId: '123456',
              },
              metadata: { jobId: 3, userId: '123456' },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '123456',
                    email: 'test@rudderstack.com',
                    trait4: 'value4',
                  },
                },
                type: 'identify',
                anonymousId: '123456',
                userId: '123456',
              },
              metadata: { jobId: 4, userId: '123456' },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '123456',
                    email: 'test@rudderstack.com',
                    trait5: 'value5',
                  },
                },
                type: 'identify',
                anonymousId: '123456',
                userId: '123456',
              },
              metadata: { jobId: 5, userId: '123456' },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '123456',
                    email: 'test@rudderstack.com',
                    trait7: 'value7',
                  },
                },
                type: 'identify',
                anonymousId: '123456',
                userId: '123456',
              },
              metadata: { jobId: 6, userId: '123456' },
              destination,
            },
            {
              message: {
                type: 'audiencelist',
                event: 'Order Completed',
                sentAt: '2020-08-14T05:30:30.118Z',
                context: {},
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {},
                anonymousId: '123456',
                integrations: {
                  S3: false,
                  All: true,
                },
              },
              destination: destination,
              metadata: { jobId: 7, userId: '123456' },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.5',
                  },
                  traits: {
                    name: 'Shehan Study',
                    category: 'SampleIdentify',
                    email: 'test@rudderstack.com',
                    plan: 'Open source',
                    logins: 5,
                    createdAt: 1599264000,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.5',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                  locale: 'en-US',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 0.8999999761581421,
                  },
                  campaign: {
                    source: 'google',
                    medium: 'medium',
                    term: 'keyword',
                    content: 'some content',
                    name: 'some campaign',
                    test: 'other value',
                  },
                  page: {
                    path: '/destinations/amplitude',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/amplitude',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                },
                type: 'alias',
                messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
                originalTimestamp: '2020-10-20T08:14:28.778Z',
                anonymousId: '123456',
                integrations: {
                  All: true,
                },
                previousId: 'sampleusrRudder3',
                sentAt: '2020-10-20T08:14:28.778Z',
              },
              destination: destination,
              metadata: { jobId: 8, userId: '123456' },
            },
          ],
          destType: 'am',
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
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    api_key: 'am2',
                    events: [
                      {
                        device_id: '123456',
                        event_type: '$identify',
                        library: 'rudderstack',
                        platform: 'Web',
                        session_id: -1,
                        time: 0,
                        user_id: '123456',
                        user_properties: {
                          anonymousId: '123456',
                          email: 'test@rudderstack.com',
                          trait1: 'value1',
                        },
                      },
                      {
                        device_id: '123456',
                        event_type: '$identify',
                        library: 'rudderstack',
                        platform: 'Web',
                        session_id: -1,
                        time: 0,
                        user_id: '123456',
                        user_properties: {
                          anonymousId: '123456',
                          email: 'test@rudderstack.com',
                          trait3: 'value3',
                        },
                      },
                      {
                        device_id: '123456',
                        event_type: '$identify',
                        library: 'rudderstack',
                        platform: 'Web',
                        session_id: -1,
                        time: 0,
                        user_id: '123456',
                        user_properties: {
                          anonymousId: '123456',
                          email: 'test@rudderstack.com',
                          trait4: 'value4',
                        },
                      },
                    ],
                    options: {
                      min_id_length: 1,
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api2.amplitude.com/batch',
                endpointPath: 'batch',
                files: {},
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                userId: '123456',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'am2',
                  groupTypeTrait: 'email',
                  groupValueTrait: 'age',
                },
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'am',
                  ID: '123',
                  Name: 'am',
                },
                Enabled: true,
                ID: '123',
                Name: 'am',
                Transformations: [],
                WorkspaceID: '123',
              },
              metadata: [
                {
                  jobId: 1,
                  userId: '123456',
                },
                {
                  jobId: 3,
                  userId: '123456',
                },
                {
                  jobId: 4,
                  userId: '123456',
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: [
                {
                  body: {
                    FORM: {},
                    JSON: {
                      api_key: 'am2',
                      events: [
                        {
                          device_id: '123',
                          event_type: '$identify',
                          library: 'rudderstack',
                          platform: 'Web',
                          session_id: -1,
                          time: 0,
                          user_id: '123',
                          user_properties: {
                            anonymousId: '123',
                            email: 'test@rudderstack.com',
                            trait2: 'value2',
                          },
                        },
                      ],
                      options: {
                        min_id_length: 1,
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://api2.amplitude.com/2/httpapi',
                  endpointPath: '2/httpapi',
                  files: {},
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  userId: '123',
                  version: '1',
                },
              ],
              destination: {
                Config: {
                  apiKey: 'am2',
                  groupTypeTrait: 'email',
                  groupValueTrait: 'age',
                },
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'am',
                  ID: '123',
                  Name: 'am',
                },
                Enabled: true,
                ID: '123',
                Name: 'am',
                Transformations: [],
                WorkspaceID: '123',
              },
              metadata: [
                {
                  jobId: 2,
                  userId: '123',
                },
              ],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    api_key: 'am2',
                    events: [
                      {
                        device_id: '123456',
                        event_type: '$identify',
                        library: 'rudderstack',
                        platform: 'Web',
                        session_id: -1,
                        time: 0,
                        user_id: '123456',
                        user_properties: {
                          anonymousId: '123456',
                          email: 'test@rudderstack.com',
                          trait5: 'value5',
                        },
                      },
                      {
                        device_id: '123456',
                        event_type: '$identify',
                        library: 'rudderstack',
                        platform: 'Web',
                        session_id: -1,
                        time: 0,
                        user_id: '123456',
                        user_properties: {
                          anonymousId: '123456',
                          email: 'test@rudderstack.com',
                          trait7: 'value7',
                        },
                      },
                    ],
                    options: {
                      min_id_length: 1,
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api2.amplitude.com/batch',
                endpointPath: 'batch',
                files: {},
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                userId: '123456',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'am2',
                  groupTypeTrait: 'email',
                  groupValueTrait: 'age',
                },
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'am',
                  ID: '123',
                  Name: 'am',
                },
                Enabled: true,
                ID: '123',
                Name: 'am',
                Transformations: [],
                WorkspaceID: '123',
              },
              metadata: [
                {
                  jobId: 5,
                  userId: '123456',
                },
                {
                  jobId: 6,
                  userId: '123456',
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              destination: {
                Config: {
                  apiKey: 'am2',
                  groupTypeTrait: 'email',
                  groupValueTrait: 'age',
                },
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'am',
                  ID: '123',
                  Name: 'am',
                },
                Enabled: true,
                ID: '123',
                Name: 'am',
                Transformations: [],
                WorkspaceID: '123',
              },
              error: 'message type not supported',
              metadata: [
                {
                  jobId: 7,
                  userId: '123456',
                },
              ],
              statTags: {
                destType: 'AM',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
            {
              batched: false,
              batchedRequest: [
                {
                  body: {
                    FORM: {
                      api_key: 'am2',
                      mapping: [
                        '{"user_id":"sampleusrRudder3","user_properties":{"initial_referrer":"https://docs.rudderstack.com","initial_referring_domain":"docs.rudderstack.com","utm_source":"google","utm_medium":"medium","utm_term":"keyword","utm_content":"some content","utm_name":"some campaign","utm_test":"other value"}}',
                      ],
                    },
                    JSON: {},
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://api2.amplitude.com/usermap',
                  endpointPath: 'usermap',
                  files: {},
                  headers: {},
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  userId: '123456',
                  version: '1',
                },
              ],
              destination: {
                Config: {
                  apiKey: 'am2',
                  groupTypeTrait: 'email',
                  groupValueTrait: 'age',
                },
                DestinationDefinition: {
                  Config: {},
                  DisplayName: 'am',
                  ID: '123',
                  Name: 'am',
                },
                Enabled: true,
                ID: '123',
                Name: 'am',
                Transformations: [],
                WorkspaceID: '123',
              },
              metadata: [
                {
                  jobId: 8,
                  userId: '123456',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
    id: '',
  },
  {
    name: 'am',
    description:
      'Test 2: Test case to test the router with multiple events of same userIds but with different event types',
    scenario:
      'The input contains 5 events distributed across 1 different user ID - 5 events belong to userId=12345. Among these, there is 1 group event, 1 track event, 1 identify event, 1 alias event and 1 page event. The mock configuration sets the maximum batch limit to 3 events per batch. The track call is multiplexed to 3 events and group call is multiplexed to 2 events. Based on these constraints, the expected output should have 4 batches: the first batch contains the group events, the second batch contains the multiplexed track events, the third batch contains identify, page and screen events and the fourth batch contains the alias event.',
    successCriteria:
      'We should have 4 batches and all events should be transformed successfully and batched correctly as per userIds and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    name: 'Shehan Study',
                    category: 'SampleIdentify',
                    email: 'test@rudderstack.com',
                  },
                },
                type: 'group',
                userId: '12345',
                integrations: {
                  All: true,
                  Amplitude: {
                    groups: {
                      group_type: 'Company',
                      group_value: 'ABC',
                    },
                  },
                },
                groupId: 'Sample_groupId23',
                traits: {
                  KEY_3: {
                    CHILD_KEY_92: 'value_95',
                    CHILD_KEY_102: 'value_103',
                  },
                  KEY_2: {
                    CHILD_KEY_92: 'value_95',
                    CHILD_KEY_102: 'value_103',
                  },
                  name_trait: 'Company',
                  value_trait: 'ABC',
                },
                sentAt: '2020-10-20T07:54:58.983Z',
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: {
                jobId: 1,
                userId: '12345',
              },
            },
            {
              message: {
                type: 'track',
                event: 'Order Completed',
                sentAt: '2020-08-14T05:30:30.118Z',
                context: {
                  source: 'test',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                userId: '12345',
                integrations: {
                  S3: false,
                  All: true,
                },
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: {
                jobId: 2,
                userId: '12345',
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '12345',
                    email: 'test@rudderstack.com',
                    trait1: 'value1',
                  },
                },
                type: 'identify',
                anonymousId: '12345',
                userId: '12345',
              },
              metadata: {
                jobId: 3,
                userId: '12345',
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
            },
            {
              message: {
                type: 'screen',
                userId: '12345',
                anonymousId: 'anon-id-new',
                event: 'Screen View',
                properties: {
                  prop1: '5',
                },
                context: {
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: {
                jobId: 4,
                userId: '12345',
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'test@rudderstack.com',
                    anonymousId: '12345',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '/destinations/amplitude',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/amplitude',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                },
                request_ip: '1.1.1.1',
                type: 'page',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                integrations: {
                  All: true,
                },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: {
                jobId: 5,
                userId: '12345',
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.5',
                  },
                  traits: {
                    name: 'Shehan Study',
                    category: 'SampleIdentify',
                    email: 'test@rudderstack.com',
                    plan: 'Open source',
                    logins: 5,
                    createdAt: 1599264000,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.5',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                  locale: 'en-US',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 0.8999999761581421,
                  },
                  campaign: {
                    source: 'google',
                    medium: 'medium',
                    term: 'keyword',
                    content: 'some content',
                    name: 'some campaign',
                    test: 'other value',
                  },
                  page: {
                    path: '/destinations/amplitude',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/amplitude',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                },
                type: 'alias',
                messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
                originalTimestamp: '2020-10-20T08:14:28.778Z',
                anonymousId: '12345',
                integrations: {
                  All: true,
                },
                previousId: 'sampleusrRudder3',
                sentAt: '2020-10-20T08:14:28.778Z',
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: {
                jobId: 6,
                userId: '12345',
              },
            },
          ],
          destType: 'am',
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
              batched: false,
              batchedRequest: [
                {
                  body: {
                    FORM: {},
                    JSON: {
                      api_key: 'secret2',
                      events: [
                        {
                          event_type: '$identify',
                          groups: {
                            Company: 'ABC',
                          },
                          library: 'rudderstack',
                          platform: 'Web',
                          session_id: -1,
                          time: 0,
                          user_id: '12345',
                          user_properties: {
                            Company: 'ABC',
                          },
                        },
                      ],
                      options: {
                        min_id_length: 1,
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://api2.amplitude.com/2/httpapi',
                  endpointPath: '2/httpapi',
                  files: {},
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  version: '1',
                },
                {
                  body: {
                    FORM: {
                      api_key: 'secret2',
                      identification: ['{"group_type":"Company","group_value":"ABC"}'],
                    },
                    JSON: {},
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://api2.amplitude.com/groupidentify',
                  endpointPath: 'groupidentify',
                  files: {},
                  headers: {},
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  version: '1',
                },
              ],
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: [
                {
                  jobId: 1,
                  userId: '12345',
                },
              ],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    api_key: 'secret2',
                    events: [
                      {
                        event_properties: {
                          affiliation: 'Google Store',
                          checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                          coupon: 'hasbros',
                          currency: 'USD',
                          discount: 2.5,
                          order_id: '50314b8e9bcf000000000000',
                          shipping: 3,
                          subtotal: 22.5,
                          tax: 2,
                          total: 27.5,
                        },
                        event_type: 'Order Completed',
                        insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        library: 'rudderstack',
                        price: 25,
                        quantity: 2,
                        revenue: 48,
                        revenueType: 'Purchased',
                        session_id: -1,
                        time: 1597383030118,
                        user_id: '12345',
                        user_properties: {
                          anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                        },
                      },
                      {
                        event_properties: {
                          category: 'Games',
                          image_url: 'https:///www.example.com/product/path.jpg',
                          name: 'Monopoly: 3rd Edition',
                          price: 19,
                          product_id: '507f1f77bcf86cd799439011',
                          quantity: 1,
                          sku: '45790-32',
                          url: 'https://www.example.com/product/path',
                        },
                        event_type: 'Product Purchased',
                        insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-1',
                        library: 'rudderstack',
                        session_id: -1,
                        time: 1597383030118,
                        user_id: '12345',
                        user_properties: {
                          anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                        },
                      },
                      {
                        event_properties: {
                          category: 'Games',
                          name: 'Uno Card Game',
                          price: 3,
                          product_id: '505bd76785ebb509fc183733',
                          quantity: 2,
                          sku: '46493-32',
                        },
                        event_type: 'Product Purchased',
                        insert_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9-2',
                        library: 'rudderstack',
                        session_id: -1,
                        time: 1597383030118,
                        user_id: '12345',
                        user_properties: {
                          anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                        },
                      },
                    ],
                    options: {
                      min_id_length: 1,
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api2.amplitude.com/batch',
                endpointPath: 'batch',
                files: {},
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: [
                {
                  jobId: 2,
                  userId: '12345',
                },
              ],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    api_key: 'secret2',
                    events: [
                      {
                        device_id: '12345',
                        event_type: '$identify',
                        library: 'rudderstack',
                        platform: 'Web',
                        session_id: -1,
                        time: 0,
                        user_id: '12345',
                        user_properties: {
                          anonymousId: '12345',
                          email: 'test@rudderstack.com',
                          trait1: 'value1',
                        },
                      },
                      {
                        device_id: 'anon-id-new',
                        event_properties: {
                          name: 'Screen View',
                          prop1: '5',
                        },
                        event_type: 'Viewed Screen View Screen',
                        ip: '14.5.67.21',
                        library: 'rudderstack',
                        session_id: -1,
                        time: 1580602989544,
                        user_id: '12345',
                        user_properties: {},
                      },
                      {
                        app_name: 'RudderLabs JavaScript SDK',
                        app_version: '1.0.0',
                        device_id: '00000000000000000000000000',
                        device_model: 'Mac',
                        event_properties: {
                          category: 'destination',
                          initial_referrer: 'https://docs.rudderstack.com',
                          initial_referring_domain: 'docs.rudderstack.com',
                          name: 'ApplicationLoaded',
                          path: '/destinations/amplitude',
                          referrer: '',
                          search: '',
                          title: '',
                          url: 'https://docs.rudderstack.com/destinations/amplitude',
                        },
                        event_type: 'Viewed ApplicationLoaded Page',
                        insert_id: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                        ip: '1.1.1.1',
                        language: 'en-US',
                        library: 'rudderstack',
                        os_name: 'Chrome',
                        os_version: '77.0.3865.90',
                        platform: 'Web',
                        session_id: -1,
                        time: 1571051718299,
                        user_id: '12345',
                        user_properties: {
                          anonymousId: '12345',
                          email: 'test@rudderstack.com',
                          initial_referrer: 'https://docs.rudderstack.com',
                          initial_referring_domain: 'docs.rudderstack.com',
                        },
                      },
                    ],
                    options: {
                      min_id_length: 1,
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api2.amplitude.com/batch',
                endpointPath: 'batch',
                files: {},
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                userId: '12345',
                version: '1',
              },
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: [
                {
                  jobId: 3,
                  userId: '12345',
                },
                {
                  jobId: 4,
                  userId: '12345',
                },
                {
                  jobId: 5,
                  userId: '12345',
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: [
                {
                  body: {
                    FORM: {
                      api_key: 'secret2',
                      mapping: [
                        '{"user_id":"sampleusrRudder3","user_properties":{"initial_referrer":"https://docs.rudderstack.com","initial_referring_domain":"docs.rudderstack.com","utm_source":"google","utm_medium":"medium","utm_term":"keyword","utm_content":"some content","utm_name":"some campaign","utm_test":"other value"}}',
                      ],
                    },
                    JSON: {},
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://api2.amplitude.com/usermap',
                  endpointPath: 'usermap',
                  files: {},
                  headers: {},
                  method: 'POST',
                  params: {},
                  type: 'REST',
                  userId: '12345',
                  version: '1',
                },
              ],
              destination: {
                ...destination,
                Config: {
                  apiKey: 'secret2',
                  trackProductsOnce: false,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: [
                {
                  jobId: 6,
                  userId: '12345',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
    id: '',
  },
];
