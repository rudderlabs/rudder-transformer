import type { ProxyMetdata } from '../../../../../src/types';
import type { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import { destination, endpoint, headers } from '../common';
import {
  acceptedRequest,
  rejectedRequest,
  retryableRequest,
  throttledRequest,
  unexpectedSuccessRequest,
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

const configurationStatTags = {
  ...statTags,
  errorCategory: 'dataValidation',
  errorType: 'configuration',
};

export const data: ProxyV1TestData[] = [
  {
    id: 'rokt-delivery-accepted',
    name: 'rokt',
    description: 'Framework delivery treats mParticle HTTP 202 as accepted',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job in the bulk request succeeds on HTTP 202',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
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
    id: 'rokt-delivery-rejected-sanitized',
    name: 'rokt',
    description: 'Framework delivery sanitizes mParticle HTTP 400 failure reasons',
    scenario: 'Native batching delivery',
    successCriteria:
      'The failure preserves raw response only as destinationResponse, not the reason or per-job error',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
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
              '[ROKT] mParticle rejected the bulk request (status 400); no safe error detail returned.',
            destinationResponse: {
              response: { message: 'unsafe echoed value synthetic-customer-2' },
              status: 400,
            },
            statTags,
            response: [
              {
                statusCode: 400,
                metadata: proxyMetadata(2),
                error:
                  'mParticle rejected the bulk request (status 400); no safe error detail returned.',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-unexpected-2xx',
    name: 'rokt',
    description: 'Framework delivery rejects undocumented mParticle HTTP 200 responses',
    scenario: 'Native batching delivery',
    successCriteria: 'HTTP 200 fails rather than inheriting generic 2xx success behavior',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(unexpectedSuccessRequest) },
          },
          [proxyMetadata(3)],
          destination.Config,
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message:
              '[ROKT] mParticle rejected the bulk request (status 200); no safe error detail returned.',
            destinationResponse: { response: {}, status: 200 },
            statTags,
            response: [
              {
                statusCode: 400,
                metadata: proxyMetadata(3),
                error:
                  'mParticle rejected the bulk request (status 200); no safe error detail returned.',
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
    description: 'Framework delivery preserves HTTP 429 throttling for mParticle',
    scenario: 'Native batching delivery',
    successCriteria: 'The request remains retryable with throttled stat tags',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
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
              '[ROKT] mParticle rejected the bulk request (status 429); no safe error detail returned.',
            destinationResponse: { response: {}, status: 429 },
            statTags: { ...statTags, errorType: 'throttled' },
            response: [
              {
                statusCode: 429,
                metadata: proxyMetadata(4),
                error:
                  'mParticle rejected the bulk request (status 429); no safe error detail returned.',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'rokt-delivery-forged-endpoint',
    name: 'rokt',
    description: 'Framework transport rejects a forged ROKT endpoint before delivery',
    scenario: 'Native batching delivery',
    successCriteria:
      'The request fails with a configuration error before any mParticle call is made',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        method: 'POST',
        body: generateProxyV1Payload(
          {
            endpoint: 'https://attacker.example/v2/bulkevents',
            endpointPath: '/v2/bulkevents',
            method: 'POST',
            headers,
            JSON_ARRAY: { batch: JSON.stringify(acceptedRequest) },
          },
          [proxyMetadata(7)],
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
            message: 'ROKT delivery endpoint does not match the configured endpoint',
            statTags: configurationStatTags,
            response: [
              {
                statusCode: 400,
                metadata: proxyMetadata(7),
                error: 'ROKT delivery endpoint does not match the configured endpoint',
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
    description: 'Framework delivery retries every job after an mParticle HTTP 503',
    scenario: 'Native batching delivery',
    successCriteria: 'The whole request remains retryable and null response data stays confined',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
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
              '[ROKT] mParticle rejected the bulk request (status 503); no safe error detail returned.',
            destinationResponse: { response: '', status: 503 },
            statTags: { ...statTags, errorType: 'retryable' },
            response: [
              {
                statusCode: 500,
                metadata: proxyMetadata(5),
                error:
                  'mParticle rejected the bulk request (status 503); no safe error detail returned.',
              },
              {
                statusCode: 500,
                metadata: proxyMetadata(6),
                error:
                  'mParticle rejected the bulk request (status 503); no safe error detail returned.',
              },
            ],
          },
        },
      },
    },
  },
];
