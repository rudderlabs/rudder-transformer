import { RouterTestData } from '../../../testTypes';
import { authHeader1, secret1 } from '../maskedSecrets';
import { generateMetadata } from '../../../testUtils';
import { defaultMockFns } from '../mocks';

// Common user agent string
const COMMON_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';

// Common destination configuration and definition
const COMMON_DESTINATION = {
  Config: {
    version: 'v3',
    accountId: 'a2_fsddXXXfsfd',
    hashData: true,
    eventsMapping: [
      {
        from: 'Order Completed',
        to: 'Purchase',
      },
      {
        from: 'Order Completed',
        to: 'AddToWishlist',
      },
    ],
  },
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
    ID: '123',
    Name: 'reddit',
    DisplayName: 'Reddit',
  },
  ID: '',
  Name: '',
  Enabled: false,
  WorkspaceID: '',
  Transformations: [],
};

// Common request structure elements
const COMMON_BODY_STRUCTURE = {
  FORM: {},
  JSON_ARRAY: {},
  XML: {},
};

const COMMON_REQUEST_PROPS = {
  method: 'POST',
  params: {},
  type: 'REST' as const,
  version: '1',
  files: {},
};

// Hashed user data for test scenarios (when hashData: true)
const HASHED_USER_DATA = {
  testUserOne: {
    email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
    external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
    ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
  },
  testUserTwo: {
    email: '47e20278066eb56697354270158cfeeac2390d253fb8eff7ce47d2b17c20c2b5',
    external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
    ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
  },
  testUserThree: {
    email: '58cb9d56bbc45494dfc934e84844db9389097c2d1d03e0880fcd2ab02fd97929',
    external_id: '5e971b31cff99c66aec57b2be82f562b292ae220ba859017df3b40ff4001c804',
    ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
  },
};

// Common product objects
const PRODUCTS = {
  monopoly: { id: '123', name: 'Monopoly' },
  uno: { id: '345', name: 'UNO' },
  monopolyLarge: { id: '123456', name: 'Monopoly' },
  unoLarge: { id: '345678', name: 'UNO' },
};

