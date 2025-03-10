export const data = [
  {
    name: 'af',
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
                  externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testhubspot2@email.com',
                    name: 'Test Hubspot',
                    anonymousId: '12345',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: 'android', version: '' },
                  screen: { density: 2 },
                },
                type: 'page',
                messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
                originalTimestamp: '2019-10-15T09:35:31.289Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: { path: '', referrer: '', search: '', title: '', url: '' },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
                integrations: { AF: { af_uid: 'afUid' } },
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: {
                Config: {
                  devKey: 'ef1d42390426e3f7c90ac78272e74344',
                  androidAppId: 'com.rudderlabs.javascript',
                },
                Enabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: { email: 'testhubspot2@email.com', name: 'Test Hubspot' },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: 'android', version: '' },
                  screen: { density: 2 },
                },
                type: 'track',
                messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
                originalTimestamp: '2019-10-15T09:35:31.291Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                event: 'test track event HS',
                properties: {
                  user_actual_role: 'system_admin, system_user',
                  user_actual_id: 12345,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
                integrations: { AF: { af_uid: 'afUid' } },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: {
                Config: {
                  devKey: 'ef1d42390426e3f7c90ac78272e74344',
                  androidAppId: 'com.rudderlabs.javascript',
                },
                Enabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testhubspot2@email.com',
                    name: 'Test Hubspot',
                    anonymousId: '12345',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: 'android', version: '' },
                  screen: { density: 2 },
                },
                type: 'page',
                messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
                originalTimestamp: '2019-10-15T09:35:31.289Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: { path: '', referrer: '', search: '', title: '', url: '' },
                name: 'ApplicationLoaded',
                sentAt: '2019-10-14T11:15:53.296Z',
                integrations: { AF: { af_uid: 'afUid' } },
              },
              metadata: { jobId: 4, userId: 'u1' },
              destination: {
                Config: {
                  devKey: 'ef1d42390426e3f7c90ac78272e74344',
                  sharingFilter: 'hey',
                  androidAppId: 'com.rudderlabs.javascript',
                },
                Enabled: true,
              },
            },
          ],
          destType: 'af',
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
                endpoint: 'https://api2.appsflyer.com/inappevent/com.rudderlabs.javascript',
                headers: {
                  'Content-Type': 'application/json',
                  authentication: 'ef1d42390426e3f7c90ac78272e74344',
                },
                method: 'POST',
                params: {},
                body: {
                  JSON: {
                    app_version_name: '1.0.0',
                    bundleIdentifier: 'com.rudderlabs.javascript',
                    customer_user_id: '12345',
                    eventValue: JSON.stringify({
                      path: '',
                      referrer: '',
                      search: '',
                      title: '',
                      url: '',
                    }),
                    eventName: 'page',
                    appsflyer_id: 'afUid',
                    os: '',
                    ip: '0.0.0.0',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  devKey: 'ef1d42390426e3f7c90ac78272e74344',
                  androidAppId: 'com.rudderlabs.javascript',
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                endpoint: 'https://api2.appsflyer.com/inappevent/com.rudderlabs.javascript',
                headers: {
                  'Content-Type': 'application/json',
                  authentication: 'ef1d42390426e3f7c90ac78272e74344',
                },
                params: {},
                method: 'POST',
                body: {
                  JSON: {
                    app_version_name: '1.0.0',
                    bundleIdentifier: 'com.rudderlabs.javascript',
                    customer_user_id: '12345',
                    eventValue: JSON.stringify({
                      properties: {
                        user_actual_role: 'system_admin, system_user',
                        user_actual_id: 12345,
                      },
                    }),
                    eventName: 'test track event HS',
                    appsflyer_id: 'afUid',
                    os: '',
                    ip: '0.0.0.0',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  devKey: 'ef1d42390426e3f7c90ac78272e74344',
                  androidAppId: 'com.rudderlabs.javascript',
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                endpoint: 'https://api2.appsflyer.com/inappevent/com.rudderlabs.javascript',
                headers: {
                  'Content-Type': 'application/json',
                  authentication: 'ef1d42390426e3f7c90ac78272e74344',
                },
                method: 'POST',
                params: {},
                body: {
                  JSON: {
                    app_version_name: '1.0.0',
                    bundleIdentifier: 'com.rudderlabs.javascript',
                    customer_user_id: '12345',
                    eventValue: JSON.stringify({
                      path: '',
                      referrer: '',
                      search: '',
                      title: '',
                      url: '',
                    }),
                    eventName: 'page',
                    appsflyer_id: 'afUid',
                    os: '',
                    ip: '0.0.0.0',
                    sharing_filter: 'hey',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 4, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  devKey: 'ef1d42390426e3f7c90ac78272e74344',
                  sharingFilter: 'hey',
                  androidAppId: 'com.rudderlabs.javascript',
                },
                Enabled: true,
              },
            },
          ],
        },
      },
    },
  },
];
