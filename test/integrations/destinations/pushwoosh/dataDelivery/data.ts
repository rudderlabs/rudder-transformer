import type { ProxyMetdata } from '../../../../../src/types';
import type { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload } from '../../../testUtils';
import {
  destination,
  eventsEndpoint,
  eventsHeaders,
  metadata,
  setTagsEndpoint,
  setTagsHeaders,
} from '../common';
import {
  applicationNotFoundResponse,
  decodeFailureRequest,
  eventsBatchRequest,
  invalidApplicationRequest,
  invalidApplicationResponse,
  setTagsRequest,
  unauthorizedResponse,
} from '../network';

const proxyMetadata = (jobId: number, dontBatch = false): ProxyMetdata =>
  ({ ...metadata(jobId), dontBatch }) as unknown as ProxyMetdata;

const eventsPayload = (
  JSON: Record<string, unknown>,
  headers: Record<string, string> = eventsHeaders,
) =>
  generateProxyV1Payload(
    { endpoint: eventsEndpoint, endpointPath: '/post-events', method: 'POST', headers, JSON },
    [proxyMetadata(1), proxyMetadata(2)],
    destination.Config,
  );

const setTagsPayload = (JSON: Record<string, unknown>) =>
  generateProxyV1Payload(
    {
      endpoint: setTagsEndpoint,
      endpointPath: '/setTags',
      method: 'POST',
      headers: setTagsHeaders,
      JSON,
    },
    [proxyMetadata(1)],
    destination.Config,
  );

const statTags = (errorType: string) => ({
  errorCategory: 'network',
  errorType,
  destType: 'PUSHWOOSH',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'pushwoosh-dest-1',
  workspaceId: 'ws-1',
});

const job = (jobId: number, statusCode: number, error: string, dontBatch = false) => ({
  statusCode,
  error,
  metadata: proxyMetadata(jobId, dontBatch),
});

const decodeFailureMessage =
  'Pushwoosh rejected the events batch: parsing time "bad" as "2006-01-02T15:04:05Z07:00": cannot parse "bad" as "2006"';

export const data: ProxyV1TestData[] = [
  {
    id: 'pushwoosh-delivery-events-success',
    name: 'pushwoosh',
    description: 'post-events answers an accepted batch with an empty 200',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job in the batch is successful',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: eventsPayload(eventsBatchRequest) } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[PUSHWOOSH] Request processed successfully',
            response: [job(1, 200, 'success'), job(2, 200, 'success')],
          },
        },
      },
    },
  },
  {
    id: 'pushwoosh-delivery-events-unauthorized',
    name: 'pushwoosh',
    description: 'post-events 401 for an API token that does not match the app code aborts',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job aborts with the Pushwoosh response and no token refresh',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        method: 'POST',
        body: eventsPayload(eventsBatchRequest, {
          ...eventsHeaders,
          Authorization: 'Token invalid-api-token',
        }),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            message: '[PUSHWOOSH] unauthorized',
            response: [
              job(1, 401, JSON.stringify(unauthorizedResponse)),
              job(2, 401, JSON.stringify(unauthorizedResponse)),
            ],
            statTags: statTags('aborted'),
          },
        },
      },
    },
  },
  {
    id: 'pushwoosh-delivery-events-application-not-found',
    name: 'pushwoosh',
    description: 'post-events 400 for an unknown app code aborts without splitting the batch',
    scenario: 'Native batching delivery',
    successCriteria: 'A configuration 400 is terminal for every job',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        method: 'POST',
        body: eventsPayload(eventsBatchRequest, {
          ...eventsHeaders,
          'X-PW-Appcode': 'AAAAA-BBBBB',
        }),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: '[PUSHWOOSH] application not found',
            response: [
              job(1, 400, JSON.stringify(applicationNotFoundResponse)),
              job(2, 400, JSON.stringify(applicationNotFoundResponse)),
            ],
            statTags: statTags('aborted'),
          },
        },
      },
    },
  },
  {
    id: 'pushwoosh-delivery-events-decode-failure',
    name: 'pushwoosh',
    description: 'post-events 400 decode failure isolates the batch for singleton redelivery',
    scenario: 'Native batching delivery',
    successCriteria: 'Every job is retried with dontBatch=true',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: eventsPayload(decodeFailureRequest) } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: `[PUSHWOOSH] ${decodeFailureMessage}`,
            response: [
              job(1, 500, decodeFailureMessage, true),
              job(2, 500, decodeFailureMessage, true),
            ],
            statTags: statTags('retryable'),
          },
        },
      },
    },
  },
  {
    id: 'pushwoosh-delivery-set-tags-success',
    name: 'pushwoosh',
    description: 'setTags success',
    scenario: 'Native batching delivery',
    successCriteria: 'The job is successful',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: setTagsPayload(setTagsRequest) } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[PUSHWOOSH] Request processed successfully',
            response: [job(1, 200, 'success')],
          },
        },
      },
    },
  },
  {
    id: 'pushwoosh-delivery-set-tags-invalid-application',
    name: 'pushwoosh',
    description: 'setTags 400 with status_code 210 aborts with the Pushwoosh status message',
    scenario: 'Native batching delivery',
    successCriteria: 'The job aborts; the message carries status_message and status_code',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { method: 'POST', body: setTagsPayload(invalidApplicationRequest) } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: '[PUSHWOOSH] application code is not valid (status_code: 210)',
            response: [job(1, 400, JSON.stringify(invalidApplicationResponse))],
            statTags: statTags('aborted'),
          },
        },
      },
    },
  },
];
