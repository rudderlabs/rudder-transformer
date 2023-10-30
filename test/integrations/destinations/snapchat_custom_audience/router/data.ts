import { FEATURES, MODULES } from '../../../../../src/v0/util/tags';

const DEST_TYPE = 'snapchat_custom_audience';

export const data = [
  {
    name: DEST_TYPE,
    description: 'Test 0',
    feature: FEATURES.ROUTER,
    module: MODULES.DESTINATION,
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                secret: {
                  access_token: 'dummyAccessToken',
                  refresh_token: 'dummyRefreshToken',
                  developer_token: 'dummyDeveloperToken',
                },
              },
              destination: {
                Config: {
                  segmentId: '123',
                  disableHashing: false,
                  schema: 'email',
                },
              },
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
                context: {
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
          ],
          destType: DEST_TYPE,
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
                    Authorization: 'Bearer dummyAccessToken',
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
                    access_token: 'dummyAccessToken',
                    developer_token: 'dummyDeveloperToken',
                    refresh_token: 'dummyRefreshToken',
                  },
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  disableHashing: false,
                  schema: 'email',
                  segmentId: '123',
                },
              },
            },
          ],
        },
      },
    },
  },
];
