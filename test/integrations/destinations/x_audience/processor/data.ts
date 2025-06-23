import { destination, authHeaderConstant, generateMetadata } from '../common';

const fields = {
  email: 'abc@xyz.com,a+1@xyz.com',
  phone_number: '98765433232,21323',
  handle: '@abc,@xyz',
  twitter_id: 'tid1,tid2',
  partner_user_id: 'puid1,puid2',
};

export const data = [
  {
    name: 'x_audience',
    description: 'All traits are present with hash enbaled for the audience with insert operation',
    successCriteria: 'It should be passed with 200 Ok with all traits mapped after hashing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { ...destination, Config: { ...destination.Config, enableHash: true } },
            message: {
              type: 'record',
              action: 'insert',
              fields: {
                ...fields,
                device_id: 'did123,did456',
                effective_at: '2024-05-15T00:00:00Z',
                expires_at: '2025-05-15T00:00:00Z',
              },
              context: {},
              recordId: '1',
            },
            metadata: generateMetadata(1),
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
              method: 'POST',
              endpoint:
                'https://ads-api.twitter.com/12/accounts/1234/custom_audiences/dummyId/users',
              headers: {
                Authorization: authHeaderConstant,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch: JSON.stringify([
                    {
                      operation_type: 'Update',
                      params: {
                        effective_at: '2024-05-15T00:00:00Z',
                        expires_at: '2025-05-15T00:00:00Z',
                        users: [
                          {
                            email: [
                              'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
                              '27a1b87036e9b0f43235026e7cb1493f1838b6fe41965ea04486d82e499f8401',
                            ],
                            phone_number: [
                              '76742d946d9f6d0c844da5648e461896227782ccf1cd0db64573f39dbd92e05f',
                              '69c3bf36e0476c08a883fd6a995f67fc6d362c865549312fb5170737945fd073',
                            ],
                            handle: [
                              '771c7b0ff2eff313009a81739307c3f7cde375acd7902b11061266a899a375f6',
                              '7bde3c2d41eab9043df37c9adf4f5f7591c632340d1cabc894e438e881fdd5f6',
                            ],
                            device_id: [
                              '85a598fd6c8834f2d4da3d6886bb53d0032021e137307ec91d3f0da78e9bfa5b',
                              '936444046bea8b5d9de6bcae59b6f196ea4bb59945bc93e84bc9533dbf3e01c0',
                            ],
                            twitter_id: [
                              'a70d41727df61f21ce0ec81cca51c58f516b6151275d9293d7437bf15fa22e0d',
                              'e39994d056999d79ff5a35b02cf2af946fc14bd7bd1b799b58619796584af02f',
                            ],
                            partner_user_id: ['puid1', 'puid2'],
                          },
                        ],
                      },
                    },
                  ]),
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: generateMetadata(1),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'x_audience',
    description: 'All traits are present with hash disabled for the audience with delete operation',
    successCriteria: 'It should be passed with 200 Ok with all traits mapped without hashing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'record',
              action: 'delete',
              fields,
              channel: 'sources',
              context: {},
              recordId: '1',
            },
            metadata: generateMetadata(1),
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
              method: 'POST',
              endpoint:
                'https://ads-api.twitter.com/12/accounts/1234/custom_audiences/dummyId/users',
              headers: {
                Authorization: authHeaderConstant,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch: JSON.stringify([
                    {
                      operation_type: 'Delete',
                      params: {
                        users: [
                          {
                            email: ['abc@xyz.com', 'a+1@xyz.com'],
                            phone_number: ['98765433232', '21323'],
                            handle: ['@abc', '@xyz'],
                            twitter_id: ['tid1', 'tid2'],
                            partner_user_id: ['puid1', 'puid2'],
                          },
                        ],
                      },
                    },
                  ]),
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: generateMetadata(1),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'x_audience',
    description: 'Type Validation case',
    successCriteria: 'It should be passed with 200 Ok giving validation error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              context: {},
              recordId: '1',
            },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: generateMetadata(1),
            statusCode: 400,
            error: '[X AUDIENCE]: identify is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              destinationId: 'default-destinationId',
              errorType: 'instrumentation',
              destType: 'X_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              workspaceId: 'default-workspaceId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'x_audience',
    description: 'Validation for oauth secret',
    successCriteria: 'It should be passed with 200 and return oauth secret not found for jobs',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'record',
              action: 'insert',
              fields: {
                ...fields,
                device_id: 'did123,did456',
                effective_at: '2024-05-15T00:00:00Z',
                expires_at: '2025-05-15T00:00:00Z',
              },
              context: {},
              recordId: '1',
            },
            metadata: {
              jobId: 1,
              attemptNum: 1,
              userId: 'default-userId',
              sourceId: 'default-sourceId',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              dontBatch: false,
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
              jobId: 1,
              attemptNum: 1,
              userId: 'default-userId',
              sourceId: 'default-sourceId',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              dontBatch: false,
            },
            statusCode: 500,
            error:
              '[X Audience]:: OAuth - secret not found. This might be a platform issue. Please contact RudderStack support for assistance.',
            statTags: {
              errorCategory: 'platform',
              destinationId: 'default-destinationId',
              errorType: 'oAuthSecret',
              destType: 'X_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              workspaceId: 'default-workspaceId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'x_audience',
    description: 'Validation for oauth secret',
    successCriteria:
      'It should be passed with 200 Ok and and return oauth consumerKey not found for jobs',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'record',
              action: 'insert',
              fields: {
                ...fields,
                device_id: 'did123,did456',
                effective_at: '2024-05-15T00:00:00Z',
                expires_at: '2025-05-15T00:00:00Z',
              },
              context: {},
              recordId: '1',
            },
            metadata: {
              jobId: 1,
              attemptNum: 1,
              userId: 'default-userId',
              sourceId: 'default-sourceId',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              dontBatch: false,
              secret: {
                consumerSecret: 'validConsumerSecret',
                accessToken: 'validAccessToken',
                accessTokenSecret: 'validAccessTokenSecret',
              },
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
              jobId: 1,
              attemptNum: 1,
              userId: 'default-userId',
              sourceId: 'default-sourceId',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
              dontBatch: false,
              secret: {
                consumerSecret: 'validConsumerSecret',
                accessToken: 'validAccessToken',
                accessTokenSecret: 'validAccessTokenSecret',
              },
            },
            statusCode: 500,
            error: '[X Audience]:: OAuth - consumerKey not found',
            statTags: {
              errorCategory: 'platform',
              destinationId: 'default-destinationId',
              errorType: 'oAuthSecret',
              destType: 'X_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              workspaceId: 'default-workspaceId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns: (_) => {
    jest.mock('../../../../../src/v0/destinations/twitter_ads/util', () => ({
      ...jest.requireActual('../../../../../src/v0/destinations/twitter_ads/util'),
      getAuthHeaderForRequest: (_a, _b) => {
        return { Authorization: authHeaderConstant };
      },
    }));
  },
}));
