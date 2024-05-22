import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';
import {
  overrideDestination,
  generateTrackPayload,
  generateMetadata,
  transformResultBuilder,
} from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

const commonDestination: Destination = {
  ID: '12335',
  Name: 'sample-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'facebook_pixel',
    DisplayName: 'Facebook Pixel',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
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
        from: 'ABC Started',
        to: 'InitiateCheckout',
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
    categoryToContent: [
      {
        from: 'clothing',
        to: 'newClothing',
      },
    ],
  },
  Enabled: true,
};

const commonUserTraits = {
  email: 'abc@gmail.com',
  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
  event_id: '12345',
};

// the below object has properties that are used as whitelist and blacklist properties in below test cases
const piiPropertiesForAllowDeny = {
  email: 'abc@gmail.com',
  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
  event_id: '12345',
  firstName: 'John',
  lastName: 'Doe',
  whitelistProp1: 'val1',
  blacklistProp2: 'val2',
  blacklistProp3: 'val3',
  category: 'dummy',
  quantity: 10,
  value: 100,
  product_id: '12345',
};

const commonPropertiesWithoutProductArray = {
  category: 'dummy',
  quantity: 10,
  value: 100,
  product_id: '12345',
};

const commonTimestamp = new Date('2023-10-14');

export const configLevelFeaturesTestData: ProcessorTestData[] = [
  {
    id: 'facebook_pixel-config-test-1',
    name: 'facebook_pixel',
    description:
      'config feature : limitedDataUSage switched on. Ref:https://developers.facebook.com/docs/marketing-apis/data-processing-options/#supported-tools-and-apis ',
    scenario: 'configuration',
    successCriteria: 'Response should contain limitedDataUSage related fields',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: commonPropertiesWithoutProductArray,
              context: {
                traits: commonUserTraits,
                dataProcessingOptions: ['val1', 'val2', 'val3'],
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    data_processing_options: 'val1',
                    data_processing_options_country: 'val2',
                    data_processing_options_state: 'val3',
                    custom_data: {
                      category: 'dummy',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_ids: ['dummy'],
                      content_type: 'product_group',
                      contents: [
                        {
                          id: 'dummy',
                          quantity: 1,
                        },
                      ],
                      content_category: 'dummy',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-config-test-2',
    name: 'facebook_pixel',
    scenario: 'configuration',
    description:
      'config feature : While categoryToContent mapping is filled up in UI, but category is passed with message.properties as well. message.properties.category should be given priority over categoryToContent mapping',
    successCriteria: 'Response should contain category mapped to newClothing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: { ...commonPropertiesWithoutProductArray, category: 'clothing' },
              context: {
                traits: commonUserTraits,
                dataProcessingOptions: ['val1', 'val2', 'val3'],
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    data_processing_options: 'val1',
                    data_processing_options_country: 'val2',
                    data_processing_options_state: 'val3',
                    custom_data: {
                      category: 'clothing',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_ids: ['clothing'],
                      content_type: 'newClothing',
                      contents: [
                        {
                          id: 'clothing',
                          quantity: 1,
                        },
                      ],
                      content_category: 'clothing',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-config-test-3',
    name: 'facebook_pixel',
    description:
      'config feature : ContentCategoryMapping table is filled up, and category is passed with properties along with contentType via integrations object',
    scenario: 'configuration',
    successCriteria: 'contentType should be used from integrations object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: { ...commonPropertiesWithoutProductArray, category: 'clothing' },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              integrations: {
                FacebookPixel: {
                  contentType: 'newClothingFromIntegrationObject',
                },
              },
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      category: 'clothing',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_ids: ['clothing'],
                      content_type: 'newClothingFromIntegrationObject',
                      contents: [
                        {
                          id: 'clothing',
                          quantity: 1,
                        },
                      ],
                      content_category: 'clothing',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-config-test-4',
    name: 'facebook_pixel',
    description:
      'config feature : Config mapped whiteList and blackListed properties with marked hashed within integrations object, along with default pii property email in the properties',
    scenario: 'configuration',
    successCriteria:
      'BlackListed properties should not be hashed and default pii property should be deleted from the properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: { ...piiPropertiesForAllowDeny },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              integrations: {
                FacebookPixel: {
                  hashed: true,
                },
              },
            }),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, {
              whitelistPiiProperties: [
                {
                  whitelistPiiProperties: 'whitelistProp1',
                },
              ],
              blacklistPiiProperties: [
                {
                  blacklistPiiProperties: 'blacklistProp2',
                },
                {
                  blacklistPiiProperties: 'blacklistProp3',
                },
              ],
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id: 'default-user-id',
                      em: 'abc@gmail.com',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                      whitelistProp1: 'val1',
                      blacklistProp2: 'val2',
                      blacklistProp3: 'val3',
                      category: 'dummy',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_ids: ['dummy'],
                      content_type: 'product_group',
                      contents: [
                        {
                          id: 'dummy',
                          quantity: 1,
                        },
                      ],
                      content_category: 'dummy',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-config-test-5',
    name: 'facebook_pixel',
    description:
      'config feature : Config mapped whiteList and blackListed properties without marked hashed within integrations object but marked hashed true from UI, along with default pii property email in the properties',
    scenario: 'configuration',
    successCriteria:
      'BlackListed properties should be hashed and default pii property should be deleted from the properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: { ...piiPropertiesForAllowDeny },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, {
              whitelistPiiProperties: [
                {
                  whitelistPiiProperties: 'whitelistProp1',
                },
              ],
              blacklistPiiProperties: [
                {
                  blacklistPiiProperties: 'blacklistProp2',
                  blacklistPiiHash: true,
                },
                {
                  blacklistPiiProperties: 'blacklistProp3',
                  blacklistPiiHash: true,
                },
              ],
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                      whitelistProp1: 'val1',
                      blacklistProp2:
                        '528e5290f8ff0eb0325f0472b9c1a9ef4fac0b02ff6094b64d9382af4a10444b',
                      blacklistProp3:
                        'bac8d4414984861d5199b7a97699c728bee36c4084299b2ca905434cf65d8944',
                      category: 'dummy',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_ids: ['dummy'],
                      content_type: 'product_group',
                      contents: [
                        {
                          id: 'dummy',
                          quantity: 1,
                        },
                      ],
                      content_category: 'dummy',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-config-test-6',
    name: 'facebook_pixel',
    description:
      'config feature : Config mapped whiteList and blackListed properties marked hashed within integrations object but marked hashed true from UI, along with default pii property email in the properties',
    scenario: 'configuration',
    successCriteria:
      'BlackListed properties should not be hashed again and default pii property should be deleted from the properties',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: { ...piiPropertiesForAllowDeny },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              integrations: {
                FacebookPixel: {
                  hashed: true,
                },
              },
            }),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, {
              whitelistPiiProperties: [
                {
                  whitelistPiiProperties: 'whitelistProp1',
                },
              ],
              blacklistPiiProperties: [
                {
                  blacklistPiiProperties: 'blacklistProp2',
                  blacklistPiiHash: true,
                },
                {
                  blacklistPiiProperties: 'blacklistProp3',
                  blacklistPiiHash: true,
                },
              ],
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id: 'default-user-id',
                      em: 'abc@gmail.com',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                      whitelistProp1: 'val1',
                      blacklistProp2: 'val2',
                      blacklistProp3: 'val3',
                      category: 'dummy',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_ids: ['dummy'],
                      content_type: 'product_group',
                      contents: [
                        {
                          id: 'dummy',
                          quantity: 1,
                        },
                      ],
                      content_category: 'dummy',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'facebook_pixel-config-test-7',
    name: 'facebook_pixel',
    description:
      'properties.content_type is given priority over populating it from categoryToContent mapping.',
    scenario: 'configuration',
    successCriteria: 'Response should contain content_type as product_group and not newClothing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'product list viewed',
              properties: { ...piiPropertiesForAllowDeny, content_type: 'product_group' },
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              integrations: {
                FacebookPixel: {
                  hashed: true,
                },
              },
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id: 'default-user-id',
                      em: 'abc@gmail.com',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'ViewContent',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      email: 'abc@gmail.com',
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                      whitelistProp1: 'val1',
                      blacklistProp2: 'val2',
                      blacklistProp3: 'val3',
                      category: 'dummy',
                      quantity: 10,
                      value: 100,
                      product_id: '12345',
                      content_type: 'product_group',
                      content_ids: ['dummy'],
                      contents: [
                        {
                          id: 'dummy',
                          quantity: 1,
                        },
                      ],
                      content_category: 'dummy',
                      currency: 'USD',
                    },
                  }),
                ],
              },
              files: {},
              userId: '',
            }),
            metadata: generateMetadata(1),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
