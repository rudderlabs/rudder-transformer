import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { isMatch } from 'lodash';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';

const proxyV1TestData: ProxyV1TestData[] = [
  {
    id: '1',
    name: 'am',
    description: 'Test 10: for http endpoint single event success scenario',
    scenario: 'Business',
    successCriteria: 'Should deliver event successfully to amplitude endpoint',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            api_key: 'dummy-api-key',
            events: [
              {
                time: 1619006730330,
                user_id: 'gabi_userId_45',
                user_properties: {
                  email: 'gabi29@gmail.com',
                  zip: '100-0001',
                },
              },
            ],
            options: {
              min_id_length: 1,
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
          endpoint: 'https://api2.amplitude.com/2/httpapi',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: {
                code: 200,
                events_ingested: 1,
                payload_size_bytes: 50,
                server_upload_time: 1396381378123,
              },
              status: 200,
            },
            message: '[amplitude Response Handler] - Request Processed Successfully',
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/2/httpapi', {
          asymmetricMatch: (actual) => {
            const expected = {
              api_key: 'dummy-api-key',
              events: [
                {
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    email: 'gabi29@gmail.com',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(200, {
          code: 200,
          events_ingested: 1,
          payload_size_bytes: 50,
          server_upload_time: 1396381378123,
        });
    },
  },
  {
    id: '2',
    name: 'am',
    description: 'Test 11: for http endpoint single event failure scenario',
    feature: 'dataDelivery',
    scenario: 'Business',
    successCriteria: 'Should return 400 with error with destination response',
    module: 'destination',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            api_key: 'dummy-api-key-failure',
            events: [
              {
                time: 1619006730330,
                user_id: 'gabi_userId_45',
                user_properties: {
                  email: 'gabi29@gmail.com',
                  zip: '100-0001',
                },
              },
            ],
            options: {
              min_id_length: 1,
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
          endpoint: 'https://api2.amplitude.com/2/httpapi',
          endpointPath: 'httpapi',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Request failed during amplitude response transformation: with status "400" due to "Request missing required field", (Aborted)',
            response: [
              {
                error:
                  '{"code":400,"error":"Request missing required field","missing_field":"api_key","events_with_missing_fields":{"event_type":[3]}}',
                metadata: generateMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: {
              destType: 'AM',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 400,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/2/httpapi', {
          asymmetricMatch: (actual) => {
            const expected = {
              api_key: 'dummy-api-key-failure',
              events: [
                {
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    email: 'gabi29@gmail.com',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(400, {
          code: 400,
          error: 'Request missing required field',
          missing_field: 'api_key',
          events_with_missing_fields: {
            event_type: [3],
          },
        });
    },
  },
  {
    id: '3',
    name: 'am',
    description: 'Test 11: for http endpoint single event throttled scenario',
    feature: 'dataDelivery',
    module: 'destination',
    scenario: 'Business',
    successCriteria: 'Should return 500 with error with destination response',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            api_key: 'dummy-api-key-throttled',
            events: [
              {
                time: 1619006730330,
                user_id: 'gabi_userId_45',
                user_properties: {
                  email: 'gabi29@gmail.com',
                  zip: '100-0001',
                },
              },
            ],
            options: {
              min_id_length: 1,
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
          endpoint: 'https://api2.amplitude.com/2/httpapi',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Request failed during amplitude response transformation: with status "429" due to "Too many requests for some devices and users", (Throttled)',
            response: [
              {
                error:
                  '{"code":429,"error":"Too many requests for some devices and users","eps_threshold":30,"throttled_devices":{"C8F9E604-F01A-4BD9-95C6-8E5357DF265D":31},"throttled_users":{"datamonster@amplitude.com":32},"throttled_events":[3,4,7]}',
                metadata: generateMetadata(1),
                statusCode: 429,
              },
            ],
            statTags: {
              destType: 'AM',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 429,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/2/httpapi', {
          asymmetricMatch: (actual) => {
            const expected = {
              api_key: 'dummy-api-key-throttled',
              events: [
                {
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    email: 'gabi29@gmail.com',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(429, {
          code: 429,
          error: 'Too many requests for some devices and users',
          eps_threshold: 30,
          throttled_devices: {
            'C8F9E604-F01A-4BD9-95C6-8E5357DF265D': 31,
          },
          throttled_users: {
            'datamonster@amplitude.com': 32,
          },
          throttled_events: [3, 4, 7],
        });
    },
  },
  {
    id: '4',
    name: 'am',
    description: 'Test 13: for groupIdentify call success scenario',
    feature: 'dataDelivery',
    module: 'destination',
    scenario: 'Business',
    successCriteria: 'Should return 200 with success',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          FORM: {
            api_key: 'dummy-api-key-groupIdentify-success',
            identification: [JSON.stringify({ group_type: 'Company', group_value: 'ABC' })],
          },
          headers: {},
          endpoint: 'https://api2.amplitude.com/groupidentify',
          endpointPath: 'groupidentify',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              status: 200,
              response: '',
            },
            message: '[amplitude Response Handler] - Request Processed Successfully',
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/groupidentify', {
          asymmetricMatch: (actual) => {
            const actualString = actual.toString();
            return actualString.includes('api_key=dummy-api-key-groupIdentify-success');
          },
        })
        .replyOnce(200);
    },
  },
  {
    id: '5',
    name: 'am',
    description:
      'Test 14: for batch endpoint call success scenario with multiple events, batched through /batch endpoint not routerTransform',
    feature: 'dataDelivery',
    module: 'destination',
    scenario: 'Business',
    successCriteria: 'Should return 200 with success, metadata should contain dontBatch as false',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              events: [
                {
                  ip: '[::1]',
                  time: 1603132712347,
                  os_name: '',
                  user_id: 'sampleusrRudder3',
                },
                {
                  ip: '[::1]',
                  time: 1603132719505,
                  os_name: '',
                  user_id: 'sampleusrRudder3',
                },
                {
                  ip: '[::1]',
                  time: 1603132726413,
                  groups: {
                    Company: 'Comapny-ABC',
                  },
                  os_name: '',
                },
                {
                  ip: '[::1]',
                  time: 1603132726413,
                  groups: {
                    Company: 'Comapny-ABC',
                  },
                  os_name: '',
                  user_id: 'sampleusrRudder3',
                },
              ],
              api_key: 'dummy-api-key-batch-success',
            },
            headers: {
              'Content-Type': 'application/json',
            },
            endpoint: 'https://api2.amplitude.com/batch',
            endpointPath: 'batch',
            params: {
              destination: 'am',
            },
          },
          [generateMetadata(1), generateMetadata(2), generateMetadata(3), generateMetadata(4)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              status: 200,
              response: {
                code: 200,
                events_ingested: 50,
                payload_size_bytes: 50,
                server_upload_time: 1396381378123,
              },
            },
            message: '[amplitude Response Handler] - Request Processed Successfully',
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
              {
                error: 'success',
                metadata: generateMetadata(2),
                statusCode: 200,
              },
              {
                error: 'success',
                metadata: generateMetadata(3),
                statusCode: 200,
              },
              {
                error: 'success',
                metadata: generateMetadata(4),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/batch', {
          asymmetricMatch: (actual) => {
            const expected = {
              events: [
                {
                  ip: '[::1]',
                  time: 1603132712347,
                  os_name: '',
                  user_id: 'sampleusrRudder3',
                },
                {
                  ip: '[::1]',
                  time: 1603132719505,
                  os_name: '',
                  user_id: 'sampleusrRudder3',
                },
                {
                  ip: '[::1]',
                  time: 1603132726413,
                  groups: {
                    Company: 'Comapny-ABC',
                  },
                  os_name: '',
                },
                {
                  ip: '[::1]',
                  time: 1603132726413,
                  groups: {
                    Company: 'Comapny-ABC',
                  },
                  os_name: '',
                  user_id: 'sampleusrRudder3',
                },
              ],
              api_key: 'dummy-api-key-batch-success',
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(200, {
          code: 200,
          events_ingested: 50,
          payload_size_bytes: 50,
          server_upload_time: 1396381378123,
        });
    },
  },
  {
    id: '6',
    name: 'am',
    description:
      'Test 15: for batch endpoint call failure scenario with multiple events, batched through /batch endpoint not routerTransform and dontBatch is false',
    scenario: 'Business',
    successCriteria:
      'Event should be retried with dontBatch set to true and status code should be 500',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              events: [
                {
                  ip: '[::1]',
                  time: 1603132712347,
                  os_name: '',
                  user_id: '1',
                },
                {
                  ip: '[::1]',
                  time: 1603132719505,
                  os_name: '',
                  user_id: '2',
                },
              ],
              api_key: 'dummy-api-key-batch-success',
            },
            headers: {
              'Content-Type': 'application/json',
            },
            endpoint: 'https://api2.amplitude.com/batch',
            endpointPath: 'batch',
            params: {
              destination: 'am',
            },
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              status: 400,
              response: {
                code: 400,
                error: 'Request missing required field',
                missing_field: 'api_key',
                events_with_invalid_fields: {
                  time: [3, 4, 7],
                },
                events_with_missing_fields: {
                  event_type: [3, 4, 7],
                },
              },
            },
            message:
              'Request failed for a batch of events during amplitude response transformation: with status "400" due to "Request missing required field" (Retryable)',
            response: [
              {
                error: '"Request missing required field"',
                metadata: {
                  ...generateMetadata(1),
                  dontBatch: true,
                },
                statusCode: 500,
              },
              {
                error: '"Request missing required field"',
                metadata: {
                  ...generateMetadata(2),
                  dontBatch: true,
                },
                statusCode: 500,
              },
            ],
            status: 400,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/batch', {
          asymmetricMatch: (actual) => {
            const expected = {
              events: [
                {
                  ip: '[::1]',
                  time: 1603132712347,
                  os_name: '',
                  user_id: '1',
                },
                {
                  ip: '[::1]',
                  time: 1603132719505,
                  os_name: '',
                  user_id: '2',
                },
              ],
              api_key: 'dummy-api-key-batch-success',
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(400, {
          code: 400,
          error: 'Request missing required field',
          missing_field: 'api_key',
          events_with_invalid_fields: {
            time: [3, 4, 7],
          },
          events_with_missing_fields: {
            event_type: [3, 4, 7],
          },
        });
    },
  },
  {
    id: '7',
    name: 'am',
    description:
      'Test 16: for batch endpoint call failure scenario with multiple events, batched through /batch endpoint not routerTransform and dontBatch is true',
    successCriteria: 'Event should be failed with status code should be 400',
    feature: 'dataDelivery',
    module: 'destination',
    scenario: 'Business',
    skip: false,
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              events: [
                {
                  ip: '[::1]',
                  time: 1603132712347,
                  os_name: '',
                  user_id: '1',
                },
                {
                  ip: '[::1]',
                  time: 1603132719505,
                  os_name: '',
                  user_id: '2',
                },
              ],
              api_key: 'dummy-api-key-batch-success',
            },
            headers: {
              'Content-Type': 'application/json',
            },
            endpoint: 'https://api2.amplitude.com/batch',
            endpointPath: 'batch',
            params: {
              destination: 'am',
            },
          },
          [
            {
              jobId: 1,
              attemptNum: 1,
              userId: '1',
              sourceId: 'default-sourceId',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              secret: {
                accessToken: 'defaultAccessToken',
              },
              dontBatch: true,
            },
            {
              jobId: 2,
              attemptNum: 1,
              userId: '2',
              sourceId: 'default-sourceId',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              secret: {
                accessToken: 'defaultAccessToken',
              },
              dontBatch: true,
            },
          ],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              status: 400,
              response: {
                code: 400,
                error: 'Request missing required field',
                missing_field: 'api_key',
                events_with_invalid_fields: {
                  time: [3, 4, 7],
                },
                events_with_missing_fields: {
                  event_type: [3, 4, 7],
                },
              },
            },
            message:
              'Request failed for a batch of events during amplitude response transformation: with status "400" due to "Request missing required field" (Retryable)',
            response: [
              {
                error: '"Request missing required field"',
                metadata: {
                  secret: {
                    accessToken: 'defaultAccessToken',
                  },
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: true,
                  jobId: 1,
                  sourceId: 'default-sourceId',
                  userId: '1',
                  workspaceId: 'default-workspaceId',
                },
                statusCode: 400,
              },
              {
                error: '"Request missing required field"',
                metadata: {
                  secret: {
                    accessToken: 'defaultAccessToken',
                  },
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: true,
                  jobId: 2,
                  sourceId: 'default-sourceId',
                  userId: '2',
                  workspaceId: 'default-workspaceId',
                },
                statusCode: 400,
              },
            ],
            status: 400,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/batch', {
          asymmetricMatch: (actual) => {
            const expected = {
              events: [
                {
                  ip: '[::1]',
                  time: 1603132712347,
                  os_name: '',
                  user_id: '1',
                },
                {
                  ip: '[::1]',
                  time: 1603132719505,
                  os_name: '',
                  user_id: '2',
                },
              ],
              api_key: 'dummy-api-key-batch-success',
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(400, {
          code: 400,
          error: 'Request missing required field',
          missing_field: 'api_key',
          events_with_invalid_fields: {
            time: [3, 4, 7],
          },
          events_with_missing_fields: {
            event_type: [3, 4, 7],
          },
        });
    },
  },
  {
    id: '8',
    name: 'am',
    description: 'Test 17: for http endpoint single event 500 server error scenario',
    scenario: 'Business',
    successCriteria: 'Should throw RetryableError with status 500',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            api_key: 'dummy-api-key-500-error',
            events: [
              {
                time: 1619006730330,
                user_id: 'test_user_500',
                user_properties: {
                  email: 'test500@gmail.com',
                },
              },
            ],
            options: {
              min_id_length: 1,
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
          endpoint: 'https://api2.amplitude.com/2/httpapi',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Request failed during amplitude response transformation: with status \"500\" due to \"Internal server error\", (Retryable)',
            response: [
              {
                error: '{"code":500,"error":"Internal server error"}',
                metadata: generateMetadata(1),
                statusCode: 500,
              },
            ],
            statTags: {
              destType: 'AM',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 500,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/2/httpapi', {
          asymmetricMatch: (actual) => {
            const expected = {
              api_key: 'dummy-api-key-500-error',
              events: [
                {
                  time: 1619006730330,
                  user_id: 'test_user_500',
                  user_properties: {
                    email: 'test500@gmail.com',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(500, {
          code: 500,
          error: 'Internal server error',
        });
    },
  },
  {
    id: '9',
    name: 'am',
    description: 'Test 18: for http endpoint single event 503 service unavailable scenario',
    scenario: 'Business',
    successCriteria: 'Should throw RetryableError with status 500',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            api_key: 'dummy-api-key-503-error',
            events: [
              {
                time: 1619006730330,
                user_id: 'test_user_503',
                user_properties: {
                  email: 'test503@gmail.com',
                },
              },
            ],
            options: {
              min_id_length: 1,
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
          endpoint: 'https://api2.amplitude.com/2/httpapi',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Request failed during amplitude response transformation: with status "503" due to "Service temporarily unavailable", (Retryable)',
            response: [
              {
                error: '{"code":503,"error":"Service temporarily unavailable"}',
                metadata: generateMetadata(1),
                statusCode: 500,
              },
            ],
            statTags: {
              destType: 'AM',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 500,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/2/httpapi', {
          asymmetricMatch: (actual) => {
            const expected = {
              api_key: 'dummy-api-key-503-error',
              events: [
                {
                  time: 1619006730330,
                  user_id: 'test_user_503',
                  user_properties: {
                    email: 'test503@gmail.com',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(503, {
          code: 503,
          error: 'Service temporarily unavailable',
        });
    },
  },
  {
    id: '11',
    name: 'am',
    description: 'Test 20: for groupIdentify call failure scenario',
    feature: 'dataDelivery',
    module: 'destination',
    scenario: 'Business',
    successCriteria: 'Should return 400 with error',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          FORM: {
            api_key: 'dummy-api-key-groupIdentify-failure',
            identification: [JSON.stringify({ group_type: 'Company' })],
          },
          headers: {},
          endpoint: 'https://api2.amplitude.com/groupidentify',
          endpointPath: 'groupidentify',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Request failed during amplitude response transformation: with status "400" due to "Missing group_value", (Aborted)',
            response: [
              {
                error: '{"error":"Missing group_value"}',
                metadata: generateMetadata(1),
                statusCode: 400,
              },
            ],
            statTags: {
              destType: 'AM',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 400,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/groupidentify', {
          asymmetricMatch: (actual) => {
            const actualString = actual.toString();
            return actualString.includes('api_key=dummy-api-key-groupIdentify-failure');
          },
        })
        .replyOnce(400, {
          error: 'Missing group_value',
        });
    },
  },
  {
    id: '14',
    name: 'am',
    description:
      'Test 23: for 429 with only throttled_users defined but empty (should trigger ThrottledError)',
    scenario: 'Business',
    successCriteria: 'Should throw ThrottledError when throttled_users is empty object',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    skip: false,
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            api_key: 'dummy-api-key-empty-throttled-users',
            events: [
              {
                time: 1619006730330,
                user_id: 'test_user_empty_throttle',
                user_properties: {
                  email: 'emptythrottle@gmail.com',
                },
              },
            ],
            options: {
              min_id_length: 1,
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
          endpoint: 'https://api2.amplitude.com/2/httpapi',
          params: {
            destination: 'am',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Request failed during amplitude response transformation: with status "429" due to "Rate limit exceeded", (Throttled)',
            response: [
              {
                error:
                  '{"code":429,"error":"Rate limit exceeded","eps_threshold":50,"throttled_users":{}}',
                metadata: generateMetadata(1),
                statusCode: 429,
              },
            ],
            statTags: {
              destType: 'AM',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 429,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api2.amplitude.com/2/httpapi', {
          asymmetricMatch: (actual) => {
            const expected = {
              api_key: 'dummy-api-key-empty-throttled-users',
              events: [
                {
                  time: 1619006730330,
                  user_id: 'test_user_empty_throttle',
                  user_properties: {
                    email: 'emptythrottle@gmail.com',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            };
            const isMatched = isMatch(actual, expected);
            return isMatched;
          },
        })
        .replyOnce(429, {
          code: 429,
          error: 'Rate limit exceeded',
          eps_threshold: 50,
          throttled_users: {},
        });
    },
  },
];

// Note: This destination makes use of generic network handler
export const data = [
  {
    name: 'am',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/test1',
          method: 'POST',
          userId: 'gabi_anonId_45',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-CleverTap_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    Residence: 'Shibuya',
                    city: 'Tokyo',
                    country: 'JP',
                    email: 'gabi29@gmail.com',
                    gender: 'M',
                    name: 'User2 Gabi2',
                    organization: 'Company',
                    region: 'ABC',
                    title: 'Owner',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[amplitude Response Handler] - Request Processed Successfully',
            destinationResponse: {
              code: 200,
              server_upload_time: 1639235302252,
              payload_size_bytes: 863,
              events_ingested: 1,
            },
          },
        },
      },
    },
  },
  {
    name: 'am',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/test2',
          method: 'POST',
          userId: 'gabi_anonId_45',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-CleverTap_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    Residence: 'Shibuya',
                    city: 'Tokyo',
                    country: 'JP',
                    email: 'gabi29@gmail.com',
                    gender: 'M',
                    name: 'User2 Gabi2',
                    organization: 'Company',
                    region: 'ABC',
                    title: 'Owner',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Request Failed during amplitude response transformation: with status "400" due to "{"code":400,"server_upload_time":1639235302252,"payload_size_bytes":863,"events_ingested":0}", (Aborted)',
            destinationResponse: {
              headers: {
                'access-control-allow-methods': 'GET, POST',
                'access-control-allow-origin': '*',
                connection: 'keep-alive',
                'content-length': '93',
                'content-type': 'application/json',
                date: 'Sat, 11 Dec 2021 15:08:22 GMT',
                'strict-transport-security': 'max-age=15768000',
              },
              response: {
                code: 400,
                server_upload_time: 1639235302252,
                payload_size_bytes: 863,
                events_ingested: 0,
              },
              status: 400,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'am',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/test3',
          method: 'POST',
          userId: 'gabi_anonId_45',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-CleverTap_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    Residence: 'Shibuya',
                    city: 'Tokyo',
                    country: 'JP',
                    email: 'gabi29@gmail.com',
                    gender: 'M',
                    name: 'User2 Gabi2',
                    organization: 'Company',
                    region: 'ABC',
                    title: 'Owner',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Request Failed during amplitude response transformation: with status "400" due to ""[ENOTFOUND] :: DNS lookup failed"", (Aborted)',
            destinationResponse: {
              response: '[ENOTFOUND] :: DNS lookup failed',
              status: 400,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost(
          'https://api.amplitude.com/2/httpapi/test3',
          {
            asymmetricMatch: (actual) => {
              const expected = {
                api_key: 'dummy-api-key',
                events: [
                  {
                    app_name: 'Rudder-CleverTap_Example',
                    app_version: '1.0',
                    time: 1619006730330,
                    user_id: 'gabi_userId_45',
                    user_properties: {
                      Residence: 'Shibuya',
                      city: 'Tokyo',
                      country: 'JP',
                      email: 'gabi29@gmail.com',
                      gender: 'M',
                      name: 'User2 Gabi2',
                      organization: 'Company',
                      region: 'ABC',
                      title: 'Owner',
                      zip: '100-0001',
                    },
                  },
                ],
                options: { min_id_length: 1 },
              };
              const isMatched = isMatch(actual, expected);
              return isMatched;
            },
          },
          {
            asymmetricMatch: (actual) => {
              const expected = { 'Content-Type': 'application/json', 'User-Agent': 'RudderLabs' };
              const isMatched = isMatch(actual, expected);
              return isMatched;
            },
          },
        )
        .replyOnce((config) => {
          // @ts-ignore
          const err = AxiosError.from('DNS not found', 'ENOTFOUND', config);
          return Promise.reject(err);
        });
    },
  },
  {
    name: 'am',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/test4',
          method: 'POST',
          userId: 'gabi_anonId_45',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-CleverTap_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    Residence: 'Shibuya',
                    city: 'Tokyo',
                    country: 'JP',
                    email: 'gabi29@gmail.com',
                    gender: 'M',
                    name: 'User2 Gabi2',
                    organization: 'Company',
                    region: 'ABC',
                    title: 'Owner',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Request Failed during amplitude response transformation: with status "400" due to """", (Aborted)',
            destinationResponse: {
              response: '',
              status: 400,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'am',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/test5',
          method: 'POST',
          userId: 'gabi_anonId_45',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-CleverTap_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    Residence: 'Shibuya',
                    city: 'Tokyo',
                    country: 'JP',
                    email: 'gabi29@gmail.com',
                    gender: 'M',
                    name: 'User2 Gabi2',
                    organization: 'Company',
                    region: 'ABC',
                    title: 'Owner',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              'Request Failed during amplitude response transformation: with status "500" due to """", (Retryable)',
            destinationResponse: {
              response: '',
              status: 500,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'am',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/test6',
          method: 'POST',
          userId: 'gabi_anonId_45',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-CleverTap_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'gabi_userId_45',
                  user_properties: {
                    Residence: 'Shibuya',
                    city: 'Tokyo',
                    country: 'JP',
                    email: 'gabi29@gmail.com',
                    gender: 'M',
                    name: 'User2 Gabi2',
                    organization: 'Company',
                    region: 'ABC',
                    title: 'Owner',
                    zip: '100-0001',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              'Request Failed during amplitude response transformation: with status "500" due to """", (Retryable)',
            destinationResponse: {
              response: '',
              status: 500,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    name: 'am',
    description: 'Test 6: for 429 Rate Limit Handling (ThrottledUsers)',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/rate-limited',
          method: 'POST',
          userId: 'test_user_123',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-Amplitude_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'testrluser@email.com',
                  user_properties: {
                    city: 'San Francisco',
                    country: 'US',
                    email: 'testrluser@email.com',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500, // Expected status is 500 (RetryableError)
        body: {
          output: {
            status: 500,
            message:
              'Request Failed during amplitude response transformation: Too many requests for some devices and users - due to Request Limit exceeded, (Retryable)',
            destinationResponse: {
              headers: {
                'access-control-allow-methods': 'GET, POST',
                'access-control-allow-origin': '*',
                'content-type': 'application/json',
                'retry-after': '120',
              },
              response: {
                code: 429,
                error: 'Too many requests for some devices and users',
                eps_threshold: 30,
                throttled_users: {
                  'testrluser@email.com': 32,
                },
                throttled_events: [3, 4, 7],
              },
              status: 429,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api.amplitude.com/2/httpapi/rate-limited', {
          asymmetricMatch: (actual) => {
            // Simple check to match the request body
            return actual.api_key === 'dummy-api-key';
          },
        })
        .replyOnce(
          429,
          {
            code: 429,
            error: 'Too many requests for some devices and users',
            eps_threshold: 30,
            throttled_users: {
              'testrluser@email.com': 32,
            },
            throttled_events: [3, 4, 7],
          },
          {
            'access-control-allow-methods': 'GET, POST',
            'access-control-allow-origin': '*',
            'content-type': 'application/json',
            'retry-after': '120',
          },
        );
    },
  },
  {
    name: 'am',
    description: 'Test 7: for 429 Rate Limit Handling (ThrottledDevices)',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/rate-limited',
          method: 'POST',
          userId: 'test_user_123',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-Amplitude_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'testrluser@email.com',
                  user_properties: {
                    city: 'San Francisco',
                    country: 'US',
                    email: 'testrluser@email.com',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500, // Expected status is 500 (RetryableError)
        body: {
          output: {
            status: 500,
            message:
              'Request Failed during amplitude response transformation: Too many requests for some devices and users - due to Request Limit exceeded, (Retryable)',
            destinationResponse: {
              headers: {
                'access-control-allow-methods': 'GET, POST',
                'access-control-allow-origin': '*',
                'content-type': 'application/json',
                'retry-after': '120',
              },
              response: {
                code: 429,
                error: 'Too many requests for some devices and users',
                eps_threshold: 30,
                throttled_devices: {
                  'HIJ3L821-F01A-2GY5-2C81-7F03X7DS291D': 31,
                },
                throttled_events: [3, 4, 7],
              },
              status: 429,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api.amplitude.com/2/httpapi/rate-limited', {
          asymmetricMatch: (actual) => {
            // Simple check to match the request body
            return actual.api_key === 'dummy-api-key';
          },
        })
        .replyOnce(
          429,
          {
            code: 429,
            error: 'Too many requests for some devices and users',
            eps_threshold: 30,
            throttled_devices: {
              'HIJ3L821-F01A-2GY5-2C81-7F03X7DS291D': 31,
            },
            throttled_events: [3, 4, 7],
          },
          {
            'access-control-allow-methods': 'GET, POST',
            'access-control-allow-origin': '*',
            'content-type': 'application/json',
            'retry-after': '120',
          },
        );
    },
  },
  {
    name: 'am',
    description: 'Test 8: for 429 Rate Limit Handling (ThrottledUsers and ThrottledDevices)',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/rate-limited',
          method: 'POST',
          userId: 'test_user_123',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'dummy-api-key',
              events: [
                {
                  app_name: 'Rudder-Amplitude_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'testrluser@email.com',
                  user_properties: {
                    city: 'San Francisco',
                    country: 'US',
                    email: 'testrluser@email.com',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500, // Expected status is 500 (RetryableError)
        body: {
          output: {
            status: 500,
            message:
              'Request Failed during amplitude response transformation: Too many requests for some devices and users - due to Request Limit exceeded, (Retryable)',
            destinationResponse: {
              headers: {
                'access-control-allow-methods': 'GET, POST',
                'access-control-allow-origin': '*',
                'content-type': 'application/json',
                'retry-after': '120',
              },
              response: {
                code: 429,
                error: 'Too many requests for some devices and users',
                eps_threshold: 30,
                throttled_devices: {
                  'HIJ3L821-F01A-2GY5-2C81-7F03X7DS291D': 31,
                },
                throttled_users: {
                  'testrluser@email.com': 32,
                },
                throttled_events: [3, 4, 7],
              },
              status: 429,
            },
            statTags: {
              destType: 'AM',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api.amplitude.com/2/httpapi/rate-limited', {
          asymmetricMatch: (actual) => {
            // Simple check to match the request body
            return actual.api_key === 'dummy-api-key';
          },
        })
        .replyOnce(
          429,
          {
            code: 429,
            error: 'Too many requests for some devices and users',
            eps_threshold: 30,
            throttled_devices: {
              'HIJ3L821-F01A-2GY5-2C81-7F03X7DS291D': 31,
            },
            throttled_users: {
              'testrluser@email.com': 32,
            },
            throttled_events: [3, 4, 7],
          },
          {
            'access-control-allow-methods': 'GET, POST',
            'access-control-allow-origin': '*',
            'content-type': 'application/json',
            'retry-after': '120',
          },
        );
    },
  },
  {
    name: 'am',
    description: 'Test 9: for standard 429 Rate Limit Handling (ThrottledError)',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          endpoint: 'https://api.amplitude.com/2/httpapi/standard-rate-limited',
          method: 'POST',
          userId: 'test_user_456',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            FORM: {},
            JSON: {
              api_key: 'random-api-key',
              events: [
                {
                  app_name: 'Rudder-Amplitude_Example',
                  app_version: '1.0',
                  time: 1619006730330,
                  user_id: 'user@example.com',
                  user_properties: {
                    city: 'San Francisco',
                    country: 'US',
                    email: 'user@example.com',
                  },
                },
              ],
              options: {
                min_id_length: 1,
              },
            },
            JSON_ARRAY: {},
            XML: {},
          },
          files: {},
          params: {
            destination: 'am',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            destinationResponse: {
              headers: {
                'access-control-allow-methods': 'GET, POST',
                'access-control-allow-origin': '*',
                'content-type': 'application/json',
                'retry-after': '60',
              },
              response: {
                code: 429,
                eps_threshold: 20,
                error: 'Rate limit exceeded',
                throttled_events: [],
                throttled_users: {},
              },
              status: 429,
            },
            message:
              'Request Failed during amplitude response transformation: Rate limit exceeded - due to Request Limit exceeded, (Throttled)',
            statTags: {
              destType: 'AM',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 429,
          },
        },
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost('https://api.amplitude.com/2/httpapi/standard-rate-limited', {
          asymmetricMatch: (actual) => {
            // Simple check to match the request body
            return actual.api_key === 'random-api-key';
          },
        })
        .replyOnce(
          429,
          {
            code: 429,
            error: 'Rate limit exceeded',
            eps_threshold: 20,
            throttled_users: {},
            throttled_events: [],
          },
          {
            'access-control-allow-methods': 'GET, POST',
            'access-control-allow-origin': '*',
            'content-type': 'application/json',
            'retry-after': '60',
          },
        );
    },
  },
  ...proxyV1TestData,
];
