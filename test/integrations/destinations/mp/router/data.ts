import { overrideDestination } from '../../../testUtils';
import { sampleDestination } from '../common';

export const data = [
  {
    name: 'mp',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              description: 'Page call',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                useOldMapping: true,
                strictMode: true,
              }),
              metadata: {
                jobId: 1,
                additionalProp: 1,
              },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                channel: 'web',
                name: 'Contact Us',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {},
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
                originalTimestamp: '2020-01-24T06:29:02.358Z',
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53708',
                sentAt: '2020-01-24T06:29:02.359Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'page',
                userId: 'hjikl',
              },
            },
            {
              description:
                'Track: set device id and user id when simplified id merge api is selected',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                identityMergeApi: 'simplified',
                strictMode: true,
              }),
              metadata: {
                jobId: 2,
                additionalProp: 2,
              },
              message: {
                anonymousId: 'anonId01',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1',
                    name: 'LeanPlumIntegrationAndroid',
                    namespace: 'com.android.SampleLeanPlum',
                    version: '1.0',
                  },
                  device: {
                    id: '5094f5704b9cf2b3',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'ios',
                    token: 'test_device_token',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '1.0.1-beta.1',
                  },
                  locale: 'en-US',
                  network: {
                    carrier: 'Android',
                    bluetooth: false,
                    cellular: true,
                    wifi: true,
                  },
                  os: {
                    name: 'iOS',
                    version: '8.1.0',
                  },
                  screen: {
                    density: 420,
                    height: 1794,
                    width: 1080,
                  },
                  timezone: 'Asia/Kolkata',
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
                },
                event: 'Product Viewed',
                integrations: {
                  All: true,
                },
                userId: 'userId01',
                messageId: 'id2',
                properties: {
                  name: 'T-Shirt',
                  revenue: 18.9,
                },
                type: 'track',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
              },
            },
            {
              description: 'Identify call to create anonymous user profile',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                useOldMapping: true,
                strictMode: true,
              }),
              metadata: {
                jobId: 3,
                additionalProp: 3,
              },
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstName: 'Mickey',
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'identify',
                userId: '',
              },
            },
            {
              description:
                'Identify: append $device: to deviceId while creating the user when simplified id merge api is selected',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                identityMergeApi: 'simplified',
                strictMode: true,
              }),
              metadata: {
                jobId: 4,
                additionalProp: 4,
              },
              message: {
                anonymousId: 'anonId01',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstName: 'Mickey',
                    lastName: 'Mouse',
                    createdAt: '2020-01-23T08:54:02.362Z',
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'identify',
              },
            },
            {
              description: 'Merge call with strict mode enabled',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                strictMode: true,
              }),
              metadata: {
                jobId: 5,
                additionalProp: 5,
              },
              message: {
                anonymousId: '5094f5704b9cf2b3',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1',
                    name: 'LeanPlumIntegrationAndroid',
                    namespace: 'com.android.SampleLeanPlum',
                    version: '1.0',
                  },
                  device: {
                    id: '5094f5704b9cf2b3',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'ios',
                    token: 'test_device_token',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '1.0.1-beta.1',
                  },
                  locale: 'en-US',
                  network: {
                    carrier: 'Android',
                    bluetooth: false,
                    cellular: true,
                    wifi: true,
                  },
                  os: {
                    name: 'iOS',
                    version: '8.1.0',
                  },
                  screen: {
                    density: 420,
                    height: 1794,
                    width: 1080,
                  },
                  timezone: 'Asia/Kolkata',
                  traits: {
                    anonymousId: '5094f5704b9cf2b3',
                    userId: 'test_user_id',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
                },
                event: 'MainActivity',
                integrations: {
                  All: true,
                },
                userId: 'test_user_id',
                messageId: 'id2',
                properties: {
                  name: 'MainActivity',
                  automatic: true,
                },
                originalTimestamp: '2020-03-12T09:05:03.421Z',
                type: 'identify',
                sentAt: '2020-03-12T09:05:13.042Z',
              },
            },
            {
              description: 'Group call',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                groupKeySettings: [
                  {
                    groupKey: 'company',
                  },
                ],
                strictMode: true,
              }),
              metadata: {
                jobId: 6,
                additionalProp: 6,
              },
              message: {
                anonymousId: 'anonId06',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                traits: {
                  company: 'testComp',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'group',
                userId: 'userId06',
              },
            },
            {
              description: 'Group key not present in traits',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                groupKeySettings: [
                  {
                    groupKey: 'company',
                  },
                ],
                strictMode: true,
              }),
              metadata: {
                jobId: 7,
                additionalProp: 7,
              },
              message: {
                anonymousId: 'anonId06',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'group',
                userId: 'userId06',
              },
            },
          ],
          destType: 'mp',
        },
        method: 'POST',
        headers: {
          'X-Feature-Gzip-Support': '?1',
        },
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
                endpoint: 'https://api.mixpanel.com/import/',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic dGVzdF9hcGlfc2VjcmV0Og==',
                },
                params: {
                  strict: 1,
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  GZIP: {
                    payload:
                      '[{"event":"Loaded a Page","properties":{"ip":"0.0.0.0","$user_id":"hjikl","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"hjikl","time":1688624942,"name":"Contact Us","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  additionalProp: 1,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  useNativeSDK: false,
                  useOldMapping: true,
                  strictMode: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/engage/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$append":{"$transactions":{"$time":"2023-07-06T06:29:02.402Z","$amount":18.9}},"$token":"test_api_token","$distinct_id":"userId01"}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/import/',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic dGVzdF9hcGlfc2VjcmV0Og==',
                  },
                  params: {
                    strict: 1,
                  },
                  body: {
                    JSON: {},
                    JSON_ARRAY: {},
                    GZIP: {
                      payload:
                        '[{"event":"Product Viewed","properties":{"name":"T-Shirt","revenue":18.9,"$user_id":"userId01","$os":"iOS","$screen_height":1794,"$screen_width":1080,"$screen_dpi":420,"$carrier":"Android","$os_version":"8.1.0","$device":"generic_x86","$manufacturer":"Google","$model":"Android SDK built for x86","mp_device_model":"Android SDK built for x86","$wifi":true,"$bluetooth_enabled":false,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"1","$app_version_string":"1.0","$insert_id":"id2","token":"test_api_token","distinct_id":"userId01","time":1688624942,"$device_id":"anonId01"}}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                  additionalProp: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  identityMergeApi: 'simplified',
                  strictMode: true,
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/engage/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$set":{"$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$firstName":"Mickey","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1688624942},{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"$device:anonId01","$ip":"0.0.0.0","$time":1688624942},{"$set":{"$carrier":"Android","$manufacturer":"Google","$model":"Android SDK built for x86","$screen_height":1794,"$screen_width":1080,"$wifi":true,"anonymousId":"5094f5704b9cf2b3","userId":"test_user_id","$ios_devices":["test_device_token"],"$os":"iOS","$ios_device_model":"Android SDK built for x86","$ios_version":"8.1.0","$ios_app_release":"1","$ios_app_version":"1.0"},"$token":"test_api_token","$distinct_id":"test_user_id","$time":null}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/import/',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic dGVzdF9hcGlfc2VjcmV0Og==',
                  },
                  params: {
                    strict: 1,
                  },
                  body: {
                    JSON: {},
                    JSON_ARRAY: {},
                    GZIP: {
                      payload:
                        '[{"event":"$merge","properties":{"$distinct_ids":["test_user_id","5094f5704b9cf2b3"],"token":"test_api_token"}}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 3,
                  additionalProp: 3,
                },
                {
                  jobId: 4,
                  additionalProp: 4,
                },
                {
                  jobId: 5,
                  additionalProp: 5,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  useNativeSDK: false,
                  useOldMapping: true,
                  strictMode: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/engage/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$token":"test_api_token","$distinct_id":"userId06","$set":{"company":["testComp"]},"$ip":"0.0.0.0"}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/groups/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$token":"test_api_token","$group_key":"company","$group_id":"testComp","$set":{"company":"testComp"}}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 6,
                  additionalProp: 6,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  groupKeySettings: [
                    {
                      groupKey: 'company',
                    },
                  ],
                  strictMode: true,
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              metadata: [
                {
                  jobId: 7,
                  additionalProp: 7,
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'Group Key is not present. Please ensure that the group key is included in the payload as configured in the `Group Key Settings` in destination',
              statTags: {
                destType: 'MP',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  useNativeSDK: false,
                  groupKeySettings: [
                    {
                      groupKey: 'company',
                    },
                  ],
                  strictMode: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              description: 'Page call',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                useOldMapping: true,
                strictMode: true,
              }),
              metadata: {
                jobId: 1,
                additionalProp: 1,
              },
              message: {
                anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                channel: 'web',
                name: 'Contact Us',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {},
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
                originalTimestamp: '2020-01-24T06:29:02.358Z',
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53708',
                sentAt: '2020-01-24T06:29:02.359Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'page',
                userId: 'hjikl',
              },
            },
            {
              description:
                'Track: set device id and user id when simplified id merge api is selected',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                identityMergeApi: 'simplified',
                strictMode: true,
              }),
              metadata: {
                jobId: 2,
                additionalProp: 2,
              },
              message: {
                anonymousId: 'anonId01',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1',
                    name: 'LeanPlumIntegrationAndroid',
                    namespace: 'com.android.SampleLeanPlum',
                    version: '1.0',
                  },
                  device: {
                    id: '5094f5704b9cf2b3',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'ios',
                    token: 'test_device_token',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '1.0.1-beta.1',
                  },
                  locale: 'en-US',
                  network: {
                    carrier: 'Android',
                    bluetooth: false,
                    cellular: true,
                    wifi: true,
                  },
                  os: {
                    name: 'iOS',
                    version: '8.1.0',
                  },
                  screen: {
                    density: 420,
                    height: 1794,
                    width: 1080,
                  },
                  timezone: 'Asia/Kolkata',
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
                },
                event: 'Product Viewed',
                integrations: {
                  All: true,
                },
                userId: 'userId01',
                messageId: 'id2',
                properties: {
                  name: 'T-Shirt',
                  revenue: 18.9,
                },
                type: 'track',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
              },
            },
            {
              description: 'Identify call to create anonymous user profile',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                useOldMapping: true,
                strictMode: true,
              }),
              metadata: {
                jobId: 3,
                additionalProp: 3,
              },
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstName: 'Mickey',
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'identify',
                userId: '',
              },
            },
            {
              description:
                'Identify: append $device: to deviceId while creating the user when simplified id merge api is selected',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                identityMergeApi: 'simplified',
                strictMode: true,
              }),
              metadata: {
                jobId: 4,
                additionalProp: 4,
              },
              message: {
                anonymousId: 'anonId01',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    city: 'Disney',
                    country: 'USA',
                    email: 'mickey@disney.com',
                    firstName: 'Mickey',
                    lastName: 'Mouse',
                    createdAt: '2020-01-23T08:54:02.362Z',
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'identify',
              },
            },
            {
              description: 'Merge call with strict mode enabled',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                strictMode: true,
              }),
              metadata: {
                jobId: 5,
                additionalProp: 5,
              },
              message: {
                anonymousId: '5094f5704b9cf2b3',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1',
                    name: 'LeanPlumIntegrationAndroid',
                    namespace: 'com.android.SampleLeanPlum',
                    version: '1.0',
                  },
                  device: {
                    id: '5094f5704b9cf2b3',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'ios',
                    token: 'test_device_token',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '1.0.1-beta.1',
                  },
                  locale: 'en-US',
                  network: {
                    carrier: 'Android',
                    bluetooth: false,
                    cellular: true,
                    wifi: true,
                  },
                  os: {
                    name: 'iOS',
                    version: '8.1.0',
                  },
                  screen: {
                    density: 420,
                    height: 1794,
                    width: 1080,
                  },
                  timezone: 'Asia/Kolkata',
                  traits: {
                    anonymousId: '5094f5704b9cf2b3',
                    userId: 'test_user_id',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
                },
                event: 'MainActivity',
                integrations: {
                  All: true,
                },
                userId: 'test_user_id',
                messageId: 'id2',
                properties: {
                  name: 'MainActivity',
                  automatic: true,
                },
                originalTimestamp: '2020-03-12T09:05:03.421Z',
                type: 'identify',
                sentAt: '2020-03-12T09:05:13.042Z',
              },
            },
            {
              description: 'Group call',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                groupKeySettings: [
                  {
                    groupKey: 'company',
                  },
                ],
                strictMode: true,
              }),
              metadata: {
                jobId: 6,
                additionalProp: 6,
              },
              message: {
                anonymousId: 'anonId06',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                traits: {
                  company: 'testComp',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'group',
                userId: 'userId06',
              },
            },
            {
              description: 'Group key not present in traits',
              destination: overrideDestination(sampleDestination, {
                apiSecret: 'test_api_secret',
                token: 'test_api_token',
                groupKeySettings: [
                  {
                    groupKey: 'company',
                  },
                ],
                strictMode: true,
              }),
              metadata: {
                jobId: 7,
                additionalProp: 7,
              },
              message: {
                anonymousId: 'anonId06',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.5',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.5',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '/destinations/mixpanel',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'https://docs.rudderstack.com/destinations/mixpanel',
                    category: 'destination',
                    initial_referrer: 'https://docs.rudderstack.com',
                    initial_referring_domain: 'docs.rudderstack.com',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'group',
                userId: 'userId06',
              },
            },
          ],
          destType: 'mp',
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
                endpoint: 'https://api.mixpanel.com/import/',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic dGVzdF9hcGlfc2VjcmV0Og==',
                },
                params: {
                  strict: 1,
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch:
                      '[{"event":"Loaded a Page","properties":{"ip":"0.0.0.0","$user_id":"hjikl","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"hjikl","time":1688624942,"name":"Contact Us","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  additionalProp: 1,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  useNativeSDK: false,
                  useOldMapping: true,
                  strictMode: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/engage/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$append":{"$transactions":{"$time":"2023-07-06T06:29:02.402Z","$amount":18.9}},"$token":"test_api_token","$distinct_id":"userId01"}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/import/',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic dGVzdF9hcGlfc2VjcmV0Og==',
                  },
                  params: {
                    strict: 1,
                  },
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"event":"Product Viewed","properties":{"name":"T-Shirt","revenue":18.9,"$user_id":"userId01","$os":"iOS","$screen_height":1794,"$screen_width":1080,"$screen_dpi":420,"$carrier":"Android","$os_version":"8.1.0","$device":"generic_x86","$manufacturer":"Google","$model":"Android SDK built for x86","mp_device_model":"Android SDK built for x86","$wifi":true,"$bluetooth_enabled":false,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"1","$app_version_string":"1.0","$insert_id":"id2","token":"test_api_token","distinct_id":"userId01","time":1688624942,"$device_id":"anonId01"}}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                  additionalProp: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  identityMergeApi: 'simplified',
                  strictMode: true,
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/engage/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$set":{"$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$firstName":"Mickey","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1688624942},{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"$device:anonId01","$ip":"0.0.0.0","$time":1688624942},{"$set":{"$carrier":"Android","$manufacturer":"Google","$model":"Android SDK built for x86","$screen_height":1794,"$screen_width":1080,"$wifi":true,"anonymousId":"5094f5704b9cf2b3","userId":"test_user_id","$ios_devices":["test_device_token"],"$os":"iOS","$ios_device_model":"Android SDK built for x86","$ios_version":"8.1.0","$ios_app_release":"1","$ios_app_version":"1.0"},"$token":"test_api_token","$distinct_id":"test_user_id","$time":null}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/import/',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic dGVzdF9hcGlfc2VjcmV0Og==',
                  },
                  params: {
                    strict: 1,
                  },
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"event":"$merge","properties":{"$distinct_ids":["test_user_id","5094f5704b9cf2b3"],"token":"test_api_token"}}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 3,
                  additionalProp: 3,
                },
                {
                  jobId: 4,
                  additionalProp: 4,
                },
                {
                  jobId: 5,
                  additionalProp: 5,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  useNativeSDK: false,
                  useOldMapping: true,
                  strictMode: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/engage/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$token":"test_api_token","$distinct_id":"userId06","$set":{"company":["testComp"]},"$ip":"0.0.0.0"}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.mixpanel.com/groups/',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {},
                    JSON_ARRAY: {
                      batch:
                        '[{"$token":"test_api_token","$group_key":"company","$group_id":"testComp","$set":{"company":"testComp"}}]',
                    },
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 6,
                  additionalProp: 6,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  groupKeySettings: [
                    {
                      groupKey: 'company',
                    },
                  ],
                  strictMode: true,
                  useNativeSDK: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
            {
              metadata: [
                {
                  jobId: 7,
                  additionalProp: 7,
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'Group Key is not present. Please ensure that the group key is included in the payload as configured in the `Group Key Settings` in destination',
              statTags: {
                destType: 'MP',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  apiSecret: 'test_api_secret',
                  token: 'test_api_token',
                  prefixProperties: true,
                  useNativeSDK: false,
                  groupKeySettings: [
                    {
                      groupKey: 'company',
                    },
                  ],
                  strictMode: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Mixpanel',
                  ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                  Name: 'MP',
                },
                Enabled: true,
                ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
                Name: 'MP',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
];
