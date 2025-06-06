import { gunzipSync } from 'zlib';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import { secret1 } from '../maskedSecrets';
import MockAdapter from 'axios-mock-adapter';
// Generate metadata for test events
const metadata = [generateMetadata(1), generateMetadata(2)];

// Stat tags for error reporting
const retryStatTags = {
  errorCategory: 'network',
  errorType: 'retryable',
  destType: 'MP',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

const gzipPayload = JSON.stringify([
  {
    event: 'Test Event 1',
    properties: {
      time: 1619006730,
      $insert_id: 'event1',
      distinct_id: 'user123',
      property1: 'value1',
    },
  },
  {
    event: 'Test Event 2',
    properties: {
      time: 1619006731,
      $insert_id: 'event2',
      distinct_id: 'user123',
      property2: 'value2',
    },
  },
]);

// Test data for v1 API
export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'mp_v1_scenario_1',
    name: 'mp',
    description: '[Proxy v1 API] :: Mixpanel Import API successful batch',
    successCriteria: 'Should return 200 with successful response for all events',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.mixpanel.com/import',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              project_id: secret1,
            },
            JSON_ARRAY: {
              batch: JSON.stringify([
                {
                  event: 'Test Event 1',
                  properties: {
                    time: 1619006730,
                    $insert_id: 'event1',
                    distinct_id: 'user123',
                    property1: 'value1',
                  },
                },
                {
                  event: 'Test Event 2',
                  properties: {
                    time: 1619006731,
                    $insert_id: 'event2',
                    distinct_id: 'user123',
                    property2: 'value2',
                  },
                },
              ]),
            },
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Request for MP Processed Successfully',
            response: [
              {
                statusCode: 200,
                metadata: expect.objectContaining({
                  jobId: 1,
                }),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: expect.objectContaining({
                  jobId: 2,
                }),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'mp_v1_scenario_2',
    name: 'mp',
    description: '[Proxy v1 API] :: Mixpanel Import API partial batch handling',
    successCriteria: 'Should handle partial failures in Import API correctly',
    scenario: 'Partial Batch',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.mixpanel.com/import',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              strict: '1', // Enable strict mode to get detailed error responses
              project_id: secret1,
            },
            JSON_ARRAY: {
              batch: JSON.stringify([
                {
                  event: 'Test Event 1',
                  properties: {
                    time: 1619006730,
                    $insert_id: 'event1',
                    distinct_id: 'user123',
                    $device_id: 'device123',
                    property1: 'value1',
                  },
                },
                {
                  event: 'Test Event 2',
                  properties: {
                    // Missing time property to trigger a validation error
                    $insert_id: 'event2',
                    distinct_id: 'user123',
                    $device_id: 'device123',
                    property2: 'value2',
                  },
                },
              ]),
            },
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200, // The HTTP status is 200, but the response body contains 207
        body: {
          output: {
            status: 200,
            message: expect.stringContaining('Partial failure in batch import'),
            response: [
              {
                statusCode: 200,
                metadata: expect.objectContaining({
                  jobId: 1,
                }),
                error: 'success',
              },
              {
                statusCode: 400,
                metadata: expect.objectContaining({
                  jobId: 2,
                }),
                error: expect.stringContaining('Invalid timestamp'),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'mp_v1_scenario_3',
    name: 'mp',
    description: '[Proxy v1 API] :: Mixpanel Engage API error handling',
    successCriteria: 'Should handle errors in Engage API correctly',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.mixpanel.com/engage',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              verbose: '1',
              project_id: secret1,
            },
            JSON: {
              $token: secret1,
              $distinct_id: 'user123',
              $set: {
                email: 'test@example.com',
                name: 'Test User',
              },
            },
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200, // The HTTP status is 200, but the response body contains 207
        body: {
          output: {
            status: 200,
            message: expect.stringContaining('Error in Engage API'),
            response: [
              {
                statusCode: 400,
                metadata: expect.objectContaining({
                  jobId: 1,
                }),
                error: expect.stringContaining('Engage API error'),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'mp_v1_scenario_4',
    name: 'mp',
    description: '[Proxy v1 API] :: Mixpanel Groups API error handling',
    successCriteria: 'Should handle errors in Groups API correctly',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.mixpanel.com/groups',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              verbose: '1',
              project_id: secret1,
            },
            JSON: {
              $token: secret1,
              $group_key: 'company',
              $group_id: 'company123',
              $set: {
                name: 'Test Company',
                industry: 'Technology',
              },
            },
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200, // The HTTP status is 200, but the response body contains 207
        body: {
          output: {
            status: 200,
            message: expect.stringContaining('Error in Groups API'),
            response: [
              {
                statusCode: 400,
                metadata: expect.objectContaining({
                  jobId: 1,
                }),
                error: expect.stringContaining('Groups API error'),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'mp_v1_scenario_5',
    name: 'mp',
    description: '[Proxy v1 API] :: Mixpanel non-success status code handling',
    successCriteria: 'Should handle non-success status codes correctly',
    scenario: 'Error Handling',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.mixpanel.com/import',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              project_id: secret1,
            },
            JSON_ARRAY: {
              batch: JSON.stringify([
                {
                  event: 'Test Event 1',
                  properties: {
                    time: 1619006730,
                    $insert_id: 'event1',
                    distinct_id: 'user123',
                    property1: 'value1',
                  },
                },
              ]),
            },
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200, // The HTTP status is 200, but the response body contains 500
        body: {
          output: {
            status: 500,
            message: expect.stringContaining('Error encountered in transformer proxy V1'),
            response: [
              {
                statusCode: 500,
                metadata: expect.objectContaining({
                  jobId: 1,
                }),
                error: expect.stringContaining('Internal Server Error'),
              },
            ],
            statTags: retryStatTags,
          },
        },
      },
    },
  },
  {
    id: 'mp_v1_scenario_6',
    name: 'mp',
    description: '[Proxy v1 API] :: Mixpanel Import API successful batch with GZIP payload',
    successCriteria: 'Should return 200 with successful response for all events',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.mixpanel.com/import',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              project_id: secret1,
            },
            GZIP: {
              payload: gzipPayload,
            },
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Request for MP Processed Successfully',
            response: [
              {
                statusCode: 200,
                metadata: expect.objectContaining({
                  jobId: 1,
                }),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: expect.objectContaining({
                  jobId: 2,
                }),
                error: 'success',
              },
            ],
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      // Mock the Mixpanel Import API response for successful batch we are doing beacuse data in gzip format
      // mockAdapter.onPost do not handle deep match of body due to this we
      // create custom mock so that we can check wheather the correct body and header is sent to mockAdapter
      mockAdapter.onPost('https://api.mixpanel.com/import').reply((config) => {
        const actualBody = gunzipSync(config.data).toString();
        const actualHeaders = config.headers || {};
        const headersMatch = Object.entries({
          'Content-Encoding': 'gzip',
          'Content-Type': 'application/json',
          'User-Agent': 'RudderLabs',
        }).every(
          ([key, value]) =>
            actualHeaders[key] && actualHeaders[key].toLowerCase() === value.toLowerCase(),
        );

        if (actualBody === gzipPayload && headersMatch) {
          return [
            200,
            {
              status: 2,
            },
          ];
        } else {
          return [400, 'Request body did not match'];
        }
      });
    },
  },
  {
    id: 'mp_v1_scenario_7',
    name: 'mp',
    description:
      '[Proxy v1 API] :: Mixpanel Import API unsuccessful batch with invalid GZIP payload',
    successCriteria: 'Should return 200 with successful response for all events',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://api.mixpanel.com/import',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              project_id: secret1,
            },
            GZIP: {
              payload: { hello: 'world' },
            },
          },
          metadata,
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
            message:
              'Failed to do GZIP compression: TypeError [ERR_INVALID_ARG_TYPE]: The \"chunk\" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Object',
            response: [
              {
                statusCode: 400,
                metadata: expect.objectContaining({
                  jobId: 1,
                }),
                error:
                  'Failed to do GZIP compression: TypeError [ERR_INVALID_ARG_TYPE]: The \"chunk\" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Object',
              },
              {
                statusCode: 400,
                metadata: expect.objectContaining({
                  jobId: 2,
                }),
                error:
                  'Failed to do GZIP compression: TypeError [ERR_INVALID_ARG_TYPE]: The \"chunk\" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Object',
              },
            ],
            statTags: {
              destType: 'MP',
              destinationId: 'default-destinationId',
              errorCategory: 'platform',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },
];
