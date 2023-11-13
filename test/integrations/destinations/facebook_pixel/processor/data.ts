export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2023-10-15'));
};

export const data = [
  {
    name: 'facebook_pixel',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              channel: 'mobile',
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
              timestamp: '2023-10-14T00:00:00.693229+05:30',
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
                removeExternalId: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","zp":"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"},"event_name":"spin_result","event_time":1697221800,"action_source":"app","custom_data":{"additional_bet_index":0,"value":400}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: '    aBc@gmail.com   ',
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
              type: 'group',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: 'Message type group not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  name: 'Test',
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
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error:
              'For identify events, "Advanced Mapping" configuration must be enabled on the RudderStack dashboard',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  name: 'Rudder Test',
                  email: 'abc@gmail.com',
                  firstname: 'Rudder',
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
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","ph":"593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579","ge":"252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111","ln":"532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25","fn":"2c2ccf28d806f6f9a34b67aa874d2113b7ac1444f1a4092541b8b75b84771747","client_ip_address":"0.0.0.0","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"identify","event_time":1697278611,"event_id":"84e26acc-56a5-4835-8233-591137fca468","action_source":"website"}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                traits: {
                  name: 'Rudder Test',
                  email: 'abc@gmail.com',
                  phone: 9000000000,
                  address: {
                    postalCode: 1234,
                  },
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
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '123456',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","ph":"593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579","ge":"252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111","zp":"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4","client_ip_address":"0.0.0.0","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36","fn":"2c2ccf28d806f6f9a34b67aa874d2113b7ac1444f1a4092541b8b75b84771747","ln":"532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25"},"event_name":"identify","event_time":1697278611,"event_id":"84e26acc-56a5-4835-8233-591137fca468","action_source":"website"}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                email: 'abc@gmail.com',
              },
              timestamp: '2023-10-14T15:46:51.693229+05:30',
              type: 'track',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08"},"event_name":"spin_result","event_time":1697278611,"action_source":"other","custom_data":{"additional_bet_index":0,"value":400}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                email: 'abc@gmail.com',
              },
              timestamp: '2023-10-14T15:46:51.693229+05:30',
              type: 'track',
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
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: 'email',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08"},"event_name":"spin_result","event_time":1697278611,"action_source":"other","custom_data":{"additional_bet_index":0,"email":"abc@gmail.com","value":400}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                email: 'abc@gmail.com',
                phone: 9000000000,
              },
              timestamp: '2023-10-14T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: 'phone',
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
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: 'email',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08"},"event_name":"spin_result","event_time":1697278611,"action_source":"other","custom_data":{"additional_bet_index":0,"email":"abc@gmail.com","value":400}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                email: 'abc@gmail.com',
                phone: 9000000000,
              },
              timestamp: '2023-10-14T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: 'phone',
                    blacklistPiiHash: true,
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
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: 'email',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08"},"event_name":"spin_result","event_time":1697278611,"action_source":"other","custom_data":{"additional_bet_index":0,"email":"abc@gmail.com","phone":"593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579","value":400}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              timestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: 'xyz',
                search: 'def',
                title: 'ghi',
                url: 'jkl',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: 'phone',
                    blacklistPiiHash: true,
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
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: 'email',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_ip_address":"0.0.0.0","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Viewed page ApplicationLoaded","event_time":1697278611,"event_source_url":"jkl","event_id":"5e10d13a-bf9a-44bf-b884-43a9e591ea71","action_source":"website","custom_data":{"path":"/abc","referrer":"xyz","search":"def","title":"ghi","url":"jkl"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: 'xyz',
                search: 'def',
                title: 'ghi',
                url: 'jkl',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: 'phone',
                    blacklistPiiHash: true,
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
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: 'email',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_ip_address":"0.0.0.0","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Viewed a page","event_time":1697278611,"event_source_url":"jkl","event_id":"5e10d13a-bf9a-44bf-b884-43a9e591ea71","action_source":"website","custom_data":{"path":"/abc","referrer":"xyz","search":"def","title":"ghi","url":"jkl"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product list viewed',
              properties: {
                phone: 9000000000,
                email: 'abc@gmail.com',
                category: 'cat 1',
                list_id: '1234',
                filters: [
                  {
                    type: 'department',
                    value: 'beauty',
                  },
                  {
                    type: 'price',
                    value: 'under',
                  },
                ],
                sorts: [
                  {
                    type: 'price',
                    value: 'desc',
                  },
                ],
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: 'phone',
                    blacklistPiiHash: true,
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
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: 'email',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"ViewContent","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"phone":"593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579","email":"abc@gmail.com","category":"cat 1","list_id":"1234","filters[0].type":"department","filters[0].value":"beauty","filters[1].type":"price","filters[1].value":"under","sorts[0].type":"price","sorts[0].value":"desc","testDimension":true,"testMetric":true,"content_ids":["cat 1"],"content_type":"product_group","contents":[{"id":"cat 1","quantity":1}],"content_category":"cat 1","value":0,"currency":"USD"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product list viewed',
              properties: {
                phone: 9000000000,
                email: 'abc@gmail.com',
                category: 'cat 1',
                list_id: '1234',
                filters: [
                  {
                    type: 'department',
                    value: 'beauty',
                  },
                  {
                    type: 'price',
                    value: 'under',
                  },
                ],
                sorts: [
                  {
                    type: 'price',
                    value: 'desc',
                  },
                ],
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"ViewContent","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"category":"cat 1","list_id":"1234","filters[0].type":"department","filters[0].value":"beauty","filters[1].type":"price","filters[1].value":"under","sorts[0].type":"price","sorts[0].value":"desc","testDimension":true,"testMetric":true,"content_ids":["cat 1"],"content_type":"product_group","contents":[{"id":"cat 1","quantity":1}],"content_category":"cat 1","value":0,"currency":"USD"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product list viewed',
              properties: {
                email: 'abc@gmail.com',
                quantity: 2,
                category: 'cat 1',
                list_id: '1234',
                contentName: 'nutrition',
                value: 18.9,
                filters: [
                  {
                    type: 'department',
                    value: 'beauty',
                  },
                  {
                    type: 'price',
                    value: 'under',
                  },
                ],
                sorts: [
                  {
                    type: 'price',
                    value: 'desc',
                  },
                ],
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    productDimension: 'My Product Dimension',
                    productMetric: 'My Product Metric',
                    position: 10,
                  },
                  {
                    product_id: '507f1f77bcf86cdef799439011',
                    productDimension: 'My Product Dimension1',
                    productMetric: 'My Product Metric1',
                    position: -10,
                  },
                ],
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"ViewContent","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"quantity":2,"category":"cat 1","list_id":"1234","contentName":"nutrition","value":18.9,"filters[0].type":"department","filters[0].value":"beauty","filters[1].type":"price","filters[1].value":"under","sorts[0].type":"price","sorts[0].value":"desc","products[0].product_id":"507f1f77bcf86cd799439011","products[0].productDimension":"My Product Dimension","products[0].productMetric":"My Product Metric","products[0].position":10,"products[1].product_id":"507f1f77bcf86cdef799439011","products[1].productDimension":"My Product Dimension1","products[1].productMetric":"My Product Metric1","products[1].position":-10,"testDimension":true,"testMetric":true,"content_ids":["507f1f77bcf86cd799439011","507f1f77bcf86cdef799439011"],"content_type":"product","contents":[{"id":"507f1f77bcf86cd799439011","quantity":2},{"id":"507f1f77bcf86cdef799439011","quantity":2}],"content_category":"cat 1","content_name":"nutrition","currency":"USD"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'my product list',
              properties: {
                email: 'abc@gmail.com',
                quantity: 2,
                category: 'cat 1',
                list_id: '1234',
                filters: [
                  {
                    type: 'department',
                    value: 'beauty',
                  },
                  {
                    type: 'price',
                    value: 'under',
                  },
                ],
                sorts: [
                  {
                    type: 'price',
                    value: 'desc',
                  },
                ],
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    productDimension: 'My Product Dimension',
                    productMetric: 'My Product Metric',
                    position: 10,
                  },
                  {
                    product_id: '507f1f77bcf86cdef799439011',
                    productDimension: 'My Product Dimension1',
                    productMetric: 'My Product Metric1',
                    position: -10,
                  },
                ],
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                accessToken: '09876',
                pixelId: 'dummyPixelId',
                removeExternalId: false,
                eventsToEvents: [
                  {
                    from: 'My product list',
                    to: 'ViewContent',
                  },
                ],
                eventCustomProperties: [
                  {
                    eventCustomProperties: 'list_id',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"ViewContent","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"quantity":2,"category":"cat 1","list_id":"1234","filters[0].type":"department","filters[0].value":"beauty","filters[1].type":"price","filters[1].value":"under","sorts[0].type":"price","sorts[0].value":"desc","products[0].product_id":"507f1f77bcf86cd799439011","products[0].productDimension":"My Product Dimension","products[0].productMetric":"My Product Metric","products[0].position":10,"products[1].product_id":"507f1f77bcf86cdef799439011","products[1].productDimension":"My Product Dimension1","products[1].productMetric":"My Product Metric1","products[1].position":-10,"testDimension":true,"testMetric":true,"content_ids":["507f1f77bcf86cd799439011","507f1f77bcf86cdef799439011"],"content_type":"product","contents":[{"id":"507f1f77bcf86cd799439011","quantity":2},{"id":"507f1f77bcf86cdef799439011","quantity":2}],"content_category":"cat 1","value":0,"currency":"USD"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product viewed',
              properties: {
                currency: 'CAD',
                quantity: 1,
                price: 24.75,
                name: 'my product 1',
                category: 'clothing',
                sku: 'p-298',
                testDimension: true,
                testMetric: true,
                position: 4.5,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"ViewContent","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","quantity":1,"price":24.75,"name":"my product 1","category":"clothing","sku":"p-298","testDimension":true,"testMetric":true,"position":4.5,"content_ids":["p-298"],"content_type":"product","content_name":"my product 1","content_category":"clothing","value":24.75,"contents":[{"id":"p-298","quantity":1,"item_price":24.75}]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product added',
              properties: {
                currency: 'CAD',
                quantity: 1,
                value: 24.75,
                category: 'cat 1',
                id: 'p-298',
                testDimension: true,
                testMetric: true,
                position: 4.5,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                accessToken: '09876',
                pixelId: 'dummyPixelId',
                removeExternalId: false,
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
                valueFieldIdentifier: 'properties.value',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"AddToCart","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","quantity":1,"value":24.75,"category":"cat 1","id":"p-298","testDimension":true,"testMetric":true,"position":4.5,"content_ids":["p-298"],"content_type":"product","content_name":"","content_category":"cat 1","contents":[{"id":"p-298","quantity":1}]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'order completed',
              properties: {
                order_id: 'rudderstackorder1',
                total: 99.99,
                revenue: 12.24,
                shipping: 13.99,
                tax: 20.99,
                currency: 'INR',
                contentName: 'all about nutrition',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 3,
                    price: 24.75,
                    name: 'other product',
                    sku: 'p-299',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Purchase","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"order_id":"rudderstackorder1","total":99.99,"revenue":12.24,"shipping":13.99,"tax":20.99,"currency":"INR","contentName":"all about nutrition","products[0].quantity":1,"products[0].price":24.75,"products[0].name":"my product","products[0].sku":"p-298","products[1].quantity":3,"products[1].price":24.75,"products[1].name":"other product","products[1].sku":"p-299","content_ids":["p-298","p-299"],"content_type":"product","value":12.24,"contents":[{"id":"p-298","quantity":1,"item_price":24.75},{"id":"p-299","quantity":3,"item_price":24.75}],"num_items":2,"content_name":"all about nutrition"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'checkout started',
              properties: {
                currency: 'CAD',
                category: 'clothing',
                contentName: 'abc',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product 2',
                    sku: 'p-299',
                  },
                ],
                step: 1,
                paymentMethod: 'Visa',
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                    eventCustomProperties: 'contentName',
                  },
                ],
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"InitiateCheckout","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","category":"clothing","contentName":"abc","products[0].quantity":1,"products[0].price":24.75,"products[0].name":"my product","products[0].sku":"p-298","products[1].quantity":1,"products[1].price":24.75,"products[1].name":"my product 2","products[1].sku":"p-299","step":1,"paymentMethod":"Visa","testDimension":true,"testMetric":true,"content_category":"clothing","content_ids":["p-298","p-299"],"content_type":"product","value":0,"contents":[{"id":"p-298","quantity":1,"item_price":24.75},{"id":"p-299","quantity":1,"item_price":24.75}],"num_items":2}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                dataProcessingOptions: [['LDU'], 1, 1000],
                fbc: 'fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890',
                fbp: 'fb.1.1554763741205.234567890',
                fb_login_id: 'fb_id',
                lead_id: 'lead_id',
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
            destination: {
              Config: {
                limitedDataUSage: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","fbc":"fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890","fbp":"fb.1.1554763741205.234567890","lead_id":"lead_id","fb_login_id":"fb_id"},"event_name":"spin_result","event_time":1697278611,"action_source":"other","data_processing_options":["LDU"],"data_processing_options_country":1,"data_processing_options_state":1000,"custom_data":{"additional_bet_index":0,"value":400}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                dataProcessingOptions: [['LDU'], 1, 1000],
                fbc: 'fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890',
                fbp: 'fb.1.1554763741205.234567890',
                fb_login_id: 'fb_id',
                lead_id: 'lead_id',
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
            destination: {
              Config: {
                limitedDataUSage: false,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","fbc":"fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890","fbp":"fb.1.1554763741205.234567890","lead_id":"lead_id","fb_login_id":"fb_id"},"event_name":"spin_result","event_time":1697278611,"action_source":"other","custom_data":{"additional_bet_index":0,"value":400}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'products searched',
              properties: {
                product_id: 'p-298',
                quantity: 2,
                price: 18.9,
                category: 'health',
                value: 18.9,
                query: 'HDMI cable',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Search","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"product_id":"p-298","quantity":2,"price":18.9,"category":"health","value":18.9,"query":"HDMI cable","content_ids":["p-298"],"content_category":"health","contents":[{"id":"p-298","quantity":2,"item_price":18.9}],"search_string":"HDMI cable","currency":"USD"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'products searched',
              properties: {
                query: 'HDMI cable',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                testDestination: true,
                testEventCode: 'TEST1001',
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Search","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"query":"HDMI cable","content_ids":[],"content_category":"","value":0,"contents":[],"search_string":"HDMI cable","currency":"USD"}}',
                  ],
                  test_event_code: 'TEST1001',
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: 'xyz',
                search: 'def',
                title: 'ghi',
                url: 'jkl',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                standardPageCall: true,
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: 'phone',
                    blacklistPiiHash: true,
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
                    eventCustomProperties: 'url',
                  },
                ],
                valueFieldIdentifier: '',
                advancedMapping: false,
                whitelistPiiProperties: [
                  {
                    whitelistPiiProperties: 'email',
                  },
                ],
              },
              Enabled: true,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_ip_address":"0.0.0.0","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"PageView","event_time":1697278611,"event_source_url":"jkl","event_id":"5e10d13a-bf9a-44bf-b884-43a9e591ea71","action_source":"website","custom_data":{"path":"/abc","referrer":"xyz","search":"def","title":"ghi","url":"jkl"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 24',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              event: 'track page',
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
                pixelId: 'dummyPixelId',
                eventsToEvents: [
                  {
                    from: 'track page',
                    to: 'PageView',
                  },
                ],
                eventCustomProperties: [
                  {
                    eventCustomProperties: 'additional_bet_index',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08"},"event_name":"PageView","event_time":1697278611,"action_source":"other","custom_data":{"revenue":400,"additional_bet_index":0}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'my product list',
              properties: {
                email: 'abc@gmail.com',
                quantity: 2,
                category: 'cat 1',
                list_id: '1234',
                filters: [
                  {
                    type: 'department',
                    value: 'beauty',
                  },
                  {
                    type: 'price',
                    value: 'under',
                  },
                ],
                sorts: [
                  {
                    type: 'price',
                    value: 'desc',
                  },
                ],
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    productDimension: 'My Product Dimension',
                    productMetric: 'My Product Metric',
                    position: 10,
                  },
                  {
                    product_id: '507f1f77bcf86cdef799439011',
                    productDimension: 'My Product Dimension1',
                    productMetric: 'My Product Metric1',
                    position: -10,
                  },
                ],
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                accessToken: '09876',
                pixelId: 'dummyPixelId',
                eventsToEvents: [
                  {
                    from: 'My product list',
                    to: 'Schedule',
                  },
                ],
                eventCustomProperties: [
                  {
                    eventCustomProperties: 'list_id',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Schedule","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"quantity":2,"category":"cat 1","list_id":"1234","filters[0].type":"department","filters[0].value":"beauty","filters[1].type":"price","filters[1].value":"under","sorts[0].type":"price","sorts[0].value":"desc","products[0].product_id":"507f1f77bcf86cd799439011","products[0].productDimension":"My Product Dimension","products[0].productMetric":"My Product Metric","products[0].position":10,"products[1].product_id":"507f1f77bcf86cdef799439011","products[1].productDimension":"My Product Dimension1","products[1].productMetric":"My Product Metric1","products[1].position":-10,"testDimension":true,"testMetric":true}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: "'event' is required",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 27',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product added',
              properties: {
                currency: 'CAD',
                quantity: 1,
                value: '35.753',
                category: 'cat 1',
                id: 'p-298',
                testDimension: true,
                testMetric: true,
                position: 4.5,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
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
                valueFieldIdentifier: 'properties.value',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"AddToCart","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","quantity":1,"value":35.75,"category":"cat 1","id":"p-298","testDimension":true,"testMetric":true,"position":4.5,"content_ids":["p-298"],"content_type":"product","content_name":"","content_category":"cat 1","contents":[{"id":"p-298","quantity":1}]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 28',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product added',
              properties: {
                currency: 'CAD',
                quantity: 1,
                value: '35.7A3',
                category: 'cat 1',
                id: 'p-298',
                testDimension: true,
                testMetric: true,
                position: 4.5,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
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
                valueFieldIdentifier: 'properties.value',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"AddToCart","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","quantity":1,"value":35.7,"category":"cat 1","id":"p-298","testDimension":true,"testMetric":true,"position":4.5,"content_ids":["p-298"],"content_type":"product","content_name":"","content_category":"cat 1","contents":[{"id":"p-298","quantity":1}]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 29',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product added',
              properties: {
                currency: 'CAD',
                quantity: 1,
                value: 'ABC',
                category: 'cat 1',
                id: 'p-298',
                testDimension: true,
                testMetric: true,
                position: 4.5,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
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
                valueFieldIdentifier: 'properties.value',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: 'Revenue could not be converted to number',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 30',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'order completed',
              properties: {
                category: ['clothing', 'fishing'],
                order_id: 'rudderstackorder1',
                total: 99.99,
                revenue: 12.24,
                shipping: 13.99,
                tax: 20.99,
                currency: 'INR',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 3,
                    price: 24.75,
                    name: 'other product',
                    sku: 'p-299',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Purchase","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"category[0]":"clothing","category[1]":"fishing","order_id":"rudderstackorder1","total":99.99,"revenue":12.24,"shipping":13.99,"tax":20.99,"currency":"INR","products[0].quantity":1,"products[0].price":24.75,"products[0].name":"my product","products[0].sku":"p-298","products[1].quantity":3,"products[1].price":24.75,"products[1].name":"other product","products[1].sku":"p-299","content_category":"clothing,fishing","content_ids":["p-298","p-299"],"content_type":"product","value":12.24,"contents":[{"id":"p-298","quantity":1,"item_price":24.75},{"id":"p-299","quantity":3,"item_price":24.75}],"num_items":2}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 31',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'order completed',
              properties: {
                category: 100,
                order_id: 'rudderstackorder1',
                total: 99.99,
                revenue: 12.24,
                shipping: 13.99,
                tax: 20.99,
                currency: 'INR',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 3,
                    price: 24.75,
                    name: 'other product',
                    sku: 'p-299',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Purchase","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"category":100,"order_id":"rudderstackorder1","total":99.99,"revenue":12.24,"shipping":13.99,"tax":20.99,"currency":"INR","products[0].quantity":1,"products[0].price":24.75,"products[0].name":"my product","products[0].sku":"p-298","products[1].quantity":3,"products[1].price":24.75,"products[1].name":"other product","products[1].sku":"p-299","content_category":"100","content_ids":["p-298","p-299"],"content_type":"product","value":12.24,"contents":[{"id":"p-298","quantity":1,"item_price":24.75},{"id":"p-299","quantity":3,"item_price":24.75}],"num_items":2}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 32',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'order completed',
              properties: {
                category: {
                  category1: '1',
                },
                order_id: 'rudderstackorder1',
                total: 99.99,
                revenue: 12.24,
                shipping: 13.99,
                tax: 20.99,
                currency: 'INR',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 3,
                    price: 24.75,
                    name: 'other product',
                    sku: 'p-299',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: "'properties.category' must be either be a string or an array",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 33',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            destination: {
              Config: {
                limitedDataUsage: true,
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: false,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
                  },
                ],
                accessToken: '09876',
                pixelId: 'dummyPixelId',
                eventsToEvents: [
                  {
                    from: 'spin_result',
                    to: 'Schedule',
                  },
                  {
                    to: 'Schedule',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"6dc8118ec743f5f3b758939714193f547f4a674c68757fa80d7c9564dc093b0a","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08"},"event_name":"Schedule","event_time":1697278611,"action_source":"other","custom_data":{"revenue":400,"additional_bet_index":0}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 34',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              timestamp: '2019-08-24T15:46:51.693229+05:30',
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
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
                  },
                ],
                accessToken: '09876',
                pixelId: 'dummyPixelId',
                eventsToEvents: [
                  {
                    from: 'spin_result',
                    to: 'Schedule',
                  },
                  {
                    to: 'Schedule',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error:
              'Events must be sent within seven days of their occurrence or up to one minute in the future.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 35',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              originalTimestamp: '2019-04-16T15:50:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: false,
                  },
                ],
                accessToken: 'validToken',
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
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error:
              'Events must be sent within seven days of their occurrence or up to one minute in the future.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 36',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'products searched',
              properties: {
                query: {
                  key1: 'HDMI cable',
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: "'query' should be in string format only",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 37',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'products searched',
              properties: {
                query: 50,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Search","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"query":50,"content_ids":[],"content_category":"","value":0,"contents":[],"search_string":50,"currency":"USD"}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 38',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  url: 'https://theminimstory.com/collections/summer-of-pearls?utm_source=facebook&utm_medium=paidsocial&utm_campaign=carousel&utm_content=ad1-jul&fbclid=IwAR2SsDcjzd_TLZN-e93kxOeGBYO4pQ3AiyeXSheHW5emDeLw8uTvo6lTMPI',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'checkout started',
              properties: {
                currency: 'CAD',
                category: 'clothing',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product 2',
                    sku: 'p-299',
                  },
                ],
                step: 1,
                paymentMethod: 'Visa',
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36","fbc":"fb.1.1697278611693.IwAR2SsDcjzd_TLZN-e93kxOeGBYO4pQ3AiyeXSheHW5emDeLw8uTvo6lTMPI"},"event_name":"InitiateCheckout","event_time":1697278611,"event_source_url":"https://theminimstory.com/collections/summer-of-pearls?utm_source=facebook&utm_medium=paidsocial&utm_campaign=carousel&utm_content=ad1-jul&fbclid=IwAR2SsDcjzd_TLZN-e93kxOeGBYO4pQ3AiyeXSheHW5emDeLw8uTvo6lTMPI","event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","category":"clothing","products[0].quantity":1,"products[0].price":24.75,"products[0].name":"my product","products[0].sku":"p-298","products[1].quantity":1,"products[1].price":24.75,"products[1].name":"my product 2","products[1].sku":"p-299","step":1,"paymentMethod":"Visa","testDimension":true,"testMetric":true,"content_category":"clothing","content_ids":["p-298","p-299"],"content_type":"product","value":0,"contents":[{"id":"p-298","quantity":1,"item_price":24.75},{"id":"p-299","quantity":1,"item_price":24.75}],"num_items":2}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 39',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  url: 'https://theminimstory.com/collections/summer-of-pearls?utm_source=facebook&utm_medium=paidsocial&utm_campaign=carousel&utm_content=ad1-jul&fbclid=IwAR2SsDcjzd_TLZN-e93kxOeGBYO4pQ3AiyeXSheHW5emDeLw8uTvo6lTMPI',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: {
                name: 'checkout started',
              },
              properties: {
                currency: 'CAD',
                category: 'clothing',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product 2',
                    sku: 'p-299',
                  },
                ],
                step: 1,
                paymentMethod: 'Visa',
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: 'event name should be string',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 40',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                page: {
                  url: 'url in wrong format',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'checkout started',
              properties: {
                currency: 'CAD',
                category: 'clothing',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product 2',
                    sku: 'p-299',
                  },
                ],
                step: 1,
                paymentMethod: 'Visa',
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"InitiateCheckout","event_time":1697278611,"event_source_url":"url in wrong format","event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","category":"clothing","products[0].quantity":1,"products[0].price":24.75,"products[0].name":"my product","products[0].sku":"p-298","products[1].quantity":1,"products[1].price":24.75,"products[1].name":"my product 2","products[1].sku":"p-299","step":1,"paymentMethod":"Visa","testDimension":true,"testMetric":true,"content_category":"clothing","content_ids":["p-298","p-299"],"content_type":"product","value":0,"contents":[{"id":"p-298","quantity":1,"item_price":24.75},{"id":"p-299","quantity":1,"item_price":24.75}],"num_items":2}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 41',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product viewed',
              properties: {
                currency: 'CAD',
                quantity: 1,
                price: 24.75,
                name: 'my product 1',
                category: 'clothing',
                sku: 'p-298',
                testDimension: true,
                testMetric: true,
                position: 4.5,
              },
              integrations: {
                All: true,
                Facebook_Pixel: {
                  contentType: 'sending dedicated content type for this particular payload',
                },
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"ViewContent","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","quantity":1,"price":24.75,"name":"my product 1","category":"clothing","sku":"p-298","testDimension":true,"testMetric":true,"position":4.5,"content_ids":["p-298"],"content_type":"sending dedicated content type for this particular payload","content_name":"my product 1","content_category":"clothing","value":24.75,"contents":[{"id":"p-298","quantity":1,"item_price":24.75}]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 42',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product viewed',
              properties: {
                currency: 'CAD',
                quantity: 1,
                price: 24.75,
                value: 18.9,
                name: 'my product 1',
                category: 'clothing',
                sku: 'p-298',
                testDimension: true,
                testMetric: true,
                position: 4.5,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.value',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"ViewContent","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"currency":"CAD","quantity":1,"price":24.75,"value":18.9,"name":"my product 1","category":"clothing","sku":"p-298","testDimension":true,"testMetric":true,"position":4.5,"content_ids":["p-298"],"content_type":"product","content_name":"my product 1","content_category":"clothing","contents":[{"id":"p-298","quantity":1,"item_price":24.75}]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 43',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'order completed',
              properties: {
                order_id: 'rudderstackorder1',
                total: 99.99,
                revenue: 12.24,
                shipping: 13.99,
                tax: 20.99,
                currency: 'INR',
                contentName: 'all about nutrition',
                products: {
                  quantity: 1,
                  price: 24.75,
                  name: 'my product',
                  sku: 'p-298',
                },
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: "'properties.products' is not sent as an Array<Object>",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 44',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'product list viewed',
              properties: {
                email: 'abc@gmail.com',
                quantity: 2,
                category: 'cat 1',
                list_id: '1234',
                contentName: 'nutrition',
                value: 18.9,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    productDimension: 'My Product Dimension',
                    productMetric: 'My Product Metric',
                    position: 10,
                  },
                  [
                    {
                      product_id: '507f1f77bcf86cdef799439011',
                      productDimension: 'My Product Dimension1',
                      productMetric: 'My Product Metric1',
                      position: -10,
                    },
                  ],
                ],
                testDimension: true,
                testMetric: true,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: "'properties.products[1]' is not an object",
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 45',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'custom',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                pixelId: 'dummyPixelId',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: 'Access token not found. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 46',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'custom',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: 400,
            error: 'Pixel Id not found. Aborting',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'FACEBOOK_PIXEL',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 47',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              jobId: 12,
            },
            destination: {
              secretConfig: {},
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: false,
                  },
                ],
                pixelId: 'dummyPixelId',
                eventsToEvents: [
                  {
                    from: '',
                    to: '',
                  },
                ],
                valueFieldIdentifier: 'properties.price',
                advancedMapping: false,
                whitelistPiiProperties: [],
                limitedDataUSage: false,
                accessToken: 'dummyAccessToken',
                testDestination: false,
                testEventCode: '',
                standardPageCall: false,
                blacklistedEvents: [],
                whitelistedEvents: [],
                eventFilteringOption: 'disable',
                removeExternalId: false,
                useUpdatedMapping: false,
                oneTrustCookieCategories: [],
                useNativeSDK: false,
                eventDelivery: false,
                eventDeliveryTS: 1686748039135,
              },
              liveEventsConfig: {
                eventDelivery: false,
                eventDeliveryTS: 1686748039135,
              },
              id: 'destId1',
              workspaceId: 'wsp2',
              transformations: [],
              isConnectionEnabled: true,
              isProcessorEnabled: true,
              name: 'san-fb_pixel',
              enabled: true,
              deleted: false,
              createdAt: '2023-06-06T13:36:08.579Z',
              updatedAt: '2023-06-14T13:07:19.136Z',
              revisionId: 'revId2',
              secretVersion: 3,
            },
            message: {
              type: 'page',
              sentAt: '2023-10-14T15:46:51.000Z',
              userId: 'user@19',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  version: 'dev-snapshot',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:8888/',
                  path: '/',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:8888/',
                  referrer: 'http://127.0.0.1:8888/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:8888',
                  initial_referring_domain: '',
                },
                locale: 'en-GB',
                screen: {
                  width: 1728,
                  height: 1117,
                  density: 2,
                  innerWidth: 547,
                  innerHeight: 915,
                },
                traits: {
                  name: false,
                  source: 'rudderstack',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: 'dev-snapshot',
                },
                campaign: {},
                sessionId: 1687769234506,
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
              },
              rudderId: '6bbfd003-c074-4ee9-8674-c132ded9ff04',
              timestamp: '2023-10-14T15:46:51.000Z',
              properties: {
                url: 'http://127.0.0.1:8888/',
                path: '/',
                title: 'Document',
                search: '',
                tab_url: 'http://127.0.0.1:8888/',
                referrer: 'http://127.0.0.1:8888/',
                initial_referrer: '$direct',
                referring_domain: '127.0.0.1:8888',
                initial_referring_domain: '',
              },
              receivedAt: '2023-10-14T15:46:51.000Z',
              request_ip: '49.206.54.243',
              anonymousId: '700ab220-faad-4cdf-8484-63e4c6bce6fe',
              integrations: {
                All: true,
              },
              originalTimestamp: '2023-10-14T15:46:51.000Z',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=dummyAccessToken',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"72fd46c9ecb386f6747664a3e1d524294a3d7a2c8ae4aeb22b1e578b75093635","client_ip_address":"49.206.54.243","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"},"event_name":"PageView","event_time":1697298411,"event_source_url":"http://127.0.0.1:8888/","action_source":"website","custom_data":{"url":"http://127.0.0.1:8888/","path":"/","title":"Document","search":"","tab_url":"http://127.0.0.1:8888/","referrer":"http://127.0.0.1:8888/","initial_referrer":"$direct","referring_domain":"127.0.0.1:8888","initial_referring_domain":""}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 12,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 48',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  email: 'test@rudderstack.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'order completed',
              properties: {
                category: ['clothing', 'fishing'],
                order_id: 'rudderstackorder1',
                total: 99.99,
                revenue: 12.24,
                shipping: 13.99,
                tax: 20.99,
                currency: 'INR',
                products: [
                  {
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                    delivery_category: 'home_delivery',
                  },
                  {
                    quantity: 3,
                    price: 24.75,
                    name: 'other product',
                    sku: 'p-299',
                    delivery_category: 'home_delivery',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                blacklistPiiProperties: [
                  {
                    blacklistPiiProperties: '',
                    blacklistPiiHash: true,
                  },
                ],
                categoryToContent: [
                  {
                    from: 'clothing',
                    to: 'product',
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
                valueFieldIdentifier: 'properties.price',
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5","em":"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"},"event_name":"Purchase","event_time":1697278611,"event_id":"ec5481b6-a926-4d2e-b293-0b3a77c4d3be","action_source":"website","custom_data":{"category[0]":"clothing","category[1]":"fishing","order_id":"rudderstackorder1","total":99.99,"revenue":12.24,"shipping":13.99,"tax":20.99,"currency":"INR","products[0].quantity":1,"products[0].price":24.75,"products[0].name":"my product","products[0].sku":"p-298","products[0].delivery_category":"home_delivery","products[1].quantity":3,"products[1].price":24.75,"products[1].name":"other product","products[1].sku":"p-299","products[1].delivery_category":"home_delivery","content_category":"clothing,fishing","content_ids":["p-298","p-299"],"content_type":"product","value":12.24,"contents":[{"id":"p-298","quantity":1,"item_price":24.75,"delivery_category":"home_delivery"},{"id":"p-299","quantity":3,"item_price":24.75,"delivery_category":"home_delivery"}],"num_items":2}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 49',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              channel: 'mobile',
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
                content_ids: ['prod1', 'prod2'],
              },
              timestamp: '2023-10-14T00:00:00.693229+05:30',
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
                removeExternalId: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","zp":"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"},"event_name":"spin_result","event_time":1697221800,"action_source":"app","custom_data":{"additional_bet_index":0,"value":400,"content_ids":["prod1","prod2"]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 50',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              channel: 'mobile',
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
                contents: [
                  {
                    id: 'prod1',
                    quantity: 5,
                    item_price: 55,
                  },
                ],
              },
              timestamp: '2023-10-14T00:00:00.693229+05:30',
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
                removeExternalId: true,
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/dummyPixelId/events?access_token=09876',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","zp":"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"},"event_name":"spin_result","event_time":1697221800,"action_source":"app","custom_data":{"additional_bet_index":0,"value":400,"contents":[{"id":"prod1","quantity":5,"item_price":55}]}}',
                  ],
                },
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
].map((d) => ({ ...d, mockFns }));
