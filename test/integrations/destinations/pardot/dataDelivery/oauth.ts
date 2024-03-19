import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { commonRequestParameters, retryStatTags } from './constant';

export const v1OauthScenarios: ProxyV1TestData[] = [
  {
    id: 'pardot_v1_oauth_scenario_1',
    name: 'pardot',
    description:
      '[Proxy v1 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria:
      'Since the error from the destination is 401 - the proxy should return 500 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint:
            'https://pi.pardot.com/api/prospect/version/4/do/upsert/email/rolex_waltair@mywebsite.io',
          params: {
            destination: 'pardot',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            response: [
              {
                error:
                  'access_token is invalid, unknown, or malformed: Inactive token during Pardot response transformation',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: retryStatTags,
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'access_token is invalid, unknown, or malformed: Inactive token during Pardot response transformation',
            status: 500,
          },
        },
      },
    },
  },
];
