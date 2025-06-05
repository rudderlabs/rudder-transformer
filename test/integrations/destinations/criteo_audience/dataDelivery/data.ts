import { defaultAccessTokenAuthHeader } from '../../../common/secrets';
import { generateMetadata } from '../../../testUtils';
import { V1BusinessTestScenarion } from './business';
import { v1OauthScenarios } from './oauth';
import { v1OtherScenarios } from './other';

const v0testCases = [
  {
    name: 'criteo_audience',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.criteo.com/2025-04/audiences/34894/contactlist',
          headers: {
            Authorization: defaultAccessTokenAuthHeader,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'criteo_audience',
          },
          userId: '1234',
          metadata: generateMetadata(1),
          destinationConfig: {},
        },
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
              response: '',
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.criteo.com/2025-04/audiences/3485/contactlist/expiredAccessToken',
          headers: {
            Authorization: defaultAccessTokenAuthHeader,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'criteo_audience',
          },
          userId: '1234',
          metadata: generateMetadata(2),
          destinationConfig: {},
        },
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
            destinationResponse: {
              errors: [
                {
                  traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
                  type: 'authorization',
                  code: 'authorization-token-expired',
                  instance: '/2025-04/audiences/123/contactlist',
                  title: 'The authorization token has expired',
                },
              ],
            },
            message:
              'The authorization token has expired during criteo_audience response transformation',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
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
    name: 'criteo_audience',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.criteo.com/2025-04/audiences/34895/contactlist/invalidAccessToken',
          headers: {
            Authorization: defaultAccessTokenAuthHeader,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'criteo_audience',
          },
          userId: '1234',
          metadata: generateMetadata(3),
          destinationConfig: {},
        },
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
            destinationResponse: {
              errors: [
                {
                  traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
                  type: 'authorization',
                  code: 'authorization-token-invalid',
                  instance: '/2025-04/audiences/123/contactlist',
                  title: 'The authorization header is invalid',
                },
              ],
            },
            message:
              'The authorization header is invalid during criteo_audience response transformation',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
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
    name: 'criteo_audience',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.criteo.com/2025-04/audiences/34896/contactlist',
          headers: {
            Authorization: defaultAccessTokenAuthHeader,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'criteo_audience',
          },
          userId: '1234',
          metadata: generateMetadata(4),
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            message: 'AudienceId is Invalid. Please Provide Valid AudienceId',
            destinationResponse: {
              response: {
                errors: [
                  {
                    code: 'audience-invalid',
                    traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
                    type: 'authorization',
                  },
                ],
              },
              status: 404,
            },
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
            status: 400,
          },
        },
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.criteo.com/2025-04/audiences/34897/contactlist',
          headers: {
            Authorization: defaultAccessTokenAuthHeader,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'criteo_audience',
          },
          userId: '1234',
          metadata: generateMetadata(5),
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            destinationResponse: {
              response: {
                errors: [
                  {
                    code: 'audience-invalid',
                    traceIdentifier: '80a1a0ba3981b04da847d05700752c77',
                    type: 'authorization',
                  },
                ],
              },
              status: 503,
            },
            message: 'Request Failed: during criteo_audience response transformation (Retryable)',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              feature: 'dataDelivery',
              implementation: 'native',
              errorType: 'retryable',
              module: 'destination',
            },
            status: 500,
          },
        },
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.criteo.com/2025-04/audiences/34898/contactlist',
          headers: {
            Authorization: defaultAccessTokenAuthHeader,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'criteo_audience',
          },
          userId: '1234',
          metadata: generateMetadata(6),
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            destinationResponse: {
              response: {},
              status: 429,
            },
            message:
              'Request Failed: during criteo_audience response transformation - due to Request Limit exceeded, (Throttled)',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
            status: 429,
          },
        },
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 6',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.criteo.com/2025-04/audiences/34899/contactlist',
          headers: {
            Authorization: defaultAccessTokenAuthHeader,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: {
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
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
          params: {
            destination: 'criteo_audience',
          },
          userId: '1234',
          metadata: generateMetadata(7),
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              response: {
                message: 'unknown error',
              },
              status: 410,
            },
            message:
              'Request Failed: during criteo_audience response transformation with status "410" due to "{"message":"unknown error"}", (Aborted) ',
            statTags: {
              destType: 'CRITEO_AUDIENCE',
              errorCategory: 'network',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
            status: 400,
          },
        },
      },
    },
  },
];

export const data = [
  ...v0testCases,
  ...V1BusinessTestScenarion,
  ...v1OauthScenarios,
  ...v1OtherScenarios,
];
