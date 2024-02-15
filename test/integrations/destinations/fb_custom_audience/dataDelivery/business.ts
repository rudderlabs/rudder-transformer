import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { getEndPoint } from '../../../../../src/v0/destinations/fb_custom_audience/config';

export const testScenariosForV1API = [
  {
    id: 'fbca_v1_scenario_1',
    name: 'fb_custom_audience',
    description: 'successfully adding users to audience',
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
          params: {
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
          },
        }),
        method: 'DELETE',
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
                error: {
                  audience_id: 'aud1',
                  invalid_entry_samples: {},
                  num_invalid_entries: 0,
                  num_received: 4,
                  session_id: '123',
                },
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
          params: {
            access_token: 'BCD',
            payload: {
              is_raw: true,
              data_source: {
                sub_type: 'ANYTHING',
              },
              schema: [
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
                ['2', '13', '2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN'],
              ],
            },
          },
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
            message:
              'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            response: [
              {
                error: {
                  error: {
                    code: 294,
                    message:
                      'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
                    type: 'GraphMethodException',
                  },
                  status: 400,
                },
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
    description: 'user addition failed due to unavailable audience error',
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
          params: {
            access_token: 'ABC',
            payload: {
              is_raw: true,
              data_source: {
                sub_type: 'ANYTHING',
              },
              schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
              data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
            },
          },
        }),
        method: 'DELETE',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            response: [
              {
                error: {
                  error: {
                    code: 1487301,
                    message:
                      'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
                    type: 'GraphMethodException',
                  },
                  status: 400,
                },
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
