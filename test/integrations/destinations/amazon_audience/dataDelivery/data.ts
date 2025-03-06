import { generateMetadata, generateProxyV0Payload } from '../../../testUtils';
import { authHeader1, authHeader2 } from '../maskedSecrets';

const commonStatTags = {
  destType: 'AMAZON_AUDIENCE',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};
export const data = [
  {
    name: 'amazon_audience',
    id: 'Test 0',
    description: 'Successfull Delivery case',
    successCriteria: 'It should be passed with 200 Ok with no errors',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            Authorization: authHeader1,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          endpoint: '',
          JSON: {
            associateUsers: {
              patches: [
                {
                  op: 'remove',
                  path: '/EXTERNAL_USER_ID-Rudderstack_c73bcaadd94985269eeafd457c9f395135874dad5536cf1f6d75c132f602a14c/audiences',
                  value: ['dummyId'],
                },
              ],
            },
            createUsers: {
              records: [
                {
                  externalId:
                    'Rudderstack_c73bcaadd94985269eeafd457c9f395135874dad5536cf1f6d75c132f602a14c',
                  hashedRecords: [
                    {
                      email: 'email4@abc.com',
                    },
                  ],
                },
              ],
            },
          },
        }),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[amazon_audience Response Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                requestId: 'dummy request id',
                jobId: 'dummy job id',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'amazon_audience',
    id: 'Test 1',
    description: 'Unsuccessfull Delivery case for step 2',
    successCriteria: 'It should be passed with 500 Internal with error with invalid payload',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            Authorization: authHeader1,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          endpoint: '',
          JSON: {
            associateUsers: {
              patches: [
                {
                  op: 'add',
                  path: '/EXTERNAL_USER_ID-Fail_Case/audiences',
                  value: ['dummyId'],
                },
              ],
            },
            createUsers: {
              records: [
                {
                  externalId:
                    'Rudderstack_c73bcaadd94985269eeafd457c9f395135874dad5536cf1f6d75c132f602a14c',
                  hashedRecords: [
                    {
                      email: 'email4@abc.com',
                    },
                  ],
                },
              ],
            },
          },
        }),
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            destinationResponse: {
              response: {
                code: 'Internal Error',
              },
              status: 500,
            },
            message: 'Request Failed: during amazon_audience response transformation (Retryable)',
            statTags: {
              destType: 'AMAZON_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
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
    name: 'amazon_audience',
    id: 'Test 2 - Oauth Refresh Token',
    description: 'Unsuccessfull Access Error for step 1',
    successCriteria: 'It should be passed with 401 Unauthorized error',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          headers: {
            Authorization: authHeader2,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          endpoint: '',
          JSON: {
            associateUsers: [],
            createUsers: {
              records: [
                {
                  externalId: 'access token expired fail case',
                  hashedRecords: [],
                },
              ],
            },
          },
        }),
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            destinationResponse: {
              message: 'Unauthorized',
            },
            authErrorCategory: 'REFRESH_TOKEN',
            message: 'Unauthorized during creating users',
            statTags: commonStatTags,
          },
        },
      },
    },
  },
];
