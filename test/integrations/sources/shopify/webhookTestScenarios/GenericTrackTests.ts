// This file contains the test scenarios for the server-side events from the Shopify GraphQL API for
// the v1 transformation flow
import utils from '../../../../../src/v0/util';
const mockFns = (_) => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('5d3e2cb6-4011-5c9c-b7ee-11bc1e905097');
};
import { dummySourceConfig } from '../constants';

export const genericTrackTestScenarios = [
  {
    id: 'c005',
    name: 'shopify',
    description: 'Track Call -> Cart Update event with no line items from Pixel app',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              query_parameters: {
                topic: ['carts_update'],
                writeKey: ['2mw9SN679HngnXXXHT4oSVVBVmb'],
                version: ['pixel'],
              },
              id: 'Z2NwLXVzLWVhc3QxOjAxSjdXRjdOQjY0NlFFNFdQVEg0MTRFM1E2',
              token: 'Z2NwLXVzLWVhc3QxOjAxSjdXRjdOQjY0NlFFNFdQVEg0MTRFM1E2',
              line_items: [],
              note: '',
              updated_at: '2024-09-17T08:15:13.280Z',
              created_at: '2024-09-16T03:50:15.478Z',
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  anonymousId: '5d3e2cb6-4011-5c9c-b7ee-11bc1e905097',
                  context: {
                    integration: {
                      name: 'SHOPIFY',
                    },
                    library: {
                      eventOrigin: 'server',
                      name: 'RudderStack Shopify Cloud',
                      version: '2.0.0',
                    },
                    shopifyDetails: {
                      created_at: '2024-09-16T03:50:15.478Z',
                      id: 'Z2NwLXVzLWVhc3QxOjAxSjdXRjdOQjY0NlFFNFdQVEg0MTRFM1E2',
                      line_items: [],
                      note: '',
                      token: 'Z2NwLXVzLWVhc3QxOjAxSjdXRjdOQjY0NlFFNFdQVEg0MTRFM1E2',
                      updated_at: '2024-09-17T08:15:13.280Z',
                    },
                    topic: 'carts_update',
                  },
                  event: 'Cart Update',
                  integrations: {
                    SHOPIFY: true,
                  },
                  properties: {
                    products: [],
                  },
                  type: 'track',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    id: 'c005',
    name: 'shopify',
    description: 'Track Call -> Checkout Started event from Pixel app',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 35550298931313,
              token: '84ad78572dae52a8cbea7d55371afe89',
              cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ',
              email: null,
              gateway: null,
              buyer_accepts_marketing: false,
              buyer_accepts_sms_marketing: false,
              sms_marketing_phone: null,
              created_at: '2024-11-06T02:22:00+00:00',
              updated_at: '2024-11-05T21:22:02-05:00',
              landing_site: '/',
              note: '',
              note_attributes: [],
              referring_site: '',
              shipping_lines: [],
              shipping_address: [],
              taxes_included: false,
              total_weight: 0,
              currency: 'USD',
              completed_at: null,
              phone: null,
              customer_locale: 'en-US',
              line_items: [
                {
                  key: '41327142600817',
                  fulfillment_service: 'manual',
                  gift_card: false,
                  grams: 0,
                  presentment_title: 'The Collection Snowboard: Hydrogen',
                  presentment_variant_title: '',
                  product_id: 7234590408817,
                  quantity: 1,
                  requires_shipping: true,
                  sku: '',
                  tax_lines: [],
                  taxable: true,
                  title: 'The Collection Snowboard: Hydrogen',
                  variant_id: 41327142600817,
                  variant_title: '',
                  variant_price: '600.00',
                  vendor: 'Hydrogen Vendor',
                  unit_price_measurement: {
                    measured_type: null,
                    quantity_value: null,
                    quantity_unit: null,
                    reference_value: null,
                    reference_unit: null,
                  },
                  compare_at_price: null,
                  line_price: '600.00',
                  price: '600.00',
                  applied_discounts: [],
                  destination_location_id: null,
                  user_id: null,
                  rank: null,
                  origin_location_id: null,
                  properties: {},
                },
              ],
              name: '#35550298931313',
              abandoned_checkout_url:
                'https://pixel-testing-rs.myshopify.com/59026964593/checkouts/ac/Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ/recover?key=0385163be3875d3a2117e982d9cc3517&locale=en-US',
              discount_codes: [],
              tax_lines: [],
              presentment_currency: 'USD',
              source_name: 'web',
              total_line_items_price: '600.00',
              total_tax: '0.00',
              total_discounts: '0.00',
              subtotal_price: '600.00',
              total_price: '600.00',
              total_duties: '0.00',
              device_id: null,
              user_id: null,
              location_id: null,
              source_identifier: null,
              source_url: null,
              source: null,
              closed_at: null,
              query_parameters: {
                topic: ['checkouts_create'],
                version: ['pixel'],
                writeKey: ['2mw9SN679HngnXXXHT4oSVVBVmb'],
              },
            },
            source: dummySourceConfig,
            query_parameters: {
              topic: ['carts_update'],
              writeKey: ['2mw9SN679HngnXXXHT4oSVVBVmb'],
              version: ['pixel'],
            },
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    library: {
                      eventOrigin: 'server',
                      name: 'RudderStack Shopify Cloud',
                      version: '2.0.0',
                    },
                    integration: {
                      name: 'SHOPIFY',
                    },
                    topic: 'checkouts_create',
                    cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ',
                    shopifyDetails: {
                      id: 35550298931313,
                      token: '84ad78572dae52a8cbea7d55371afe89',
                      cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ',
                      email: null,
                      gateway: null,
                      buyer_accepts_marketing: false,
                      buyer_accepts_sms_marketing: false,
                      sms_marketing_phone: null,
                      created_at: '2024-11-06T02:22:00+00:00',
                      updated_at: '2024-11-05T21:22:02-05:00',
                      landing_site: '/',
                      note: '',
                      note_attributes: [],
                      referring_site: '',
                      shipping_lines: [],
                      shipping_address: [],
                      taxes_included: false,
                      total_weight: 0,
                      currency: 'USD',
                      completed_at: null,
                      phone: null,
                      customer_locale: 'en-US',
                      line_items: [
                        {
                          key: '41327142600817',
                          fulfillment_service: 'manual',
                          gift_card: false,
                          grams: 0,
                          presentment_title: 'The Collection Snowboard: Hydrogen',
                          presentment_variant_title: '',
                          product_id: 7234590408817,
                          quantity: 1,
                          requires_shipping: true,
                          sku: '',
                          tax_lines: [],
                          taxable: true,
                          title: 'The Collection Snowboard: Hydrogen',
                          variant_id: 41327142600817,
                          variant_title: '',
                          variant_price: '600.00',
                          vendor: 'Hydrogen Vendor',
                          unit_price_measurement: {
                            measured_type: null,
                            quantity_value: null,
                            quantity_unit: null,
                            reference_value: null,
                            reference_unit: null,
                          },
                          compare_at_price: null,
                          line_price: '600.00',
                          price: '600.00',
                          applied_discounts: [],
                          destination_location_id: null,
                          user_id: null,
                          rank: null,
                          origin_location_id: null,
                          properties: {},
                        },
                      ],
                      name: '#35550298931313',
                      abandoned_checkout_url:
                        'https://pixel-testing-rs.myshopify.com/59026964593/checkouts/ac/Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ/recover?key=0385163be3875d3a2117e982d9cc3517&locale=en-US',
                      discount_codes: [],
                      tax_lines: [],
                      presentment_currency: 'USD',
                      source_name: 'web',
                      total_line_items_price: '600.00',
                      total_tax: '0.00',
                      total_discounts: '0.00',
                      subtotal_price: '600.00',
                      total_price: '600.00',
                      total_duties: '0.00',
                      device_id: null,
                      user_id: null,
                      location_id: null,
                      source_identifier: null,
                      source_url: null,
                      source: null,
                      closed_at: null,
                    },
                  },
                  integrations: {
                    SHOPIFY: true,
                  },
                  type: 'track',
                  event: 'Checkout Started',
                  properties: {
                    order_id: 35550298931313,
                    value: '600.00',
                    tax: '0.00',
                    currency: 'USD',
                    products: [
                      {
                        product_id: 7234590408817,
                        price: '600.00',
                        brand: 'Hydrogen Vendor',
                        quantity: 1,
                      },
                    ],
                  },
                  timestamp: '2024-11-06T02:22:02.000Z',
                  traits: {
                    shippingAddress: [],
                  },
                  anonymousId: '5d3e2cb6-4011-5c9c-b7ee-11bc1e905097',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    id: 'c006',
    name: 'shopify',
    description: 'Track Call -> Unsupported event from Pixel app',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              id: 35550298931313,
              query_parameters: {
                topic: ['unsupported_event'],
                writeKey: ['2mw9SN679HngnXXXHT4oSVVBVmb'],
                version: ['pixel'],
              },
            },
            source: dummySourceConfig,
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            outputToSource: {
              body: 'T0s=',
              contentType: 'text/plain',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
].map((d2) => ({ ...d2, mockFns }));
