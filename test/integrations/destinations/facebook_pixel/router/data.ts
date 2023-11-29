import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';

export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2023-10-15'));
};

export const data = [
  {
    name: 'facebook_pixel',
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
                anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                destination_props: {
                  Fb: {
                    app_id: 'RudderFbApp',
                  },
                },
                context: {
                  device: {
                    id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                    manufacturer: 'Xiaomi',
                    model: 'Redmi 6',
                    name: 'xiaomi',
                  },
                  network: {
                    carrier: 'Banglalink',
                  },
                  os: {
                    name: 'android',
                    version: '8.1.0',
                  },
                  screen: {
                    height: '100',
                    density: 50,
                  },
                  traits: {
                    email: 'abc@gmail.com',
                    anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  },
                },
                event: 'spin_result',
                integrations: {
                  All: true,
                },
                message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                properties: {
                  revenue: 400,
                  additional_bet_index: 0,
                },
                timestamp: '2023-10-14T15:46:51.693229+05:30',
                type: 'track',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  limitedDataUsage: true,
                  blacklistPiiProperties: [
                    {
                      blacklistPiiProperties: '',
                      blacklistPiiHash: false,
                    },
                  ],
                  removeExternalId: true,
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
                  advancedMapping: false,
                  whitelistPiiProperties: [
                    {
                      whitelistPiiProperties: '',
                    },
                  ],
                },
                Enabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    name: 'Rudder Test',
                    email: 'abc@gmail.com',
                    firstname: 'Test',
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
                },
                properties: {
                  plan: 'standard plan',
                  name: 'rudder test',
                },
                type: 'identify',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                originalTimestamp: '2023-10-14T00:00:00.693229+05:30',
                anonymousId: '00000000000000000000000000',
                userId: '123456',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
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
              },
            },
          ],
          destType: 'facebook_pixel',
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
                endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
                headers: {},
                params: {},
                body: {
                  JSON: {},
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    data: [
                      '{"user_data":{"em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08"},"event_name":"spin_result","event_time":1697278611,"action_source":"other","custom_data":{"additional_bet_index":0,"value":400}}',
                    ],
                  },
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  limitedDataUsage: true,
                  blacklistPiiProperties: [
                    {
                      blacklistPiiProperties: '',
                      blacklistPiiHash: false,
                    },
                  ],
                  removeExternalId: true,
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
                  advancedMapping: false,
                  whitelistPiiProperties: [
                    {
                      whitelistPiiProperties: '',
                    },
                  ],
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
                headers: {},
                params: {},
                body: {
                  JSON: {},
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    data: [
                      '{"user_data":{"external_id":"8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","ph":"593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579","ge":"252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111","ln":"532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25","fn":"2c2ccf28d806f6f9a34b67aa874d2113b7ac1444f1a4092541b8b75b84771747","client_ip_address":"0.0.0.0","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"identify","event_time":1697221800,"event_id":"84e26acc-56a5-4835-8233-591137fca468","action_source":"website"}',
                    ],
                  },
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
              },
            },
          ],
        },
      },
    },
  },
].map((d) => ({ ...d, mockFns }));
