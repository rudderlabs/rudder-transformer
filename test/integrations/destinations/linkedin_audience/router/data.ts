import { defaultAccessToken, defaultAccessTokenAuthHeader } from '../../../common/secrets';
import { generateMetadata, generateRecordPayload } from '../../../testUtils';

export const data = [
  {
    name: 'linkedin_audience',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                  sha512Email: 'random@rudderstack.com',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(1),
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: '2lepjs3uWK6ac2WLukJjOrbcTfC',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: 32589526,
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [
                      {
                        from: 'name',
                        to: 'firstName',
                      },
                      {
                        from: 'name',
                        to: 'lastName',
                      },
                    ],
                    identifierMappings: [
                      {
                        from: 'email',
                        to: 'sha256Email',
                      },
                      {
                        from: 'email',
                        to: 'sha512Email',
                      },
                    ],
                    isHashRequired: true,
                  },
                  source: {},
                },
              },
            },
            {
              message: generateRecordPayload({
                fields: {},
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
                action: 'insert',
              }),
              metadata: generateMetadata(2),
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: '2lepjs3uWK6ac2WLukJjOrbcTfC',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: 32589526,
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [
                      {
                        from: 'name',
                        to: 'firstName',
                      },
                      {
                        from: 'name',
                        to: 'lastName',
                      },
                    ],
                    identifierMappings: [
                      {
                        from: 'email',
                        to: 'sha256Email',
                      },
                      {
                        from: 'email',
                        to: 'sha512Email',
                      },
                    ],
                    isHashRequired: true,
                  },
                  source: {},
                },
              },
            },
            {
              message: generateRecordPayload({
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                identifiers: {
                  sha256Email: 12345,
                },
                action: 'insert',
              }),
              metadata: generateMetadata(3),
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: '2lepjs3uWK6ac2WLukJjOrbcTfC',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: 32589526,
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [
                      {
                        from: 'name',
                        to: 'firstName',
                      },
                      {
                        from: 'name',
                        to: 'lastName',
                      },
                    ],
                    identifierMappings: [
                      {
                        from: 'email',
                        to: 'sha256Email',
                      },
                      {
                        from: 'email',
                        to: 'sha512Email',
                      },
                    ],
                    isHashRequired: true,
                  },
                  source: {},
                },
              },
            },
          ],
          destType: 'linkedin_audience',
        },
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
                body: {
                  FORM: {},
                  JSON: {
                    elements: [
                      {
                        action: 'ADD',
                        company: 'Rudderlabs',
                        country: 'Dhaka',
                        firstName: 'Test',
                        lastName: 'User',
                        userIds: [
                          {
                            idType: 'SHA256_EMAIL',
                            idValue:
                              '52ac4b9ef8f745e007c19fac81ddb0a3f50b20029f6699ca1406225fc217f392',
                          },
                          {
                            idType: 'SHA512_EMAIL',
                            idValue:
                              '631372c5eafe80f3fe1b5d067f6a1870f1f04a0f0c0d9298eeaa20b9e54224da9588e3164d2ec6e2a5545a5299ed7df563e4a60315e6782dfa7db4de6b1c5326',
                          },
                        ],
                      },
                      {
                        action: 'ADD',
                        userIds: [
                          {
                            idType: 'SHA256_EMAIL',
                            idValue:
                              '52ac4b9ef8f745e007c19fac81ddb0a3f50b20029f6699ca1406225fc217f392',
                          },
                        ],
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.linkedin.com/rest/dmpSegments/32589526/users',
                files: {},
                headers: {
                  Authorization: defaultAccessTokenAuthHeader,
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202409',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                  DisplayName: 'Linkedin Audience',
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                },
                Enabled: true,
                ID: '123',
                Name: 'Linkedin Audience',
                Transformations: [],
                WorkspaceID: '2lepjs3uWK6ac2WLukJjOrbcTfC',
              },
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              destination: {
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                  DisplayName: 'Linkedin Audience',
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                },
                Enabled: true,
                ID: '123',
                Name: 'Linkedin Audience',
                Transformations: [],
                WorkspaceID: '2lepjs3uWK6ac2WLukJjOrbcTfC',
              },
              error: 'The "string" argument must be of type string. Received type number (12345)',
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 3,
                  secret: {
                    accessToken: defaultAccessToken,
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'default-workspaceId',
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'transformation',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
              statusCode: 500,
            },
          ],
        },
      },
    },
  },
];
