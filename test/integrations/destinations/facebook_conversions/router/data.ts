import { defaultMockFns } from '../mocks';
export const data = [
  {
    name: 'facebook_conversions',
    description: 'Successfull Remove Group Call ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                jobId: 1,
              },
              message: {
                anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                channel: 'web',
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
                    email: '    aBc@gmail.com   ',
                    address: {
                      zip: 1234,
                    },
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
                timestamp: '2023-11-12T15:46:51.693229+05:30',
                type: 'track',
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
                  accessToken: '09876',
                  datasetId: 'dummyID',
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
                  removeExternalId: true,
                  whitelistPiiProperties: [
                    {
                      whitelistPiiProperties: '',
                    },
                  ],
                  actionSource: 'website',
                },
                Enabled: true,
              },
            },
            {
              metadata: {
                jobId: 2,
              },
              message: {
                anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                channel: 'web',
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
                    email: '    aBc@gmail.com   ',
                    address: {
                      zip: 1234,
                    },
                    anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  },
                },
                event: 'products searched',
                integrations: {
                  All: true,
                },
                message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                properties: {
                  revenue: 400,
                  additional_bet_index: 0,
                },
                timestamp: '2023-11-12T15:46:51.693229+05:30',
                type: 'track',
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
                  accessToken: '09876',
                  datasetId: 'dummyID',
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
                  removeExternalId: true,
                  whitelistPiiProperties: [
                    {
                      whitelistPiiProperties: '',
                    },
                  ],
                  actionSource: 'website',
                },
                Enabled: true,
              },
            },
          ],
          destType: 'facebook_conversions',
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
                endpoint: 'https://graph.facebook.com/v18.0/dummyID/events?access_token=09876',
                headers: {},
                params: {},
                body: {
                  JSON: {},
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    data: [
                      '{"user_data":{"em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","zp":"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"},"event_name":"spin_result","event_time":1699784211,"action_source":"website","custom_data":{"revenue":400,"additional_bet_index":0,"value":400,"currency":"USD"}}',
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
                  accessToken: '09876',
                  datasetId: 'dummyID',
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
                  removeExternalId: true,
                  whitelistPiiProperties: [
                    {
                      whitelistPiiProperties: '',
                    },
                  ],
                  actionSource: 'website',
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://graph.facebook.com/v18.0/dummyID/events?access_token=09876',
                headers: {},
                params: {},
                body: {
                  JSON: {},
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    data: [
                      '{"user_data":{"em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","zp":"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"},"event_name":"Search","event_time":1699784211,"action_source":"website","custom_data":{"revenue":400,"additional_bet_index":0,"content_ids":[],"contents":[],"content_type":"product","currency":"USD","value":400}}',
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
                  limitedDataUsage: true,
                  blacklistPiiProperties: [
                    {
                      blacklistPiiProperties: '',
                      blacklistPiiHash: false,
                    },
                  ],
                  accessToken: '09876',
                  datasetId: 'dummyID',
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
                  removeExternalId: true,
                  whitelistPiiProperties: [
                    {
                      whitelistPiiProperties: '',
                    },
                  ],
                  actionSource: 'website',
                },
                Enabled: true,
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
