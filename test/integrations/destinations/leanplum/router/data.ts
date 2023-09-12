export const data = [
  {
    name: 'leanplum',
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
                    type: 'android',
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
                    name: 'Android',
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
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
                },
                event: 'MainActivity',
                integrations: {
                  All: true,
                },
                messageId: 'id1',
                properties: {
                  name: 'MainActivity',
                  automatic: true,
                },
                originalTimestamp: '2020-03-12T09:05:03.421Z',
                type: 'screen',
                sentAt: '2020-03-12T09:05:13.042Z',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  applicationId: 'leanplum_application_id',
                  clientKey: 'leanplum_client_key',
                  isDevelop: true,
                  useNativeSDK: false,
                  sendEvents: false,
                },
              },
            },
          ],
          destType: 'leanplum',
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
                  endpoint: 'https://api.leanplum.com/api',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  params: {
                    action: 'start',
                  },
                  body: {
                    JSON: {
                      appId: 'leanplum_application_id',
                      clientKey: 'leanplum_client_key',
                      apiVersion: '1.0.6',
                      userId: '5094f5704b9cf2b3',
                      deviceId: '5094f5704b9cf2b3',
                      appVersion: '1.0',
                      systemName: 'Android',
                      systemVersion: '8.1.0',
                      deviceName: 'generic_x86',
                      deviceModel: 'Android SDK built for x86',
                      userAttributes: {
                        anonymousId: '5094f5704b9cf2b3',
                      },
                      locale: 'en-US',
                      timezone: 'Asia/Kolkata',
                      time: 1584003903,
                      devMode: true,
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                  userId: '5094f5704b9cf2b3',
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.leanplum.com/api',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  params: {
                    action: 'advance',
                  },
                  body: {
                    JSON: {
                      appId: 'leanplum_application_id',
                      clientKey: 'leanplum_client_key',
                      apiVersion: '1.0.6',
                      userId: '5094f5704b9cf2b3',
                      state: 'MainActivity',
                      deviceId: '5094f5704b9cf2b3',
                      time: 1584003903,
                      devMode: true,
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                  userId: '5094f5704b9cf2b3',
                },
              ],
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  applicationId: 'leanplum_application_id',
                  clientKey: 'leanplum_client_key',
                  isDevelop: true,
                  useNativeSDK: false,
                  sendEvents: false,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'leanplum',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
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
                    type: 'android',
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
                    name: 'Android',
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
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
                },
                event: 'MainActivity',
                integrations: {
                  All: true,
                },
                messageId: 'id2',
                properties: {
                  name: 'MainActivity',
                  automatic: true,
                },
                originalTimestamp: '2020-03-12T09:05:03.421Z',
                type: 'screen',
                sentAt: '2020-03-12T09:05:13.042Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  applicationId: 'leanplum_application_id',
                  clientKey: 'leanplum_client_key__',
                  isDevelop: true,
                  useNativeSDK: false,
                  sendEvents: false,
                },
              },
            },
          ],
          destType: 'leanplum',
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
                  endpoint: 'https://api.leanplum.com/api',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  params: {
                    action: 'start',
                  },
                  body: {
                    JSON: {
                      appId: 'leanplum_application_id',
                      clientKey: 'leanplum_client_key__',
                      apiVersion: '1.0.6',
                      userId: '5094f5704b9cf2b3',
                      deviceId: '5094f5704b9cf2b3',
                      appVersion: '1.0',
                      systemName: 'Android',
                      systemVersion: '8.1.0',
                      deviceName: 'generic_x86',
                      deviceModel: 'Android SDK built for x86',
                      userAttributes: {
                        anonymousId: '5094f5704b9cf2b3',
                      },
                      locale: 'en-US',
                      timezone: 'Asia/Kolkata',
                      time: 1584003903,
                      devMode: true,
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                  userId: '5094f5704b9cf2b3',
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.leanplum.com/api',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  params: {
                    action: 'advance',
                  },
                  body: {
                    JSON: {
                      appId: 'leanplum_application_id',
                      clientKey: 'leanplum_client_key__',
                      apiVersion: '1.0.6',
                      userId: '5094f5704b9cf2b3',
                      state: 'MainActivity',
                      deviceId: '5094f5704b9cf2b3',
                      time: 1584003903,
                      devMode: true,
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                  userId: '5094f5704b9cf2b3',
                },
              ],
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  applicationId: 'leanplum_application_id',
                  clientKey: 'leanplum_client_key__',
                  isDevelop: true,
                  useNativeSDK: false,
                  sendEvents: false,
                },
              },
            },
          ],
        },
      },
    },
  },
];
