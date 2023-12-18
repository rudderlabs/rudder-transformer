export const data = [
  {
    destType: 'pinterest_tag',
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
                type: 'track',
                event: 'ABC Searched',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  optOutType: 'LDP',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 1,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'track',
                event: 'Order completed',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 2,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'track',
                event: 'product added',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  product_id: '123',
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 3,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'track',
                event: 'Product List Filtered',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 4,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'Identify',
                event: 'User Signup',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 5,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'track',
                event: 'User Created',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 6,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                version: '1',
                statusCode: 200,
                type: 'REST',
                method: 'POST',
                endpoint: 'https://ct.pinterest.com/events/v3',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    action_source: 'web',
                    event_name: 'WatchVideo',
                    event_time: 1597383030,
                    event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                    app_id: '429047995',
                    advertiser_id: '429047995',
                    user_data: {
                      em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                      ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                      ln: ['bdfdee6414a89d72bfbf5ee90b1f85924467bae1e3980d83c2cd348dc31d5819'],
                      fn: ['ee5db3fe0253b651aca3676692e0c59b25909304f5c51d223a02a215d104144b'],
                      ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                      st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                      zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                      country: ['582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf'],
                      hashed_maids: [
                        '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                      ],
                      client_user_agent: 'chrome',
                    },
                    custom_data: {
                      currency: 'USD',
                      value: '27.5',
                      order_id: '50314b8e9bcf000000000000',
                      num_items: 3,
                      content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                      contents: [
                        {
                          quantity: 1,
                          item_price: '19',
                        },
                        {
                          quantity: 2,
                          item_price: '3',
                        },
                      ],
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 7,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
          destType: 'pinterest_tag',
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
                endpoint: 'https://ct.pinterest.com/events/v3',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    data: [
                      {
                        event_name: 'watch_video',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        advertiser_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          opt_out_type: 'LDP',
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'signup',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        advertiser_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          opt_out_type: 'LDP',
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'checkout',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        advertiser_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'add_to_cart',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        advertiser_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 2,
                          content_ids: ['123'],
                          contents: [
                            {
                              quantity: 2,
                              item_price: '25',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'search',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        advertiser_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'signup',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        advertiser_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        action_source: 'web',
                        event_name: 'WatchVideo',
                        event_time: 1597383030,
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        advertiser_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['bdfdee6414a89d72bfbf5ee90b1f85924467bae1e3980d83c2cd348dc31d5819'],
                          fn: ['ee5db3fe0253b651aca3676692e0c59b25909304f5c51d223a02a215d104144b'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 1,
                },
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 2,
                },
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 3,
                },
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 4,
                },
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 6,
                },
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 7,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              metadata: [
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 5,
                },
              ],
              statTags: {
                destType: 'PINTEREST_TAG',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              batched: false,
              statusCode: 400,
              error: 'message type identify is not supported',
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
  {
    destType: 'pinterest_tag',
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
                type: 'track',
                event: 'ABC Searched',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  optOutType: 'LDP',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 8,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  apiVersion: 'newApi',
                  adAccountId: 'accountId123',
                  conversionToken: 'conversionToken123',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'track',
                event: 'Order completed',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 9,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  apiVersion: 'newApi',
                  adAccountId: 'accountId123',
                  conversionToken: 'conversionToken123',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                type: 'track',
                event: 'Test',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 10,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  apiVersion: 'newApi',
                  adAccountId: 'accountId123',
                  conversionToken: 'conversionToken123',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  sendAsCustomEvent: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
          destType: 'pinterest_tag',
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
                endpoint: 'https://api.pinterest.com/v5/ad_accounts/accountId123/events',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer conversionToken123',
                },
                params: {},
                body: {
                  JSON: {
                    data: [
                      {
                        event_name: 'watch_video',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          opt_out_type: 'LDP',
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'signup',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          opt_out_type: 'LDP',
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'checkout',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                      {
                        event_name: 'custom',
                        event_time: 1597383030,
                        action_source: 'web',
                        event_id: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        app_id: '429047995',
                        user_data: {
                          em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
                          ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
                          ln: ['dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251'],
                          fn: ['9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'],
                          ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
                          st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
                          zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
                          country: [
                            '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
                          ],
                          hashed_maids: [
                            '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
                          ],
                          client_user_agent: 'chrome',
                        },
                        custom_data: {
                          currency: 'USD',
                          value: '27.5',
                          order_id: '50314b8e9bcf000000000000',
                          num_items: 3,
                          content_ids: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                          contents: [
                            {
                              quantity: 1,
                              item_price: '19',
                            },
                            {
                              quantity: 2,
                              item_price: '3',
                            },
                          ],
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 8,
                },
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 9,
                },
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 10,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  apiVersion: 'newApi',
                  adAccountId: 'accountId123',
                  conversionToken: 'conversionToken123',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'WatchVideo',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
  {
    destType: 'pinterest_tag',
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
                type: 'Identify',
                event: 'User Signup',
                sentAt: '2020-08-14T05:30:30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    ge: 'male',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2020-08-14T05:30:30.118Z',
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  products: [
                    {
                      sku: '45790-32',
                      url: 'https://www.example.com/product/path',
                      name: 'Monopoly: 3rd Edition',
                      price: 19,
                      category: 'Games',
                      quantity: 1,
                      image_url: 'https:///www.example.com/product/path.jpg',
                      product_id: '507f1f77bcf86cd799439011',
                    },
                    {
                      sku: '46493-32',
                      name: 'Uno Card Game',
                      price: 3,
                      category: 'Games',
                      quantity: 2,
                      product_id: '505bd76785ebb509fc183733',
                    },
                  ],
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                jobId: 5,
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'Watch Video',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
          destType: 'pinterest_tag',
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
              metadata: [
                {
                  destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                  jobId: 5,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'message type identify is not supported',
              statTags: {
                destType: 'PINTEREST_TAG',
                implementation: 'cdkV2',
                feature: 'router',
                module: 'destination',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
              },
              destination: {
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'PINTEREST_TAG',
                Config: {
                  sendAsTestEvent: false,
                  tagId: '123456789',
                  advertiserId: '429047995',
                  appId: '429047995',
                  sendingUnHashedData: true,
                  enableDeduplication: true,
                  deduplicationKey: 'messageId',
                  enhancedMatch: true,
                  customProperties: [
                    {
                      properties: 'presentclass',
                    },
                    {
                      properties: 'presentgrade',
                    },
                  ],
                  eventsMapping: [
                    {
                      from: 'ABC Searched',
                      to: 'Watch Video',
                    },
                    {
                      from: 'ABC Searched',
                      to: 'Signup',
                    },
                    {
                      from: 'User Signup',
                      to: 'Signup',
                    },
                    {
                      from: 'User Created',
                      to: 'Signup',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
];
