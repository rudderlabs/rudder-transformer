import { generateMetadata } from '../../amazon_audience/common';
import { authHeader1, secret1 } from '../maskedSecrets';
import { identityResolution } from './identityResolution';

const basicRouterTests = [
  {
    name: 'braze',
    description: 'simple router tests',
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
                  traits: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
                originalTimestamp: '2020-01-24T06:29:02.358Z',
                properties: {
                  path: '/tests/html/index2.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index2.html',
                },
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53708',
                sentAt: '2020-01-24T06:29:02.359Z',
                timestamp: '2020-01-24T11:59:02.402+05:30',
                type: 'page',
                userId: '',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'us-01',
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
              metadata: { jobId: 2, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
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
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstname: 'Mickey',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2020-01-24T11:59:02.402+05:30',
                type: 'identify',
                userId: '',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'us-01',
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 3, userId: 'u1' },
              message: {
                anonymousId: '56yrtsdfgbgxcb-22b4-401d-aae5-1b994be9a969',
                groupId: 'c90f0fd2-2a02-4f2f-bf07-7e7d2c2ed2b1',
                traits: { phone: '5055077683', subscriptionState: 'subscribed' },
                userId: 'user123',
                type: 'group',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'us-01',
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 4, userId: 'u1' },
              message: {
                anonymousId: 'dfgdfgdfg-22b4-401d-aae5-1b994be9a969',
                groupId: '58d0a278-b55b-4f10-b7d2-98d1c5dd4c30',
                traits: { phone: '5055077683', subscriptionState: 'subscribed' },
                userId: 'user877',
                type: 'group',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'us-01',
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 5, userId: 'u1' },
              message: { type: 'alias', previousId: 'adsfsaf', userId: 'dsafsdf' },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'us-01',
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 6, userId: 'u1' },
              message: { type: 'alias', previousId: 'adsfsaf2', userId: 'dsafsdf2' },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'us-01',
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 7, userId: 'u1' },
              message: {
                anonymousId: '56yrtsdfgbgxcb-22b4-401d-aae5-1b994be9afdf',
                groupId: 'c90f0fd2-2a02-4f2f-bf07-7e7d2c2ed2b1',
                traits: { phone: '5055077683', subscriptionState: 'subscribed' },
                userId: 'user12345',
                type: 'group',
              },
            },
          ],
          destType: 'braze',
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
                      events: [
                        {
                          name: 'Page Viewed',
                          time: '2020-01-24T11:59:02.402+05:30',
                          properties: {
                            path: '/tests/html/index2.html',
                            referrer: '',
                            search: '',
                            title: '',
                            url: 'http://localhost/tests/html/index2.html',
                          },
                          _update_existing_only: false,
                          user_alias: {
                            alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                            alias_label: 'rudder_id',
                          },
                        },
                      ],
                      attributes: [
                        {
                          email: 'mickey@disney.com',
                          city: 'Disney',
                          country: 'USA',
                          firstname: 'Mickey',
                          _update_existing_only: false,
                          user_alias: {
                            alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                            alias_label: 'rudder_id',
                          },
                        },
                      ],
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://rest.fra-01.braze.eu/v2/subscription/status/set',
                  endpointPath: 'v2/subscription/status/set',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      subscription_groups: [
                        {
                          external_ids: ['user123', 'user12345'],
                          phones: ['5055077683'],
                          subscription_group_id: 'c90f0fd2-2a02-4f2f-bf07-7e7d2c2ed2b1',
                          subscription_state: 'subscribed',
                        },
                        {
                          external_ids: ['user877'],
                          phones: ['5055077683'],
                          subscription_group_id: '58d0a278-b55b-4f10-b7d2-98d1c5dd4c30',
                          subscription_state: 'subscribed',
                        },
                      ],
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://rest.fra-01.braze.eu/users/merge',
                  endpointPath: 'users/merge',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      merge_updates: [
                        {
                          identifier_to_keep: { external_id: 'dsafsdf' },
                          identifier_to_merge: { external_id: 'adsfsaf' },
                        },
                        {
                          identifier_to_keep: { external_id: 'dsafsdf2' },
                          identifier_to_merge: { external_id: 'adsfsaf2' },
                        },
                      ],
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u1' },
                { jobId: 3, userId: 'u1' },
                { jobId: 4, userId: 'u1' },
                { jobId: 5, userId: 'u1' },
                { jobId: 6, userId: 'u1' },
                { jobId: 7, userId: 'u1' },
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
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'false',
    },
  },
  {
    name: 'braze',
    description: 'dedup enabled router tests',
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
                ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
                Name: 'Braze-Test',
                Config: {
                  appKey: '0e5440c3-226b-45d0-91b5-c64da56cde16',
                  blacklistedEvents: [],
                  dataCenter: 'US-03',
                  enableNestedArrayOperations: false,
                  enableSubscriptionGroupInGroupCall: false,
                  eventFilteringOption: 'disable',
                  restApiKey: secret1,
                  supportDedup: true,
                  trackAnonymousUser: true,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2N9Uaf2tWq2QRmatBWQm03Rz6qX',
              },
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                type: 'track',
                event: 'Sign In Completed',
                sentAt: '2023-03-10T18:36:04.738Z',
                userId: 'braze_test_user',
                channel: 'web',
                context: {
                  locale: 'en-US',
                  traits: {
                    subscribe_once: true,
                    pwa: true,
                    email: 'jackson24miranda@gmail.com',
                    lastName: 'Miranda',
                    firstName: 'Spencer',
                    is_registered: true,
                    last_identify: 'GOOGLE_SIGN_IN',
                    account_region: 'ON',
                    is_pickup_selected: 'false',
                    has_tradein_attempt: false,
                    custom_obj_attr: { key1: 'value1', key2: 'value2', key4: 'value4' },
                    custom_arr: [1, 2, 'str1'],
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '2.9.5' },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                },
                rudderId: '4118560d-e4fc-4fd1-a734-9c69eae2c047',
                messageId: '1a342814-a882-4b65-9cc9-347544997268',
                timestamp: '2023-03-10T18:36:05.028Z',
                properties: {
                  cause: '/redirector',
                  method: 'GOOGLE',
                  region: 'ON',
                  orderId: '6179367977099',
                  order_id: '6179367977099',
                  webhookurl: 'https://my.test.com',
                  countingMethod: 'standard',
                  is_first_time_signin: false,
                },
                receivedAt: '2023-03-18T01:41:42.257+05:30',
                request_ip: '[::1]',
                anonymousId: '77e278c9-e984-4cdd-950c-cd0b61befd03',
                originalTimestamp: '2023-03-10T18:36:04.733Z',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
                Name: 'Braze-Test',
                Config: {
                  appKey: '0e5440c3-226b-45d0-91b5-c64da56cde16',
                  blacklistedEvents: [],
                  dataCenter: 'US-03',
                  enableNestedArrayOperations: false,
                  enableSubscriptionGroupInGroupCall: false,
                  eventFilteringOption: 'disable',
                  restApiKey: secret1,
                  supportDedup: true,
                  trackAnonymousUser: true,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2N9Uaf2tWq2QRmatBWQm03Rz6qX',
              },
              metadata: { jobId: 2, userId: 'u1' },
              message: {
                type: 'track',
                event: 'Sign In Completed',
                sentAt: '2023-03-10T18:36:04.738Z',
                userId: 'braze_test_user',
                channel: 'web',
                context: {
                  locale: 'en-US',
                  traits: {
                    subscribe_once: true,
                    pwa: true,
                    email: 'jackson24miranda@gmail.com',
                    lastName: 'Miranda 2',
                    firstName: 'Spencer',
                    is_registered: true,
                    last_identify: 'GOOGLE_SIGN_IN',
                    account_region: 'ON',
                    is_pickup_selected: 'true',
                    has_tradein_attempt: false,
                    custom_obj_attr: { key1: 'value1', key2: 'value2', key4: 'value4' },
                    custom_arr: ['1', '2', 'str1'],
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '2.9.5' },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                },
                rudderId: '4118560d-e4fc-4fd1-a734-9c69eae2c047',
                messageId: '1a342814-a882-4b65-9cc9-347544997268',
                timestamp: '2023-03-10T18:36:05.028Z',
                properties: {
                  cause: '/redirector',
                  method: 'GOOGLE',
                  region: 'ON',
                  orderId: '6179367977099',
                  order_id: '6179367977099',
                  webhookurl: 'https://my.test.com',
                  countingMethod: 'standard',
                  is_first_time_signin: false,
                },
                receivedAt: '2023-03-18T01:41:42.257+05:30',
                request_ip: '[::1]',
                anonymousId: '77e278c9-e984-4cdd-950c-cd0b61befd03',
                originalTimestamp: '2023-03-10T18:36:04.733Z',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
                Name: 'Braze-Test',
                Config: {
                  appKey: '0e5440c3-226b-45d0-91b5-c64da56cde16',
                  blacklistedEvents: [],
                  dataCenter: 'US-03',
                  enableNestedArrayOperations: false,
                  enableSubscriptionGroupInGroupCall: false,
                  eventFilteringOption: 'disable',
                  restApiKey: secret1,
                  supportDedup: true,
                  trackAnonymousUser: true,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2N9Uaf2tWq2QRmatBWQm03Rz6qX',
              },
              metadata: { jobId: 3, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
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
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstName: 'Mickey',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                type: 'identify',
                userId: 'user@50',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
                Name: 'Braze-Test',
                Config: {
                  appKey: '0e5440c3-226b-45d0-91b5-c64da56cde16',
                  blacklistedEvents: [],
                  dataCenter: 'US-03',
                  enableNestedArrayOperations: false,
                  enableSubscriptionGroupInGroupCall: false,
                  eventFilteringOption: 'disable',
                  restApiKey: secret1,
                  supportDedup: true,
                  trackAnonymousUser: true,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2N9Uaf2tWq2QRmatBWQm03Rz6qX',
              },
              metadata: { jobId: 4, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
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
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstName: 'Mickey',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                type: 'identify',
                userId: 'user@50',
              },
            },
            {
              destination: {
                hasDynamicConfig: false,
                ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
                Name: 'Braze-Test',
                Config: {
                  appKey: '0e5440c3-226b-45d0-91b5-c64da56cde16',
                  blacklistedEvents: [],
                  dataCenter: 'US-03',
                  enableNestedArrayOperations: false,
                  enableSubscriptionGroupInGroupCall: false,
                  eventFilteringOption: 'disable',
                  restApiKey: secret1,
                  supportDedup: true,
                  trackAnonymousUser: true,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2N9Uaf2tWq2QRmatBWQm03Rz6qX',
              },
              metadata: { jobId: 5, userId: 'u1' },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
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
                    city: 'Disney',
                    email: 'mickey@disney.com',
                    firstName: 'Mickey',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: { All: true },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                type: 'identify',
                userId: 'user@50',
              },
            },
          ],
          destType: 'braze',
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
                  endpoint: 'https://rest.iad-03.braze.com/users/track',
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
                          first_name: 'Spencer',
                          subscribe_once: true,
                          pwa: true,
                          external_id: 'braze_test_user',
                          custom_obj_attr: { key1: 'value1', key2: 'value2', key4: 'value4' },
                        },
                        {
                          last_name: 'Miranda 2',
                          is_pickup_selected: 'true',
                          external_id: 'braze_test_user',
                          custom_arr: ['1', '2', 'str1'],
                        },
                        {
                          city: 'Disney',
                          country: 'USA',
                          email: 'mickey@disney.com',
                          external_id: 'user@50',
                          first_name: 'Mickey',
                        },
                        {
                          country: 'USA',
                          external_id: 'user@50',
                        },
                      ],
                      events: [
                        {
                          name: 'Sign In Completed',
                          time: '2023-03-10T18:36:05.028Z',
                          properties: {
                            cause: '/redirector',
                            method: 'GOOGLE',
                            region: 'ON',
                            orderId: '6179367977099',
                            order_id: '6179367977099',
                            webhookurl: 'https://my.test.com',
                            countingMethod: 'standard',
                            is_first_time_signin: false,
                          },
                          external_id: 'braze_test_user',
                        },
                        {
                          name: 'Sign In Completed',
                          time: '2023-03-10T18:36:05.028Z',
                          properties: {
                            cause: '/redirector',
                            method: 'GOOGLE',
                            region: 'ON',
                            orderId: '6179367977099',
                            order_id: '6179367977099',
                            webhookurl: 'https://my.test.com',
                            countingMethod: 'standard',
                            is_first_time_signin: false,
                          },
                          external_id: 'braze_test_user',
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
                { jobId: 2, userId: 'u1' },
                { jobId: 3, userId: 'u1' },
                { jobId: 4, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                hasDynamicConfig: false,
                ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
                Name: 'Braze-Test',
                Config: {
                  appKey: '0e5440c3-226b-45d0-91b5-c64da56cde16',
                  blacklistedEvents: [],
                  dataCenter: 'US-03',
                  enableNestedArrayOperations: false,
                  enableSubscriptionGroupInGroupCall: false,
                  eventFilteringOption: 'disable',
                  restApiKey: secret1,
                  supportDedup: true,
                  trackAnonymousUser: true,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2N9Uaf2tWq2QRmatBWQm03Rz6qX',
              },
            },
            {
              error: '[Braze Deduplication]: Duplicate user detected, the user is dropped',
              statTags: {
                destType: 'BRAZE',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              batched: false,
              metadata: [{ jobId: 5, userId: 'u1' }],
              destination: {
                hasDynamicConfig: false,
                ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
                Name: 'Braze-Test',
                Config: {
                  appKey: '0e5440c3-226b-45d0-91b5-c64da56cde16',
                  blacklistedEvents: [],
                  dataCenter: 'US-03',
                  enableNestedArrayOperations: false,
                  enableSubscriptionGroupInGroupCall: false,
                  eventFilteringOption: 'disable',
                  restApiKey: secret1,
                  supportDedup: true,
                  trackAnonymousUser: true,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2N9Uaf2tWq2QRmatBWQm03Rz6qX',
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
    name: 'braze',
    description: 'subscription group call with anonymousId only, it should not add external_ids',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                event: 'Order Completed',
                sentAt: '2020-09-14T12:09:37.491Z',
                anonymousId: 'c6ff1462-b692-43d6-8f6a-659efedc99ea',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.3',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'file:///Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                    path: '/Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                    title: 'Fullstory Test',
                    search: '',
                    referrer: '',
                  },
                  locale: 'en-GB',
                  screen: {
                    density: 2,
                  },
                  traits: {
                    email: 'manashi@gmaiol.com',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.3',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
                },
                messageId: '24ecc509-ce3e-473c-8483-ba1ea2c195cb',
                groupId: '1234',
                traits: {
                  email: 'abc@test.com',
                  subscriptionState: 'unsubscribed',
                },
                integrations: {
                  All: true,
                },
                originalTimestamp: '2020-09-14T12:09:37.491Z',
              },
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: 'secret1',
                  prefixProperties: true,
                  useNativeSDK: false,
                  enableSubscriptionGroupInGroupCall: true,
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
            },
            {
              message: {
                type: 'group',
                event: 'Order Completed',
                sentAt: '2020-09-14T12:09:37.491Z',
                anonymousId: 'c6ff1462-b692-43d6-8f6a-659efedc99ea',
                channel: 'web',
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.3',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  page: {
                    url: 'file:///Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                    path: '/Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                    title: 'Fullstory Test',
                    search: '',
                    referrer: '',
                  },
                  locale: 'en-GB',
                  screen: {
                    density: 2,
                  },
                  traits: {
                    email: 'manashi@gmaiol.com',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.3',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
                },
                messageId: '24ecc509-ce3e-473c-8483-ba1ea2c195cb',
                groupId: '1234',
                traits: {
                  email: 'abc1@test.com',
                  subscriptionState: 'unsubscribed',
                },
                integrations: {
                  All: true,
                },
                originalTimestamp: '2020-09-14T12:09:37.491Z',
              },
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: 'secret1',
                  prefixProperties: true,
                  useNativeSDK: false,
                  enableSubscriptionGroupInGroupCall: true,
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
            },
          ],
          destType: 'braze',
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
                  endpoint: 'https://rest.fra-01.braze.eu/v2/subscription/status/set',
                  endpointPath: 'v2/subscription/status/set',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer secret1',
                  },
                  params: {},
                  body: {
                    JSON: {
                      subscription_groups: [
                        {
                          subscription_group_id: '1234',
                          subscription_state: 'unsubscribed',
                          emails: ['abc@test.com', 'abc1@test.com'],
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
                  restApiKey: 'secret1',
                  prefixProperties: true,
                  useNativeSDK: false,
                  enableSubscriptionGroupInGroupCall: true,
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
];

const basicRouterTestsWithBatchIdentityResolutionEnabled = basicRouterTests.map((test) => {
  return {
    ...test,
    envOverrides: {
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'true',
    },
  };
});

// ---------------------------------------------------------------------------
// Per-job delivery-mapping — ON path.
// When `BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS` enables the workspace,
// processBatch emits one
// BatchRequestOutput per outgoing HTTP request (instead of one
// MultiBatchRequestOutput with batchedRequest[]). Items are coalesced by
// endpoint type across the entire input — insertion-order runs are NOT
// preserved — so a batch that mixes track, subscription, and merge jobs
// produces exactly one output per endpoint (subject to chunk-size caps).
// Track outputs carry per-metadata `destInfo.attributesIndices` /
// `.eventsIndices` / `.purchasesIndices`; sub/merge outputs carry
// `destInfo: {}` for correlation-shape uniformity.
// ---------------------------------------------------------------------------
const perJobDeliveryMappingOnTests = [
  {
    name: 'braze',
    description:
      'per-job delivery mapping ON — mixed track + subscription + merge coalesces items per endpoint into one output each',
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
                channel: 'web',
                context: {
                  ip: '0.0.0.0',
                  traits: {},
                },
                integrations: { All: true },
                messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
                originalTimestamp: '2020-01-24T06:29:02.358Z',
                properties: {
                  path: '/tests/html/index2.html',
                  url: 'http://localhost/tests/html/index2.html',
                },
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                sentAt: '2020-01-24T06:29:02.359Z',
                timestamp: '2020-01-24T11:59:02.402+05:30',
                type: 'page',
                userId: '',
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
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                channel: 'web',
                context: {
                  ip: '0.0.0.0',
                  traits: {
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstname: 'Mickey',
                  },
                },
                integrations: { All: true },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2020-01-24T11:59:02.402+05:30',
                type: 'identify',
                userId: '',
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
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 3, userId: 'u3' },
              message: {
                anonymousId: '56yrtsdfgbgxcb-22b4-401d-aae5-1b994be9a969',
                groupId: 'c90f0fd2-2a02-4f2f-bf07-7e7d2c2ed2b1',
                traits: { phone: '5055077683', subscriptionState: 'subscribed' },
                userId: 'user123',
                type: 'group',
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
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 4, userId: 'u4' },
              message: {
                anonymousId: 'dfgdfgdfg-22b4-401d-aae5-1b994be9a969',
                groupId: '58d0a278-b55b-4f10-b7d2-98d1c5dd4c30',
                traits: { phone: '5055077683', subscriptionState: 'subscribed' },
                userId: 'user877',
                type: 'group',
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
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 5, userId: 'u5' },
              message: { type: 'alias', previousId: 'adsfsaf', userId: 'dsafsdf' },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 6, userId: 'u6' },
              message: { type: 'alias', previousId: 'adsfsaf2', userId: 'dsafsdf2' },
            },
            {
              destination: {
                hasDynamicConfig: false,
                Config: {
                  restApiKey: secret1,
                  prefixProperties: true,
                  useNativeSDK: false,
                  dataCenter: 'eu-01',
                  enableSubscriptionGroupInGroupCall: true,
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
              metadata: { jobId: 7, userId: 'u7' },
              message: {
                anonymousId: '56yrtsdfgbgxcb-22b4-401d-aae5-1b994be9afdf',
                groupId: 'c90f0fd2-2a02-4f2f-bf07-7e7d2c2ed2b1',
                traits: { phone: '5055077683', subscriptionState: 'subscribed' },
                userId: 'user12345',
                type: 'group',
              },
            },
          ],
          destType: 'braze',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // Output 1 — track run (jobs 1, 2). One /users/track HTTP request.
            // Job 1's page-view lands at events[0]; job 2's identify lands at
            // attributes[0]. Per-metadata destInfo carries the positional
            // indices the v1 networkHandler uses to correlate per-item
            // warnings back to the originating job.
            {
              batchedRequest: {
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
                    events: [
                      {
                        name: 'Page Viewed',
                        time: '2020-01-24T11:59:02.402+05:30',
                        properties: {
                          path: '/tests/html/index2.html',
                          url: 'http://localhost/tests/html/index2.html',
                        },
                        _update_existing_only: false,
                        user_alias: {
                          alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                          alias_label: 'rudder_id',
                        },
                      },
                    ],
                    attributes: [
                      {
                        email: 'mickey@disney.com',
                        city: 'Disney',
                        country: 'USA',
                        firstname: 'Mickey',
                        _update_existing_only: false,
                        user_alias: {
                          alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                          alias_label: 'rudder_id',
                        },
                      },
                    ],
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                { jobId: 1, userId: 'u1', destInfo: { eventsIndices: [0] } },
                { jobId: 2, userId: 'u2', destInfo: { attributesIndices: [0] } },
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
            // Output 2 — subscription-groups (jobs 3, 4, 7 coalesced). Items
            // from all subscription-shaped jobs across the batch are combined
            // into a single output regardless of their position in the input,
            // then `combineSubscriptionGroups` merges the two `c90f0fd2` rows
            // (job 3's user123 + job 7's user12345) into one entry. Sub
            // metadata carries `destInfo: {}` (present-but-empty).
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://rest.fra-01.braze.eu/v2/subscription/status/set',
                endpointPath: 'v2/subscription/status/set',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    subscription_groups: [
                      {
                        external_ids: ['user123', 'user12345'],
                        phones: ['5055077683'],
                        subscription_group_id: 'c90f0fd2-2a02-4f2f-bf07-7e7d2c2ed2b1',
                        subscription_state: 'subscribed',
                      },
                      {
                        external_ids: ['user877'],
                        phones: ['5055077683'],
                        subscription_group_id: '58d0a278-b55b-4f10-b7d2-98d1c5dd4c30',
                        subscription_state: 'subscribed',
                      },
                    ],
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                { jobId: 3, userId: 'u3', destInfo: {} },
                { jobId: 4, userId: 'u4', destInfo: {} },
                { jobId: 7, userId: 'u7', destInfo: {} },
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
            // Output 3 — alias-merge (jobs 5, 6 coalesced). One /users/merge
            // HTTP request. Merge metadata carries `destInfo: {}`.
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://rest.fra-01.braze.eu/users/merge',
                endpointPath: 'users/merge',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    merge_updates: [
                      {
                        identifier_to_keep: { external_id: 'dsafsdf' },
                        identifier_to_merge: { external_id: 'adsfsaf' },
                      },
                      {
                        identifier_to_keep: { external_id: 'dsafsdf2' },
                        identifier_to_merge: { external_id: 'adsfsaf2' },
                      },
                    ],
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                { jobId: 5, userId: 'u5', destInfo: {} },
                { jobId: 6, userId: 'u6', destInfo: {} },
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
      BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS: 'ALL',
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'false',
    },
  },
  {
    name: 'braze',
    description:
      'per-job delivery mapping ON — order-completed with multiple products yields destInfo.purchasesIndices spanning all product indices',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            // Job 100: identify → contributes 1 attribute.
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
              metadata: { jobId: 100, userId: 'u1' },
              message: {
                anonymousId: 'a1',
                channel: 'web',
                context: { ip: '0.0.0.0', traits: { firstname: 'Alice' } },
                integrations: { All: true },
                messageId: 'm100',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2020-01-24T11:59:02.402+05:30',
                type: 'identify',
                userId: 'alice',
              },
            },
            // Job 101: order completed → contributes 1 event + 1 attribute
            // + 3 purchases (one per product). destInfo for this job must
            // list all 3 purchase indices.
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
              metadata: generateMetadata(101, 'u1'),
              message: {
                anonymousId: 'a2',
                channel: 'web',
                context: { ip: '0.0.0.0', traits: { firstname: 'Bob' } },
                event: 'Order Completed',
                integrations: { All: true },
                messageId: 'm101',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                properties: {
                  currency: 'USD',
                  products: [
                    { product_id: 'p1', price: 10, quantity: 1 },
                    { product_id: 'p2', price: 20, quantity: 2 },
                    { product_id: 'p3', price: 30, quantity: 1 },
                  ],
                },
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2020-01-24T11:59:02.402+05:30',
                type: 'track',
                userId: 'bob',
              },
            },
          ],
          destType: 'braze',
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
              batchedRequest: {
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
                      { firstname: 'Alice', external_id: 'alice' },
                      { firstname: 'Bob', external_id: 'bob' },
                    ],
                    purchases: [
                      {
                        product_id: 'p1',
                        price: 10,
                        currency: 'USD',
                        quantity: 1,
                        time: '2020-01-24T11:59:02.402+05:30',
                        external_id: 'bob',
                      },
                      {
                        product_id: 'p2',
                        price: 20,
                        currency: 'USD',
                        quantity: 2,
                        time: '2020-01-24T11:59:02.402+05:30',
                        external_id: 'bob',
                      },
                      {
                        product_id: 'p3',
                        price: 30,
                        currency: 'USD',
                        quantity: 1,
                        time: '2020-01-24T11:59:02.402+05:30',
                        external_id: 'bob',
                      },
                    ],
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              // destInfo shape:
              // - Job 100 contributes 1 attribute → attributesIndices: [0]
              // - Job 101 (Order Completed) contributes 1 attribute + 3
              //   purchases (Braze transformer emits per-product purchase
              //   records instead of a track event for Order Completed) →
              //   attributesIndices: [1], purchasesIndices: [0, 1, 2] (the
              //   multi-index case for a single-job contribution).
              metadata: [
                { jobId: 100, userId: 'u1', destInfo: { attributesIndices: [0] } },
                {
                  ...generateMetadata(101, 'u1'),
                  jobId: 101,
                  userId: 'u1',
                  destInfo: { attributesIndices: [1], purchasesIndices: [0, 1, 2] },
                },
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
      BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS: 'ALL',
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'false',
    },
  },
];

export const data = [
  ...basicRouterTests,
  ...basicRouterTestsWithBatchIdentityResolutionEnabled,
  ...perJobDeliveryMappingOnTests,
  ...identityResolution,
];
