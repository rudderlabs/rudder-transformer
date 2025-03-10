import { ProxyV1TestData } from '../../../testTypes';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';
import { authHeader1 } from '../maskedSecrets';

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  'User-Agent': 'RudderLabs',
};

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: {
    users: [
      {
        schema: ['EMAIL_SHA256'],
        data: [['938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c']],
      },
    ],
  },
};

export const businessV0TestScenarios = [
  {
    id: 'snapchat_custom_audience_v0_oauth_scenario_1',
    name: 'snapchat_custom_audience',
    description: '[Proxy v0 API] :: successfull call',
    successCriteria: 'Proper response from destination is received',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://adsapi.snapchat.com/v1/segments/123/users',
          params: {
            destination: 'snapchat_custom_audience',
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
            destinationResponse: {
              response: {
                request_status: 'SUCCESS',
                request_id: '12345',
                users: [
                  {
                    sub_request_status: 'SUCCESS',
                    user: {
                      number_uploaded_users: 1,
                    },
                  },
                ],
              },
              status: 200,
            },
          },
        },
      },
    },
  },
];

export const businessV1TestScenarios: ProxyV1TestData[] = [
  {
    id: 'snapchat_custom_audience_v1_oauth_scenario_1',
    name: 'snapchat_custom_audience',
    description: '[Proxy v1 API] :: successfull oauth',
    successCriteria: 'Proper response from destination is received',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint: 'https://adsapi.snapchat.com/v1/segments/123/users',
          params: {
            destination: 'snapchat_custom_audience',
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
                error: `{\"request_status\":\"SUCCESS\",\"request_id\":\"12345\",\"users\":[{\"sub_request_status\":\"SUCCESS\",\"user\":{\"number_uploaded_users\":1}}]}`,
                statusCode: 200,
                metadata: generateMetadata(1),
              },
            ],
          },
        },
      },
    },
  },
];
