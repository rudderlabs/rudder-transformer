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
    }
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
    }
  },
];

const basicRouterTestsWithBatchIdentityResolutionEnabled = basicRouterTests.map((test) => {
  return {
    ...test,
    envOverrides: {
      BRAZE_BATCH_IDENTIFY_RESOLUTION: 'true',
    }
  };
});

export const data = [
  ...basicRouterTests,
  ...basicRouterTestsWithBatchIdentityResolutionEnabled,
  ...identityResolution,
];
