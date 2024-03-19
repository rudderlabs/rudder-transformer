const headers = {
  HOST: 'www.google-analytics.com',
  'Content-Type': 'application/json',
};

const params = {
  api_secret: 'dymmyApiSecret',
};

const dataDeliveryMocksData = [
  {
    description: 'Mock response from destination depicting a valid request',
    httpReq: {
      method: 'post',
      url: 'https://www.google-analytics.com/debug/mp/collect',
      data: {
        events: [
          {
            name: 'sign_up',
            params: {
              method: 'google',
              engagement_time_msec: 1,
            },
          },
        ],
        user_id: 'dummyUserId',
        client_id: 'dummyClientId',
        non_personalized_ads: true,
      },
      headers,
      params,
    },
    httpRes: {
      data: {
        validationMessages: [],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response from destination depicting a invalid event name request',
    httpReq: {
      method: 'post',
      url: 'https://www.google-analytics.com/debug/mp/collect',
      data: {
        events: [
          {
            name: 'campaign@details',
            params: {
              term: 'summer+travel',
              medium: 'cpc',
              source: 'google',
              content: 'logo link',
              campaign: 'Summer_fun',
              campaign_id: 'google_1234',
              engagement_time_msec: 1,
            },
          },
        ],
        user_id: 'dummyUserId',
        client_id: 'dummyClientId',
        non_personalized_ads: true,
      },
      headers,
      params,
    },
    httpRes: {
      data: {
        validationMessages: [
          {
            fieldPath: 'events',
            description:
              'Event at index: [0] has invalid name [campaign@details]. Only alphanumeric characters and underscores are allowed.',
            validationCode: 'NAME_INVALID',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response from destination depicting a invalid parameter value request',
    httpReq: {
      method: 'post',
      url: 'https://www.google-analytics.com/debug/mp/collect',
      data: {
        events: [
          {
            name: 'add_to_cart',
            params: {
              currency: 'USD',
              value: 7.77,
              engagement_time_msec: 1,
              items: [
                {
                  item_id: '507f1f77bcf86cd799439011',
                  item_name: 'Monopoly: 3rd Edition',
                  coupon: 'SUMMER_FUN',
                  item_category: 'Apparel',
                  item_brand: 'Google',
                  item_variant: 'green',
                  price: '$19',
                  quantity: 2,
                  affiliation: 'Google Merchandise Store',
                  currency: 'USD',
                  item_list_id: 'related_products',
                  item_list_name: 'Related Products',
                  location_id: 'L_12345',
                },
              ],
            },
          },
        ],
        user_id: 'dummyUserId',
        client_id: 'dummyClientId',
        non_personalized_ads: true,
      },
      headers,
      params,
    },
    httpRes: {
      data: {
        validationMessages: [
          {
            description:
              'Validation of item.price should prevent conversion from unsupported value [string_value: "$19"]',
            validationCode: 'INTERNAL_ERROR',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
];

export const networkCallsData = [...dataDeliveryMocksData];
