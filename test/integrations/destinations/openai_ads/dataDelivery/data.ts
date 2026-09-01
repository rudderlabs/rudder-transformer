import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import type { ProxyMetdata } from '../../../../../src/types';
import { destination, endpoint, metadata } from '../common';
import { partialBatchValidationRequest, staleTimestampRequest } from '../network';

const headers = { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' };
const params = { pid: 'pixel-123' };
const statTags = {
  errorCategory: 'network',
  destType: 'OPENAI_ADS',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'openai-ads-dest-1',
  workspaceId: 'ws-1',
};
const partialBatchValidationMessage =
  'Invalid event at events[1]. See errors for details. ' +
  '(code: invalid_event, param: events[1]) | ' +
  'events[1].data.type must be a supported data type. ' +
  '(code: missing_event_data_type, param: events[1].data.type)';
const staleTimestampMessage =
  'event_timestamp_ms must be within the last 7 days. ' +
  '(code: event_timestamp_too_old, param: events[0].timestamp_ms) | ' +
  'event_timestamp_ms must be within the last 7 days. ' +
  '(code: event_timestamp_too_old, param: events[0].timestamp_ms)';
const proxyMetadata = (jobId: number, dontBatch = false): ProxyMetdata => {
  const base = metadata(jobId) as Record<string, unknown>;
  return {
    ...base,
    attemptNum: 1,
    userId: `u${jobId}`,
    secret: {},
    dontBatch,
  } as unknown as ProxyMetdata;
};

const scenarios: ProxyV1TestData[] = [
  {
    id: 'openai-ads-delivery-partial-batch-validation-failure',
    name: 'openai_ads',
    description: 'Framework delivery retries OpenAI 400 batch validation failures as singletons',
    scenario: 'Native batching delivery',
    successCriteria: '400 validation errors return retryable job states with dontBatch=true',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v1/events',
            method: 'POST',
            headers,
            params,
            JSON: partialBatchValidationRequest,
          },
          [proxyMetadata(1), proxyMetadata(2)],
          destination.Config,
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
            message: `[OPENAI_ADS] ${partialBatchValidationMessage}`,
            response: [
              {
                error: partialBatchValidationMessage,
                metadata: proxyMetadata(1, true),
                statusCode: 500,
              },
              {
                error: partialBatchValidationMessage,
                metadata: proxyMetadata(2, true),
                statusCode: 500,
              },
            ],
            statTags: { ...statTags, errorType: 'retryable' },
          },
        },
      },
    },
  },
  {
    id: 'openai-ads-delivery-stale-timestamp',
    name: 'openai_ads',
    description: 'Framework delivery aborts singleton OpenAI 422 timestamp failures',
    scenario: 'Native batching delivery',
    successCriteria: '422 validation errors return a terminal job state when already isolated',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint,
            endpointPath: '/v1/events',
            method: 'POST',
            headers,
            params,
            JSON: staleTimestampRequest,
          },
          [proxyMetadata(3)],
          destination.Config,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 422,
            message: `[OPENAI_ADS] ${staleTimestampMessage}`,
            response: [
              {
                error: staleTimestampMessage,
                metadata: proxyMetadata(3),
                statusCode: 400,
              },
            ],
            statTags: { ...statTags, errorType: 'aborted' },
          },
        },
      },
    },
  },
];

export const data = scenarios.map((scenario) => ({
  ...scenario,
  envOverrides: {
    ...scenario.envOverrides,
    OPENAI_ADS_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
  },
}));
