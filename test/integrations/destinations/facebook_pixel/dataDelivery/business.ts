import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';

const testData = [
  '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
];
const statTags = {
  destType: 'FACEBOOK_PIXEL',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};
export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'facebook_pixel_v1_scenario_1',
    name: 'facebook_pixel',
    description: 'app event fails due to access token error',
    successCriteria: 'Should return 400 with invalid access token error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_access_token`,
          FORM: {
            data: testData,
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
            status: 400,
            message: 'Invalid OAuth 2.0 access token',
            statTags: {
              ...statTags,
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              meta: 'accessTokenExpired',
            },
            response: [
              {
                error: 'Invalid OAuth 2.0 access token',
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
    id: 'facebook_pixel_v1_scenario_2',
    name: 'facebook_pixel',
    description: 'app event sent successfully',
    successCriteria: 'Should return 200',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=my_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
          FORM: {
            data: testData,
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
            status: 200,
            message: 'Request Processed Successfully',
            response: [
              {
                error: '{"events_received":1,"fbtrace_id":"facebook_trace_id"}',
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
    id: 'facebook_pixel_v1_scenario_3',
    name: 'facebook_pixel',
    description: 'app event fails due to invalid timestamp',
    successCriteria: 'Should return 400 with invalid timestamp error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_timestamp_correct_access_token`,
          FORM: {
            data: testData,
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
            status: 400,
            message: 'Event Timestamp Too Old',
            statTags,
            response: [
              {
                error: 'Event Timestamp Too Old',
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
    id: 'facebook_pixel_v1_scenario_4',
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
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_account_id_valid_access_token`,
          FORM: {
            data: testData,
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
            status: 400,
            message:
              "Object with ID 'PIXEL_ID' / 'DATASET_ID' / 'AUDIENCE_ID' does not exist, cannot be loaded due to missing permissions, or does not support this operation",
            statTags,
            response: [
              {
                error:
                  "Object with ID 'PIXEL_ID' / 'DATASET_ID' / 'AUDIENCE_ID' does not exist, cannot be loaded due to missing permissions, or does not support this operation",
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
    id: 'facebook_pixel_v1_scenario_5',
    name: 'facebook_pixel',
    description: 'app event fails due to invalid parameter',
    successCriteria: 'Should return 400 with Invalid parameter error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=not_found_access_token`,
          FORM: {
            data: [
              '{"user_data":{"external_id":"d58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
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
            status: 400,
            message: 'Invalid Parameter',
            statTags,
            response: [
              {
                error: 'Invalid Parameter',
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
    id: 'facebook_pixel_v1_scenario_6',
    name: 'facebook_pixel',
    description: 'app event fails due to invalid parameter',
    successCriteria: 'Should return 400 with Invalid parameter error',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234570/events?access_token=valid_access_token`,
          FORM: {
            data: testData,
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
            status: 400,
            message: 'Invalid Parameter',
            statTags,
            response: [
              {
                error: 'Invalid Parameter',
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
    id: 'facebook_pixel_v1_scenario_7',
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
          FORM: {
            data: testData,
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
            status: 400,
            message: 'Capability or permissions issue.',
            statTags,
            response: [
              {
                error: 'Capability or permissions issue.',
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
    id: 'facebook_pixel_v1_scenario_8',
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
          FORM: {
            data: testData,
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
