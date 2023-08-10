export const data = [
  {
    name: 'trengo',
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
                anonymousId: 'anon_id_success',
                channel: 'mobile',
                context: {
                  app: {
                    build: '1',
                    name: 'TestAppName',
                    namespace: 'com.android.sample',
                    version: '1.0',
                  },
                  device: {
                    id: 'anon_id_success',
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
                    anonymousId: 'anon_id_success',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
                },
                event: 'Product Purchased',
                integrations: {
                  All: true,
                },
                messageId: 'id1',
                properties: {
                  name: 'Test Product',
                  phone: '9830311521',
                },
                originalTimestamp: '2020-12-17T21:00:59.176Z',
                type: 'track',
                sentAt: '2020-03-12T09:05:03.421Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiToken: 'trengo_integration_test_api_token',
                  channelId: 'trengo_phone_channel',
                  channelIdentifier: 'phone',
                  enableDedup: true,
                  eventTemplateMap: [
                    {
                      from: 'Product Purchased',
                      to: '{{event}} from Rudderstack',
                    },
                    {
                      from: 'checkedOut',
                      to: 'Total cart value {{value}} shipped',
                    },
                    {
                      from: 'Order Completed',
                      to: 'Completed Order',
                    },
                    {
                      from: 'Stress Test',
                    },
                    {
                      from: 'Stress test2',
                      to: '',
                    },
                    {
                      from: 'Stress test3',
                      to: '{event} Stress test',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Trengo',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  config: {
                    destConfig: {
                      defaultConfig: [
                        'apiToken',
                        'channelId',
                        'channelIdentifier',
                        'enableDedup',
                        'eventTemplateMap',
                      ],
                    },
                    secretKeys: ['apiToken'],
                    excludeKeys: [],
                    includeKeys: [],
                    routerTransform: true,
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'TRENGO',
                  displayName: 'Trengo',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
          destType: 'trengo',
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
                endpoint: 'https://app.trengo.com/api/v2/tickets',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: 'Bearer trengo_integration_test_api_token',
                },
                params: {},
                body: {
                  JSON: {
                    contact_id: 90002431001,
                    channel_id: 'trengo_phone_channel',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiToken: 'trengo_integration_test_api_token',
                  channelId: 'trengo_phone_channel',
                  channelIdentifier: 'phone',
                  enableDedup: true,
                  eventTemplateMap: [
                    {
                      from: 'Product Purchased',
                      to: '{{event}} from Rudderstack',
                    },
                    {
                      from: 'checkedOut',
                      to: 'Total cart value {{value}} shipped',
                    },
                    {
                      from: 'Order Completed',
                      to: 'Completed Order',
                    },
                    {
                      from: 'Stress Test',
                    },
                    {
                      from: 'Stress test2',
                      to: '',
                    },
                    {
                      from: 'Stress test3',
                      to: '{event} Stress test',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Trengo',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  config: {
                    destConfig: {
                      defaultConfig: [
                        'apiToken',
                        'channelId',
                        'channelIdentifier',
                        'enableDedup',
                        'eventTemplateMap',
                      ],
                    },
                    secretKeys: ['apiToken'],
                    excludeKeys: [],
                    includeKeys: [],
                    routerTransform: true,
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'TRENGO',
                  displayName: 'Trengo',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'trengo',
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
                userId: 'randomUserId',
                type: 'identify',
                context: {
                  traits: {
                    name: 'Jimothy Halpert',
                    email: 'jimbo@dunmiff.com',
                  },
                  ip: '14.5.67.21',
                  app: {
                    build: '1',
                    name: 'RudderAndroidClient',
                    namespace: 'com.rudderstack.demo.android',
                    version: '1.0',
                  },
                  device: {
                    id: '7e32188a4dab669f',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'android',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '0.1.4',
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
                    version: '9',
                  },
                  screen: {
                    density: 420,
                    height: 1794,
                    width: 1080,
                  },
                  timezone: 'Asia/Kolkata',
                },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiToken: 'trengo_integration_test_api_token',
                  channelId: 'trengo_email_channel',
                  channelIdentifier: 'email',
                  enableDedup: true,
                  eventTemplateMap: [
                    {
                      from: 'Product Purchased',
                      to: '{{event}} from Rudderstack',
                    },
                    {
                      from: 'checkedOut',
                      to: 'Total cart value {{value}} shipped',
                    },
                    {
                      from: 'Order Completed',
                      to: 'Completed Order',
                    },
                    {
                      from: 'Stress Test',
                    },
                    {
                      from: 'Stress test2',
                      to: '',
                    },
                    {
                      from: 'Stress test3',
                      to: '{event} Stress test',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Trengo',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  config: {
                    destConfig: {
                      defaultConfig: [
                        'apiToken',
                        'channelId',
                        'channelIdentifier',
                        'enableDedup',
                        'eventTemplateMap',
                      ],
                    },
                    secretKeys: ['apiToken'],
                    excludeKeys: [],
                    includeKeys: [],
                    routerTransform: true,
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'TRENGO',
                  displayName: 'Trengo',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
          destType: 'trengo',
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
                endpoint: 'https://app.trengo.com/api/v2/channels/trengo_email_channel/contacts',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: 'Bearer trengo_integration_test_api_token',
                },
                params: {},
                body: {
                  JSON: {
                    name: 'Jimothy Halpert',
                    identifier: 'jimbo@dunmiff.com',
                    channel_id: 'trengo_email_channel',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiToken: 'trengo_integration_test_api_token',
                  channelId: 'trengo_email_channel',
                  channelIdentifier: 'email',
                  enableDedup: true,
                  eventTemplateMap: [
                    {
                      from: 'Product Purchased',
                      to: '{{event}} from Rudderstack',
                    },
                    {
                      from: 'checkedOut',
                      to: 'Total cart value {{value}} shipped',
                    },
                    {
                      from: 'Order Completed',
                      to: 'Completed Order',
                    },
                    {
                      from: 'Stress Test',
                    },
                    {
                      from: 'Stress test2',
                      to: '',
                    },
                    {
                      from: 'Stress test3',
                      to: '{event} Stress test',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Trengo',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  config: {
                    destConfig: {
                      defaultConfig: [
                        'apiToken',
                        'channelId',
                        'channelIdentifier',
                        'enableDedup',
                        'eventTemplateMap',
                      ],
                    },
                    secretKeys: ['apiToken'],
                    excludeKeys: [],
                    includeKeys: [],
                    routerTransform: true,
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'TRENGO',
                  displayName: 'Trengo',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
];
