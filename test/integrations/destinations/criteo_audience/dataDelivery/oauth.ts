import { params, headers } from './business';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';

const commonStatTags = {
  destType: 'CRITEO_AUDIENCE',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const v1OauthScenarios = [
  {
    id: 'criteo_audience_oauth_0',
    name: 'criteo_audience',
    description: '[OAUTH]:: Test expired access token',
    successCriteria: 'Should return a 401 status code with authErrorCategory as REFRESH_TOKEN',
    scenario: 'oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              data: {
                type: 'ContactlistAmendment',
                attributes: {
                  operation: 'add',
                  identifierType: 'madid',
                  identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                  internalIdentifiers: false,
                },
              },
            },
            params,
            headers,
            method: 'PATCH',
            endpoint:
              'https://api.criteo.com/2025-04/audiences/3485/contactlist/expiredAccessToken',
          },
          [generateMetadata(1)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            authErrorCategory: 'REFRESH_TOKEN',
            response: [
              {
                error:
                  'The authorization token has expired during criteo_audience response transformation',
                metadata: generateMetadata(1),
                statusCode: 401,
              },
            ],
            message:
              'The authorization token has expired during criteo_audience response transformation',
            statTags: commonStatTags,
          },
        },
      },
    },
  },
  {
    id: 'criteo_audience_oauth_1',
    name: 'criteo_audience',
    description: '[OAUTH]:: Test invalid access token',
    successCriteria:
      'We should get a 401 status code with errorCode authorization-token-invalid. As we need to refresh the token for these conditions, authErrorCategory should be REFRESH_TOKEN',
    scenario: 'oauth',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              data: {
                type: 'ContactlistAmendment',
                attributes: {
                  operation: 'add',
                  identifierType: 'madid',
                  identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                  internalIdentifiers: false,
                },
              },
            },
            params,
            headers,
            method: 'PATCH',
            endpoint:
              'https://api.criteo.com/2025-04/audiences/34895/contactlist/invalidAccessToken',
          },
          [generateMetadata(2)],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            status: 401,
            authErrorCategory: 'REFRESH_TOKEN',
            response: [
              {
                error:
                  'The authorization header is invalid during criteo_audience response transformation',
                metadata: generateMetadata(2),
                statusCode: 401,
              },
            ],
            statTags: commonStatTags,
            message:
              'The authorization header is invalid during criteo_audience response transformation',
          },
        },
      },
    },
  },
];
