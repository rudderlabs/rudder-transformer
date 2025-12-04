import { testFormData, statTags } from './business';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';

export const oauthScenariosV1: ProxyV1TestData[] = [
  {
    id: 'facebook_pixel_v1_oauth_scenario_1',
    name: 'facebook_pixel',
    description: 'app event fails due to missing permissions',
    successCriteria: 'Should return 400 with missing permissions error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234571/events?access_token=valid_access_token`,
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
            status: 400,
            message:
              'Some error in permission. Facebook responded with error code: 3 and sub-code: 10',
            statTags,
            response: [
              {
                error:
                  'Some error in permission. Facebook responded with error code: 3 and sub-code: 10',
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
