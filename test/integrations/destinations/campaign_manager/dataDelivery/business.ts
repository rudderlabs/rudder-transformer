import { ProxyMetdata } from '../../../../../src/types';
import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV0Payload, generateProxyV1Payload } from '../../../testUtils';
import { authHeader1 } from '../../am/maskedSecrets';

// Boilerplate data for the test cases
// ======================================

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const encryptionInfo = {
  kind: 'dfareporting#encryptionInfo',
  encryptionSource: 'AD_SERVING',
  encryptionEntityId: '3564523',
  encryptionEntityType: 'DCM_ACCOUNT',
};

const testConversion1 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 7,
  gclid: '123',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const testConversion2 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 8,
  gclid: '321',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: {
    kind: 'dfareporting#conversionsBatchInsertRequest',
    encryptionInfo,
    conversions: [testConversion1, testConversion2],
  },
};

const proxyMetdata1: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};

const proxyMetdata2: ProxyMetdata = {
  jobId: 2,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};

const metadataArray = [proxyMetdata1, proxyMetdata2];

// Test scenarios for the test cases
// ===================================

export const testScenariosForV0API = [
  {
    id: 'cm360_v0_scenario_1',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Test for a valid request with a successful 200 response from the destination',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://dfareporting.googleapis.com/test_url_for_valid_request',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[CAMPAIGN_MANAGER Response Handler] - Request Processed Successfully',
            destinationResponse: {
              response: {
                hasFailures: false,
                status: [
                  {
                    conversion: testConversion1,
                    kind: 'dfareporting#conversionStatus',
                  },
                  {
                    conversion: testConversion2,
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
    id: 'cm360_v0_scenario_2',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Test for a valid request - where the destination responds with 200 with error for conversion 2',
    successCriteria: 'Should return 400 with error and with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://dfareporting.googleapis.com/test_url_for_invalid_request_conversion_2',
        }),
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
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: testConversion1,
                    kind: 'dfareporting#conversionStatus',
                  },
                  {
                    conversion: testConversion2,
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
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },
  {
    id: 'cm360_v0_scenario_3',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Test for a valid request - where the destination responds with 200 with error for both conversions',
    successCriteria: 'Should return 400 with error and with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint:
            'https://dfareporting.googleapis.com/test_url_for_invalid_request_both_conversions',
        }),
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
            destinationResponse: {
              response: {
                hasFailures: true,
                status: [
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    errors: [
                      {
                        code: 'INVALID_ARGUMENT',
                        message: 'Gclid is not valid.',
                        kind: 'dfareporting#conversionError',
                      },
                    ],
                    kind: 'dfareporting#conversionStatus',
                  },
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 8,
                      gclid: '321',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
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
            statTags: {
              errorCategory: 'network',
              errorType: 'aborted',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'dataDelivery',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
          },
        },
      },
    },
  },
];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'cm360_v1_scenario_1',
    name: 'campaign_manager',
    description:
      '[Proxy v1 API] :: Test for a valid request - where the destination responds with 200 without any error',
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
            endpoint: 'https://dfareporting.googleapis.com/test_url_for_valid_request',
          },
          metadataArray,
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
                hasFailures: false,
                status: [
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    kind: 'dfareporting#conversionStatus',
                  },
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 8,
                      gclid: '321',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    kind: 'dfareporting#conversionStatus',
                  },
                ],
                kind: 'dfareporting#conversionsBatchInsertResponse',
              },
              status: 200,
            },
            response: [
              {
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: false,
                },
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: false,
                },
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_scenario_2',
    name: 'campaign_manager',
    description:
      '[Proxy v1 API] :: Test for a valid request - where the destination responds with 200 with error for conversion 2',
    successCriteria: 'Should return 200 with partial failures within the response payload',
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
              'https://dfareporting.googleapis.com/test_url_for_invalid_request_conversion_2',
          },
          metadataArray,
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
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    kind: 'dfareporting#conversionStatus',
                  },
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 8,
                      gclid: '321',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
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
            response: [
              {
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: false,
                },
                error: 'success',
              },
              {
                statusCode: 400,
                metadata: {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: false,
                },
                error: 'Floodlight config id: 213123123 was not found., ',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'cm360_v1_scenario_3',
    name: 'campaign_manager',
    description:
      '[Proxy v0 API] :: Test for a valid request - where the destination responds with 200 with error for both conversions',
    successCriteria: 'Should return 200 with all failures within the response payload',
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
              'https://dfareporting.googleapis.com/test_url_for_invalid_request_both_conversions',
          },
          metadataArray,
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
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 7,
                      gclid: '123',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
                    errors: [
                      {
                        code: 'INVALID_ARGUMENT',
                        message: 'Gclid is not valid.',
                        kind: 'dfareporting#conversionError',
                      },
                    ],
                    kind: 'dfareporting#conversionStatus',
                  },
                  {
                    conversion: {
                      timestampMicros: '1668624722000000',
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      floodlightActivityId: '456543345245',
                      value: 8,
                      gclid: '321',
                      limitAdTracking: true,
                      childDirectedTreatment: true,
                    },
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
            response: [
              {
                statusCode: 400,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: false,
                },
                error: 'Gclid is not valid., ',
              },
              {
                statusCode: 400,
                metadata: {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'dummyUserId',
                  sourceId: 'dummySourceId',
                  destinationId: 'dummyDestinationId',
                  workspaceId: 'dummyWorkspaceId',
                  secret: {},
                  dontBatch: false,
                },
                error: 'Floodlight config id: 213123123 was not found., ',
              },
            ],
          },
        },
      },
    },
  },
];
