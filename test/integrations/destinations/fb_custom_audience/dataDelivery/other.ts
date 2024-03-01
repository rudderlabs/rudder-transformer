import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { getEndPoint } from '../../../../../src/v0/destinations/fb_custom_audience/config';
import { statTags, testParams2 as testParams } from './business';

export const otherScenariosV1: ProxyV1TestData[] = [
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
          params: testParams,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'There have been too many calls to this ad-account.',
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
            status: 429,
            response: [
              {
                error: 'There have been too many calls to this ad-account.',
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
