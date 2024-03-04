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
  {
    id: 'facebook_pixel_v1_other_scenario_2',
    name: 'facebook_pixel',
    description: 'app event fails due to Unhandled random error',
    successCriteria: 'Should return 500 with Unhandled random error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234572/events?access_token=valid_access_token_unhandled_response`,
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
            status: 500,
            message: 'Unhandled random error',
            statTags: {
              ...statTags,
              errorType: 'retryable',
              meta: 'unhandledStatusCode',
            },
            response: [
              {
                error: 'Unhandled random error',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
];
