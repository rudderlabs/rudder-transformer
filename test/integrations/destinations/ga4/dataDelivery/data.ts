export const data = [
  {
    name: 'ga4',
    description: 'Successful data delivery',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
            measurement_id: 'dummyMeasurementId',
          },
          body: {
            JSON: {
              client_id: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              timestamp_micros: 1650950229000000,
              non_personalized_ads: true,
              events: [
                {
                  name: 'view_item_list',
                  params: {
                    item_list_id: 'related_products',
                    item_list_name: 'Related_products',
                    items: [
                      {
                        item_id: '507f1f77bcf86cd799439011',
                        item_name: 'Monopoly: 3rd Edition',
                        coupon: 'SUMMER_FUN',
                        item_category: 'Apparel',
                        item_brand: 'Google',
                        item_variant: 'green',
                        price: 19,
                        quantity: 2,
                        index: 1,
                        affiliation: 'Google Merchandise Store',
                        currency: 'USD',
                        discount: 2.22,
                        item_category2: 'Adult',
                        item_category3: 'Shirts',
                        item_category4: 'Crew',
                        item_category5: 'Short sleeve',
                        item_list_id: 'related_products',
                        item_list_name: 'Related Products',
                        location_id: 'L_12345',
                      },
                    ],
                    engagement_time_msec: 1,
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          userId: '',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: {
                validationMessages: [],
              },
              status: 200,
            },
            message: '[GA4 Response Handler] - Request Processed Successfully',
            status: 200,
          },
        },
      },
    },
  },
  {
    name: 'ga4',
    description: 'Data delivery failure',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://www.google-analytics.com/debug/mp/collect',
          headers: {
            HOST: 'www.google-analytics.com',
            'Content-Type': 'application/json',
          },
          params: {
            api_secret: 'dummyApiSecret',
            measurement_id: 'dummyMeasurementId',
          },
          body: {
            JSON: {
              client_id: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              timestamp_micros: 1650950229000000,
              non_personalized_ads: true,
              events: [
                {
                  name: 'view_item',
                  params: {
                    category: 'Electronics',
                    productID: 'ABC123',
                    productName: 'Example Product',
                    customer_name: 'Sample User',
                    link_imageURL: 'https://example.com/images/product.jpg',
                    customer_email: 'testrudder@gmail.com',
                    link_productURL: 'https://example.com/products/ABC123',
                    stockAvailability: true,
                    details_features_0: 'wireless charging',
                    details_features_1: 'water-resistant',
                    engagement_time_msec: 1,
                    transaction_currency: 'USD',
                    customer_loyaltyPoints: 500,
                    transaction_totalAmount: 150.99,
                    transaction_discountApplied: 20.5,
                    details_specifications_color: 'blue',
                    details_specifications_specifications_specifications_specifications_color:
                      'blue',
                    details_specifications_specifications_specifications_specifications_weight:
                      '1.5kg',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          userId: '',
        },
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse:
              'The event param [string_value: "1.5kg"] has a duplicate name [details_specifications_specifications_specifications_specifications_weight].',
            message:
              'Validation Server Response Handler:: Validation Error for ga4 of field path :events.params | NAME_DUPLICATED-The event param [string_value: "1.5kg"] has a duplicate name [details_specifications_specifications_specifications_specifications_weight].',
            statTags: {
              destType: 'GA4',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
];
