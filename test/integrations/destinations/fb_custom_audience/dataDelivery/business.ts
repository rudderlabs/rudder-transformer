import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { getEndPoint } from '../../../../../src/v0/destinations/fb_custom_audience/config';

export const statTags = {
  destType: 'FB_CUSTOM_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

const testParams1 = {
  access_token: 'ABC',
  payload: {
    is_raw: true,
    data_source: {
      sub_type: 'ANYTHING',
    },
    schema: [
      'EMAIL',
      'DOBM',
      'DOBD',
      'DOBY',
      'PHONE',
      'GEN',
      'FI',
      'MADID',
      'ZIP',
      'ST',
      'COUNTRY',
    ],
    data: [
      [
        'shrouti@abc.com',
        '2',
        '13',
        '2013',
        '@09432457768',
        'f',
        'Ms.',
        'ABC',
        'ZIP ',
        '123abc ',
        'IN',
      ],
    ],
  },
};

export const testParams2 = {
  access_token: 'ABC',
  payload: {
    is_raw: true,
    data_source: {
      sub_type: 'ANYTHING',
    },
    schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
    data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
  },
};

const testParams3 = {
  access_token: 'BCD',
  payload: {
    is_raw: true,
    data_source: {
      sub_type: 'ANYTHING',
    },
    schema: ['DOBM', 'DOBD', 'DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
    data: [['2', '13', '2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
  },
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'fbca_v1_scenario_1',
    name: 'fb_custom_audience',
    description: 'successfully delete users from audience',
    successCriteria: 'Should return 200 with no error with destination response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'successResponse',
          },
          params: testParams1,
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
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"audience_id":"aud1","session_id":"123","num_received":4,"num_invalid_entries":0,"invalid_entry_samples":{}}',
                statusCode: 200,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_2',
    name: 'fb_custom_audience',
    description: 'user addition failed due to missing permission',
    successCriteria: 'Fail with status code 400 due to missing permissions',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'POST',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'permissionMissingError',
          },
          params: testParams3,
        }),
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
              'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
            statTags,
            response: [
              {
                error:
                  'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_3',
    name: 'fb_custom_audience',
    description: 'user deletion failed due to unavailable audience error',
    successCriteria: 'Fail with status code 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'audienceUnavailableError',
          },
          params: testParams2,
        }),
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
              'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
            statTags,
            response: [
              {
                error:
                  'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_4',
    name: 'fb_custom_audience',
    description: 'user deletion failed because the custom audience has been deleted',
    successCriteria: 'Fail with status code 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'audienceDeletedError',
          },
          params: testParams2,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'Custom Audience Has Been Deleted',
            statTags,
            response: [
              {
                error: 'Custom Audience Has Been Deleted',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_5',
    name: 'fb_custom_audience',
    description: 'Failed to update the custom audience for unknown reason',
    successCriteria: 'Fail with status code 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'failedToUpdateAudienceError',
          },
          params: testParams2,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'Failed to update the custom audience',
            statTags,
            response: [
              {
                error: 'Failed to update the custom audience',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_6',
    name: 'fb_custom_audience',
    description:
      'Failed to update the custom audience as excessive number of parameters were passed in the request',
    successCriteria: 'Fail with status code 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'parameterExceededError',
          },
          params: testParams2,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'The number of parameters exceeded the maximum for this operation',
            statTags,
            response: [
              {
                error: 'The number of parameters exceeded the maximum for this operation',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_7',
    name: 'fb_custom_audience',
    description: 'user having permission issue while updating audience',
    successCriteria: 'Fail with status code 403',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'code200PermissionError',
          },
          params: testParams2,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 403,
            message: '(#200) The current user can not update audience 23861283180290489',
            statTags,
            response: [
              {
                error: '(#200) The current user can not update audience 23861283180290489',
                statusCode: 403,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_8',
    name: 'fb_custom_audience',
    description: 'user deletion failed due expired access token error',
    successCriteria: 'Fail with status code 400',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'accessTokenInvalidError',
          },
          params: testParams2,
        }),
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
              'Error validating access token: Session has expired on Tuesday, 01-Aug-23 10:12:14 PDT. The current time is Sunday, 28-Jan-24 16:01:17 PST.',
            statTags: {
              ...statTags,
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              meta: 'accessTokenExpired',
            },
            response: [
              {
                error:
                  'Error validating access token: Session has expired on Tuesday, 01-Aug-23 10:12:14 PDT. The current time is Sunday, 28-Jan-24 16:01:17 PST.',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'fbca_v1_scenario_9',
    name: 'fb_custom_audience',
    description: 'user deletion failed differently created custom audience',
    successCriteria: 'Fail with status code 400 and sending the actual error message.',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud-value-based'),
          headers: {
            'test-dest-response-key': 'validAccessToken',
          },
          params: testParams2,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: '(#100) Value-Based Custom Audience requires LOOKALIKE_VALUE attribute.',
            statTags: {
              ...statTags,
              errorCategory: 'network',
              errorType: 'aborted',
            },
            response: [
              {
                error: '(#100) Value-Based Custom Audience requires LOOKALIKE_VALUE attribute.',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
];
