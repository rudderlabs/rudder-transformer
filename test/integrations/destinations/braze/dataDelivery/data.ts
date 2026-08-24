import { testScenariosForV1API } from './business';
import { otherScenariosV1 } from './other';
import { authHeader1 } from '../maskedSecrets';

export const existingTestData = [
  {
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with Braze v1 proxy handler',
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
            Authorization: authHeader1,
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
            message: 'Request for braze Processed Successfully',
            response: [
              {
                error: JSON.stringify({ aliases_processed: 1, message: 'success' }),
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
            status: 201,
          },
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with Braze v1 proxy handler Error returned',
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
            Authorization: authHeader1,
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
            status: 401,
            response: [
              {
                error: JSON.stringify({ code: 400, message: 'Bad Req', status: 'Fail Case' }),
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
            message: 'Request failed for braze with status: 401',
          },
        },
      },
    },
  },
  {
    name: 'braze',
    description:
      'Test Transformer Proxy V1 input with Braze v1 proxy handler Error returned Multiple metadata Track Event',
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
            Authorization: authHeader1,
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
            status: 401,
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
            message: 'Request failed for braze with status: 401',
          },
        },
      },
    },
  },
];

export const data = [...existingTestData, ...testScenariosForV1API, ...otherScenariosV1];
