import { authHeader1, secret1 } from '../maskedSecrets';
import {
  mockSuccessfulBatchedIdentify,
  mockFnsWithBatchedIdentifyDisabled,
  mockNetworkFailure,
  mockHttpStatusFailure,
} from '../mocks';

export const identityResolution = [
  {
    id: 'batchedIdentify_success',
    name: 'braze',
    description: 'Test batched identify resolution - successful case',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                userId: 'user123',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                  locale: 'en-GB',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  traits: {
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                receivedAt: '2019-10-14T09:03:22.563Z',
                request_ip: '0.0.0.0',
                sentAt: '2019-10-14T09:03:22.563Z',
                timestamp: '2019-10-14T09:03:17.562Z',
                type: 'identify',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
              metadata: { jobId: 2, userId: 'u2' },
              message: {
                anonymousId: 'f7bc3d6f-3eda-55b0-b963-f3g78ef89cdb',
                userId: 'user456',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  traits: {
                    email: 'test2@example.com',
                    firstName: 'Jane',
                    lastName: 'Smith',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '95f37bdd-67b6-5946-9344-602248gdb579',
                originalTimestamp: '2019-10-14T09:03:18.562Z',
                receivedAt: '2019-10-14T09:03:23.563Z',
                request_ip: '0.0.0.0',
                sentAt: '2019-10-14T09:03:23.563Z',
                timestamp: '2019-10-14T09:03:18.562Z',
                type: 'identify',
              },
            },
          ],
          destType: 'braze',
        },
      },
    },
    mockFns: mockSuccessfulBatchedIdentify,
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
                  endpoint: 'https://rest.fra-01.braze.eu/users/track',
                  endpointPath: 'users/track',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      partner: 'RudderStack',
                      attributes: [
                        {
                          external_id: 'user123',
                          email: 'test@example.com',
                          first_name: 'John',
                          last_name: 'Doe',
                        },
                        {
                          external_id: 'user456',
                          email: 'test2@example.com',
                          first_name: 'Jane',
                          last_name: 'Smith',
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u2' },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'true',
    },
  },
  {
    id: 'batchedIdentify_disabled',
    name: 'braze',
    description: 'Test batched identify resolution disabled - should use individual calls',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                userId: 'user123',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                  locale: 'en-GB',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  traits: {
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                receivedAt: '2019-10-14T09:03:22.563Z',
                request_ip: '0.0.0.0',
                sentAt: '2019-10-14T09:03:22.563Z',
                timestamp: '2019-10-14T09:03:17.562Z',
                type: 'identify',
              },
            },
          ],
          destType: 'braze',
        },
      },
    },
    mockFns: mockFnsWithBatchedIdentifyDisabled,
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
                  endpoint: 'https://rest.fra-01.braze.eu/users/track',
                  endpointPath: 'users/track',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      partner: 'RudderStack',
                      attributes: [
                        {
                          external_id: 'user123',
                          email: 'test@example.com',
                          first_name: 'John',
                          last_name: 'Doe',
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'false',
    },
  },
  {
    id: 'batchedIdentify_network_failure',
    name: 'braze',
    description: 'Test batched identify resolution - network failure',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                userId: 'user123',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                  locale: 'en-GB',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  traits: {
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                receivedAt: '2019-10-14T09:03:22.563Z',
                request_ip: '0.0.0.0',
                sentAt: '2019-10-14T09:03:22.563Z',
                timestamp: '2019-10-14T09:03:17.562Z',
                type: 'identify',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
              metadata: { jobId: 2, userId: 'u2' },
              message: {
                anonymousId: 'f7bc3d6f-3eda-55b0-b963-f3g78ef89cdb',
                userId: 'user456',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  traits: {
                    email: 'test2@example.com',
                    firstName: 'Jane',
                    lastName: 'Smith',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '95f37bdd-67b6-5946-9344-602248gdb579',
                originalTimestamp: '2019-10-14T09:03:18.562Z',
                receivedAt: '2019-10-14T09:03:23.563Z',
                request_ip: '0.0.0.0',
                sentAt: '2019-10-14T09:03:23.563Z',
                timestamp: '2019-10-14T09:03:18.562Z',
                type: 'identify',
              },
            },
          ],
          destType: 'braze',
        },
      },
    },
    mockFns: mockNetworkFailure,
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
                  endpoint: 'https://rest.fra-01.braze.eu/users/track',
                  endpointPath: 'users/track',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      partner: 'RudderStack',
                      attributes: [
                        {
                          external_id: 'user123',
                          email: 'test@example.com',
                          first_name: 'John',
                          last_name: 'Doe',
                        },
                        {
                          external_id: 'user456',
                          email: 'test2@example.com',
                          first_name: 'Jane',
                          last_name: 'Smith',
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u2' },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'true',
    },
  },
  {
    id: 'batchedIdentify_http_failure',
    name: 'braze',
    description: 'Test batched identify resolution - HTTP 500 error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                userId: 'user123',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                  locale: 'en-GB',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  traits: {
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                receivedAt: '2019-10-14T09:03:22.563Z',
                request_ip: '0.0.0.0',
                sentAt: '2019-10-14T09:03:22.563Z',
                timestamp: '2019-10-14T09:03:17.562Z',
                type: 'identify',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
              metadata: { jobId: 2, userId: 'u2' },
              message: {
                anonymousId: 'f7bc3d6f-3eda-55b0-b963-f3g78ef89cdb',
                userId: 'user456',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  traits: {
                    email: 'test2@example.com',
                    firstName: 'Jane',
                    lastName: 'Smith',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '95f37bdd-67b6-5946-9344-602248gdb579',
                originalTimestamp: '2019-10-14T09:03:18.562Z',
                receivedAt: '2019-10-14T09:03:23.563Z',
                request_ip: '0.0.0.0',
                sentAt: '2019-10-14T09:03:23.563Z',
                timestamp: '2019-10-14T09:03:18.562Z',
                type: 'identify',
              },
            },
          ],
          destType: 'braze',
        },
      },
    },
    mockFns: mockHttpStatusFailure,
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
                  endpoint: 'https://rest.fra-01.braze.eu/users/track',
                  endpointPath: 'users/track',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      partner: 'RudderStack',
                      attributes: [
                        {
                          external_id: 'user123',
                          email: 'test@example.com',
                          first_name: 'John',
                          last_name: 'Doe',
                        },
                        {
                          external_id: 'user456',
                          email: 'test2@example.com',
                          first_name: 'Jane',
                          last_name: 'Smith',
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u2' },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                },
                DestinationDefinition: {
                  DisplayName: 'Braze',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'BRAZE',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'Braze',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
    envOverrides: {
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'true',
    },
  },
];
