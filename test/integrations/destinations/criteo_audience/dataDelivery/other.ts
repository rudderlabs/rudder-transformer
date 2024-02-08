import { params, headers } from './business';
import { generateProxyV1Payload } from '../../../testUtils';

export const v1OtherScenarios = [
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
            endpoint: 'https://api.criteo.com/2022-10/audiences/34897/contactlist',
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
          [
            {
              attemptNum: 1,
              destinationId: 'dummyDestinationId',
              dontBatch: false,
              secret: {},
              sourceId: 'dummySourceId',
              userId: 'dummyUserId',
              workspaceId: 'dummyWorkspaceId',
              jobId: 1,
            },
          ],
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
                error:
                  '{"errors":[{"traceIdentifier":"80a1a0ba3981b04da847d05700752c77","type":"authorization","code":"audience-invalid"}]}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                  jobId: 1,
                },
                statusCode: 500,
              },
            ],
            message: 'Request Failed: during criteo_audience response transformation (Retryable)',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
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
            endpoint: 'https://api.criteo.com/2022-10/audiences/34898/contactlist',
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
          [
            {
              attemptNum: 1,
              destinationId: 'dummyDestinationId',
              dontBatch: false,
              secret: {},
              sourceId: 'dummySourceId',
              userId: 'dummyUserId',
              workspaceId: 'dummyWorkspaceId',
              jobId: 2,
            },
          ],
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
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                  jobId: 2,
                },
                statusCode: 429,
              },
            ],
            message:
              'Request Failed: during criteo_audience response transformation - due to Request Limit exceeded, (Throttled)',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
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
            endpoint: 'https://api.criteo.com/2022-10/audiences/34899/contactlist',
          },
          [
            {
              attemptNum: 1,
              destinationId: 'dummyDestinationId',
              dontBatch: false,
              secret: {},
              sourceId: 'dummySourceId',
              userId: 'dummyUserId',
              workspaceId: 'dummyWorkspaceId',
              jobId: 3,
            },
          ],
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
                error: '{"message":"unknown error"}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                  jobId: 3,
                },
                statusCode: 400,
              },
            ],
            message:
              'Request Failed: during criteo_audience response transformation with status "410" due to "{"message":"unknown error"}", (Aborted) ',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
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
