import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';
// TODO: 1) category to content via integrations object , 2) PII properties allowlist deny list , 3) use updated mapping
import { removeUndefinedAndNullValues } from '@rudderstack/integrations-lib';
import {
  overrideDestination,
  transformResultBuilder,
  generateSimplifiedIdentifyPayload,
  generateTrackPayload,
} from '../../../testUtils';

const commonDestination = {
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

const commonPropertiesWithoutProductArray = {
  category: 'dummy',
  quantity: 10,
  value: 100,
  product_id: '12345',
};

const commonTimestamp = new Date('2023-10-14');

export const configLevelFeaturesTestData = [
  {
    name: 'facebook_pixel',
    description: 'config feature : limitedDataUSage switched on',
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"},"event_name":"ViewContent","event_time":1697241600,"event_id":"12345","action_source":"website","data_processing_options":"val1","data_processing_options_country":"val2","data_processing_options_state":"val3","custom_data":{"category":"dummy","quantity":10,"value":100,"product_id":"12345","content_ids":["dummy"],"content_type":"product_group","contents":[{"id":"dummy","quantity":1}],"content_category":"dummy","currency":"USD"}}',
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
    description:
      'config feature : ContentCategoryMapping table is filled up, but category is passed with properties',
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://graph.facebook.com/${VERSION}/dummyPixelId/events?access_token=09876`,
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  data: [
                    '{"user_data":{"external_id":"3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47","em":"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08","client_user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"},"event_name":"ViewContent","event_time":1697241600,"event_id":"12345","action_source":"website","data_processing_options":"val1","data_processing_options_country":"val2","data_processing_options_state":"val3","custom_data":{"category":"clothing","quantity":10,"value":100,"product_id":"12345","content_ids":["clothing"],"content_type":"newClothing","contents":[{"id":"clothing","quantity":1}],"content_category":"clothing","currency":"USD"}}',
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
];
