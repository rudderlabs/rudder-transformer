import { ProxyMetdata } from '../../../../../src/types';
import { generateProxyV1Payload } from '../../../testUtils';

const commonHeaders = {
  Authorization: 'Bearer token',
  'Content-Type': 'application/json',
};
const params = { destination: 'salesforce' };

const users = [
  {
    Email: 'danis.archurav@sbermarket.ru',
    Company: 'itus.ru',
    LastName: 'Danis',
    FirstName: 'Archurav',
    LeadSource: 'App Signup',
    account_type__c: 'free_trial',
  },
];

const proxyMetdata: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};

const reqMetadataArray = [proxyMetdata];

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: users[0],
  params,
};

const externalIdSearchData = { Planning_Categories__c: 'pc', External_ID__c: 123 };
const externalIDSearchedData = {
  headers: commonHeaders,
  JSON: externalIdSearchData,
  params,
};

console.log(
  JSON.stringify(
    generateProxyV1Payload(
      {
        ...commonRequestParameters,
        endpoint:
          'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/invalid_session_id',
      },
      reqMetadataArray,
    ),
  ),
);

export const testScenariosForV1API = [
  {
    id: 'salesforce_v1_scenario_1',
    name: 'salesforce',
    description: 'Lead creation with existing unchanged leadId and unchanged data',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint:
              'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/existing_unchanged_leadId',
          },
          reqMetadataArray,
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
            message: 'Request for destination: salesforce Processed Successfully',
            response: [
              {
                error: '{"statusText":"No Content"}',
                metadata: proxyMetdata,
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'salesforce_v1_scenario_2',
    name: 'salesforce',
    description: 'salesforce',
    successCriteria: 'Should return 5XX with error Session expired or invalid, INVALID_SESSION_ID',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint:
              'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/invalid_session_id',
          },
          reqMetadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            message:
              'Salesforce Request Failed - due to "Session expired or invalid", (Retryable) during Salesforce Response Handling',
            response: [
              {
                error:
                  '[{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}]',
                metadata: proxyMetdata,
                statusCode: 500,
              },
            ],
            statTags: {
              destType: 'SALESFORCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
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
    id: 'salesforce_v1_scenario_3',
    name: 'salesforce',
    description: 'salesforce',
    successCriteria: '',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/2',
          },
          reqMetadataArray,
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
              'Salesforce Request Failed: "401" due to "INVALID_HEADER_TYPE", (Aborted) during Salesforce Response Handling',
            response: [
              {
                error: '[{"message":"INVALID_HEADER_TYPE","errorCode":"INVALID_AUTH_HEADER"}]',
                metadata: proxyMetdata,
                statusCode: 400,
              },
            ],
            statTags: {
              destType: 'SALESFORCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
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
    id: 'salesforce_v1_scenario_4',
    name: 'salesforce',
    description: 'salesforce',
    successCriteria: '',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/4',
          },
          reqMetadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Salesforce Request Failed - due to "REQUEST_LIMIT_EXCEEDED", (Throttled) during Salesforce Response Handling',
            response: [
              {
                error:
                  '[{"message":"Request limit exceeded","errorCode":"REQUEST_LIMIT_EXCEEDED"}]',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 429,
              },
            ],
            statTags: {
              destType: 'SALESFORCE',
              destinationId: 'dummyDestinationId',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'dummyWorkspaceId',
            },
            status: 429,
          },
        },
      },
    },
  },

  {
    id: 'salesforce_v1_scenario_5',
    name: 'salesforce',
    description: 'salesforce',
    successCriteria: '',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/5',
          },
          reqMetadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Salesforce Request Failed - due to "Server Unavailable", (Retryable) during Salesforce Response Handling',
            response: [
              {
                error: '[{"message":"Server Unavailable","errorCode":"SERVER_UNAVAILABLE"}]',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 500,
              },
            ],
            statTags: {
              destType: 'SALESFORCE',
              destinationId: 'dummyDestinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'dummyWorkspaceId',
            },
            status: 500,
          },
        },
      },
    },
  },

  {
    id: 'salesforce_v1_scenario_6',
    name: 'salesforce',
    description: 'salesforce',
    successCriteria: '',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/6',
          },
          reqMetadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Salesforce Request Failed: "400" due to "{"error":"invalid_grant","error_description":"authentication failure"}", (Aborted) during Salesforce Response Handling',
            response: [
              {
                error: '{"error":"invalid_grant","error_description":"authentication failure"}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 400,
              },
            ],
            statTags: {
              destType: 'SALESFORCE',
              destinationId: 'dummyDestinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'dummyWorkspaceId',
            },
            status: 400,
          },
        },
      },
    },
  },

  {
    id: 'salesforce_v1_scenario_7',
    name: 'salesforce',
    description: 'salesforce',
    successCriteria: '',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...commonRequestParameters,
            endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/7',
          },
          reqMetadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'Salesforce Request Failed - due to "{"message":"Server Unavailable","errorCode":"SERVER_UNAVAILABLE"}", (Retryable) during Salesforce Response Handling',
            response: [
              {
                error: '{"message":"Server Unavailable","errorCode":"SERVER_UNAVAILABLE"}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 500,
              },
            ],
            statTags: {
              destType: 'SALESFORCE',
              destinationId: 'dummyDestinationId',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'dummyWorkspaceId',
            },
            status: 500,
          },
        },
      },
    },
  },

  {
    id: 'salesforce_v1_scenario_8',
    name: 'salesforce',
    description: 'salesforce',
    successCriteria: '',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...externalIDSearchedData,
            endpoint:
              'https://rudderstack.my.salesforce.com/services/data/v50.0/parameterizedSearch/?q=123&sobject=object_name&in=External_ID__c&object_name.fields=id,External_ID__c',
          },
          reqMetadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request for destination: salesforce Processed Successfully',
            response: [
              {
                error:
                  '{"searchRecords":[{"attributes":{"type":"object_name","url":"/services/data/v50.0/sobjects/object_name/a0J75100002w97gEAA"},"Id":"a0J75100002w97gEAA","External_ID__c":"external_id"},{"attributes":{"type":"object_name","url":"/services/data/v50.0/sobjects/object_name/a0J75200002w9ZsEAI"},"Id":"a0J75200002w9ZsEAI","External_ID__c":"external_id TEST"}]}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },

  // {
  //   id: 'salesforce_v1_scenario_4',
  //   name: 'salesforce',
  //   description: 'salesforce',
  //   successCriteria: '',
  //   scenario: 'Business',
  //   feature: 'dataDelivery',
  //   module: 'destination',
  //   version: 'v1',
  //   input: {
  //     request: {
  //       body: generateProxyV1Payload(
  //         {
  //           ...commonRequestParameters,
  //           endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/4',
  //         },
  //         reqMetadataArray,
  //       ),
  //       method: 'POST',
  //     },
  //   },
  //   output: {
  //     response: {
  //       status: 200,
  //       body: {},
  //     },
  //   },
  // },

  // {
  //   id: 'salesforce_v1_scenario_4',
  //   name: 'salesforce',
  //   description: 'salesforce',
  //   successCriteria: '',
  //   scenario: 'Business',
  //   feature: 'dataDelivery',
  //   module: 'destination',
  //   version: 'v1',
  //   input: {
  //     request: {
  //       body: generateProxyV1Payload(
  //         {
  //           ...commonRequestParameters,
  //           endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/4',
  //         },
  //         reqMetadataArray,
  //       ),
  //       method: 'POST',
  //     },
  //   },
  //   output: {
  //     response: {
  //       status: 200,
  //       body: {},
  //     },
  //   },
  // },

  // {
  //   id: 'salesforce_v1_scenario_3',
  //   name: 'salesforce',
  //   description: 'salesforce',
  //   successCriteria: '',
  //   scenario: 'Business',
  //   feature: 'dataDelivery',
  //   module: 'destination',
  //   version: 'v1',
  //   input: {
  //     request: {
  //       body: generateProxyV1Payload(
  //         {
  //           ...commonRequestParameters,
  //           endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/2',
  //         },
  //         reqMetadataArray,
  //       ),
  //       method: 'POST',
  //     },
  //   },
  //   output: {
  //     response: {
  //       status: 200,
  //       body: {
  //         output: {
  //           status: 500,
  //           message:
  //             'Salesforce Request Failed - due to "Session expired or invalid", (Retryable) during Salesforce Response Handling',
  //           response: [
  //             {
  //               error:
  //                 '[{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}]',
  //               metadata: proxyMetdata,
  //               statusCode: 500,
  //             },
  //           ],
  //           statTags: {
  //             destType: 'SALESFORCE',
  //             errorCategory: 'network',
  //             destinationId: 'dummyDestinationId',
  //             workspaceId: 'dummyWorkspaceId',
  //             errorType: 'retryable',
  //             feature: 'dataDelivery',
  //             implementation: 'native',
  //             module: 'destination',
  //           },
  //         },
  //       },
  //     },
  //   },
  // },

  // {
  //   id: 'salesforce_v1_scenario_3',
  //   name: 'salesforce',
  //   description: 'salesforce',
  //   successCriteria: '',
  //   scenario: 'Business',
  //   feature: 'dataDelivery',
  //   module: 'destination',
  //   version: 'v1',
  //   input: {
  //     request: {
  //       body: generateProxyV1Payload(
  //         {
  //           ...commonRequestParameters,
  //           endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/2',
  //         },
  //         reqMetadataArray,
  //       ),
  //       method: 'POST',
  //     },
  //   },
  //   output: {
  //     response: {
  //       status: 200,
  //       body: {
  //         output: {
  //           status: 500,
  //           message:
  //             'Salesforce Request Failed - due to "Session expired or invalid", (Retryable) during Salesforce Response Handling',
  //           response: [
  //             {
  //               error:
  //                 '[{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}]',
  //               metadata: proxyMetdata,
  //               statusCode: 500,
  //             },
  //           ],
  //           statTags: {
  //             destType: 'SALESFORCE',
  //             errorCategory: 'network',
  //             destinationId: 'dummyDestinationId',
  //             workspaceId: 'dummyWorkspaceId',
  //             errorType: 'retryable',
  //             feature: 'dataDelivery',
  //             implementation: 'native',
  //             module: 'destination',
  //           },
  //         },
  //       },
  //     },
  //   },
  // },

  // {
  //   id: 'salesforce_v1_scenario_3',
  //   name: 'salesforce',
  //   description: 'salesforce',
  //   successCriteria: '',
  //   scenario: 'Business',
  //   feature: 'dataDelivery',
  //   module: 'destination',
  //   version: 'v1',
  //   input: {
  //     request: {
  //       body: generateProxyV1Payload(
  //         {
  //           ...commonRequestParameters,
  //           endpoint: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/2',
  //         },
  //         reqMetadataArray,
  //       ),
  //       method: 'POST',
  //     },
  //   },
  //   output: {
  //     response: {
  //       status: 200,
  //       body: {
  //         output: {
  //           status: 500,
  //           message:
  //             'Salesforce Request Failed - due to "Session expired or invalid", (Retryable) during Salesforce Response Handling',
  //           response: [
  //             {
  //               error:
  //                 '[{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}]',
  //               metadata: proxyMetdata,
  //               statusCode: 500,
  //             },
  //           ],
  //           statTags: {
  //             destType: 'SALESFORCE',
  //             errorCategory: 'network',
  //             destinationId: 'dummyDestinationId',
  //             workspaceId: 'dummyWorkspaceId',
  //             errorType: 'retryable',
  //             feature: 'dataDelivery',
  //             implementation: 'native',
  //             module: 'destination',
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
];
