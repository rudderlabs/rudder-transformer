export const networkCallsData = [
  {
    httpReq: {
      url: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
      data: {
        events: [
          {
            event_at: '2019-10-14T09:03:17.562Z',
            event_type: {
              tracking_type: 'Purchase',
            },
            user: {
              aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
              email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
              external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
              ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
              user_agent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              screen_dimensions: {},
            },
            event_metadata: {
              item_count: 3,
              products: [
                {
                  id: '123',
                  name: 'Monopoly',
                  category: 'Games',
                },
                {
                  id: '345',
                  name: 'UNO',
                  category: 'Games',
                },
              ],
            },
          },
        ],
      },
      params: { destination: 'reddit' },
      headers: {
        Authorization: 'Bearer dummyAccessToken',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        message: 'Successfully processed 1 conversion events.',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_gsddXXXfsfd',
      data: {
        events: [
          {
            event_at: '2019-10-14T09:03:17.562Z',
            event_type: {
              tracking_type: 'ViewContent',
            },
            user: {
              aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
              email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
              external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
              ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
              user_agent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              screen_dimensions: {},
            },
            event_metadata: {
              item_count: 3,
              products: [
                {
                  id: '123',
                  name: 'Monopoly',
                  category: 'Games',
                },
                {
                  id: '345',
                  name: 'UNO',
                  category: 'Games',
                },
              ],
            },
          },
        ],
      },
      params: { destination: 'reddit' },
      headers: {
        Authorization: 'Bearer dummyAccessToken',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: { data: 'Authorization Required', status: 401, statusText: 'Unauthorized' },
  },
  {
    httpReq: {
      url: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_objResp_401',
      data: {
        events: [
          {
            event_at: '2019-10-14T09:03:17.562Z',
            event_type: {
              tracking_type: 'ViewContent',
            },
            user: {
              aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
              email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
              external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
              ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
              user_agent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              screen_dimensions: {},
            },
            event_metadata: {
              item_count: 3,
              products: [
                {
                  id: '123',
                  name: 'Monopoly',
                  category: 'Games',
                },
                {
                  id: '345',
                  name: 'UNO',
                  category: 'Games',
                },
              ],
            },
          },
        ],
      },
      params: { destination: 'reddit' },
      headers: {
        Authorization: 'Bearer dummyAccessToken',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        success: false,
        error: {
          reason: 'UNAUTHORIZED',
          explanation:
            'This server could not verify that you are authorized to access the document you requested.',
        },
      },
      status: 401,
      statusText: 'Unauthorized',
    },
  },
  {
    httpReq: {
      url: 'https://ads-api.reddit.com/api/v2.0/conversions/events/403_event',
      data: {
        events: [
          {
            event_at: '2019-10-14T09:03:17.562Z',
            event_type: {
              tracking_type: 'Purchase',
            },
            user: {
              aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
              email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
              external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
              ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
              user_agent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              screen_dimensions: {},
            },
            event_metadata: {
              item_count: 3,
              products: [
                {
                  id: '123',
                  name: 'Monopoly',
                  category: 'Games',
                },
                {
                  id: '345',
                  name: 'UNO',
                  category: 'Games',
                },
              ],
            },
          },
        ],
      },
      params: { destination: 'reddit' },
      headers: {
        Authorization: 'Bearer dummyAccessToken',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        success: false,
        error: {
          reason: 'UNAUTHORIZED',
          explanation: 'JSON error unexpected type number on field events event_metadata value',
        },
      },
      status: 403,
      statusText: 'Unauthorized',
    },
  },
  {
    httpReq: {
      url: 'https://ads-api.reddit.com/api/v2.0/conversions/events/partial_failed_events',
      data: {
        events: [
          {
            event_at: '2019-10-14T09:03:17.562Z',
            event_type: {
              tracking_type: 'Purchase',
            },
            user: {
              aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
              email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
              external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
              ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
              user_agent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              screen_dimensions: {},
            },
            event_metadata: {
              item_count: 3,
              products: [
                {
                  id: '123',
                  name: 'Monopoly',
                  category: 'Games',
                },
                {
                  id: '345',
                  name: 'UNO',
                  category: 'Games',
                },
              ],
            },
          },
          {
            event_at: '2018-10-14T09:03:17.562Z',
            event_type: {
              tracking_type: 'Purchase',
            },
            user: {
              aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
              email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
              external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
              ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
              user_agent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              screen_dimensions: {},
            },
            event_metadata: {
              item_count: 3,
              products: [
                {
                  id: '123',
                  name: 'Monopoly',
                  category: 'Games',
                },
                {
                  id: '345',
                  name: 'UNO',
                  category: 'Games',
                },
              ],
            },
          },
        ],
      },
      params: { destination: 'reddit' },
      headers: {
        Authorization: 'Bearer dummyAccessToken',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        message: 'There were 1 invalid conversion events. None were processed.',
        invalid_events: [
          {
            error_message: 'event_at timestamp must be less than 168h0m0s old',
            event: {
              event_at: '2018-10-14T09:03:17.562Z',
              event_type: {
                tracking_type: 'Purchase',
              },
              event_metadata: {
                item_count: 0,
                products: [{}],
                conversion_id: 'c054005afd85a4de74638a776eb8348d44ee875184d7a401830705b7a06e7df1',
              },
              user: {
                aaid: 'c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a',
                email: 'ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2',
                external_id: '7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d',
                ip_address: 'e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db',
                user_agent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                screen_dimensions: {},
              },
            },
          },
        ],
      },
      status: 400,
      statusText: 'Bad Request',
    },
  },
];
