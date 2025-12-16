import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
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
          endpoint: 'https://graph.facebook.com/v23.0/aud1/users',
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
            message:
              'There have been too many calls to this ad-account.. Facebook responded with error code: 80003',
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
            status: 429,
            response: [
              {
                error:
                  'There have been too many calls to this ad-account.. Facebook responded with error code: 80003',
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
    id: 'fbca_v1_other_scenario_2',
    name: 'fb_custom_audience',
    description: 'got invalid response format (not-json) from facebook',
    successCriteria: 'should throw retyable error',
    scenario: 'Framework',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          method: 'DELETE',
          endpoint: 'https://graph.facebook.com/v23.0/aud1/users',
          headers: {
            'test-dest-response-key': 'htmlResponse',
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
            status: 500,
            message: 'Invalid response format (HTML) during response transformation',
            statTags,
            response: [
              {
                error:
                  '"<!DOCTYPE html><html> <body> <h1>My First Heading</h1><p>My first paragraph.</p> </body></html>"',
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
