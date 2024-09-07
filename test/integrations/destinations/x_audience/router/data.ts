import { destination, authHeaderConstant, generateMetadata } from '../common';

export const data = [
  {
    name: 'x_audience',
    id: 'router-test-1',
    description:
      'case with 2 record with no effective and expire at date with insert operations, 4 insert with 2 each having same effective and expire at and one delete and one failure event',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                type: 'record',
                action: 'delete',
                fields: { email: 'email1@abc.com' },
                channel: 'sources',
                context: {},
                recordId: '1',
              },
              metadata: generateMetadata(1),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'insert',
                fields: { email: 'email2@abc.com' },
                channel: 'sources',
                context: {},
                recordId: '2',
              },
              metadata: generateMetadata(2),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'insert',
                fields: { email: 'email3@abc.com' },
                channel: 'sources',
                context: {},
                recordId: '3',
              },
              metadata: generateMetadata(3),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'update',
                fields: {
                  email: 'email4@abc.com',
                  expires_at: 'some date',
                  effective_at: 'some effective date',
                },
                channel: 'sources',
                context: {},
                recordId: '4',
              },
              metadata: generateMetadata(4),
            },
            {
              destination,
              message: {
                type: 'record',
                action: 'update',
                fields: {
                  email: 'email5@abc.com',
                  expires_at: 'some date',
                  effective_at: 'some effective date',
                },
                channel: 'sources',
                context: {},
                recordId: '5',
              },
              metadata: generateMetadata(5),
            },
            {
              destination,
              message: {
                type: 'identify',
                context: {},
                recordId: '1',
              },
              metadata: generateMetadata(6),
            },
          ],
          destType: 'x_audience',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: true,
              batchedRequest: {
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
                              email: ['email1@abc.com'],
                            },
                          ],
                        },
                      },
                      {
                        operation_type: 'Update',
                        params: {
                          users: [
                            {
                              email: ['email2@abc.com'],
                            },
                            {
                              email: ['email3@abc.com'],
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
              },
              destination,
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
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
                          effective_at: 'some effective date',
                          expires_at: 'some date',
                          users: [
                            {
                              email: ['email4@abc.com'],
                            },
                            {
                              email: ['email5@abc.com'],
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
              },
              destination,
              metadata: [generateMetadata(4), generateMetadata(5)],
              statusCode: 200,
            },
            {
              metadata: [generateMetadata(6)],
              destination,
              batched: false,
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
                feature: 'router',
              },
            },
          ],
        },
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns: (_) => {
    jest.mock('../../../../../src/v0/destinations/twitter_ads/util', () => ({
      getAuthHeaderForRequest: (_a, _b) => {
        return { Authorization: authHeaderConstant };
      },
    }));
    jest.mock('../../../../../src/v0/destinations/x_audience/config', () => ({
      BASE_URL:
        'https://ads-api.twitter.com/12/accounts/:account_id/custom_audiences/:audience_id/users',
      MAX_PAYLOAD_SIZE_IN_BYTES: 40000,
      MAX_OPERATIONS: 2,
    }));
  },
}));
