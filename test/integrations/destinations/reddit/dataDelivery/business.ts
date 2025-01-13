import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';

const validRequestPayload = {
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
};

const validRequestMultipleEventsInPayload = {
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
};

const commonHeaders = {
  Authorization: 'Bearer dummyAccessToken',
  'Content-Type': 'application/json',
};

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: validRequestPayload,
};

export const testScenariosForV0API = [
  {
    id: 'reddit_v0_scenario_1',
    name: 'reddit',
    description:
      '[Proxy v0 API] :: Test for a valid request with a successful 200 response from the destination',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: {
                message: 'Successfully processed 1 conversion events.',
              },
              status: 200,
            },
            message:
              '[Generic Response Handler] Request for destination: reddit Processed Successfully',
            status: 200,
          },
        },
      },
    },
  },
];

export const testScenariosForV1API = [
  {
    id: 'reddit_v1_scenario_1',
    name: 'reddit',
    description:
      '[Proxy v1 API] :: Test for a valid request with a successful 200 response from the destination',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/a2_fsddXXXfsfd',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            destinationResponse: {
              response: {
                message: 'Successfully processed 1 conversion events.',
              },
              status: 200,
            },
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },
  {
    id: 'reddit_v1_scenario_2',
    name: 'reddit',
    description:
      '[Proxy v1 API] :: Test for a valid request with a failed 403 response from the destination',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://ads-api.reddit.com/api/v2.0/conversions/events/403_event',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              '{"success":false,"error":{"reason":"UNAUTHORIZED","explanation":"JSON error unexpected type number on field events event_metadata value"}} during reddit response transformation',
            response: [
              {
                metadata: generateMetadata(1),
                statusCode: 403,
                error:
                  '{"success":false,"error":{"reason":"UNAUTHORIZED","explanation":"JSON error unexpected type number on field events event_metadata value"}}',
              },
            ],
            statTags: {
              destType: 'REDDIT',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 403,
          },
        },
      },
    },
  },
  {
    id: 'reddit_v1_scenario_3',
    name: 'reddit',
    description:
      '[Proxy v1 API] :: Test for a valid request with a partial event failure from the destination',
    scenario: 'PartialFailure',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: commonHeaders,
            JSON: validRequestMultipleEventsInPayload,
            endpoint:
              'https://ads-api.reddit.com/api/v2.0/conversions/events/partial_failed_events',
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'REDDIT: Error transformer proxy during REDDIT response transformation',
            response: [
              {
                metadata: { ...generateMetadata(1), dontBatch: true },
                statusCode: 500,
                error:
                  '{"message":"There were 1 invalid conversion events. None were processed.","invalid_events":[{"error_message":"event_at timestamp must be less than 168h0m0s old","event":{"event_at":"2018-10-14T09:03:17.562Z","event_type":{"tracking_type":"Purchase"},"event_metadata":{"item_count":0,"products":[{}],"conversion_id":"c054005afd85a4de74638a776eb8348d44ee875184d7a401830705b7a06e7df1"},"user":{"aaid":"c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a","email":"ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2","external_id":"7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d","ip_address":"e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36","screen_dimensions":{}}}}]}',
              },
              {
                metadata: { ...generateMetadata(2), dontBatch: true },
                statusCode: 500,
                error:
                  '{"message":"There were 1 invalid conversion events. None were processed.","invalid_events":[{"error_message":"event_at timestamp must be less than 168h0m0s old","event":{"event_at":"2018-10-14T09:03:17.562Z","event_type":{"tracking_type":"Purchase"},"event_metadata":{"item_count":0,"products":[{}],"conversion_id":"c054005afd85a4de74638a776eb8348d44ee875184d7a401830705b7a06e7df1"},"user":{"aaid":"c12d34889302d3c656b5699fa9190b51c50d6f62fce57e13bd56b503d66c487a","email":"ac144532d9e4efeab19475d9253a879173ea12a3d2238d1cb8a332a7b3a105f2","external_id":"7b023241a3132b792a5a33915a5afb3133cbb1e13d72879689bf6504de3b036d","ip_address":"e80bd55a3834b7c2a34ade23c7ecb54d2a49838227080f50716151e765a619db","user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36","screen_dimensions":{}}}}]}',
              },
            ],
            statTags: {
              destType: 'REDDIT',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 500,
          },
        },
      },
    },
  },
];
