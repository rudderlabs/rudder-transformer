import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { testScenariosForV1API } from './business';
import { otherScenariosV1 } from './other';
import { authHeader1 } from '../maskedSecrets';

const destinationId = '2RHh08uOsXqE9KvCDg3hoaeuK2L';
const workspaceId = '2Csl0lSTbuM3qyHdaOQB2GcDH8o';
const sourceId = '2Vsge2uWYdrLfG7pZb5Y82eo4lr';
const successMessage = 'Request for braze Processed Successfully';
const failureMessage = (status: number) => `Request failed for braze with status: ${status}`;

const metadataForJob = (jobId: number) => ({
  jobId,
  attemptNum: 0,
  userId: '',
  sourceId,
  destinationId,
  workspaceId,
  secret: {
    access_token: 'secret',
    refresh_token: 'refresh',
    developer_token: 'developer_Token',
  },
});

const identifyBody = {
  aliases_to_identify: [
    {
      external_id: 'gabi_userId_45',
      user_alias: {
        alias_label: 'rudder_id',
        alias_name: 'gabi_anonId_45',
      },
    },
  ],
};

const trackBody = {
  partner: 'RudderStack',
  attributes: [
    {
      email: '123@a.com',
      city: 'Disney',
      country: 'USA',
      firstname: 'Mickey',
      external_id: '456345345',
    },
    {
      email: '123@a.com',
      city: 'Disney',
      country: 'USA',
      firstname: 'Mickey',
      external_id: '456345345',
    },
    {
      email: '123@a.com',
      city: 'Disney',
      country: 'USA',
      firstname: 'Mickey',
      external_id: '456345345',
    },
  ],
};

const proxyV1RequestBody = (endpoint: string, JSON: Record<string, unknown>, jobIds = [2]) => ({
  type: 'REST',
  endpoint,
  method: 'POST',
  userId: 'gabi_userId_45',
  headers: {
    Accept: 'application/json',
    Authorization: authHeader1,
    'Content-Type': 'application/json',
  },
  body: {
    FORM: {},
    JSON,
    JSON_ARRAY: {},
    XML: {},
  },
  metadata: jobIds.map(metadataForJob),
  files: {},
  params: {
    destination: 'braze',
  },
});

const statTags = (errorType: 'aborted' | 'retryable') => ({
  destType: 'BRAZE',
  destinationId,
  errorCategory: 'network',
  errorType,
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId,
});

const jobState = (statusCode: number, response: unknown, jobId = 2) => ({
  error: JSON.stringify(response) ?? '',
  statusCode,
  metadata: metadataForJob(jobId),
});

const successfulOutput = (status: number, response: unknown) => ({
  status,
  message: successMessage,
  response: [jobState(status, response)],
});

const failedOutput = (
  status: number,
  response: unknown,
  errorType: 'aborted' | 'retryable',
  message = failureMessage(status),
) => ({
  status,
  response: [
    {
      error: JSON.stringify(response) || message,
      statusCode: status,
      metadata: metadataForJob(2),
    },
  ],
  statTags: statTags(errorType),
  message,
});

const identifySuccessResponse = { aliases_processed: 1, message: 'success' };
const identifySuccessWithErrorsResponse = { message: 'success', errors: ['minor error message'] };
const identifyFatalResponse = { message: 'fatal error message', errors: ['minor error message'] };
const identifyBadRequestResponse = { code: 400, message: 'Bad Req', status: 'Fail Case' };
const trackBadRequestResponse = {
  message: "Valid data must be provided in the 'attributes', 'events', or 'purchases' fields.",
  errors: [
    {
      type: "The value provided for the 'email' field is not a valid email.",
      input_array: 'attributes',
      index: 0,
    },
    {
      type: "The value provided for the 'email' field is not a valid email.",
      input_array: 'attributes',
      index: 1,
    },
  ],
};

export const existingTestData = [
  {
    name: 'braze',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test1',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: successfulOutput(201, identifySuccessResponse),
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test2',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: successfulOutput(201, identifySuccessWithErrorsResponse),
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test3',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: failedOutput(201, identifyFatalResponse, 'aborted'),
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test4',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: failedOutput(201, '', 'aborted'),
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test5',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: failedOutput(500, '', 'retryable'),
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test6',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: failedOutput(400, '[ENOTFOUND] :: DNS lookup failed', 'aborted'),
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://rest.iad-03.braze.com/users/identify/test6', identifyBody, {
          Accept: 'application/json',
          Authorization: authHeader1,
          'Content-Type': 'application/json',
          'User-Agent': 'RudderLabs',
        })
        .replyOnce((config) => {
          // @ts-ignore
          const err = AxiosError.from('DNS not found', 'ENOTFOUND', config);
          return Promise.reject(err);
        });
    },
  },
  {
    name: 'braze',
    description: 'Test 6',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test7',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: failedOutput(500, '', 'retryable'),
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with Braze v1 proxy handler',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/test1',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: successfulOutput(201, identifySuccessResponse),
        },
      },
    },
  },
  {
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with Braze v1 proxy handler Error returned',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/identify/testV1',
          identifyBody,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: failedOutput(401, identifyBadRequestResponse, 'aborted'),
        },
      },
    },
  },
  {
    name: 'braze',
    description:
      'Test Transformer Proxy V1 input with Braze v1 proxy handler Error returned Multiple metadata Track Event',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: proxyV1RequestBody(
          'https://rest.iad-03.braze.com/users/track/testV1',
          trackBody,
          [2, 3, 4],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            response: [2, 3, 4].map((jobId) => ({
              error: JSON.stringify(trackBadRequestResponse),
              statusCode: 401,
              metadata: metadataForJob(jobId),
            })),
            statTags: statTags('aborted'),
            message: failureMessage(401),
          },
        },
      },
    },
  },
];

export const data = [...existingTestData, ...testScenariosForV1API, ...otherScenariosV1];
