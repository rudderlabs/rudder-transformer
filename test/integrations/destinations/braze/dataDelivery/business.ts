import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { authHeader1 } from '../maskedSecrets';

const BRAZE_USERS_TRACK_ENDPOINT = 'https://rest.iad-03.braze.com/users/track';

const partner = 'RudderStack';

const headers = {
  Accept: 'application/json',
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  'User-Agent': 'RudderLabs',
};

const BrazeEvent1 = {
  name: 'Product List Viewed',
  time: '2023-11-30T21:48:45.634Z',
  properties: {
    products: [
      {
        sku: '23-04-52-62-01-18',
        name: 'Broman Hoodie',
        price: '97.99',
        variant: [
          {
            id: 39653520310368,
            sku: '23-04-52-62-01-18',
            grams: 0,
            price: '97.99',
            title: '(SM)',
            weight: 0,
            option1: '(SM)',
            taxable: true,
            position: 1,
            tax_code: '',
            created_at: '2023-05-18T12:56:22-06:00',
            product_id: 6660780884064,
            updated_at: '2023-11-30T15:48:43-06:00',
            weight_unit: 'kg',
            quantity_rule: {
              min: 1,
              increment: 1,
            },
            compare_at_price: '139.99',
            inventory_policy: 'deny',
            requires_shipping: true,
            inventory_quantity: 8,
            fulfillment_service: 'manual',
            inventory_management: 'shopify',
            quantity_price_breaks: [],
            old_inventory_quantity: 8,
          },
        ],
        category: '62 OTHER/RETRO',
        currency: 'CAD',
        product_id: 6660780884064,
      },
      {
        sku: '23-04-08-61-01-18',
        name: 'Kipling Camo Hoodie',
        price: '69.99',
        variant: [
          {
            id: 39672628740192,
            sku: '23-04-08-61-01-18',
            grams: 0,
            price: '69.99',
            title: '(SM)',
            weight: 0,
            option1: '(SM)',
            taxable: true,
            position: 1,
            tax_code: '',
            created_at: '2023-06-28T12:52:56-06:00',
            product_id: 6666835853408,
            updated_at: '2023-11-30T15:48:43-06:00',
            weight_unit: 'kg',
            quantity_rule: {
              min: 1,
              increment: 1,
            },
            compare_at_price: '99.99',
            inventory_policy: 'deny',
            requires_shipping: true,
            inventory_quantity: 8,
            fulfillment_service: 'manual',
            inventory_management: 'shopify',
            quantity_price_breaks: [],
            old_inventory_quantity: 8,
          },
        ],
        category: 'Misc',
        currency: 'CAD',
        product_id: 6666835853408,
      },
    ],
  },
  _update_existing_only: false,
  user_alias: {
    alias_name: 'ab7de609-9bec-8e1c-42cd-084a1cd93a4e',
    alias_label: 'rudder_id',
  },
};

const BrazeEvent2 = {
  name: 'Add to Cart',
  time: '2020-01-24T11:59:02.403+05:30',
  properties: {
    revenue: 50,
  },
  external_id: 'mickeyMouse',
};

const BrazePurchaseEvent = {
  product_id: '507f1f77bcf86cd799439011',
  price: 0,
  currency: 'USD',
  quantity: 1,
  time: '2020-01-24T11:59:02.402+05:30',
  _update_existing_only: false,
  user_alias: {
    alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
    alias_label: 'rudder_id',
  },
};

const metadataArray = [generateMetadata(1), generateMetadata(2), generateMetadata(3)];

const errorMessages = {
  message_1: JSON.stringify({ events_processed: 2, purchases_processed: 1, message: 'success' }),
  message_2:
    '{"events_processed":1,"message":"success","errors":[{"type":"\'external_id\', \'braze_id\', \'user_alias\', \'email\' or \'phone\' is required","input_array":"events","index":1},{"type":"\'quantity\' is not valid","input_array":"purchases","index":0}]}',
  message_3:
    '{"message":"Valid data must be provided in the \'attributes\', \'events\', or \'purchases\' fields.","errors":[{"type":"\'external_id\', \'braze_id\', \'user_alias\', \'email\' or \'phone\' is required","input_array":"events","index":0},{"type":"\'external_id\', \'braze_id\', \'user_alias\', \'email\' or \'phone\' is required","input_array":"events","index":1},{"type":"\'quantity\' is not valid","input_array":"purchases","index":0}]}',
};

