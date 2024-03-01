import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';
import { testFormData, statTags } from './business';

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'facebook_pixel_v1_other_scenario_1',
    name: 'facebook_pixel',
    description: 'user update request is throttled due to too many calls',
    successCriteria: 'Should return 429 with message there have been too many calls',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=throttled_valid_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
          FORM: testFormData,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 429,
            message: 'API User Too Many Calls',
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
            response: [
              {
                error: 'API User Too Many Calls',
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
