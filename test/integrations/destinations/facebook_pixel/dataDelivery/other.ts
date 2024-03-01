import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';

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
          FORM: {
            data: [
              '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
            ],
          },
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
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
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