const expectedStatTags = {
  errorCategory: 'network',
  errorType: 'aborted',
  destType: 'BRAZE',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'braze_v1_scenario_1',
    name: 'braze',
    description:
      '[Proxy v1 API] :: Test for a valid request - 2 events and 1 purchase event are sent where the destination responds with 200 without any error',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              partner,
              events: [BrazeEvent1, BrazeEvent2],
              purchases: [BrazePurchaseEvent],
            },
            headers,
            endpoint: `${BRAZE_USERS_TRACK_ENDPOINT}/valid_scenario1`,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: errorMessages.message_1,
                statusCode: 200,
                metadata: generateMetadata(1),
              },
              {
                error: errorMessages.message_1,
                statusCode: 200,
                metadata: generateMetadata(2),
              },
              {
                error: errorMessages.message_1,
                statusCode: 200,
                metadata: generateMetadata(3),
              },
            ],
            status: 200,
            message: 'Request for braze Processed Successfully',
          },
        },
      },
    },
  },
  {
    id: 'braze_v1_scenario_2',
    name: 'braze',
    description:
      '[Proxy v1 API] :: Test for a invalid request - 2 events and 1 purchase event are sent where the destination responds with 200 with error for a one of the event and the purchase event',
    successCriteria: 'Should return 200 with error for one of the event and the purchase event',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              partner,
              events: [{ ...BrazeEvent1, user_alias: undefined }, BrazeEvent2], // modifying first event to be invalid
              purchases: [{ ...BrazePurchaseEvent, quantity: 'invalid quantity' }], // modifying purchase event to be invalid
            },
            headers,
            endpoint: `${BRAZE_USERS_TRACK_ENDPOINT}/invalid_scenario1`,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: errorMessages.message_2,
                statusCode: 200,
                metadata: generateMetadata(1),
              },
              {
                error: errorMessages.message_2,
                statusCode: 200,
                metadata: generateMetadata(2),
              },
              {
                error: errorMessages.message_2,
                statusCode: 200,
                metadata: generateMetadata(3),
              },
            ],
            status: 200,
            message: 'Request for braze Processed Successfully',
          },
        },
      },
    },
  },
  {
    id: 'braze_v1_scenario_3',
    name: 'braze',
    description: '[Proxy v1 API] :: Test for an invalid request  - all the payloads are invalid',
    successCriteria: 'Should return 400 with error for all the payloads',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              partner,
              events: [
                { ...BrazeEvent1, user_alias: undefined },
                { ...BrazeEvent2, external_id: undefined },
              ], // modifying first event to be invalid
              purchases: [{ ...BrazePurchaseEvent, quantity: 'invalid quantity' }], // modifying purchase event to be invalid
            },
            headers,
            endpoint: `${BRAZE_USERS_TRACK_ENDPOINT}/invalid_scenario2`,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: errorMessages.message_3,
                statusCode: 400,
                metadata: generateMetadata(1),
              },
              {
                error: errorMessages.message_3,
                statusCode: 400,
                metadata: generateMetadata(2),
              },
              {
                error: errorMessages.message_3,
                statusCode: 400,
                metadata: generateMetadata(3),
              },
            ],
            statTags: expectedStatTags,
            message: 'Request failed for braze with status: 400',
            status: 400,
          },
        },
      },
    },
  },
  {
    id: 'braze_v1_scenario_4',
    name: 'braze',
    description: '[Proxy v1 API] :: Test for invalid auth scneario',
    successCriteria: 'Should return 400 for all the payloads',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              partner,
              events: [BrazeEvent1, BrazeEvent2],
              purchases: [BrazePurchaseEvent],
            },
            headers,
            endpoint: `${BRAZE_USERS_TRACK_ENDPOINT}/invalid_scenario3`,
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({ message: 'Invalid API Key' }),
                statusCode: 401,
                metadata: generateMetadata(1),
              },
              {
                error: JSON.stringify({ message: 'Invalid API Key' }),
                statusCode: 401,
                metadata: generateMetadata(2),
              },
              {
                error: JSON.stringify({ message: 'Invalid API Key' }),
                statusCode: 401,
                metadata: generateMetadata(3),
              },
            ],
            statTags: expectedStatTags,
            message: 'Request failed for braze with status: 401',
            status: 401,
          },
        },
      },
    },
  },
];
