import type { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import { destination, endpoint, endpointPath, headers } from '../common';
import { futureEventBatchRequest, futureEventRequest, validBatchRequest } from '../network';

const futureEventMessage = 'invalid_event_time: At least one event is in the future';

const proxyMetadata = (jobId: number, dontBatch = false): ProxyMetdata => ({
  jobId,
  attemptNum: 1,
  userId: `u${jobId}`,
  sourceId: 'src-1',
  destinationId: 'topsort-dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch,
});

const proxyRequest = (json: Record<string, unknown>, metadata: ProxyMetdata[]) =>
  generateProxyV1Payload(
    { endpoint, endpointPath, method: 'POST', headers, params: {}, JSON: json },
    metadata,
    destination.Config,
  );

const statTags = {
  errorCategory: 'network',
  destType: 'TOPSORT',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'topsort-dest-1',
  workspaceId: 'ws-1',
};

export const data: ProxyV1TestData[] = [
  {
    id: 'topsort-delivery-success',
    name: 'topsort',
    description: 'A 204 marks every job in the request as delivered',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job returns a 200',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyRequest(validBatchRequest, [proxyMetadata(1), proxyMetadata(2)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 204,
            message: '[TOPSORT] Request processed successfully',
            response: [
              { statusCode: 200, metadata: proxyMetadata(1), error: 'success' },
              { statusCode: 200, metadata: proxyMetadata(2), error: 'success' },
            ],
          },
        },
      },
    },
  },
  {
    id: 'topsort-delivery-batch-rejected',
    name: 'topsort',
    description: 'A 400 for a multi-job request retries each job on its own with dontBatch',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job returns a retryable 500 with dontBatch set on its metadata',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyRequest(futureEventBatchRequest, [proxyMetadata(3), proxyMetadata(4)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: `[TOPSORT] ${futureEventMessage}`,
            response: [
              { statusCode: 500, metadata: proxyMetadata(3, true), error: futureEventMessage },
              { statusCode: 500, metadata: proxyMetadata(4, true), error: futureEventMessage },
            ],
            statTags: { ...statTags, errorType: 'retryable' },
          },
        },
      },
    },
  },
  {
    id: 'topsort-delivery-isolated-event-rejected',
    name: 'topsort',
    description: 'A 400 for a job already sent alone with dontBatch aborts it',
    scenario: 'Native batching delivery',
    successCriteria: 'The job returns a terminal 400 instead of retrying again',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyRequest(futureEventRequest, [proxyMetadata(4, true)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: `[TOPSORT] ${futureEventMessage}`,
            response: [
              { statusCode: 400, metadata: proxyMetadata(4, true), error: futureEventMessage },
            ],
            statTags: { ...statTags, errorType: 'aborted' },
          },
        },
      },
    },
  },
];
