import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { VERSION } from '../../../../../src/v0/destinations/fb/config';

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
          FORM: {
            extinfo: '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
            custom_events:
              '[{"_logTime":1567333011693,"_eventName":"Viewed Screen","fb_description":"Main.1233"}]',
            'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
            advertiser_tracking_enabled: '0',
            application_tracking_enabled: '0',
            event: 'CUSTOM_APP_EVENTS',
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
              destType: 'FB',
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
