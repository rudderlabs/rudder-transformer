import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { testScenariosForV1API } from './business';
import { otherSalesforceScenariosV1 } from './other';
import { authHeader1, authHeader2 } from '../maskedSecrets';

const legacyDataValue = {
  Email: 'danis.archurav@sbermarket.ru',
  Company: 'itus.ru',
  LastName: 'Danis',
  FirstName: 'Archurav',
  LeadSource: 'App Signup',
  account_type__c: 'free_trial',
};

const legacyTests = [
  {
    name: 'salesforce',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/1',
          body: {
            XML: {},
            FORM: {},
            JSON: legacyDataValue,
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
            message: 'Request for destination: salesforce Processed Successfully',
            destinationResponse: {
              response: {
                statusText: 'No Content',
              },
              status: 204,
            },
          },
        },
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/3',
          body: {
            XML: {},
            FORM: {},
            JSON: legacyDataValue,
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
              'Salesforce Request Failed - due to "INVALID_SESSION_ID", (Retryable) during Salesforce Response Handling',
            destinationResponse: {
              response: [
                {
                  message: 'Session expired or invalid',
                  errorCode: 'INVALID_SESSION_ID',
                },
              ],
              status: 401,
            },
            statTags: {
              destType: 'SALESFORCE',
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
    name: 'salesforce',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader2,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/2',
          body: {
            XML: {},
            FORM: {},
            JSON: legacyDataValue,
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
              'Salesforce Request Failed: "401" due to "INVALID_HEADER_TYPE", (Aborted) during Salesforce Response Handling',
            destinationResponse: {
              response: [
                {
                  message: 'INVALID_HEADER_TYPE',
                  errorCode: 'INVALID_AUTH_HEADER',
                },
              ],
              status: 401,
            },
            statTags: {
              destType: 'SALESFORCE',
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
    name: 'salesforce',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/4',
          body: {
            XML: {},
            FORM: {},
            JSON: legacyDataValue,
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
            status: 429,
            message:
              'Salesforce Request Failed - due to "REQUEST_LIMIT_EXCEEDED", (Throttled) during Salesforce Response Handling',
            destinationResponse: {
              response: [
                {
                  message: 'Request limit exceeded',
                  errorCode: 'REQUEST_LIMIT_EXCEEDED',
                },
              ],
              status: 403,
            },
            statTags: {
              destType: 'SALESFORCE',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'throttled',
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
    name: 'salesforce',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/5',
          body: {
            XML: {},
            FORM: {},
            JSON: legacyDataValue,
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
            status: 429,
            message:
              'Salesforce Request Failed: 503 - due to Server Unavailable, during Salesforce Response Handling',
            destinationResponse: {
              response: [
                {
                  message: 'Server Unavailable',
                  errorCode: 'SERVER_UNAVAILABLE',
                },
              ],
              status: 503,
            },
            statTags: {
              destType: 'SALESFORCE',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'throttled',
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
    name: 'salesforce',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/6',
          body: {
            XML: {},
            FORM: {},
            JSON: legacyDataValue,
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
              'Salesforce Request Failed: "400" due to "{"error":"invalid_grant","error_description":"authentication failure"}", (Aborted) during Salesforce Response Handling',
            destinationResponse: {
              response: {
                error: 'invalid_grant',
                error_description: 'authentication failure',
              },
              status: 400,
            },
            statTags: {
              destType: 'SALESFORCE',
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
    name: 'salesforce',
    description: 'Test 6',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/7',
          body: {
            XML: {},
            FORM: {},
            JSON: legacyDataValue,
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
            destinationResponse: {
              response: {
                errorCode: 'SERVER_UNAVAILABLE',
                message: 'Server Unavailable',
              },
              status: 503,
            },
            message:
              'Salesforce Request Failed: 503 - due to "{"message":"Server Unavailable","errorCode":"SERVER_UNAVAILABLE"}", (Retryable) during Salesforce Response Handling',
            statTags: {
              destType: 'SALESFORCE',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
            status: 500,
          },
        },
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 7',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://rudderstack.my.salesforce.com/services/data/v50.0/parameterizedSearch/?q=123&sobject=object_name&in=External_ID__c&object_name.fields=id,External_ID__c',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          body: {
            JSON: {
              Planning_Categories__c: 'pc',
              External_ID__c: 123,
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
            message: 'Request for destination: salesforce Processed Successfully',
            destinationResponse: {
              response: {
                searchRecords: [
                  {
                    attributes: {
                      type: 'object_name',
                      url: '/services/data/v50.0/sobjects/object_name/a0J75100002w97gEAA',
                    },
                    Id: 'a0J75100002w97gEAA',
                    External_ID__c: 'external_id',
                  },
                  {
                    attributes: {
                      type: 'object_name',
                      url: '/services/data/v50.0/sobjects/object_name/a0J75200002w9ZsEAI',
                    },
                    Id: 'a0J75200002w9ZsEAI',
                    External_ID__c: 'external_id TEST',
                  },
                ],
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 8',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/101',
          body: {
            XML: {},
            FORM: {},
            JSON: {
              Email: 'denis.kornilov@sbermarket.ru',
              Company: 'sbermarket.ru',
              LastName: 'Корнилов',
              FirstName: 'Денис',
              LeadSource: 'App Signup',
              account_type__c: 'free_trial',
            },
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
              'Salesforce Request Failed: 500 - due to ""[ECONNABORTED] :: Connection aborted"", (Retryable) during Salesforce Response Handling',
            destinationResponse: {
              response: '[ECONNABORTED] :: Connection aborted',
              status: 500,
            },
            statTags: {
              destType: 'SALESFORCE',
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
      // params has `{ destination: salesforce }`
      mockAdapter
        .onPost(
          'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/101',
          {
            Email: 'denis.kornilov@sbermarket.ru',
            Company: 'sbermarket.ru',
            LastName: 'Корнилов',
            FirstName: 'Денис',
            LeadSource: 'App Signup',
            account_type__c: 'free_trial',
          },
          {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
            'User-Agent': 'RudderLabs',
            Accept: 'application/json, text/plain, */*',
          },
        )
        .abortRequest();
    },
  },
  {
    name: 'salesforce',
    description: 'Test 9',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          version: '1',
          endpoint: 'https://rudder.my.salesforce.com/services/data/v50.0/sobjects/Lead/102',
          body: {
            XML: {},
            FORM: {},
            JSON: {
              Email: 'denis.kornilov@sbermarket.ru',
              Company: 'sbermarket.ru',
              LastName: 'Корнилов',
              FirstName: 'Денис',
              LeadSource: 'App Signup',
              account_type__c: 'free_trial',
            },
            JSON_ARRAY: {},
          },
          metadata: {
            destInfo: {
              authKey: '2HezPl1w11opbFSxnLDEgZ7kWTf',
            },
          },
          params: {
            destination: 'salesforce',
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
              'Salesforce Request Failed: 500 - due to ""[EAI_AGAIN] :: Temporary failure in name resolution"", (Retryable) during Salesforce Response Handling',
            destinationResponse: {
              response: '[EAI_AGAIN] :: Temporary failure in name resolution',
              status: 500,
            },
            statTags: {
              destType: 'SALESFORCE',
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
      // params has `{ destination: salesforce }`
      mockAdapter
        .onPost(
          'https://rudder.my.salesforce.com/services/data/v50.0/sobjects/Lead/102',
          {
            Email: 'denis.kornilov@sbermarket.ru',
            Company: 'sbermarket.ru',
            LastName: 'Корнилов',
            FirstName: 'Денис',
            LeadSource: 'App Signup',
            account_type__c: 'free_trial',
          },
          {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
            'User-Agent': 'RudderLabs',
            Accept: 'application/json, text/plain, */*',
          },
        )
        .reply((config) => {
          // @ts-ignore
          const err = AxiosError.from('DNS not found', 'EAI_AGAIN', config);
          return Promise.reject(err);
        });
    },
  },
];
export const data = [...legacyTests, ...testScenariosForV1API, ...otherSalesforceScenariosV1];
