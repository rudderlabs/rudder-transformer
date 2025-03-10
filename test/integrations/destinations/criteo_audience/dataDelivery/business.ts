import { ProxyV1TestData } from '../../../testTypes';
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';
import { defaultAccessTokenAuthHeader } from '../../../common/secrets';

export const headers = {
  Authorization: defaultAccessTokenAuthHeader,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
export const params = {
  destination: 'criteo_audience',
};
const method = 'PATCH';

export const V1BusinessTestScenarion: ProxyV1TestData[] = [
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
          [generateMetadata(1)],
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
                metadata: generateMetadata(1),
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
    scenario: 'business',
    description: '[Business]:: Test for email type audience to add users with success response',
    successCriteria: 'Should return a 200 status code with a success message',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        method: 'POST',
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
          [generateMetadata(2)],
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
                metadata: generateMetadata(2),
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
    scenario: 'business',
    description: '[Business]:: Test for mobile type audience to remove users with success response',
    successCriteria: 'Should return a 200 status code with a success message',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        method: 'POST',
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
          [generateMetadata(3)],
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
                metadata: generateMetadata(3),
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
    scenario: 'business',
    description: '[Business]:: Test for mobile type audience where audienceId is invalid',
    successCriteria:
      'Should return a 400 status code with an error audience-invalid. It should also have the invalid audienceId in the error message as follows: "Audience <provided audienceId> is invalid"',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        method: 'POST',
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
          [generateMetadata(4)],
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
                error: JSON.stringify({
                  errors: [
                    {
                      traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
                      type: 'authorization',
                      code: 'audience-invalid',
                    },
                  ],
                }),
                metadata: generateMetadata(4),
                statusCode: 400,
              },
            ],
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
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
