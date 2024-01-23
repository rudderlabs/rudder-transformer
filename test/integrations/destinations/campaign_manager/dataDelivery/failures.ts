import {
  generateMetadata,
  generatePayloadForDelivery,
  generateV1PayloadForDelivery,
} from '../../../testUtils';
import {
  headers,
  encryptionInfo,
  conversion1,
  getEndpointBatchInsert,
  conversion2,
  secret,
} from './data';

// v0 failure scenarios (need to add network and partial error), bad data from destination, bad request structure
export const generalFailureScnearioV0 = [
  {
    id: 'campaign_manager_failure_scenario_v0_1',
    name: 'campaign_manager',
    description:
      'Failure for the delivery request to deliver to the destination due to NOT_FOUND error',
    scenario: 'Business',
    successCriteria:
      'Response from destination should contain errors for the sent conversion, destination response mentioning NOT_FOUND error. The status code should be 400',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generatePayloadForDelivery(
          {
            endpoint: getEndpointBatchInsert('437690'),
            headers,
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              encryptionInfo,
              conversions: [conversion1],
            },
          },
          null as any,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation',
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
            },
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: conversion1,
                    errors: [
                      {
                        code: 'NOT_FOUND',
                        message: 'Floodlight config id: 213123123 was not found.',
                        kind: 'dfareporting#conversionError',
                      },
                    ],
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    id: 'campaign_manager_failure_scenario_v0_1',
    name: 'campaign_manager',
    description:
      'Failure for the delivery request to deliver to the destination due to INVALID_ARGUMENT error',
    scenario: 'Business',
    successCriteria:
      'Response from destination should contain errors for the sent conversion, destination response mentioning INVALID_ARGUMENT error. The status code should be 400',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generatePayloadForDelivery(
          {
            endpoint: getEndpointBatchInsert('437691'),
            headers,
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              conversions: [conversion1],
            },
          },
          null as any,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation',
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
            },
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: conversion1,
                    errors: [
                      {
                        code: 'INVALID_ARGUMENT',
                        message: 'Floodlight config id: 213123123 was not found.',
                        kind: 'dfareporting#conversionError',
                      },
                    ],
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
            },
          },
        },
      },
    },
  },
];

export const networkFailureScnearioV0 = [
    {
        id: 'campaign_manager_network_failure_scenario_v0_1',
        name: 'campaign_manager',
        description:
          'Failure for the delivery request to deliver to the destination due to NOT_FOUND error',
        scenario: 'Business',
        successCriteria:
          'Response from destination should contain errors for the sent conversion, destination response mentioning NOT_FOUND error. The status code should be 400',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
          request: {
            body: generatePayloadForDelivery(
              {
                endpoint: getEndpointBatchInsert('438600'),
                headers,
                JSON: {
                  kind: 'dfareporting#conversionsBatchInsertRequest',
                  encryptionInfo,
                  conversions: [conversion1],
                },
              },
              null as any,
            ),
            method: 'POST',
          },
        },
        output: {
          response: {
            status: 400,
            body: {
              output: {
                status: 400,
                message: 'Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation',
                statTags: {
                  errorCategory: 'network',
                  errorType: 'aborted',
                  destType: 'CAMPAIGN_MANAGER',
                  module: 'destination',
                  implementation: 'native',
                  feature: 'dataDelivery',
                  destinationId: 'Non-determininable',
                  workspaceId: 'Non-determininable',
                },
                destinationResponse: {
                  response: {
                    hasFailures: true,
                    status: [
                      {
                        conversion: conversion1,
                        errors: [
                          {
                            code: 'NOT_FOUND',
                            message: 'Floodlight config id: 213123123 was not found.',
                            kind: 'dfareporting#conversionError',
                          },
                        ],
                        kind: 'dfareporting#conversionStatus',
                      },
                    ],
                    kind: 'dfareporting#conversionsBatchInsertResponse',
                  },
                  status: 200,
                },
              },
            },
          },
        },
      }
]

export const oauthScenariosV0 = []

export const badRequestStructure = []


// v1 failure scenarios along with partial failure (need to add network error) bad data from destination, bad request structure,
export const partialFailureScnearioV1 = [
  {
    id: 'campaign_manager_failure_scenario_v1_1',
    name: 'campaign_manager',
    description:
      'Partial failure for the delivery request to deliver to the destination for v1 proxy',
    scenario: 'Business + Framework',
    successCriteria:
      'Response from destination should contain errors for the sent conversion, destination response mentioning INVALID_ARGUMENT error for 1 job and success for 1 job. The status code should be 200',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateV1PayloadForDelivery(
          {
            endpoint: getEndpointBatchInsert('437692'),
            headers,
            JSON: {
              kind: 'dfareporting#conversionsBatchInsertRequest',
              conversions: [conversion1, conversion2],
            },
          },
          [generateMetadata(2), generateMetadata(3)],
          null as any,
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
            message: '[CAMPAIGN_MANAGER Response V1 Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: conversion1,
                    kind: 'dfareporting#conversionStatus',
                    errors: [
                      {
                        code: 'INVALID_ARGUMENT',
                        kind: 'dfareporting#conversionError',
                        message: 'Floodlight config id: 213123123 was not found.',
                      },
                    ],
                  },
                  {
                    conversion: conversion2,
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
              rudderJobMetadata: [generateMetadata(2, secret), generateMetadata(3, secret)],
            },
            response: [
              {
                error: 'Floodlight config id: 213123123 was not found., ',
                statusCode: 400,
                metadata: generateMetadata(2, secret),
              },
              {
                error: 'success',
                metadata: generateMetadata(3, secret),
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
];

export const networkFailureScnearioV1 = []

export const oauthScenariosV1 = []
export const badRequestStructureV1 = []
