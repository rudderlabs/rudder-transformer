import utils from '../../../../src/v0/util';

const ANONYMOUS_ID = '97fcd7b2-cc24-47d7-b776-057b7b199513';
const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue(ANONYMOUS_ID);
};

export const data = [
  {
    name: 'webhook',
    description: 'successful webhook request with query params and headers',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                prop1: 'value1',
                prop2: 'value2',
              }),
              method: 'POST',
              url: '/v1/webhook?writeKey=write_key&query_param_key_1=query_param_value_1&query_param_key_2=query_param_value_2',
              proto: 'HTTP/1.1',
              headers: {
                Connection: ['keep-alive'],
                'Content-Length': ['48'],
                'Content-Type': ['application/json'],
              },
              query_parameters: {
                query_param_key_1: ['query_param_value_1'],
                query_param_key_2: ['query_param_value_2'],
                writeKey: ['write_key'],
              },
            },
            source: {},
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'webhook_source_event',
                  properties: {
                    prop1: 'value1',
                    prop2: 'value2',
                  },
                  anonymousId: ANONYMOUS_ID,
                  context: {
                    method: 'POST',
                    url: '/v1/webhook?writeKey=write_key&query_param_key_1=query_param_value_1&query_param_key_2=query_param_value_2',
                    proto: 'HTTP/1.1',
                    headers: {
                      Connection: ['keep-alive'],
                      'Content-Length': ['48'],
                      'Content-Type': ['application/json'],
                    },
                    query_parameters: {
                      query_param_key_1: ['query_param_value_1'],
                      query_param_key_2: ['query_param_value_2'],
                      writeKey: ['write_key'],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    description: 'failed webhook request with malformed JSON body',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: '{"prop1": "value1", "prop2": "value2"',
              method: 'POST',
              url: '/v1/webhook?writeKey=write_key&query_param_key_1=query_param_value_1&query_param_key_2=query_param_value_2',
              proto: 'HTTP/1.1',
              headers: {
                Accept: ['*/*'],
                'Accept-Encoding': ['gzip, deflate, br'],
                Connection: ['keep-alive'],
                'Content-Length': ['48'],
                'Content-Type': ['application/json'],
                'Postman-Token': ['1d06ebe8-086f-44dd-916a-ad5ab26959f6'],
                'User-Agent': ['PostmanRuntime/7.43.0'],
              },
              query_parameters: {
                query_param_key_1: ['query_param_value_1'],
                query_param_key_2: ['query_param_value_2'],
                writeKey: ['write_key'],
              },
            },
            source: {},
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Malformed JSON in request body',
            statTags: {
              destinationId: 'Non determinable',
              errorCategory: 'transformation',
              implementation: 'native',
              module: 'source',
              srcType: 'webhook',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns: () => {
    defaultMockFns();
  },
}));
