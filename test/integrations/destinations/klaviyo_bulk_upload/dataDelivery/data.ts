import MockAdapter from 'axios-mock-adapter';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';

const endpoint = 'https://a.klaviyo.com/api/profile-bulk-import-jobs/';
const headers = {
  Authorization: 'Klaviyo-API-Key pk_dummy_123',
  'Content-Type': 'application/json',
  revision: '2024-10-15',
};

const metadata = [generateMetadata(1), generateMetadata(2), generateMetadata(3)];
const profiles = [
  {
    type: 'profile',
    attributes: {
      email: 'valid-one@example.com',
      jobIdentifier: 'valid-one:1',
    },
  },
  {
    type: 'profile',
    attributes: {
      email: 'not-an-email',
      jobIdentifier: 'invalid:2',
    },
  },
  {
    type: 'profile',
    attributes: {
      email: 'valid-two@example.com',
      jobIdentifier: 'valid-two:3',
    },
  },
];

const payload = {
  data: {
    type: 'profile-bulk-import-job',
    attributes: {
      profiles: {
        data: profiles,
      },
    },
  },
};

const invalidEmailResponse = {
  errors: [
    {
      id: 'invalid-email',
      status: '400',
      code: 'invalid',
      title: 'Invalid input.',
      detail: 'not-an-email is not a valid email address.',
      source: {
        pointer: '/data/attributes/profiles/data/1/attributes/email',
      },
    },
  ],
};

const singletonInvalidEmailResponse = {
  errors: [
    {
      id: 'invalid-email',
      status: '400',
      code: 'invalid',
      title: 'Invalid input.',
      detail: 'not-an-email is not a valid email address.',
      source: {
        pointer: '/data/attributes/profiles/data/0/attributes/email',
      },
    },
  ],
};

const nonEmailResponse = {
  errors: [
    {
      id: 'missing-list',
      status: '400',
      code: 'invalid',
      title: 'Invalid input.',
      detail: 'List relationship is invalid.',
      source: {
        pointer: '/data/relationships/lists/data/0/id',
      },
    },
  ],
};

const mockPost = (mockAdapter: MockAdapter, status: number, response: Record<string, unknown>) => {
  mockAdapter.onPost(endpoint).reply(status, response);
};

const buildInput = (inputMetadata = metadata) =>
  generateProxyV1Payload(
    {
      JSON: payload,
      headers,
      endpoint,
      params: {
        destination: 'klaviyo_bulk_upload',
      },
    },
    inputMetadata,
  );

export const data: ProxyV1TestData[] = [
  {
    id: '1',
    name: 'klaviyo_bulk_upload',
    description: 'Successful bulk profile import job delivery',
    scenario: 'Business',
    successCriteria: 'Should mark each profile metadata entry as delivered',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: buildInput(),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: { data: { id: 'import-job-1', type: 'profile-bulk-import-job' } },
              status: 202,
            },
            message: '[klaviyo_bulk_upload Response Handler] - Request Processed Successfully',
            response: metadata.map((entry) => ({
              error: 'success',
              metadata: entry,
              statusCode: 200,
            })),
            status: 202,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockPost(mockAdapter, 202, { data: { id: 'import-job-1', type: 'profile-bulk-import-job' } });
    },
  },
  {
    id: '2',
    name: 'klaviyo_bulk_upload',
    description: 'Mixed batch aborts only the profile identified by Klaviyo as invalid email',
    scenario: 'Business',
    successCriteria: 'Should abort invalid email metadata and retry other records unbatched',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: buildInput(),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: invalidEmailResponse,
              status: 400,
            },
            message: '[klaviyo_bulk_upload Response Handler] - Request Processed with Errors',
            response: [
              {
                error: JSON.stringify(invalidEmailResponse),
                metadata: { ...generateMetadata(1), dontBatch: true },
                statusCode: 500,
              },
              {
                error: 'not-an-email is not a valid email address.',
                metadata: generateMetadata(2),
                statusCode: 400,
              },
              {
                error: JSON.stringify(invalidEmailResponse),
                metadata: { ...generateMetadata(3), dontBatch: true },
                statusCode: 500,
              },
            ],
            status: 200,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockPost(mockAdapter, 400, invalidEmailResponse);
    },
  },
  {
    id: '3',
    name: 'klaviyo_bulk_upload',
    description: 'Singleton invalid email aborts the only input record',
    scenario: 'Business',
    successCriteria: 'Should abort the only metadata entry for a mapped invalid email response',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: buildInput([generateMetadata(1)]),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: singletonInvalidEmailResponse,
              status: 400,
            },
            message: '[klaviyo_bulk_upload Response Handler] - Request Processed with Errors',
            response: [
              {
                error: 'not-an-email is not a valid email address.',
                metadata: generateMetadata(1),
                statusCode: 400,
              },
            ],
            status: 200,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockPost(mockAdapter, 400, singletonInvalidEmailResponse);
    },
  },
  {
    id: '4',
    name: 'klaviyo_bulk_upload',
    description: 'Unmappable non-email 400 retries records outside the rejected batch',
    scenario: 'Business',
    successCriteria:
      'Should retry all records unbatched when Klaviyo 400 cannot be mapped to email',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: buildInput(),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: nonEmailResponse,
              status: 400,
            },
            message: '[klaviyo_bulk_upload Response Handler] - Request Processed with Errors',
            response: metadata.map((entry) => ({
              error: JSON.stringify(nonEmailResponse),
              metadata: { ...entry, dontBatch: true },
              statusCode: 500,
            })),
            status: 200,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockPost(mockAdapter, 400, nonEmailResponse);
    },
  },
];
