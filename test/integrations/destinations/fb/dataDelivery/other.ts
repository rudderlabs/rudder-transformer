import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { VERSION } from '../../../../../src/v0/destinations/fb/config';
import { testData2 as testData, statTags } from './business';

export const otherScenariosV1: ProxyV1TestData[] = [
  {
    id: 'fb_v1_other_scenario_1',
    name: 'fb',
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
            destination: 'fb',
          },
          FORM: testData,
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
            message: 'User request limit reached',
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
            response: [
              {
                error: 'User request limit reached',
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
