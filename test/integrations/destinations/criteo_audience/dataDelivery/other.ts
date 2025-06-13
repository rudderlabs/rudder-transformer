import { ProxyV1TestData } from '../../../testTypes';
import { params, headers } from './business';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';

export const v1OtherScenarios: ProxyV1TestData[] = [
  {
    id: 'criteo_audience_other_0',
    name: 'criteo_audience',
    description: '[Other]:: Test for checking service unavailable scenario',
    successCriteria: 'Should return a 500 status code with',
    scenario: 'other',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params,
            method: 'PATCH',
            endpoint: 'https://random_test_url/test_for_internal_server_error',
            JSON: {
              data: {
                type: 'ContactlistAmendment',
                attributes: {
                  operation: 'add',
                  identifierType: 'madid',
                  identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                  internalIdentifiers: false,
                },
              },
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
            status: 500,
            response: [
              {
                error: '""',
                metadata: generateMetadata(1),
                statusCode: 500,
              },
            ],
            message: 'Request Failed: during criteo_audience response transformation (Retryable)',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              feature: 'dataDelivery',
              implementation: 'native',
              errorType: 'retryable',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    id: 'criteo_audience_other_1',
    name: 'criteo_audience',
    description: '[Other]:: Test for checking throttling scenario',
    successCriteria: 'Should return a 429 status code',
    scenario: 'other',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params,
            method: 'PATCH',
            endpoint: 'https://random_test_url/test_for_too_many_requests',
            JSON: {
              data: {
                type: 'ContactlistAmendment',
                attributes: {
                  operation: 'add',
                  identifierType: 'madid',
                  identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                  internalIdentifiers: false,
                },
              },
            },
          },
          [generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            response: [
              {
                error: '{}',
                metadata: generateMetadata(2),
                statusCode: 429,
              },
            ],
            message:
              'Request Failed: during criteo_audience response transformation - due to Request Limit exceeded, (Throttled)',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              feature: 'dataDelivery',
              implementation: 'native',
              errorType: 'throttled',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    id: 'criteo_audience_other_2',
    name: 'criteo_audience',
    description: '[Other]:: Test for checking unknown error scenario',
    successCriteria: 'Should return a 410 status code and abort the event',
    scenario: 'other',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params,
            method: 'PATCH',
            JSON: {
              data: {
                type: 'ContactlistAmendment',
                attributes: {
                  operation: 'add',
                  identifierType: 'madid',
                  identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                  internalIdentifiers: false,
                },
              },
            },
            endpoint: 'https://api.criteo.com/2025-04/audiences/34899/contactlist',
          },
          [generateMetadata(3)],
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
            response: [
              {
                error: JSON.stringify({ message: 'unknown error' }),
                metadata: generateMetadata(3),
                statusCode: 400,
              },
            ],
            message:
              'Request Failed: during criteo_audience response transformation with status "410" due to "{"message":"unknown error"}", (Aborted) ',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
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
];
