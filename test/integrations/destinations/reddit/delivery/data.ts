export const data = [
  {
    name: 'reddit',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
          headers: {
            Authorization: 'Bearer dummyAccessToken',
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          userId: '',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destResp: {
              response: {
                message: 'Successfully processed 1 conversion events.',
              },
              status: 200,
            },
            message: 'Request Processed Successfully',
            status: 200,
          },
        },
      },
    },
  },
  {
    name: 'reddit',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_gsddXXXfsfd',
          headers: {
            Authorization: 'Bearer dummyAccessToken',
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          userId: '',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            authErrorCategory: 'REFRESH_TOKEN',
            destinationResponse: {
              response: 'Authorization Required',
              status: 401,
            },
            message:
              "Request failed due to Authorization Required 'during reddit response transformation'",
            statTags: {
              destType: 'REDDIT',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 500,
          },
        },
      },
    },
  },
];
