import { AxiosError } from 'axios';
import MockAxiosAdapter from 'axios-mock-adapter';
import lodash from 'lodash';

export const data = [
  {
    name: 'tiktok_ads',
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
          endpoint: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
          headers: {
            'Access-Token': 'dummyAccessToken',
            'Content-Type': 'application/json',
            'test-dest-response-key': 'successResponse',
          },
          body: {
            JSON: {
              pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
              partner_name: 'RudderStack',
              event: 'CompletePayment',
              event_id: '1616318632825_357',
              timestamp: '2020-09-17T19:49:27Z',
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: '1077218',
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: '1197218',
                  },
                ],
                currency: 'USD',
                value: 46,
              },
              context: {
                ad: {
                  callback: '123ATXSfe',
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                user: {
                  external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                  phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                },
                ip: '13.57.97.131',
                user_agent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
              },
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'tiktok_ads',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[TIKTOK_ADS Response Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                code: 0,
                message: 'OK',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'tiktok_ads',
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
          endpoint: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
          headers: {
            'Access-Token': 'dummyAccessToken',
            'Content-Type': 'application/json',
            'test-dest-response-key': 'invalidDataTypeResponse',
          },
          body: {
            JSON: {
              pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
              partner_name: 'RudderStack',
              event: 'CompletePayment',
              event_id: '1616318632825_357',
              timestamp: '2020-09-17T19:49:27Z',
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: 1077218,
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: 1197218,
                  },
                ],
                currency: 'USD',
                value: 46,
              },
              context: {
                ad: {
                  callback: '123ATXSfe',
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                user: {
                  external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                  phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                },
                ip: '13.57.97.131',
                user_agent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
              },
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'tiktok_ads',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Request failed with status: 40002',
            destinationResponse: {
              response: {
                code: 40002,
                message: 'Batch.0.properties.contents.0.content_id: Not a valid string',
              },
              status: 200,
            },
            statTags: {
              destType: 'TIKTOK_ADS',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
          headers: {
            'Access-Token': 'dummyAccessToken',
            'Content-Type': 'application/json',
            'test-dest-response-key': 'invalidPermissionsResponse',
          },
          body: {
            JSON: {
              pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
              partner_name: 'RudderStack',
              event: 'CompletePayment',
              event_id: '1616318632825_357',
              timestamp: '2020-09-17T19:49:27Z',
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: 1077218,
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: 1197218,
                  },
                ],
                currency: 'USD',
                value: 46,
              },
              context: {
                ad: {
                  callback: '123ATXSfe',
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                user: {
                  external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                  phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                },
                ip: '13.57.97.131',
                user_agent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
              },
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'tiktok_ads',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Request failed with status: 40001',
            destinationResponse: {
              response: {
                code: 40001,
                message:
                  'No permission to operate pixel code: BU35TSQHT2A1QT375OMG. You must be an admin or operator of this advertiser account.',
              },
              status: 200,
            },
            statTags: {
              destType: 'TIKTOK_ADS',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
          headers: {
            'Access-Token': 'dummyAccessToken',
            'Content-Type': 'application/json',
            'test-dest-response-key': 'tooManyRequests',
          },
          body: {
            JSON: {
              pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
              partner_name: 'RudderStack',
              event: 'CompletePayment',
              event_id: '1616318632825_357',
              timestamp: '2020-09-17T19:49:27Z',
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: 1077218,
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: 1197218,
                  },
                ],
                currency: 'USD',
                value: 46,
              },
              context: {
                ad: {
                  callback: '123ATXSfe',
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                user: {
                  external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                  phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                },
                ip: '13.57.97.131',
                user_agent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
              },
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'tiktok_ads',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            status: 429,
            message: 'Request failed with status: 40100',
            destinationResponse: {
              response: {
                code: 40100,
                message: 'Too many requests. Please retry in some time.',
              },
              status: 200,
            },
            statTags: {
              destType: 'TIKTOK_ADS',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
          headers: {
            'Access-Token': 'dummyAccessToken',
            'Content-Type': 'application/json',
            'test-dest-response-key': '502-BadGateway',
          },
          params: {
            destination: 'tiktok_ads',
          },
          body: {
            JSON: {
              pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
              partner_name: 'RudderStack',
              event: 'CompletePayment',
              event_id: '1616318632825_357',
              timestamp: '2020-09-17T19:49:27Z',
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: 1077218,
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: 1197218,
                  },
                ],
                currency: 'USD',
                value: 46,
              },
              context: {
                ad: {
                  callback: '123ATXSfe',
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                user: {
                  external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                  phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                },
                ip: '13.57.97.131',
                user_agent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
              },
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 502,
        body: {
          output: {
            status: 502,
            message: 'Request failed with status: 502',
            destinationResponse: {
              response:
                '<html>\r\n<head><title>502 Bad Gateway</title></head>\r\n<body bgcolor="white">\r\n<center><h1>502 Bad Gateway</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>\r\n',
              status: 502,
            },
            statTags: {
              destType: 'TIKTOK_ADS',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'tiktok_ads',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
          headers: {
            'Access-Token': 'dummyAccessToken',
            'Content-Type': 'application/json',
          },
          params: {
            destination: 'tiktok_ads',
          },
          body: {
            JSON: {
              pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
              partner_name: 'RudderStack',
              event: 'CompletePayment',
              event_id: '1616318632825_357',
              timestamp: '2020-09-17T19:49:27Z',
              properties: {
                contents: [
                  {
                    price: 8,
                    quantity: 2,
                    content_type: 'socks',
                    content_id: 1077218,
                  },
                  {
                    price: 30,
                    quantity: 1,
                    content_type: 'dress',
                    content_id: 1197218,
                  },
                ],
                currency: 'USD',
                value: 46,
              },
              context: {
                ad: {
                  callback: '123ATXSfe',
                },
                page: {
                  url: 'http://demo.mywebsite.com/purchase',
                  referrer: 'http://demo.mywebsite.com',
                },
                user: {
                  external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                  phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                  email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                },
                ip: '13.57.97.131',
                user_agent:
                  'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
              },
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message: 'Request failed with status: 500',
            destinationResponse: {
              response: '[ECONNRESET] :: Connection reset by peer',
              status: 500,
            },
            statTags: {
              destType: 'TIKTOK_ADS',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAxiosAdapter) => {
      mockAdapter
        .onPost(
          'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
          {
            asymmetricMatch: (actual) => {
              const expected = {
                pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
                partner_name: 'RudderStack',
                event: 'CompletePayment',
                event_id: '1616318632825_357',
                timestamp: '2020-09-17T19:49:27Z',
                properties: {
                  contents: [
                    {
                      price: 8,
                      quantity: 2,
                      content_type: 'socks',
                      content_id: 1077218, // casted to string
                    },
                    {
                      price: 30,
                      quantity: 1,
                      content_type: 'dress',
                      content_id: 1197218, // casted to string
                    },
                  ],
                  currency: 'USD',
                  value: 46,
                },
                context: {
                  ad: {
                    callback: '123ATXSfe',
                  },
                  page: {
                    url: 'http://demo.mywebsite.com/purchase',
                    referrer: 'http://demo.mywebsite.com',
                  },
                  user: {
                    external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
                    phone_number:
                      '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
                    email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
                  },
                  ip: '13.57.97.131',
                  user_agent:
                    'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
                },
              };
              const isMatched = lodash.isMatch(actual, expected);
              return isMatched;
            },
          },
          {
            asymmetricMatch: (actualHeader) => {
              const isMatched = lodash.isMatch(actualHeader, {
                'Access-Token': 'dummyAccessToken',
                'Content-Type': 'application/json',
              });
              return isMatched;
            },
          },
        )
        .reply((config) => {
          // @ts-ignore
          const err = AxiosError.from('Connection reset by peer', 'ECONNRESET', config);
          return Promise.reject(err);
        });
    },
  },
];
