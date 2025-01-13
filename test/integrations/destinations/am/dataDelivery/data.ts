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
              api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
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
            message:
              '[Generic Response Handler] Request for destination: am Processed Successfully',
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
                code: 200,
                server_upload_time: 1639235302252,
                payload_size_bytes: 863,
                events_ingested: 1,
              },
              status: 200,
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
              api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
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
              '[Generic Response Handler] Request failed for destination am with status: 400',
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
              api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
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
              '[Generic Response Handler] Request failed for destination am with status: 400',
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
                api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
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
              api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
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
              '[Generic Response Handler] Request failed for destination am with status: 400',
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
              api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
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
              '[Generic Response Handler] Request failed for destination am with status: 500',
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
              api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
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
              '[Generic Response Handler] Request failed for destination am with status: 500',
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
];
