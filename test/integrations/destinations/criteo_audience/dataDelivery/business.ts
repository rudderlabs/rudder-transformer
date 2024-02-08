import { generateProxyV1Payload } from '../../../testUtils';
export const headers = {
  Authorization: 'Bearer success_access_token',
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const params = {
  destination: 'criteo_audience',
};
const method = 'PATCH';

const output = {
  response: {
    status: 200,
    body: {
      output: {
        status: 200,
        message: 'Request Processed Successfully',
        response: [
          {
            error: '""',
            metadata: {
              attemptNum: 1,
              destinationId: 'dummyDestinationId',
              dontBatch: false,
              secret: {},
              sourceId: 'dummySourceId',
              userId: 'dummyUserId',
              workspaceId: 'dummyWorkspaceId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
};

export const V1BusinessTestScenarion = [
  {
    id: 'criteo_audience_business_0',
    name: 'criteo_audience',
    description: '[Business]:: Test for gum type audience with gumCallerId with success response',
    successCriteria: 'Should return a 200 status code with a success message',
    scenario: 'business',
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
                  operation: 'remove',
                  identifierType: 'gum',
                  identifiers: ['sample_gum3'],
                  internalIdentifiers: false,
                  gumCallerId: '329739',
                },
              },
            },
            params,
            headers,
            method,
            endpoint: 'https://api.criteo.com/2022-10/audiences/34894/contactlist',
          },
          [
            {
              jobId: 1,
              attemptNum: 1,
              userId: 'dummyUserId',
              sourceId: 'dummySourceId',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
              secret: {},
              dontBatch: false,
            },
          ],
        ),
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
                error: '""',
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
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'criteo_audience_business_1',
    name: 'criteo_audience',
    description: '[Business]:: Test for email type audience to add users with success response',
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
                  identifierType: 'email',
                  internalIdentifiers: false,
                  identifiers: [
                    'alex@email.com',
                    'amy@email.com',
                    'van@email.com',
                    'alex@email.com',
                    'amy@email.com',
                    'van@email.com',
                  ],
                },
              },
            },
            params,
            headers,
            method,
            endpoint: 'https://api.criteo.com/2022-10/audiences/34894/contactlist',
          },
          [
            {
              jobId: 2,
              attemptNum: 1,
              userId: 'dummyUserId',
              sourceId: 'dummySourceId',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
              secret: {},
              dontBatch: false,
            },
          ],
        ),
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
                error: '""',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'criteo_audience_business_2',
    name: 'criteo_audience',
    description: '[Business]:: Test for mobile type audience to remove users with success response',
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
                  operation: 'remove',
                  identifierType: 'madid',
                  internalIdentifiers: false,
                  identifiers: [
                    'sample_madid',
                    'sample_madid_1',
                    'sample_madid_2',
                    'sample_madid_10',
                    'sample_madid_13',
                    'sample_madid_11',
                    'sample_madid_12',
                  ],
                },
              },
            },
            params,
            headers,
            method,
            endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
          },
          [
            {
              jobId: 3,
              attemptNum: 1,
              userId: 'dummyUserId',
              sourceId: 'dummySourceId',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
              secret: {},
              dontBatch: false,
            },
          ],
        ),
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
                error: '""',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 3,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 200,
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'criteo_audience_business_3',
    name: 'criteo_audience',
    description: '[Business]:: Test for mobile type audience where audienceId is invalid',
    successCriteria: 'Should return a 400 status code with an error message',
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
            method,
            endpoint: 'https://api.criteo.com/2022-10/audiences/34896/contactlist',
          },
          [
            {
              jobId: 4,
              attemptNum: 1,
              userId: 'dummyUserId',
              sourceId: 'dummySourceId',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
              secret: {},
              dontBatch: false,
            },
          ],
        ),
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            message: 'AudienceId is Invalid. Please Provide Valid AudienceId',
            response: [
              {
                error:
                  '{"errors":[{"traceIdentifier":"80a1a0ba3981b04da847d05700752c77","type":"authorization","code":"audience-invalid"}]}',
                metadata: {
                  attemptNum: 1,
                  destinationId: 'dummyDestinationId',
                  dontBatch: false,
                  jobId: 4,
                  secret: {},
                  sourceId: 'dummySourceId',
                  userId: 'dummyUserId',
                  workspaceId: 'dummyWorkspaceId',
                },
                statusCode: 400,
              },
            ],
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'dummyDestinationId',
              workspaceId: 'dummyWorkspaceId',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              meta: 'instrumentation',
              module: 'destination',
            },
          },
        },
      },
    },
  },
];
