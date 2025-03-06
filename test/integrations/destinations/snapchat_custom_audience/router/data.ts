import { authHeader1, secret1 } from '../maskedSecrets';
export const data = [
  {
    name: 'snapchat_custom_audience',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                secret: {
                  access_token: secret1,
                  refresh_token: 'dummyRefreshToken',
                  developer_token: 'dummyDeveloperToken',
                },
                userId: 'u1',
              },
              destination: { Config: { segmentId: '123', disableHashing: false, schema: 'email' } },
              message: {
                userId: 'user 1',
                anonymousId: 'anon-id-new',
                event: 'event1',
                type: 'audiencelist',
                properties: {
                  listData: {
                    add: [
                      {
                        email: 'test@abc.com',
                        phone: '@09876543210',
                        firstName: 'test',
                        lastName: 'rudderlabs',
                        country: 'US',
                        postalCode: '1245',
                      },
                    ],
                  },
                  enablePartialFailure: true,
                },
                context: { ip: '14.5.67.21', library: { name: 'http' } },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
          ],
          destType: 'snapchat_custom_audience',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://adsapi.snapchat.com/v1/segments/123/users',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      users: [
                        {
                          data: [
                            ['d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419'],
                          ],
                          schema: ['EMAIL_SHA256'],
                        },
                      ],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  secret: {
                    access_token: secret1,
                    developer_token: 'dummyDeveloperToken',
                    refresh_token: 'dummyRefreshToken',
                  },
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: { Config: { disableHashing: false, schema: 'email', segmentId: '123' } },
            },
          ],
        },
      },
    },
  },
];
