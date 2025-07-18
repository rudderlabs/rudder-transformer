import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { isMatch } from 'lodash';

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
];
