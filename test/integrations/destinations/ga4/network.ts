export const networkCallsData = [
  {
    httpReq: {
      url: 'https://www.google-analytics.com/mp/collect',
      headers: {
        HOST: 'www.google-analytics.com',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      params: {
        api_secret: 'dummyApiSecret',
        measurement_id: 'dummyMeasurementId',
      },
      data: {
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
      method: 'POST',
    },
    httpRes: {
      data: {
        validationMessages: [],
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://www.google-analytics.com/debug/mp/collect',
      headers: {
        HOST: 'www.google-analytics.com',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      params: {
        api_secret: 'dummyApiSecret',
        measurement_id: 'dummyMeasurementId',
      },
      data: {
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
              details_specifications_specifications_specifications_specifications_color: 'blue',
              details_specifications_specifications_specifications_specifications_weight: '1.5kg',
            },
          },
        ],
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        validationMessages: [
          {
            fieldPath: 'events.params',
            description:
              'The event param [string_value: "1.5kg"] has a duplicate name [details_specifications_specifications_specifications_specifications_weight].',
            validationCode: 'NAME_DUPLICATED',
          },
        ],
      },
      status: 200,
    },
  },
];
