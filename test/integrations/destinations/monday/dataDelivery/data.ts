import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';

const commonHeaders = {
  Authorization: 'authToken',
};

const commonRequestParameters = {
  headers: commonHeaders,
};

export const data: ProxyV1TestData[] = [
  {
    id: 'monday_v1_scenario_1',
    name: 'monday',
    description: 'Sucess reponse from monday',
    feature: 'dataDelivery',
    successCriteria: 'Should return 200 with no error with destination response',
    module: 'destination',
    scenario: 'Business',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint: 'https://api.monday.com/v2',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MONDAY Response V1 Handler] - Request Processed Successfully',
            response: [
              {
                error: 'success',
                statusCode: 200,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'monday_v1_scenario_2',
    name: 'monday',
    description: 'Error response with 200 status',
    feature: 'dataDelivery',
    successCriteria: 'Should return 200 with no error with destination response',
    module: 'destination',
    scenario: 'Business',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          headers: {
            Authorization: 'errorAuth',
          },
          endpoint: 'https://api.monday.com/v2',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MONDAY Response V1 Handler] - Request Processed Successfully',
            response: [
              {
                error: "Field 'region' doesn't exist on type 'User'",
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'monday_v1_scenario_3',
    name: 'monday',
    description: 'Rate limit exceeded request',
    feature: 'dataDelivery',
    successCriteria: 'Should return throlled with correct status code',
    module: 'destination',
    scenario: 'Business',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          headers: {
            Authorization: 'rateLimitAuthToken',
          },
          endpoint: 'https://api.monday.com/v2',
        }),
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
                error: JSON.stringify({ error_message: 'Rate Limit Exceeded.', status_code: 429 }),
                statusCode: 429,
                metadata: generateMetadata(1),
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'throttled',
              destType: 'MONDAY',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              'MONDAY: Error encountered in transformer proxy V1 with error: Rate Limit Exceeded.',
            status: 429,
          },
        },
      },
    },
  },
  {
    id: 'monday_v1_scenario_4',
    name: 'monday',
    description: 'Invalid request with bad query data',
    feature: 'dataDelivery',
    successCriteria: 'Should return 400 with error message',
    module: 'destination',
    scenario: 'Business',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          headers: {
            Authorization: 'internalServerAuthToken',
          },
          endpoint: 'https://api.monday.com/v2',
        }),
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
                error: JSON.stringify({ error_message: 'Internal server error', status_code: 500 }),
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'MONDAY',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              'MONDAY: Error encountered in transformer proxy V1 with error: Internal server error',
            status: 500,
          },
        },
      },
    },
  },
];
