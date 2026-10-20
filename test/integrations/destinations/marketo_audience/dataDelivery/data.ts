import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { destination, destType, endpointPath, listEndpoint } from '../common';
import { authHeader } from '../maskedSecrets';

const proxyInput = (method: string, listId: string, leadIds: number[]) =>
  generateProxyV1Payload(
    {
      JSON: { input: leadIds.map((id) => ({ id })) },
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      method,
      endpoint: listEndpoint(listId),
      endpointPath,
    },
    leadIds.map((_, i) => generateMetadata(i + 1)),
    destination.Config,
  );

const job = (jobId: number, statusCode: number, error: string) => ({
  statusCode,
  metadata: generateMetadata(jobId),
  error,
});

const deliveryStatTags = (errorType: 'aborted' | 'retryable' | 'throttled') => ({
  destType: 'MARKETO_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType,
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});

export const data: ProxyV1TestData[] = [
  {
    id: 'marketo_audience_v1_add_success',
    name: destType,
    description: '[Proxy v1] Leads added to the list succeed per job',
    successCriteria: 'Each added lead is 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [101, 102]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Request processed successfully',
            response: [job(1, 200, 'success'), job(2, 200, 'success')],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_add_lead_not_found',
    name: destType,
    description: '[Proxy v1] A lead skipped with 1004 on add aborts that job only',
    successCriteria: 'The added lead is 200, the missing one 400 with a code-free reason',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [111, 112]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Lead not found in Marketo',
            response: [job(1, 200, 'success'), job(2, 400, 'Lead not found in Marketo')],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_remove_absent_leads',
    name: destType,
    description: '[Proxy v1] On remove, 1004 and 1015 skips succeed: the lead is absent either way',
    successCriteria: 'Every job is 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('DELETE', '2345', [121, 122, 123]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Request processed successfully',
            response: [job(1, 200, 'success'), job(2, 200, 'success'), job(3, 200, 'success')],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_partition_denied',
    name: destType,
    description: '[Proxy v1] A lead skipped with 1008 aborts that job with the partition reason',
    successCriteria: 'The added lead is 200, the partitioned one 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [171, 172]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Lead is in a partition the Marketo API user cannot access',
            response: [
              job(1, 200, 'success'),
              job(2, 400, 'Lead is in a partition the Marketo API user cannot access'),
            ],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_result_length_mismatch',
    name: destType,
    description: '[Proxy v1] Fewer results than sent leads retries every job',
    successCriteria: 'Every job is 500 and no verdict is guessed',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [181, 182]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Marketo response could not be matched to the request',
            statTags: deliveryStatTags('retryable'),
            response: [
              job(1, 500, 'Marketo response could not be matched to the request'),
              job(2, 500, 'Marketo response could not be matched to the request'),
            ],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_access_token_invalid',
    name: destType,
    description: '[Proxy v1] 601 retries every job so the retry fetches a new token',
    successCriteria: 'Every job is 500 with the code in the reason',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [131]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Marketo rejected the access token (code 601)',
            statTags: deliveryStatTags('retryable'),
            response: [job(1, 500, 'Marketo rejected the access token (code 601)')],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_rate_limited',
    name: destType,
    description: '[Proxy v1] 606 throttles every job',
    successCriteria: 'Every job is 429',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [141]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Marketo rate limit reached (code 606)',
            statTags: deliveryStatTags('throttled'),
            response: [job(1, 429, 'Marketo rate limit reached (code 606)')],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_daily_quota',
    name: destType,
    description: '[Proxy v1] 607 throttles every job until Marketo resets the daily quota',
    successCriteria: 'Every job is 429 with the quota reason',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [151]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Marketo daily API quota reached',
            statTags: deliveryStatTags('throttled'),
            response: [job(1, 429, 'Marketo daily API quota reached')],
          },
        },
      },
    },
  },
  {
    id: 'marketo_audience_v1_list_not_found',
    name: destType,
    description: '[Proxy v1] 1013 aborts every job: the static list no longer exists',
    successCriteria: 'Every job is 400 with the list reason',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: { request: { body: proxyInput('POST', '1234', [161]), method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[MARKETO_AUDIENCE] Marketo static list not found',
            statTags: deliveryStatTags('aborted'),
            response: [job(1, 400, 'Marketo static list not found')],
          },
        },
      },
    },
  },
];
