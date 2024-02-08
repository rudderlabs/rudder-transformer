import { params, headers } from './business';
import { generateProxyV1Payload } from '../../../testUtils';
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
            endpoint: 'https://api.criteo.com/2022-10/audiences/3485/contactlist',
          },
          [
            {
              attemptNum: 1,
              destinationId: 'dummyDestinationId',
              dontBatch: false,
              secret: {},
              sourceId: 'dummySourceId',
              userId: 'dummyUserId',
              workspaceId: 'dummyWorkspaceId',
              jobId: 1,
            },
          ],
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
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 401,
              },
            ],
            message:
              'The authorization token has expired during criteo_audience response transformation',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
  {
    id: 'criteo_audience_oauth_1',
    name: 'criteo_audience',
    description: '[OAUTH]:: Test invalid access token',
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
            endpoint: 'https://api.criteo.com/2022-10/audiences/34895/contactlist',
          },
          [
            {
              attemptNum: 1,
              destinationId: 'dummyDestinationId',
              dontBatch: false,
              secret: {},
              sourceId: 'dummySourceId',
              userId: 'dummyUserId',
              workspaceId: 'dummyWorkspaceId',
              jobId: 2,
            },
          ],
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
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                  jobId: 2,
                },
                statusCode: 401,
              },
            ],
            message:
              'The authorization header is invalid during criteo_audience response transformation',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
          },
        },
      },
    },
  },
];
