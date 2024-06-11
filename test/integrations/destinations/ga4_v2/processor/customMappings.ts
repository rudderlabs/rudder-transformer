import { defaultMockFns } from '../mocks';

const traits = {
  firstName: 'John',
  lastName: 'Gomes',
  city: 'London',
  state: 'UK',
  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
  group: 'test group',
};

const device = {
  adTrackingEnabled: 'true',
  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
  manufacturer: 'Google',
  model: 'AOSP on IA Emulator',
  name: 'generic_x86_arm',
  type: 'ios',
  attTrackingStatus: 3,
};

const properties = {
  list_id: 'random_list_id',
  category: 'random_category',
  storePrice: 456,
  prices: [
    {
      id: 'store-price',
      value: 456,
    },
    {
      id: 'desk-price',
      value: 567,
    },
  ],
  products: [
    {
      product_id: 883213,
      name: 'Salt',
      coupon: 'HHH',
      price: 100,
      position: 1,
      quantity: 10,
      affiliation: 'NADA',
      currency: 'INR',
      discount: '2%',
      item_category3: 'grocery',
    },
    {
      product_id: 213123,
      name: 'Sugar',
      coupon: 'III',
      price: 200,
      position: 2,
      quantity: 20,
      affiliation: 'ADNA',
      currency: 'INR',
      discount: '5%',
      item_category2: 'regulars',
      item_category3: 'grocery',
      some_data: 'someValue',
    },
  ],
};

const integrations = {
  GA4: {
    consents: {
      ad_personalization: 'GRANTED',
      ad_user_data: 'DENIED',
    },
  },
};

const eventsMapping = [
  {
    rsEventName: 'Product List Viewed',
    destEventName: 'view_item_list',
    eventProperties: [
      {
        to: '$.client_id',
        from: '$.context.traits.anonymousId',
      },
      {
        to: '$.events[0].params.items[*].name',
        from: '$.properties.products[*].name',
      },
      {
        to: '$.events[0].params.prices',
        from: '$.properties.storePrice',
      },
      {
        to: '$.events[0].params.items[*].id',
        from: '$.properties.products[*].product_id',
      },
      {
        to: '$.events[0].params.items[*].key',
        from: '$.properties.products[*].some_data',
      },
      {
        to: '$.events[0].params.items[*].list_id',
        from: '$.properties.list_id',
      },
      {
        to: '$.userProperties.firstName.value',
        from: '$.context.traits.firstName',
      },
      {
        to: '$.userProperties.lastName.value',
        from: '$.context.traits.lastName',
      },
    ],
  },
  {
    rsEventName: 'Product Added',
    destEventName: 'add_to_cart',
    eventProperties: [
      {
        to: '$.client_id',
        from: '$.context.traits.anonymousId',
      },
      {
        to: '$.events[0].params.items[*].name',
        from: '$.properties.products[*].name',
      },
      {
        to: '$.events[0].params.prices',
        from: '$.properties.storePrice',
      },
      {
        to: '$.events[0].params.items[*].id',
        from: '$.properties.products[*].product_id',
      },
      {
        to: '$.events[0].params.items[*].key',
        from: '$.properties.products[*].some_data',
      },
      {
        to: '$.events[0].params.items[*].list_id',
        from: '$.properties.list_id',
      },
      {
        to: '$.userProperties.firstName.value',
        from: '$.context.traits.firstName',
      },
      {
        to: '$.userProperties.lastName.value',
        from: '$.context.traits.lastName',
      },
    ],
  },
  {
    rsEventName: 'Product Added',
    destEventName: 'checkout_started',
    eventProperties: [
      {
        to: '$.client_id',
        from: '$.context.traits.anonymousId',
      },
      {
        to: '$.events[0].params.items[*].name',
        from: '$.properties.products[*].name',
      },
      {
        to: '$.events[0].params.prices',
        from: '$.properties.storePrice',
      },
      {
        to: '$.events[0].params.items[*].id',
        from: '$.properties.products[*].product_id',
      },
      {
        to: '$.events[0].params.items[*].key',
        from: '$.properties.products[*].some_data',
      },
      {
        to: '$.events[0].params.items[*].list_id',
        from: '$.properties.list_id',
      },
      {
        to: '$.userProperties.firstName.value',
        from: '$.context.traits.firstName',
      },
      {
        to: '$.userProperties.lastName.value',
        from: '$.context.traits.lastName',
      },
    ],
  },
  {
    rsEventName: '$group',
    destEventName: 'join_group',
    eventProperties: [
      {
        to: '$.client_id',
        from: '$.context.traits.anonymousId',
      },
      {
        to: '$.events[0].params.group_id',
        from: '$.context.traits.group_id',
      },
      {
        to: '$.userProperties.firstName.value',
        from: '$.context.traits.firstName',
      },
      {
        to: '$.userProperties.lastName.value',
        from: '$.context.traits.lastName',
      },
    ],
  },
];