const v3Data: RouterTestData[] = [
  {
    name: 'reddit',
    description: 'one event is mapped to multiple events',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    id: 'v3-test-1',
    scenario: 'Business',
    successCriteria: 'Should pass the request successfully, with 2 events in one batch',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: {
                    email: 'testone@gmail.com',
                  },
                  userAgent: COMMON_USER_AGENT,
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2025-10-13T09:03:17.562Z',
                event: 'Order Completed',
                userId: 'testuserId1',
                properties: {
                  order_id: '1234',
                  revenue: 15,
                  currency: 'USD',
                  products: [
                    {
                      product_id: '123',
                      name: 'Monopoly',
                      price: 14,
                      quantity: 1,
                    },
                    {
                      product_id: '345',
                      name: 'UNO',
                      price: 3.45,
                      quantity: 2,
                    },
                  ],
                },
              },
              destination: COMMON_DESTINATION,
              metadata: generateMetadata(1),
            },
          ],
          destType: 'reddit',
        },
        method: '',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: {
                body: {
                  ...COMMON_BODY_STRUCTURE,
                  JSON: {
                    data: {
                      events: [
                        {
                          action_source: 'WEBSITE',
                          event_at: 1760346197562,
                          metadata: {
                            item_count: 2,
                            products: [PRODUCTS.monopoly, PRODUCTS.uno],
                            currency: 'USD',
                            value: 15,
                          },
                          type: {
                            tracking_type: 'PURCHASE',
                          },
                          user: {
                            ...HASHED_USER_DATA.testUserOne,
                            user_agent: COMMON_USER_AGENT,
                          },
                        },
                        {
                          action_source: 'WEBSITE',
                          event_at: 1760346197562,
                          metadata: {
                            item_count: 2,
                            products: [PRODUCTS.monopoly, PRODUCTS.uno],
                          },
                          type: { tracking_type: 'ADD_TO_WISHLIST' },
                          user: {
                            ...HASHED_USER_DATA.testUserOne,
                            user_agent: COMMON_USER_AGENT,
                          },
                        },
                      ],
                    },
                  },
                },
                endpoint:
                  'https://ads-api.reddit.com/api/v3/pixels/a2_fsddXXXfsfd/conversion_events',
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                },
                ...COMMON_REQUEST_PROPS,
              },
              destination: COMMON_DESTINATION,
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'reddit',
    description: 'multiple events are mapped to multiple events',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    id: 'v3-test-2',
    scenario: 'Business',
    successCriteria:
      'Should pass the request successfully, with 2 batches of events, respecting the batch size',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: {
                    email: 'testone@gmail.com',
                  },
                  userAgent: COMMON_USER_AGENT,
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2025-10-13T09:03:17.562Z',
                event: 'Order Completed',
                userId: 'testuserId1',
                properties: {
                  order_id: '1234',
                  revenue: 15,
                  currency: 'USD',
                  products: [
                    {
                      product_id: '123',
                      name: 'Monopoly',
                      price: 14,
                      quantity: 1,
                    },
                    {
                      product_id: '345',
                      name: 'UNO',
                      price: 3.45,
                      quantity: 2,
                    },
                  ],
                },
              },
              destination: COMMON_DESTINATION,
              metadata: generateMetadata(1),
            },
            {
              message: {
                context: {
                  traits: {
                    email: 'testtwo@gmail.com',
                  },
                  userAgent: COMMON_USER_AGENT,
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2025-10-13T09:03:17.562Z',
                event: 'Order Completed',
                userId: 'testuserId1',
                properties: {
                  order_id: '12345',
                  revenue: 150,
                  currency: 'USD',
                  products: [
                    {
                      product_id: '123456',
                      name: 'Monopoly',
                      price: 140,
                      quantity: 1,
                    },
                    {
                      product_id: '345678',
                      name: 'UNO',
                      price: 345,
                      quantity: 2,
                    },
                  ],
                },
              },
              destination: COMMON_DESTINATION,
              metadata: generateMetadata(2),
            },
            {
              message: {
                context: {
                  traits: {
                    email: 'testthree@gmail.com',
                  },
                  userAgent: COMMON_USER_AGENT,
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2025-10-13T09:03:17.562Z',
                event: 'Custom Event',
                userId: 'testuserId3',
                properties: {
                  order_id: '12346',
                  revenue: 1500,
                  currency: 'USD',
                },
              },
              destination: COMMON_DESTINATION,
              metadata: generateMetadata(3),
            },
          ],
          destType: 'reddit',
        },
        method: '',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: [
                {
                  body: {
                    ...COMMON_BODY_STRUCTURE,
                    JSON: {
                      data: {
                        events: [
                          {
                            action_source: 'WEBSITE',
                            event_at: 1760346197562,
                            metadata: {
                              item_count: 2,
                              products: [PRODUCTS.monopoly, PRODUCTS.uno],
                              currency: 'USD',
                              value: 15,
                            },
                            type: {
                              tracking_type: 'PURCHASE',
                            },
                            user: {
                              ...HASHED_USER_DATA.testUserOne,
                              user_agent: COMMON_USER_AGENT,
                            },
                          },
                          {
                            action_source: 'WEBSITE',
                            event_at: 1760346197562,
                            metadata: {
                              item_count: 2,
                              products: [PRODUCTS.monopoly, PRODUCTS.uno],
                            },
                            type: {
                              tracking_type: 'ADD_TO_WISHLIST',
                            },
                            user: {
                              ...HASHED_USER_DATA.testUserOne,
                              user_agent: COMMON_USER_AGENT,
                            },
                          },
                          {
                            action_source: 'WEBSITE',
                            event_at: 1760346197562,
                            metadata: {
                              item_count: 2,
                              products: [PRODUCTS.monopolyLarge, PRODUCTS.unoLarge],
                              currency: 'USD',
                              value: 150,
                            },
                            type: {
                              tracking_type: 'PURCHASE',
                            },
                            user: {
                              ...HASHED_USER_DATA.testUserTwo,
                              user_agent: COMMON_USER_AGENT,
                            },
                          },
                        ],
                      },
                    },
                  },
                  endpoint:
                    'https://ads-api.reddit.com/api/v3/pixels/a2_fsddXXXfsfd/conversion_events',
                  headers: {
                    Authorization: 'Bearer commonAccessToken',
                    'Content-Type': 'application/json',
                  },
                  ...COMMON_REQUEST_PROPS,
                },
                {
                  body: {
                    ...COMMON_BODY_STRUCTURE,
                    JSON: {
                      data: {
                        events: [
                          {
                            action_source: 'WEBSITE',
                            event_at: 1760346197562,
                            metadata: {
                              item_count: 2,
                              products: [PRODUCTS.monopolyLarge, PRODUCTS.unoLarge],
                            },
                            type: {
                              tracking_type: 'ADD_TO_WISHLIST',
                            },
                            user: {
                              ...HASHED_USER_DATA.testUserTwo,
                              user_agent: COMMON_USER_AGENT,
                            },
                          },
                          {
                            action_source: 'WEBSITE',
                            event_at: 1760346197562,
                            metadata: {
                              item_count: 1,
                              products: [{}],
                            },
                            type: {
                              custom_event_name: 'Custom Event',
                              tracking_type: 'CUSTOM',
                            },
                            user: {
                              ...HASHED_USER_DATA.testUserThree,
                              user_agent: COMMON_USER_AGENT,
                            },
                          },
                        ],
                      },
                    },
                  },
                  endpoint:
                    'https://ads-api.reddit.com/api/v3/pixels/a2_fsddXXXfsfd/conversion_events',
                  headers: {
                    Authorization: 'Bearer commonAccessToken',
                    'Content-Type': 'application/json',
                  },
                  ...COMMON_REQUEST_PROPS,
                },
              ],
              destination: COMMON_DESTINATION,
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 3,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'reddit',
    description: 'event with test_id should not be batched',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    id: 'v3-test-3',
    scenario: 'Business',
    successCriteria: 'should send the event with test_id as a single event',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: {
                    email: 'testone@gmail.com',
                  },
                  os: { name: 'android' },
                  device: { advertisingId: 'asfds7fdsihf734b34j43f' },
                  userAgent: COMMON_USER_AGENT,
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2025-10-13T09:03:17.562Z',
                event: 'product added to wishlist',
                userId: 'testuserId1',
                properties: {
                  test_id: '123',
                  order_id: '1234',
                  revenue: 15,
                  currency: 'USD',
                  products: [
                    {
                      product_id: '123',
                      name: 'Monopoly',
                      price: 14,
                      quantity: 1,
                    },
                    {
                      product_id: '345',
                      name: 'UNO',
                      price: 3.45,
                      quantity: 2,
                    },
                  ],
                },
              },
              destination: COMMON_DESTINATION,
              metadata: generateMetadata(1),
            },
            {
              message: {
                context: {
                  traits: {
                    email: 'testtwo@gmail.com',
                  },
                  userAgent: COMMON_USER_AGENT,
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2025-10-13T09:03:17.562Z',
                event: 'Order Completed',
                userId: 'testuserId1',
                properties: {
                  order_id: '12345',
                  revenue: 150,
                  currency: 'USD',
                  products: [
                    {
                      product_id: '123456',
                      name: 'Monopoly',
                      price: 140,
                      quantity: 1,
                    },
                    {
                      product_id: '345678',
                      name: 'UNO',
                      price: 345,
                      quantity: 2,
                    },
                  ],
                },
              },
              destination: COMMON_DESTINATION,
              metadata: generateMetadata(2),
            },
          ],
          destType: 'reddit',
        },
        method: '',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: {
                body: {
                  ...COMMON_BODY_STRUCTURE,
                  JSON: {
                    data: {
                      events: [
                        {
                          action_source: 'WEBSITE',
                          event_at: 1760346197562,
                          metadata: {
                            item_count: 2,
                            products: [PRODUCTS.monopoly, PRODUCTS.uno],
                          },
                          type: {
                            tracking_type: 'ADD_TO_WISHLIST',
                          },
                          user: {
                            ...HASHED_USER_DATA.testUserOne,
                            user_agent: COMMON_USER_AGENT,
                            aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
                          },
                        },
                      ],
                      test_id: '123',
                    },
                  },
                },
                endpoint:
                  'https://ads-api.reddit.com/api/v3/pixels/a2_fsddXXXfsfd/conversion_events',
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                },
                ...COMMON_REQUEST_PROPS,
              },
              destination: COMMON_DESTINATION,
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  ...COMMON_BODY_STRUCTURE,
                  JSON: {
                    data: {
                      events: [
                        {
                          action_source: 'WEBSITE',
                          event_at: 1760346197562,
                          metadata: {
                            currency: 'USD',
                            item_count: 2,
                            products: [PRODUCTS.monopolyLarge, PRODUCTS.unoLarge],
                            value: 150,
                          },
                          type: {
                            tracking_type: 'PURCHASE',
                          },
                          user: {
                            ...HASHED_USER_DATA.testUserTwo,
                            user_agent: COMMON_USER_AGENT,
                          },
                        },
                        {
                          action_source: 'WEBSITE',
                          event_at: 1760346197562,
                          metadata: {
                            item_count: 2,
                            products: [PRODUCTS.monopolyLarge, PRODUCTS.unoLarge],
                          },
                          type: {
                            tracking_type: 'ADD_TO_WISHLIST',
                          },
                          user: {
                            ...HASHED_USER_DATA.testUserTwo,
                            user_agent: COMMON_USER_AGENT,
                          },
                        },
                      ],
                    },
                  },
                },
                endpoint:
                  'https://ads-api.reddit.com/api/v3/pixels/a2_fsddXXXfsfd/conversion_events',
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                },
                ...COMMON_REQUEST_PROPS,
              },
              destination: COMMON_DESTINATION,
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];

