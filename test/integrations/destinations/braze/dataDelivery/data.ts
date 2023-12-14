import MockAdapter from 'axios-mock-adapter';

export const data = [
  {
    name: 'braze',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test1',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'braze',
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
            status: 201,
            message: 'Request for braze Processed Successfully',
            destinationResponse: {
              response: {
                aliases_processed: 1,
                message: 'success',
              },
              status: 201,
            },
          },
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test2',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'braze',
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
            status: 201,
            message: 'Request for braze Processed Successfully',
            destinationResponse: {
              response: {
                message: 'success',
                errors: ['minor error message'],
              },
              status: 201,
            },
          },
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test3',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'braze',
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
            status: 201,
            message: 'Request failed for braze with status: 201',
            destinationResponse: {
              response: {
                message: 'fatal error message',
                errors: ['minor error message'],
              },
              status: 201,
            },
            statTags: {
              destType: 'BRAZE',
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
    name: 'braze',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test4',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'braze',
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
            status: 201,
            message: 'Request for braze Processed Successfully',
            destinationResponse: {
              response: '',
              status: 201,
            },
          },
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test5',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'braze',
          },
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
            message: 'Request failed for braze with status: 500',
            destinationResponse: {
              response: '',
              status: 500,
            },
            statTags: {
              destType: 'BRAZE',
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
    name: 'braze',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test6',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'braze',
          },
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
            message: 'Request failed for braze with status: 500',
            destinationResponse: {
              response: '',
              status: 500,
            },
            statTags: {
              destType: 'BRAZE',
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
    mockFns: (mockAdapter: MockAdapter) => {
      // params has `{ destination: salesforce }`
      mockAdapter
        .onPost(
          'https://rest.iad-03.braze.com/users/identify/test6',
          {
            aliases_to_identify: [
              {
                external_id: 'gabi_userId_45',
                user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
              },
            ],
          },
          {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
            'User-Agent': 'RudderLabs',
          },
        )
        .replyOnce((config) => {
          // @ts-ignore
          const err = AxiosError.from('DNS not found', 'ENOTFOUND', config);
          return Promise.reject(err);
        });
    },
  },
  {
    name: 'braze',
    description: 'Test 6',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test7',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'braze',
          },
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
            message: 'Request failed for braze with status: 500',
            destinationResponse: {
              response: '',
              status: 500,
            },
            statTags: {
              destType: 'BRAZE',
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
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with v0 proxy handler',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test1',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          metadata: [
            {
              jobId: 2,
              attemptNum: 0,
              userId: '',
              sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
              secret: {
                access_token: 'secret',
                refresh_token: 'refresh',
                developer_token: 'developer_Token',
              },
            },
          ],
          files: {},
          params: {
            destination: 'braze',
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
            response: [
              {
                error: '{"aliases_processed":1,"message":"success"}',
                statusCode: 201,
                metadata: {
                  jobId: 2,
                  attemptNum: 0,
                  userId: '',
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                  secret: {
                    access_token: 'secret',
                    refresh_token: 'refresh',
                    developer_token: 'developer_Token',
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with v0 proxy handler Error returned',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/testV1',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              aliases_to_identify: [
                {
                  external_id: 'gabi_userId_45',
                  user_alias: {
                    alias_label: 'rudder_id',
                    alias_name: 'gabi_anonId_45',
                  },
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          metadata: [
            {
              jobId: 2,
              attemptNum: 0,
              userId: '',
              sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
              secret: {
                access_token: 'secret',
                refresh_token: 'refresh',
                developer_token: 'developer_Token',
              },
            },
          ],
          files: {},
          params: {
            destination: 'braze',
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
            response: [
              {
                error: '{"code":400,"message":"Bad Req","status":"Fail Case"}',
                statusCode: 401,
                metadata: {
                  jobId: 2,
                  attemptNum: 0,
                  userId: '',
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                  secret: {
                    access_token: 'secret',
                    refresh_token: 'refresh',
                    developer_token: 'developer_Token',
                  },
                },
              },
            ],
            statTags: {
              destType: 'BRAZE',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
            },
          },
        },
      },
    },
  },
  {
    name: 'braze',
    description:
      'Test Transformer Proxy V1 input with v0 proxy handler Error returned Multiple metadata Track Event',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://rest.iad-03.braze.com/users/track/testV1',
          method: 'POST',
          userId: 'gabi_userId_45',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer api_key',
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              partner: 'RudderStack',
              attributes: [
                {
                  email: '123@a.com',
                  city: 'Disney',
                  country: 'USA',
                  firstname: 'Mickey',
                  external_id: '456345345',
                },
                {
                  email: '123@a.com',
                  city: 'Disney',
                  country: 'USA',
                  firstname: 'Mickey',
                  external_id: '456345345',
                },
                {
                  email: '123@a.com',
                  city: 'Disney',
                  country: 'USA',
                  firstname: 'Mickey',
                  external_id: '456345345',
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
          },
          metadata: [
            {
              jobId: 2,
              attemptNum: 0,
              userId: '',
              sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
              secret: {
                access_token: 'secret',
                refresh_token: 'refresh',
                developer_token: 'developer_Token',
              },
            },
            {
              jobId: 3,
              attemptNum: 0,
              userId: '',
              sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
              secret: {
                access_token: 'secret',
                refresh_token: 'refresh',
                developer_token: 'developer_Token',
              },
            },
            {
              jobId: 4,
              attemptNum: 0,
              userId: '',
              sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
              secret: {
                access_token: 'secret',
                refresh_token: 'refresh',
                developer_token: 'developer_Token',
              },
            },
          ],
          files: {},
          params: {
            destination: 'braze',
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
            response: [
              {
                error:
                  '{"message":"Valid data must be provided in the \'attributes\', \'events\', or \'purchases\' fields.","errors":[{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":0},{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":1}]}',
                statusCode: 401,
                metadata: {
                  jobId: 2,
                  attemptNum: 0,
                  userId: '',
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                  secret: {
                    access_token: 'secret',
                    refresh_token: 'refresh',
                    developer_token: 'developer_Token',
                  },
                },
              },
              {
                error:
                  '{"message":"Valid data must be provided in the \'attributes\', \'events\', or \'purchases\' fields.","errors":[{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":0},{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":1}]}',
                statusCode: 401,
                metadata: {
                  jobId: 3,
                  attemptNum: 0,
                  userId: '',
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                  secret: {
                    access_token: 'secret',
                    refresh_token: 'refresh',
                    developer_token: 'developer_Token',
                  },
                },
              },
              {
                error:
                  '{"message":"Valid data must be provided in the \'attributes\', \'events\', or \'purchases\' fields.","errors":[{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":0},{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":1}]}',
                statusCode: 401,
                metadata: {
                  jobId: 4,
                  attemptNum: 0,
                  userId: '',
                  sourceId: '2Vsge2uWYdrLfG7pZb5Y82eo4lr',
                  destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
                  workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
                  secret: {
                    access_token: 'secret',
                    refresh_token: 'refresh',
                    developer_token: 'developer_Token',
                  },
                },
              },
            ],
            statTags: {
              destType: 'BRAZE',
              destinationId: '2RHh08uOsXqE9KvCDg3hoaeuK2L',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: '2Csl0lSTbuM3qyHdaOQB2GcDH8o',
            },
          },
        },
      },
    },
  },
];
