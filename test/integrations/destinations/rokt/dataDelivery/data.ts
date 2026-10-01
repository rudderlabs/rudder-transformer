import type { ProxyMetdata } from '../../../../../src/types';
import type { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import { destination, endpoint, headers } from '../common';
import {
  acceptedRequest,
  allInvalidRequest,
  allInvalidResponse,
  invalidCredentialsRequest,
  partialFailureRequest,
  rejectedRequest,
  rejectedResponse,
  retryableRequest,
  throttledRequest,
} from '../network';

const proxyMetadata = (jobId: number): ProxyMetdata => ({
  jobId,
  attemptNum: 1,
  userId: `synthetic-user-${jobId}`,
  sourceId: 'source-1',
  destinationId: 'rokt-dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch: false,
});

const statTags = {
  errorCategory: 'network',
  errorType: 'aborted',
  destType: 'ROKT',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'rokt-dest-1',
  workspaceId: 'ws-1',
};

const envOverrides = {
  ROKT_BATCHING_FRAMEWORK_TRANSPORT_ENABLED_WORKSPACE_IDS: 'ws-1',
};

export const data: ProxyV1TestData[] = [
  {
    id: 'rokt-delivery-accepted',
    name: 'rokt',
    description: 'Framework delivery treats Rokt HTTP 202 as accepted',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job in the bulk request succeeds on HTTP 202',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    envOverrides,
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(acceptedRequest) },
          },
          [proxyMetadata(1)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 202,
            message: '[ROKT] Request processed successfully',
            response: [{ statusCode: 200, metadata: proxyMetadata(1), error: 'success' }],
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-partial-failure',
    name: 'rokt',
    description: 'Framework delivery retries mixed-validity Rokt batches individually',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job is retried with dontBatch after a partial HTTP 202 response',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    envOverrides,
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(partialFailureRequest) },
          },
          [proxyMetadata(7), proxyMetadata(8), proxyMetadata(9)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 202,
            message:
              '[ROKT] Rokt partially rejected the bulk request; retrying each event individually.',
            statTags: { ...statTags, errorType: 'retryable' },
            response: [7, 8, 9].map((jobId) => ({
              statusCode: 500,
              metadata: { ...proxyMetadata(jobId), dontBatch: true },
              error: 'Rokt partially rejected the bulk request; retrying each event individually.',
            })),
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-rejected',
    name: 'rokt',
    description: 'Framework delivery rejects Rokt HTTP 400 responses',
    scenario: 'Native batching delivery',
    successCriteria: 'The whole request is aborted using the existing framework response path',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    envOverrides,
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(rejectedRequest) },
          },
          [proxyMetadata(2)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message:
              '[ROKT] Rokt rejected the bulk request (status 400); no safe error detail returned.',
            statTags,
            response: [
              {
                statusCode: 400,
                metadata: proxyMetadata(2),
                error: JSON.stringify(rejectedResponse),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-all-invalid',
    name: 'rokt',
    description: 'Framework delivery aborts an entirely invalid Rokt bulk request',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job is aborted when Rokt rejects every batch with HTTP 400',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    envOverrides,
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(allInvalidRequest) },
          },
          [proxyMetadata(10), proxyMetadata(11)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message:
              '[ROKT] Rokt rejected the bulk request (status 400); no safe error detail returned.',
            statTags,
            response: [10, 11].map((jobId) => ({
              statusCode: 400,
              metadata: proxyMetadata(jobId),
              error: JSON.stringify(allInvalidResponse),
            })),
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-invalid-credentials',
    name: 'rokt',
    description: 'Framework delivery aborts Rokt requests with invalid credentials',
    scenario: 'Native batching delivery',
    successCriteria: 'The request is aborted on HTTP 403 with an empty response body',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    envOverrides,
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(invalidCredentialsRequest) },
          },
          [proxyMetadata(12)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 403,
            message:
              '[ROKT] Rokt rejected the bulk request (status 403); no safe error detail returned.',
            statTags,
            response: [
              {
                statusCode: 403,
                metadata: proxyMetadata(12),
                error: '""',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-throttled',
    name: 'rokt',
    description: 'Framework delivery preserves HTTP 429 throttling for Rokt',
    scenario: 'Native batching delivery',
    successCriteria: 'The request remains retryable with throttled stat tags',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    envOverrides,
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(throttledRequest) },
          },
          [proxyMetadata(4)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            message:
              '[ROKT] Rokt rejected the bulk request (status 429); no safe error detail returned.',
            statTags: { ...statTags, errorType: 'throttled' },
            response: [
              {
                statusCode: 429,
                metadata: proxyMetadata(4),
                error: '{}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-retryable-multi-job',
    name: 'rokt',
    description: 'Framework delivery retries every job after a Rokt HTTP 503',
    scenario: 'Native batching delivery',
    successCriteria:
      'The whole request remains retryable through the existing framework response path',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    envOverrides,
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(retryableRequest) },
          },
          [proxyMetadata(5), proxyMetadata(6)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 503,
            message:
              '[ROKT] Rokt rejected the bulk request (status 503); no safe error detail returned.',
            statTags: { ...statTags, errorType: 'retryable' },
            response: [
              {
                statusCode: 503,
                metadata: proxyMetadata(5),
                error: '""',
              },
              {
                statusCode: 503,
                metadata: proxyMetadata(6),
                error: '""',
              },
            ],
          },
        },
      },
    },
  },
];
