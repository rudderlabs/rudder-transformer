import { generateProxyV1Payload } from '../../../testUtils';
import { commonHeaders, commonParams, expectedStatTags, validRequestPayload1 } from './business';

export const oauthError = [
  {
    id: 'garl_oauth_scenario',
    name: 'google_adwords_remarketing_lists',
    description:
      '[Proxy v1 API] :: Oauth  where valid credentials are missing as mock response from destination',
    successCriteria: 'The proxy should return 401 with authErrorCategory as REFRESH_TOKEN',
    scenario: 'Oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          headers: commonHeaders,
          params: commonParams,
          JSON: validRequestPayload1,
          endpoint: 'https://googleads.googleapis.com/v16/customers/customerid/offlineUserDataJobs',
          accessToken: 'dummy-access',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            authErrorCategory: 'REFRESH_TOKEN',
            message:
              'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during ga_audience response transformation',
            response: [
              {
                error:
                  'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during ga_audience response transformation',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: 'dummy-access',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                statusCode: 401,
              },
            ],
            statTags: {
              destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
              destinationId: 'default-destinationId',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            status: 401,
          },
        },
      },
    },
  },
];
