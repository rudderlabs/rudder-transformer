import { secret2 } from '../maskedSecrets';
import { defaultMockFns } from '../mocks';

export const data = [
  {
    name: 'am',
    description: 'Test 0: Initial test case to test the router',
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
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
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
              destination: { Config: { apiKey: secret2 } },
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
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
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
              destination: { Config: { apiKey: secret2 } },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'am',
    description: 'Test 1: Test case to test the router with multiple events of differnt userIds',
    successCriteria:
      'Inputs has 7 events and the mocked batch limit is 3. There are 3 different userIds. So there should be 3 batches and all events should be transformed successfully and batched correctly as per userIds and status code should be 200',
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
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
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
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
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
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
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
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
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
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    anonymousId: '1234567',
                    email: 'test@rudderstack.com',
                    trait6: 'value6',
                  },
                },
                type: 'identify',
                anonymousId: '1234567',
                userId: '1234567',
              },
              metadata: { jobId: 6, userId: '1234567' },
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
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
              metadata: { jobId: 7, userId: '123456' },
              destination: {
                Config: { apiKey: secret2, groupTypeTrait: 'email', groupValueTrait: 'age' },
              },
            },
            {
              message: {
                type: 'UNSUPPORTED-TYPE',
                event: 'Order Completed',
                sentAt: '2020-08-14T05:30:30.118Z',
                context: {},
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {},
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  S3: false,
                  All: true,
                },
              },
              destination: {
                Config: {
                  groupTypeTrait: 'email',
                  apiKey: secret2,
                  groupValueTrait: 'age',
                  trackProductsOnce: true,
                  trackRevenuePerProduct: false,
                },
              },
              metadata: { jobId: 8, userId: '50be5c78-6c3f-4b60-be84-97805a316fb1' },
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
              },
              metadata: [
                {
                  jobId: 5,
                  userId: '123456',
                },
                {
                  jobId: 7,
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
                          device_id: '1234567',
                          event_type: '$identify',
                          library: 'rudderstack',
                          platform: 'Web',
                          session_id: -1,
                          time: 0,
                          user_id: '1234567',
                          user_properties: {
                            anonymousId: '1234567',
                            email: 'test@rudderstack.com',
                            trait6: 'value6',
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
                  userId: '1234567',
                  version: '1',
                },
              ],
              destination: {
                Config: {
                  apiKey: 'am2',
                  groupTypeTrait: 'email',
                  groupValueTrait: 'age',
                },
              },
              metadata: [
                {
                  jobId: 6,
                  userId: '1234567',
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
                  trackProductsOnce: true,
                  trackRevenuePerProduct: false,
                },
              },
              error: 'message type not supported',
              metadata: [
                {
                  jobId: 8,
                  userId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
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
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
