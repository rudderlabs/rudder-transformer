import { defaultAccessToken, defaultAccessTokenAuthHeader } from '../../../common/secrets';
import { secret1 } from '../maskedSecrets';

export const data = [
  {
    name: 'criteo_audience',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                    },
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34894',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34894/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                    },
                    {
                      madid: 'sample_madid_1',
                    },
                    {
                      madid: 'sample_madid_2',
                    },
                    {
                      madid: 'sample_madid_10',
                    },
                    {
                      madid: 'sample_madid_13',
                    },
                    {
                      madid: 'sample_madid_11',
                    },
                    {
                      madid: 'sample_madid_12',
                    },
                  ],
                  remove: [
                    {
                      madid: 'sample_madid_3',
                    },
                    {
                      madid: 'sample_madid_4',
                    },
                    {
                      madid: 'sample_madid_5',
                    },
                    {
                      madid: 'sample_madid_6',
                    },
                    {
                      madid: 'sample_madid_7',
                    },
                    {
                      madid: 'sample_madid_8',
                    },
                    {
                      madid: 'sample_madid_9',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'madid',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'add',
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'remove',
                      identifierType: 'madid',
                      internalIdentifiers: false,
                      identifiers: [
                        'sample_madid_3',
                        'sample_madid_4',
                        'sample_madid_5',
                        'sample_madid_6',
                        'sample_madid_7',
                        'sample_madid_8',
                        'sample_madid_9',
                      ],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                      identityLink: 'abc.com',
                      gum: 'sdjfds',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34894',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34894/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'add',
                      identifierType: 'email',
                      internalIdentifiers: false,
                      identifiers: ['alex@email.com', 'amy@email.com', 'van@email.com'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                      identityLink: 'abc.com',
                      gum: 'sdjfds',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34895',
                audienceType: 'madid',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34895/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'add',
                      identifierType: 'madid',
                      internalIdentifiers: false,
                      identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                      identityLink: 'abc.com',
                      gum: 'sdjfds',
                    },
                  ],
                  remove: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'madid',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'add',
                      identifierType: 'madid',
                      internalIdentifiers: false,
                      identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'remove',
                      identifierType: 'madid',
                      internalIdentifiers: false,
                      identifiers: ['sample_madid'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                      identityLink: 'abc.com',
                      gum: 'sdjfds',
                    },
                  ],
                  remove: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'identityLink',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'add',
                      identifierType: 'identityLink',
                      internalIdentifiers: false,
                      identifiers: ['text.com', 'yahoo.com', 'abc.com'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'remove',
                      identifierType: 'identityLink',
                      internalIdentifiers: false,
                      identifiers: ['text.com'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sample_gum1',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sample_gum2',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                      identityLink: 'abc.com',
                      gum: 'sample_gum3',
                    },
                  ],
                  remove: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sample_gum3',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'gum',
                gumCallerId: '329739',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'add',
                      identifierType: 'gum',
                      internalIdentifiers: false,
                      gumCallerId: '329739',
                      identifiers: ['sample_gum1', 'sample_gum2', 'sample_gum3'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  data: {
                    type: 'ContactlistAmendment',
                    attributes: {
                      operation: 'remove',
                      identifierType: 'gum',
                      internalIdentifiers: false,
                      gumCallerId: '329739',
                      identifiers: ['sample_gum3'],
                    },
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'identify',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                      identityLink: 'abc.com',
                      gum: 'sdjfds',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 400,
            error: 'Event type identify is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CRITEO_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
            message: {
              type: 'audiencelist',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '1.12.3',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                traits: {
                  brand: 'John Players',
                  price: '15000',
                  firstName: 'Test',
                  email: 'test@rudderstack.com',
                  userId: 'user@27',
                },
                locale: 'en-US',
                device: {
                  token: 'token',
                  id: 'id',
                  type: 'ios',
                },
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 400,
            error: 'Message properties is not present. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CRITEO_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
            message: {
              event: 'add_to_Cart',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                brand: 'Zara',
                price: '12000',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 400,
            error: 'listData is not present inside properties. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CRITEO_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {},
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 400,
            error: 'Payload could not be populated',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CRITEO_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34893',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
            message: {
              event: 'add_to_Cart',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                brand: 'Zara',
                price: '12000',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 400,
            error: 'Message Type is not present. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CRITEO_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            destination: {
              Config: {
                audienceId: '34893',
                audienceType: 'gum',
              },
              ID: 'sample_destinationId',
            },
            message: {
              event: 'add_to_Cart',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              type: 'audiencelist',
              channel: 'web',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sample_gum1',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sample_gum2',
                    },
                    {
                      madid: 'sample_madid_2',
                      email: 'van@email.com',
                      identityLink: 'abc.com',
                      gum: 'sample_gum3',
                    },
                  ],
                },
                brand: 'Zara',
                price: '12000',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 400,
            error: 'gumCallerId is required for audience type gum',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'CRITEO_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      madid: 'sample_madid',
                      email: 'alex@email.com',
                      identityLink: 'text.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_1',
                      email: 'amy@email.com',
                      identityLink: 'yahoo.com',
                      gum: 'sdjfds',
                    },
                    {
                      madid: 'sample_madid_2',
                      identityLink: 'abc.com',
                      gum: 'sdjfds',
                    },
                  ],
                },
              },
              context: {
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: secret1,
                audienceId: '34894',
                audienceType: 'email',
              },
              ID: 'sample_destinationId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              secret: {
                accessToken: defaultAccessToken,
              },
            },
            statusCode: 400,
            error: 'Required property for email type audience is not available in an object',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CRITEO_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
];
