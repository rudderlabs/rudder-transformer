import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { getEndPoint } from '../../../../../src/v0/destinations/fb_custom_audience/config';

export const otherScenariosV1 = [
  {
    id: 'fbca_v1_other_scenario_1',
    name: 'fb_custom_audience',
    description: 'user update request is throttled due to too many calls to the ad account',
    successCriteria:
      'Should return 429 with message there have been too many calls to this ad-account',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: getEndPoint('aud1'),
          headers: {
            'test-dest-response-key': 'tooManyCallsError',
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
        status: 429,
        body: {
          output: {
            message: 'There have been too many calls to this ad-account.',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 429,
            response: [
              {
                error: {
                  error: {
                    code: 80003,
                    message: 'There have been too many calls to this ad-account.',
                    type: 'GraphMethodException',
                  },
                  status: 429,
                },
                statusCode: 429,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
];
