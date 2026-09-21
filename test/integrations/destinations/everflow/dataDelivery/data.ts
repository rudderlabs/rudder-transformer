import type { ProxyMetdata } from '../../../../../src/types';
import type { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import { destination, endpoint, metadata } from '../common';

const proxyMetadata = metadata(1) as unknown as ProxyMetdata;
const params = (transactionId: string) => ({ nid: 'network-1', transaction_id: transactionId });
const payload = (transactionId: string) =>
  generateProxyV1Payload(
    {
      endpoint,
      endpointPath: '',
      method: 'GET',
      params: params(transactionId),
      JSON: {},
    },
    [proxyMetadata],
    destination.Config,
  );
const failedJob = (error: string) => ({ error, statusCode: 400, metadata: proxyMetadata });
const statTags = {
  errorCategory: 'network',
  errorType: 'aborted',
  destType: 'EVERFLOW',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'everflow-dest-1',
  workspaceId: 'ws-1',
};

const scenarios: ProxyV1TestData[] = [
  {
    id: 'everflow-delivery-200-success',
    name: 'everflow',
    description: 'Everflow HTTP 200 marks the conversion delivered',
    scenario: 'Native batching delivery',
    successCriteria: 'The singleton job is successful',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: payload('accepted') } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[EVERFLOW] Request processed successfully',
            response: [{ error: 'success', statusCode: 200, metadata: proxyMetadata }],
          },
        },
      },
    },
  },
  {
    id: 'everflow-delivery-204-failure',
    name: 'everflow',
    description: 'Everflow HTTP 204 is overridden to a failed event',
    scenario: 'Native batching delivery',
    successCriteria: 'A generic 2xx response is not allowed to hide Everflow rejection',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: payload('rejected-204') } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 204,
            message:
              '[EVERFLOW] Everflow rejected the conversion (status 204); no error detail returned. Check the Everflow conversion report.',
            response: [
              failedJob(
                'Everflow rejected the conversion (status 204); no error detail returned. Check the Everflow conversion report.',
              ),
            ],
            statTags,
          },
        },
      },
    },
  },
  {
    id: 'everflow-delivery-string-failure',
    name: 'everflow',
    description: 'Everflow string failure bodies are surfaced verbatim',
    scenario: 'Native batching delivery',
    successCriteria: 'The complete trimmed partner response becomes the failure reason',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: payload('string-failure') } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: '[EVERFLOW] Invalid transaction ID',
            response: [failedJob('"Invalid transaction ID"')],
            statTags,
          },
        },
      },
    },
  },
  {
    id: 'everflow-delivery-object-failure',
    name: 'everflow',
    description: 'Everflow object failure bodies are surfaced as JSON',
    scenario: 'Native batching delivery',
    successCriteria: 'The complete partner response object becomes the failure reason',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: payload('object-failure') } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: '[EVERFLOW] {"code":12,"error":"Invalid transaction ID"}',
            response: [failedJob('{"code":12,"error":"Invalid transaction ID"}')],
            statTags,
          },
        },
      },
    },
  },
  {
    id: 'everflow-delivery-empty-failure',
    name: 'everflow',
    description: 'Everflow empty failure bodies use the conversion-report fallback',
    scenario: 'Native batching delivery',
    successCriteria:
      'The fallback names the response status and directs users to Everflow reporting',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: payload('empty-failure') } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message:
              '[EVERFLOW] Everflow rejected the conversion (status 400); no error detail returned. Check the Everflow conversion report.',
            response: [failedJob('""')],
            statTags,
          },
        },
      },
    },
  },
];

export const data = scenarios;