export const data = [
  {
    name: 'reddit',
    description: 'Track Events',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                type: 'track',
                session_id: '16733896350494',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'Order Completed',
                userId: 'testuserId1',
                properties: {
                  checkout_id: '12345',
                  order_id: '1234',
                  affiliation: 'Apple Store',
                  total: 20,
                  revenue: 15,
                  shipping: 4,
                  tax: 1,
                  discount: 1.5,
                  coupon: 'ImagePro',
                  currency: 'USD',
                  products: [
                    {
                      product_id: '123',
                      sku: 'G-32',
                      name: 'Monopoly',
                      price: 14,
                      quantity: 1,
                      category: 'Games',
                      url: 'https://www.website.com/product/path',
                      image_url: 'https://www.website.com/product/path.jpg',
                    },
                    {
                      product_id: '345',
                      sku: 'F-32',
                      name: 'UNO',
                      price: 3.45,
                      quantity: 2,
                      category: 'Games',
                    },
                  ],
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
                secret: { accessToken: secret1 },
                jobId: 1,
                userId: 'u1',
              },
            },
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'Product List Viewed',
                userId: 'testuserId1',
                properties: {
                  list_id: 'list1',
                  category: "What's New",
                  value: 2600,
                  value_decimal: 26,
                  products: [
                    {
                      product_id: '017c6f5d5cf86a4b22432066',
                      sku: '8732-98',
                      name: 'Just Another Game',
                      price: 22,
                      position: 2,
                      category: 'Games and Entertainment',
                      url: 'https://www.myecommercewebsite.com/product',
                      image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                    },
                    {
                      product_id: '89ac6f5d5cf86a4b64eac145',
                      sku: '1267-01',
                      name: 'Wrestling Trump Cards',
                      price: 4,
                      position: 21,
                      category: 'Card Games',
                    },
                  ],
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
                secret: { accessToken: secret1 },
                jobId: 2,
                userId: 'u1',
              },
            },
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'PRoduct Added    ',
                userId: 'testuserId1',
                properties: {
                  product_id: '622c6f5d5cf86a4c77358033',
                  sku: '8472-998-0112',
                  category: 'Games',
                  name: 'Cones of Dunshire',
                  brand: 'Wyatt Games',
                  variant: 'exapansion pack',
                  price: 49.99,
                  quantity: 5,
                  coupon: 'PREORDER15',
                  position: 1,
                  url: 'https://www.website.com/product/path',
                  image_url: 'https://www.website.com/product/path.webp',
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
                secret: { accessToken: secret1 },
                jobId: 3,
                userId: 'u1',
              },
            },
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                type: 'track',
                session_id: '16733896350494',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'Order Completed',
                userId: 'testuserId1',
                properties: {
                  checkout_id: '12345',
                  order_id: '1234',
                  affiliation: 'Apple Store',
                  total: 20,
                  revenue: 15,
                  shipping: 4,
                  tax: 1,
                  discount: 1.5,
                  coupon: 'ImagePro',
                  currency: 'USD',
                  products: [
                    {
                      product_id: '123',
                      sku: 'G-32',
                      name: 'Monopoly',
                      price: 14,
                      quantity: 1,
                      category: 'Games',
                      url: 'https://www.website.com/product/path',
                      image_url: 'https://www.website.com/product/path.jpg',
                    },
                    {
                      product_id: '345',
                      sku: 'F-32',
                      name: 'UNO',
                      price: 3.45,
                      quantity: 2,
                      category: 'Games',
                    },
                  ],
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
                secret: { accessToken: secret1 },
                jobId: 4,
                userId: 'u1',
                dontBatch: true,
              },
            },
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                type: 'track',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'Product List Viewed',
                userId: 'testuserId1',
                properties: {
                  list_id: 'list1',
                  category: "What's New",
                  value: 2600,
                  value_decimal: 26,
                  products: [
                    {
                      product_id: '017c6f5d5cf86a4b22432066',
                      sku: '8732-98',
                      name: 'Just Another Game',
                      price: 22,
                      position: 2,
                      category: 'Games and Entertainment',
                      url: 'https://www.myecommercewebsite.com/product',
                      image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                    },
                    {
                      product_id: '89ac6f5d5cf86a4b64eac145',
                      sku: '1267-01',
                      name: 'Wrestling Trump Cards',
                      price: 4,
                      position: 21,
                      category: 'Card Games',
                    },
                  ],
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
                secret: { accessToken: secret1 },
                jobId: 5,
                userId: 'u1',
                dontBatch: true,
              },
            },
          ],
          destType: 'reddit',
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
                body: {
                  JSON: {
                    events: [
                      {
                        event_at: '2019-10-14T09:03:17.562Z',
                        event_type: { tracking_type: 'Purchase' },
                        user: {
                          email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                          external_id:
                            '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                          ip_address:
                            'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                          user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                          screen_dimensions: {},
                        },
                        event_metadata: {
                          item_count: 2,
                          currency: 'USD',
                          value: 1500,
                          value_decimal: 15,
                          products: [
                            { id: '123', name: 'Monopoly', category: 'Games' },
                            { id: '345', name: 'UNO', category: 'Games' },
                          ],
                        },
                      },
                      {
                        event_at: '2019-10-14T09:03:17.562Z',
                        event_type: { tracking_type: 'ViewContent' },
                        user: {
                          email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                          external_id:
                            '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                          ip_address:
                            'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                          user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                          screen_dimensions: {},
                        },
                        event_metadata: {
                          products: [
                            {
                              id: '017c6f5d5cf86a4b22432066',
                              name: 'Just Another Game',
                              category: 'Games and Entertainment',
                            },
                            {
                              id: '89ac6f5d5cf86a4b64eac145',
                              name: 'Wrestling Trump Cards',
                              category: 'Card Games',
                            },
                          ],
                        },
                      },
                      {
                        event_at: '2019-10-14T09:03:17.562Z',
                        event_type: { tracking_type: 'AddToCart' },
                        user: {
                          email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                          external_id:
                            '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                          ip_address:
                            'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                          user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                          screen_dimensions: {},
                        },
                        event_metadata: {
                          item_count: 5,
                          value: 24995,
                          value_decimal: 249.95,
                          products: [
                            {
                              id: '622c6f5d5cf86a4c77358033',
                              name: 'Cones of Dunshire',
                              category: 'Games',
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
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  destinationId: 'destId',
                  workspaceId: 'wspId',
                  secret: { accessToken: secret1 },
                  jobId: 1,
                  userId: 'u1',
                },
                {
                  destinationId: 'destId',
                  workspaceId: 'wspId',
                  secret: { accessToken: secret1 },
                  jobId: 2,
                  userId: 'u1',
                },
                {
                  destinationId: 'destId',
                  workspaceId: 'wspId',
                  secret: { accessToken: secret1 },
                  jobId: 3,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    events: [
                      {
                        event_at: '2019-10-14T09:03:17.562Z',
                        event_type: { tracking_type: 'Purchase' },
                        user: {
                          email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                          external_id:
                            '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                          ip_address:
                            'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                          user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                          screen_dimensions: {},
                        },
                        event_metadata: {
                          item_count: 2,
                          currency: 'USD',
                          value: 1500,
                          value_decimal: 15,
                          products: [
                            { id: '123', name: 'Monopoly', category: 'Games' },
                            { id: '345', name: 'UNO', category: 'Games' },
                          ],
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  destinationId: 'destId',
                  workspaceId: 'wspId',
                  secret: { accessToken: secret1 },
                  jobId: 4,
                  userId: 'u1',
                  dontBatch: true,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    events: [
                      {
                        event_at: '2019-10-14T09:03:17.562Z',
                        event_type: { tracking_type: 'ViewContent' },
                        user: {
                          email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                          external_id:
                            '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                          ip_address:
                            'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                          user_agent:
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                          screen_dimensions: {},
                        },
                        event_metadata: {
                          products: [
                            {
                              id: '017c6f5d5cf86a4b22432066',
                              name: 'Just Another Game',
                              category: 'Games and Entertainment',
                            },
                            {
                              id: '89ac6f5d5cf86a4b64eac145',
                              name: 'Wrestling Trump Cards',
                              category: 'Card Games',
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
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  destinationId: 'destId',
                  workspaceId: 'wspId',
                  secret: { accessToken: secret1 },
                  jobId: 5,
                  userId: 'u1',
                  dontBatch: true,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  hashData: true,
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'reddit',
    description: 'Track Events with no event name',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  traits: { email: 'testone@gmail.com' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  ip: '54.100.200.255',
                },
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                type: 'track',
                userId: 'testuserId1',
                properties: {
                  list_id: 'list1',
                  category: "What's New",
                  value: 2600,
                  value_decimal: 26,
                  products: [
                    {
                      product_id: '017c6f5d5cf86a4b22432066',
                      sku: '8732-98',
                      name: 'Just Another Game',
                      price: 22,
                      position: 2,
                      category: 'Games and Entertainment',
                      url: 'https://www.myecommercewebsite.com/product',
                      image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
                    },
                    {
                      product_id: '89ac6f5d5cf86a4b64eac145',
                      sku: '1267-01',
                      name: 'Wrestling Trump Cards',
                      price: 4,
                      position: 21,
                      category: 'Card Games',
                    },
                  ],
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
                secret: { accessToken: secret1 },
                jobId: 1,
                userId: 'u1',
              },
            },
          ],
          destType: 'reddit',
        },
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
                  destinationId: 'destId',
                  workspaceId: 'wspId',
                  secret: { accessToken: secret1 },
                  jobId: 1,
                  userId: 'u1',
                },
              ],
              destination: {
                Config: {
                  accountId: 'a2_fsddXXXfsfd',
                  eventsMapping: [{ from: 'Order Completed', to: 'Purchase' }],
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
              batched: false,
              statusCode: 400,
              error: 'Event is not present. Aborting message.',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'REDDIT',
                module: 'destination',
                implementation: 'cdkV2',
                feature: 'router',
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  ...v3Data,
];
