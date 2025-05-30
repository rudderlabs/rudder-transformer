// This file contains the test scenarios for the server-side events from the Shopify GraphQL API for
// the v1 transformation flow
import { mockFns } from '../mocks';
import { dummySourceConfig, note_attributes } from '../constants';

export const genericTrackTestScenarios = [
  {
    id: 'c005',
    name: 'shopify',
    description: 'Track Call -> Cart Update event with no line items from Pixel app',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                id: 'Z2NwLXVzLWVhc3QxOjAxSjdXRjdOQjY0NlFFNFdQVEg0MTRFM1E2',
                token: 'Z2NwLXVzLWVhc3QxOjAxSjdXRjdOQjY0NlFFNFdQVEg0MTRFM1E2',
                line_items: [],
                note: '',
                note_attributes,
                updated_at: '2024-09-17T08:15:13.280Z',
                created_at: '2024-09-16T03:50:15.478Z',
              }),
              query_parameters: {
                topic: ['carts_update'],
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
            output: {
              batch: [
                {
                  anonymousId: '50ead33e-d763-4854-b0ab-765859ef05cb',
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
                      note_attributes,
                      token: 'Z2NwLXVzLWVhc3QxOjAxSjdXRjdOQjY0NlFFNFdQVEg0MTRFM1E2',
                      updated_at: '2024-09-17T08:15:13.280Z',
                    },
                    topic: 'carts_update',
                  },
                  event: 'Cart Update',
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
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
    id: 'c006',
    name: 'shopify',
    description: 'Track Call -> Unsupported event from Pixel app',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({ id: 35550298931313 }),
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
  {
    id: 'c007',
    name: 'shopify',
    description: 'Track Call -> generic event from Pixel app',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                id: 5778367414385,
                admin_graphql_api_id: 'gid://shopify/Order/5778367414385',
                cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ',
                checkout_id: 35550298931313,
                checkout_token: '84ad78572dae52a8cbea7d55371afe89',
                contact_email: 'henry@wfls.com',
                created_at: '2024-11-05T21:54:49-05:00',
                currency: 'USD',
                current_subtotal_price: '600.00',
                current_total_additional_fees_set: null,
                current_total_discounts: '0.00',
                current_total_duties_set: null,
                current_total_price: '600.00',
                current_total_tax: '0.00',
                email: 'henry@wfls.com',
                merchant_of_record_app_id: null,
                name: '#1017',
                note: null,
                note_attributes,
                order_number: 1017,
                original_total_additional_fees_set: null,
                original_total_duties_set: null,
                payment_gateway_names: ['bogus'],
                phone: null,
                po_number: null,
                presentment_currency: 'USD',
                processed_at: '2024-11-05T21:54:48-05:00',
                reference: '4d92cf60cc24a1bd95929e17ead9845f',
                referring_site: '',
                source_identifier: '4d92cf60cc24a1bd95929e17ead9845f',
                subtotal_price: '600.00',
                subtotal_price_set: {
                  shop_money: {
                    amount: '600.00',
                    currency_code: 'USD',
                  },
                  presentment_money: {
                    amount: '600.00',
                    currency_code: 'USD',
                  },
                },
                token: '676613a0027fc8240e16d67fdc9f5ac8',
                total_discounts: '0.00',
                total_line_items_price: '600.00',
                total_outstanding: '0.00',
                total_price: '600.00',
                total_tax: '0.00',
                total_weight: 0,
                updated_at: '2024-11-05T21:54:50-05:00',
                user_id: null,
                billing_address: {
                  first_name: 'yodi',
                  address1: 'Yuma Proving Ground',
                  phone: null,
                  city: 'Yuma Proving Ground',
                  zip: '85365',
                  province: 'Arizona',
                  country: 'United States',
                  last_name: 'waffles',
                  address2: 'suite 001',
                  company: null,
                  latitude: 33.0177811,
                  longitude: -114.2525392,
                  name: 'yodi waffles',
                  country_code: 'US',
                  province_code: 'AZ',
                },
                customer: {
                  id: 7358220173425,
                  email: 'henry@wfls.com',
                  created_at: '2024-10-23T16:03:11-04:00',
                  updated_at: '2024-11-05T21:54:49-05:00',
                  first_name: 'yodi',
                  last_name: 'waffles',
                  state: 'disabled',
                  note: null,
                  verified_email: true,
                  multipass_identifier: null,
                  tax_exempt: false,
                  phone: null,
                  email_marketing_consent: {
                    state: 'not_subscribed',
                    opt_in_level: 'single_opt_in',
                    consent_updated_at: null,
                  },
                  sms_marketing_consent: null,
                  tags: '',
                  currency: 'USD',
                  tax_exemptions: [],
                  admin_graphql_api_id: 'gid://shopify/Customer/7358220173425',
                  default_address: {
                    id: 8715246862449,
                    customer_id: 7358220173425,
                    first_name: 'henry',
                    last_name: 'waffles',
                    company: null,
                    address1: 'Yuimaru Kitchen',
                    address2: '6',
                    city: 'Johnson City',
                    province: 'Tennessee',
                    country: 'United States',
                    zip: '37604',
                    phone: null,
                    name: 'henry waffles',
                    province_code: 'TN',
                    country_code: 'US',
                    country_name: 'United States',
                    default: true,
                  },
                },
                line_items: [
                  {
                    id: 14234727743601,
                    admin_graphql_api_id: 'gid://shopify/LineItem/14234727743601',
                    attributed_staffs: [],
                    current_quantity: 1,
                    fulfillable_quantity: 1,
                    fulfillment_service: 'manual',
                    fulfillment_status: null,
                    gift_card: false,
                    grams: 0,
                    name: 'The Collection Snowboard: Hydrogen',
                    price: 600,
                    price_set: {
                      shop_money: {
                        amount: '600.00',
                        currency_code: 'USD',
                      },
                      presentment_money: {
                        amount: '600.00',
                        currency_code: 'USD',
                      },
                    },
                    product_exists: true,
                    product_id: '7234590408817',
                    properties: [],
                    quantity: 1,
                    requires_shipping: true,
                    sku: '',
                    taxable: true,
                    title: 'The Collection Snowboard: Hydrogen',
                    total_discount: '0.00',
                    total_discount_set: {
                      shop_money: {
                        amount: '0.00',
                        currency_code: 'USD',
                      },
                      presentment_money: {
                        amount: '0.00',
                        currency_code: 'USD',
                      },
                    },
                    variant_id: 41327142600817,
                    variant_inventory_management: 'shopify',
                    variant_title: null,
                    vendor: 'Hydrogen Vendor',
                    tax_lines: [],
                    duties: [],
                    discount_allocations: [],
                  },
                ],
                refunds: [],
                shipping_address: {
                  first_name: 'henry',
                  address1: 'Yuimaru Kitchen',
                  phone: null,
                  city: 'Johnson City',
                  zip: '37604',
                  province: 'Tennessee',
                  country: 'United States',
                  last_name: 'waffles',
                  address2: '6',
                  company: null,
                  latitude: 36.3528845,
                  longitude: -82.4006335,
                  name: 'henry waffles',
                  country_code: 'US',
                  province_code: 'TN',
                },
              }),
              query_parameters: {
                topic: ['orders_paid'],
                version: ['pixel'],
                writeKey: ['2mw9SN679HngnZkCHT4oSVVBVmb'],
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
                    topic: 'orders_paid',
                    cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ',
                    checkout_token: '84ad78572dae52a8cbea7d55371afe89',
                    shopifyDetails: {
                      id: 5778367414385,
                      admin_graphql_api_id: 'gid://shopify/Order/5778367414385',
                      cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ',
                      checkout_id: 35550298931313,
                      checkout_token: '84ad78572dae52a8cbea7d55371afe89',
                      contact_email: 'henry@wfls.com',
                      created_at: '2024-11-05T21:54:49-05:00',
                      currency: 'USD',
                      current_subtotal_price: '600.00',
                      current_total_additional_fees_set: null,
                      current_total_discounts: '0.00',
                      current_total_duties_set: null,
                      current_total_price: '600.00',
                      current_total_tax: '0.00',
                      email: 'henry@wfls.com',
                      merchant_of_record_app_id: null,
                      name: '#1017',
                      note: null,
                      note_attributes,
                      order_number: 1017,
                      original_total_additional_fees_set: null,
                      original_total_duties_set: null,
                      payment_gateway_names: ['bogus'],
                      phone: null,
                      po_number: null,
                      presentment_currency: 'USD',
                      processed_at: '2024-11-05T21:54:48-05:00',
                      reference: '4d92cf60cc24a1bd95929e17ead9845f',
                      referring_site: '',
                      source_identifier: '4d92cf60cc24a1bd95929e17ead9845f',
                      subtotal_price: '600.00',
                      subtotal_price_set: {
                        shop_money: {
                          amount: '600.00',
                          currency_code: 'USD',
                        },
                        presentment_money: {
                          amount: '600.00',
                          currency_code: 'USD',
                        },
                      },
                      token: '676613a0027fc8240e16d67fdc9f5ac8',
                      total_discounts: '0.00',
                      total_line_items_price: '600.00',
                      total_outstanding: '0.00',
                      total_price: '600.00',
                      total_tax: '0.00',
                      total_weight: 0,
                      updated_at: '2024-11-05T21:54:50-05:00',
                      user_id: null,
                      billing_address: {
                        first_name: 'yodi',
                        address1: 'Yuma Proving Ground',
                        phone: null,
                        city: 'Yuma Proving Ground',
                        zip: '85365',
                        province: 'Arizona',
                        country: 'United States',
                        last_name: 'waffles',
                        address2: 'suite 001',
                        company: null,
                        latitude: 33.0177811,
                        longitude: -114.2525392,
                        name: 'yodi waffles',
                        country_code: 'US',
                        province_code: 'AZ',
                      },
                      customer: {
                        id: 7358220173425,
                        email: 'henry@wfls.com',
                        created_at: '2024-10-23T16:03:11-04:00',
                        updated_at: '2024-11-05T21:54:49-05:00',
                        first_name: 'yodi',
                        last_name: 'waffles',
                        state: 'disabled',
                        note: null,
                        verified_email: true,
                        multipass_identifier: null,
                        tax_exempt: false,
                        phone: null,
                        email_marketing_consent: {
                          state: 'not_subscribed',
                          opt_in_level: 'single_opt_in',
                          consent_updated_at: null,
                        },
                        sms_marketing_consent: null,
                        tags: '',
                        currency: 'USD',
                        tax_exemptions: [],
                        admin_graphql_api_id: 'gid://shopify/Customer/7358220173425',
                        default_address: {
                          id: 8715246862449,
                          customer_id: 7358220173425,
                          first_name: 'henry',
                          last_name: 'waffles',
                          company: null,
                          address1: 'Yuimaru Kitchen',
                          address2: '6',
                          city: 'Johnson City',
                          province: 'Tennessee',
                          country: 'United States',
                          zip: '37604',
                          phone: null,
                          name: 'henry waffles',
                          province_code: 'TN',
                          country_code: 'US',
                          country_name: 'United States',
                          default: true,
                        },
                      },
                      line_items: [
                        {
                          id: 14234727743601,
                          admin_graphql_api_id: 'gid://shopify/LineItem/14234727743601',
                          attributed_staffs: [],
                          current_quantity: 1,
                          fulfillable_quantity: 1,
                          fulfillment_service: 'manual',
                          fulfillment_status: null,
                          gift_card: false,
                          grams: 0,
                          name: 'The Collection Snowboard: Hydrogen',
                          price: 600,
                          price_set: {
                            shop_money: {
                              amount: '600.00',
                              currency_code: 'USD',
                            },
                            presentment_money: {
                              amount: '600.00',
                              currency_code: 'USD',
                            },
                          },
                          product_exists: true,
                          product_id: '7234590408817',
                          properties: [],
                          quantity: 1,
                          requires_shipping: true,
                          sku: '',
                          taxable: true,
                          title: 'The Collection Snowboard: Hydrogen',
                          total_discount: '0.00',
                          total_discount_set: {
                            shop_money: {
                              amount: '0.00',
                              currency_code: 'USD',
                            },
                            presentment_money: {
                              amount: '0.00',
                              currency_code: 'USD',
                            },
                          },
                          variant_id: 41327142600817,
                          variant_inventory_management: 'shopify',
                          variant_title: null,
                          vendor: 'Hydrogen Vendor',
                          tax_lines: [],
                          duties: [],
                          discount_allocations: [],
                        },
                      ],
                      refunds: [],
                      shipping_address: {
                        first_name: 'henry',
                        address1: 'Yuimaru Kitchen',
                        phone: null,
                        city: 'Johnson City',
                        zip: '37604',
                        province: 'Tennessee',
                        country: 'United States',
                        last_name: 'waffles',
                        address2: '6',
                        company: null,
                        latitude: 36.3528845,
                        longitude: -82.4006335,
                        name: 'henry waffles',
                        country_code: 'US',
                        province_code: 'TN',
                      },
                    },
                  },
                  integrations: {
                    SHOPIFY: true,
                    DATA_WAREHOUSE: {
                      options: {
                        jsonPaths: ['track.context.shopifyDetails'],
                      },
                    },
                  },
                  type: 'track',
                  event: 'Order Paid',
                  properties: {
                    products: [
                      {
                        product_id: '7234590408817',
                        title: 'The Collection Snowboard: Hydrogen',
                        price: 600,
                        brand: 'Hydrogen Vendor',
                        quantity: 1,
                      },
                    ],
                  },
                  traits: {
                    email: 'henry@wfls.com',
                    cart_token_hash: '9125e1da-57b9-5bdc-953e-eb2b0ded5edc',
                  },
                  anonymousId: '50ead33e-d763-4854-b0ab-765859ef05cb',
                },
                {
                  anonymousId: '50ead33e-d763-4854-b0ab-765859ef05cb',
                  context: {
                    integration: {
                      name: 'SHOPIFY',
                    },
                    library: {
                      eventOrigin: 'server',
                      name: 'RudderStack Shopify Cloud',
                      version: '2.0.0',
                    },
                    traits: {
                      email: 'henry@wfls.com',
                    },
                  },
                  integrations: {
                    SHOPIFY: true,
                  },
                  type: 'identify',
                },
              ],
            },
          },
        ],
      },
    },
  },
].map((d2) => ({ ...d2, mockFns }));