const destination = {
  Config: {
    apiSecret: 'dummyApiSecret',
    measurementId: 'G-T40PE6KET4',
    firebaseAppId: '',
    blockPageViewEvent: false,
    typesOfClient: 'gtag',
    extendPageViewParams: false,
    sendUserId: false,
    eventFilteringOption: 'disable',
    eventsMapping,
  },
};
export const customMappingTestCases = [
  {
    name: 'ga4_v2',
    id: 'ga4_custom_mapping_test_0',
    description: 'Custom Mapping Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Product List Viewed',
              userId: 'root_user',
              anonymousId: 'root_anonId',
              context: {
                device,
                traits,
              },
              properties,
              originalTimestamp: '2022-04-28T00:23:09.544Z',
              integrations,
            },
            destination,
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
              endpoint: 'https://www.google-analytics.com/mp/collect',
              headers: {
                HOST: 'www.google-analytics.com',
                'Content-Type': 'application/json',
              },
              params: {
                api_secret: 'dummyApiSecret',
                measurement_id: 'G-T40PE6KET4',
              },
              body: {
                JSON: {
                  user_id: 'root_user',
                  timestamp_micros: 1651105389000000,
                  non_personalized_ads: false,
                  client_id: 'root_anonId',
                  events: [
                    {
                      name: 'view_item_list',
                      params: {
                        items: [
                          {
                            name: 'Salt',
                            id: 883213,
                            list_id: 'random_list_id',
                          },
                          {
                            id: 213123,
                            key: 'someValue',
                            list_id: 'random_list_id',
                            name: 'Sugar',
                          },
                        ],
                        prices: 456,
                      },
                    },
                  ],
                  userProperties: {
                    firstName: {
                      value: 'John',
                    },
                    lastName: {
                      value: 'Gomes',
                    },
                  },
                  consent: {
                    ad_user_data: 'DENIED',
                    ad_personalization: 'GRANTED',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'ga4_v2',
    id: 'ga4_custom_mapping_test_1',
    description: 'Custom Mapping Test for multiplexing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Product Added',
              userId: 'root_user',
              anonymousId: 'root_anonId',
              context: {
                device,
                traits,
              },
              properties,
              originalTimestamp: '2022-04-28T00:23:09.544Z',
              integrations,
            },
            destination,
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
              endpoint: 'https://www.google-analytics.com/mp/collect',
              headers: {
                HOST: 'www.google-analytics.com',
                'Content-Type': 'application/json',
              },
              params: {
                api_secret: 'dummyApiSecret',
                measurement_id: 'G-T40PE6KET4',
              },
              body: {
                JSON: {
                  user_id: 'root_user',
                  timestamp_micros: 1651105389000000,
                  non_personalized_ads: false,
                  client_id: 'root_anonId',
                  events: [
                    {
                      name: 'add_to_cart',
                      params: {
                        items: [
                          {
                            name: 'Salt',
                            id: 883213,
                            list_id: 'random_list_id',
                          },
                          {
                            name: 'Sugar',
                            id: 213123,
                            key: 'someValue',
                            list_id: 'random_list_id',
                          },
                        ],
                        prices: 456,
                      },
                    },
                  ],
                  userProperties: {
                    firstName: {
                      value: 'John',
                    },
                    lastName: {
                      value: 'Gomes',
                    },
                  },
                  consent: {
                    ad_user_data: 'DENIED',
                    ad_personalization: 'GRANTED',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://www.google-analytics.com/mp/collect',
              headers: {
                HOST: 'www.google-analytics.com',
                'Content-Type': 'application/json',
              },
              params: {
                api_secret: 'dummyApiSecret',
                measurement_id: 'G-T40PE6KET4',
              },
              body: {
                JSON: {
                  user_id: 'root_user',
                  timestamp_micros: 1651105389000000,
                  non_personalized_ads: false,
                  client_id: 'root_anonId',
                  events: [
                    {
                      name: 'checkout_started',
                      params: {
                        items: [
                          {
                            name: 'Salt',
                            id: 883213,
                            list_id: 'random_list_id',
                          },
                          {
                            name: 'Sugar',
                            id: 213123,
                            key: 'someValue',
                            list_id: 'random_list_id',
                          },
                        ],
                        prices: 456,
                      },
                    },
                  ],
                  userProperties: {
                    firstName: {
                      value: 'John',
                    },
                    lastName: {
                      value: 'Gomes',
                    },
                  },
                  consent: {
                    ad_user_data: 'DENIED',
                    ad_personalization: 'GRANTED',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'ga4_v2',
    id: 'ga4_custom_mapping_test_2',
    description: 'Custom Mapping Test For mapping not present in events mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Product Viewed',
              userId: 'root_user',
              anonymousId: 'root_anonId',
              context: {
                device,
                traits,
              },
              properties,
              originalTimestamp: '2022-04-28T00:23:09.544Z',
              integrations,
            },
            destination,
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
              endpoint: 'https://www.google-analytics.com/mp/collect',
              headers: {
                HOST: 'www.google-analytics.com',
                'Content-Type': 'application/json',
              },
              params: {
                api_secret: 'dummyApiSecret',
                measurement_id: 'G-T40PE6KET4',
              },
              body: {
                JSON: {
                  user_id: 'root_user',
                  timestamp_micros: 1651105389000000,
                  non_personalized_ads: false,
                  user_properties: {
                    firstName: {
                      value: 'John',
                    },
                    lastName: {
                      value: 'Gomes',
                    },
                    city: {
                      value: 'London',
                    },
                    state: {
                      value: 'UK',
                    },
                    group: {
                      value: 'test group',
                    },
                  },
                  events: [
                    {
                      name: 'Product_Viewed',
                      params: {
                        engagement_time_msec: 1,
                        list_id: 'random_list_id',
                        category: 'random_category',
                        storePrice: 456,
                        prices_0_id: 'store-price',
                        prices_0_value: 456,
                        prices_1_id: 'desk-price',
                        prices_1_value: 567,
                        products_0_product_id: 883213,
                        products_0_name: 'Salt',
                        products_0_coupon: 'HHH',
                        products_0_price: 100,
                        products_0_position: 1,
                        products_0_quantity: 10,
                        products_0_affiliation: 'NADA',
                        products_0_currency: 'INR',
                        products_0_discount: '2%',
                        products_0_item_category3: 'grocery',
                        products_1_product_id: 213123,
                        products_1_name: 'Sugar',
                        products_1_coupon: 'III',
                        products_1_price: 200,
                        products_1_position: 2,
                        products_1_quantity: 20,
                        products_1_affiliation: 'ADNA',
                        products_1_currency: 'INR',
                        products_1_discount: '5%',
                        products_1_item_category2: 'regulars',
                        products_1_item_category3: 'grocery',
                        products_1_some_data: 'someValue',
                      },
                    },
                  ],
                  consent: {
                    ad_user_data: 'DENIED',
                    ad_personalization: 'GRANTED',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'ga4_v2',
    id: 'ga4_custom_mapping_test_3',
    description: 'Custom Mapping Test For Group Event Type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              userId: 'root_user',
              anonymousId: 'root_anonId',
              context: {
                device,
                traits,
              },
              properties,
              originalTimestamp: '2022-04-28T00:23:09.544Z',
              integrations,
            },
            destination,
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
              endpoint: 'https://www.google-analytics.com/mp/collect',
              headers: {
                HOST: 'www.google-analytics.com',
                'Content-Type': 'application/json',
              },
              params: {
                api_secret: 'dummyApiSecret',
                measurement_id: 'G-T40PE6KET4',
              },
              body: {
                JSON: {
                  user_id: 'root_user',
                  timestamp_micros: 1651105389000000,
                  non_personalized_ads: false,
                  client_id: 'root_anonId',
                  events: [
                    {
                      name: 'join_group',
                      params: {
                        city: 'London',
                        engagement_time_msec: 1,
                        firstName: 'John',
                        group: 'test group',
                        lastName: 'Gomes',
                        state: 'UK',
                        streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                      },
                    },
                  ],
                  user_properties: {
                    firstName: {
                      value: 'John',
                    },
                    lastName: {
                      value: 'Gomes',
                    },
                    city: {
                      value: 'London',
                    },
                    state: {
                      value: 'UK',
                    },
                    group: {
                      value: 'test group',
                    },
                  },
                  consent: {
                    ad_user_data: 'DENIED',
                    ad_personalization: 'GRANTED',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
];
