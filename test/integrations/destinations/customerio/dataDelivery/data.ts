import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { authHeader1 } from '../maskedSecrets';

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const params = { destination: 'customerio' };

export const v1BusinessTestScenarios: ProxyV1TestData[] = [
  {
    id: 'customerio_dataDelivery_200',
    name: 'customerio',
    description: '[200] All items in batch committed successfully',
    feature: 'dataDelivery',
    scenario: 'business',
    successCriteria: 'All jobs should return statusCode 200',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: { ...commonHeaders, 'test-dest-response-key': '200-success' },
            params,
            endpoint: 'https://track.customer.io/api/v2/batch',
            endpointPath: 'v2/batch',
            JSON: {
              batch: [
                {
                  type: 'person',
                  action: 'identify',
                  identifiers: { id: 'user-1' },
                  attributes: { plan: 'pro' },
                },
              ],
            },
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
            status: 200,
            message: '[CustomerIO Response Handler] - Request Processed Successfully',
            response: [{ statusCode: 200, metadata: generateMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'customerio_dataDelivery_207',
    name: 'customerio',
    description: '[207] Partial failure — failed item gets 400, others get 200',
    feature: 'dataDelivery',
    scenario: 'business',
    successCriteria: 'Job at batch_index 1 gets statusCode 400; job at index 0 gets 200',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: { ...commonHeaders, 'test-dest-response-key': '207-partial' },
            params,
            endpoint: 'https://track.customer.io/api/v2/batch',
            endpointPath: 'v2/batch',
            JSON: {
              batch: [
                {
                  type: 'person',
                  action: 'identify',
                  identifiers: { id: 'user-ok' },
                  attributes: { plan: 'pro' },
                },
                {
                  type: 'person',
                  action: 'identify',
                  identifiers: { id: 'user-bad' },
                  attributes: { plan: 'bad' },
                },
              ],
            },
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
            status: 207,
            message: '[CustomerIO Response Handler] - Batch completed with partial failures',
            response: [
              { statusCode: 200, metadata: generateMetadata(1), error: 'success' },
              { statusCode: 400, metadata: generateMetadata(2), error: 'invalid attribute' },
            ],
          },
        },
      },
    },
  },
  {
    id: 'customerio_dataDelivery_400',
    name: 'customerio',
    description: '[400] Whole batch aborted — TransformerProxyError thrown',
    feature: 'dataDelivery',
    scenario: 'business',
    successCriteria: 'Should surface the 400 error through TransformerProxyError',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: { ...commonHeaders, 'test-dest-response-key': '400-bad-request' },
            params,
            endpoint: 'https://track.customer.io/api/v2/batch',
            endpointPath: 'v2/batch',
            JSON: {
              batch: [{ type: 'person', action: 'identify', identifiers: { id: 'bad-user' } }],
            },
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
            status: 400,
            statTags: {
              destType: 'CUSTOMERIO',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              '[CustomerIO Response Handler] - Error in transformer proxy during CustomerIO response transformation',
            response: [
              {
                error: JSON.stringify({ message: 'Bad Request' }),
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
    id: 'customerio_dataDelivery_401',
    name: 'customerio',
    description: '[401] Auth failure — TransformerProxyError with REFRESH_TOKEN',
    feature: 'dataDelivery',
    scenario: 'business',
    successCriteria: 'Should surface 401 with REFRESH_TOKEN auth error category',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: { ...commonHeaders, 'test-dest-response-key': '401-unauthorized' },
            params,
            endpoint: 'https://track.customer.io/api/v2/batch',
            endpointPath: 'v2/batch',
            JSON: {
              batch: [{ type: 'person', action: 'identify', identifiers: { id: 'any-user' } }],
            },
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            authErrorCategory: 'REFRESH_TOKEN',
            statTags: {
              destType: 'CUSTOMERIO',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            message:
              '[CustomerIO Response Handler] - Error in transformer proxy during CustomerIO response transformation',
            response: [
              {
                error: JSON.stringify({ message: 'Unauthorized' }),
                statusCode: 401,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
];

export const data = [...v1BusinessTestScenarios];
