import * as config from '../../../../../src/v0/destinations/linkedin_audience/config';

export const nativeData = [
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
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                  sha512Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
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
              message: {
                type: 'record',
                action: 'insert',
                fields: {},
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 2,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
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
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 12345,
                },
              },
              metadata: {
                jobId: 3,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
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
                endpointPath: '/dmpSegments/<audienceId>/users',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
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
                  Config: {},
                  DisplayName: 'Linkedin Audience',
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                },
                Enabled: true,
                ID: '123',
                Name: 'Linkedin Audience',
                Transformations: [],
                WorkspaceID: 'workspace-disable-cdkv2',
              },
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 1,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'workspace-disable-cdkv2',
                },
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 2,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'workspace-disable-cdkv2',
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
                  Config: {},
                  DisplayName: 'Linkedin Audience',
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                },
                Enabled: true,
                ID: '123',
                Name: 'Linkedin Audience',
                Transformations: [],
                WorkspaceID: 'workspace-disable-cdkv2',
              },
              error: 'message.identifiers.sha256Email: Expected string, received number',
              metadata: [
                {
                  attemptNum: 1,
                  destinationId: 'default-destinationId',
                  dontBatch: false,
                  jobId: 3,
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  sourceId: 'default-sourceId',
                  userId: 'default-userId',
                  workspaceId: 'workspace-disable-cdkv2',
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
                errorType: 'instrumentation',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-business-test-1',
    name: 'linkedin_audience',
    description: 'Record call : non string values provided as email',
    scenario: 'Business',
    successCriteria: 'should fail with 400 status code and error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 12345,
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error: 'message.identifiers.sha256Email: Expected string, received number',
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                feature: 'router',
                implementation: 'native',
                errorType: 'instrumentation',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-business-test-2',
    name: 'linkedin_audience',
    description: 'Record call : Valid event with action type insert without any field mappings',
    scenario: 'Business',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {},
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
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
                endpointPath: '/dmpSegments/<audienceId>/users',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-business-test-2',
    name: 'linkedin_audience',
    description:
      'Record call : customer provided hashed value, isHashRequired is false and action type is update',
    scenario: 'Business',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'update',
                fields: {},
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: '52ac4b9ef8f745e007c19fac81ddb0a3f50b20029f6699ca1406225fc217f392',
                  sha512Email:
                    '631372c5eafe80f3fe1b5d067f6a1870f1f04a0f0c0d9298eeaa20b9e54224da9588e3164d2ec6e2a5545a5299ed7df563e4a60315e6782dfa7db4de6b1c5326',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
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
                    isHashRequired: false,
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
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.linkedin.com/rest/dmpSegments/32589526/users',
                endpointPath: '/dmpSegments/<audienceId>/users',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-business-test-2',
    name: 'linkedin_audience',
    description: 'Record call : event with company audience details',
    scenario: 'Business',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  city: 'Dhaka',
                  state: 'Dhaka',
                  industries: 'Information Technology',
                  postalCode: '123456',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  companyName: 'Rudderstack',
                  organizationUrn: 'urn:li:organization:456',
                  companyWebsiteDomain: 'rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    audienceType: 'company',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [
                      {
                        from: 'city',
                        to: 'city',
                      },
                      {
                        from: 'state',
                        to: 'state',
                      },
                      {
                        from: 'domain',
                        to: 'industries',
                      },
                      {
                        from: 'psCode',
                        to: 'postalCode',
                      },
                    ],
                    identifierMappings: [
                      {
                        from: 'name',
                        to: 'companyName',
                      },
                      {
                        from: 'urn',
                        to: 'organizationUrn',
                      },
                      {
                        from: 'Website Domain',
                        to: 'companyWebsiteDomain',
                      },
                    ],
                    isHashRequired: false,
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
                        city: 'Dhaka',
                        companyName: 'Rudderstack',
                        companyWebsiteDomain: 'rudderstack.com',
                        industries: 'Information Technology',
                        organizationUrn: 'urn:li:organization:456',
                        postalCode: '123456',
                        state: 'Dhaka',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.linkedin.com/rest/dmpSegments/32589526/companies',
                endpointPath: '/dmpSegments/<audienceId>/companies',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-1',
    name: 'linkedin_audience',
    description: 'Record call : event is valid with all required elements',
    scenario: 'Validation',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                  sha512Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
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
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.linkedin.com/rest/dmpSegments/32589526/users',
                endpointPath: '/dmpSegments/<audienceId>/users',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-2',
    name: 'linkedin_audience',
    description: 'Record call : event is not valid with all required elements',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                  sha512Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error:
                'connection.config.destination.audienceId: audienceId is not present. Aborting',
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-3',
    name: 'linkedin_audience',
    description: 'Record call : audienceId can be a number (coerced to string)',
    scenario: 'Validation',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                  country: 'Dhaka',
                  company: 'Rudderlabs',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                  sha512Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
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
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.linkedin.com/rest/dmpSegments/32589526/users',
                endpointPath: '/dmpSegments/<audienceId>/users',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-4',
    name: 'linkedin_audience',
    description: 'Record call : Access Token is missing in metadata secret',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and configuration error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {},
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error:
                'metadata.secret.accessToken: Access Token is not present. This might be a platform issue. Please contact RudderStack support for assistance.',
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {},
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-5',
    name: 'linkedin_audience',
    description: 'Record call : audienceType is missing in config',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and configuration error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error:
                'connection.config.destination.audienceType: audienceType is not present. Aborting',
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-6',
    name: 'linkedin_audience',
    description: 'Record call : Message type is missing',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and instrumentation error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                action: 'insert',
                fields: {
                  firstName: 'Test',
                },
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error: 'message.type: message Type is not present. Aborting message.',
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-7',
    name: 'linkedin_audience',
    description: 'Record call : Unsupported message type',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and instrumentation error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'track',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                },
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error: "message.type: Invalid enum value. Expected 'record', received 'track'",
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-8',
    name: 'linkedin_audience',
    description: 'Record call : fields is missing',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and instrumentation error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error: 'message.fields: fields is not present. Aborting message.',
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-9',
    name: 'linkedin_audience',
    description: 'Record call : identifiers is missing',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and instrumentation error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error: 'message.identifiers: identifiers is not present. Aborting message.',
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-10',
    name: 'linkedin_audience',
    description: 'Record call : action type is unsupported',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and instrumentation error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'unknown',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    audienceType: 'user',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error:
                "message.action: Invalid enum value. Expected 'insert' | 'delete' | 'update', received 'unknown'",
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-11',
    name: 'linkedin_audience',
    description: 'Record call : audienceType is unknown',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and instrumentation error message',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {
                  firstName: 'Test',
                  lastName: 'User',
                },
                channel: 'sources',
                context: {
                  sources: {
                    job_id: 'randomJobId',
                    version: 'local',
                    job_run_id: 'jobRunId',
                    task_run_id: 'taskRunId',
                  },
                },
                recordId: '3',
                rudderId: 'randomRudderId',
                messageId: 'randomMessageId',
                receivedAt: '2024-11-08T10:30:41.618+05:30',
                request_ip: '[::1]',
                identifiers: {
                  sha256Email: 'random@rudderstack.com',
                },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: {
                  accessToken: 'commonAccessToken',
                },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    accountId: 512315509,
                    audienceId: '32589526',
                    createAudience: 'no',
                    eventType: 'record',
                    fieldMappings: [],
                    identifierMappings: [],
                    isHashRequired: true,
                    audienceType: 'unknown',
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
              batched: false,
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: {
                  connectionMode: 'cloud',
                  rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu',
                },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              error:
                "connection.config.destination.audienceType: Invalid enum value. Expected 'user' | 'company', received 'unknown'",
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: {
                    accessToken: 'commonAccessToken',
                  },
                  dontBatch: false,
                },
              ],
              statTags: {
                destType: 'LINKEDIN_AUDIENCE',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'workspace-disable-cdkv2',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    id: 'linkedin_audience-native-max-batch-size-2',
    name: 'linkedin_audience',
    description: 'Record call : splits same-action events by MAX_BATCH_SIZE=2',
    scenario: 'Business',
    successCriteria: 'should create two ADD batched requests with 2+1 elements',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {},
                channel: 'sources',
                identifiers: { sha256Email: 'random@rudderstack.com' },
              },
              metadata: {
                jobId: 1,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: { accessToken: 'commonAccessToken' },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: { connectionMode: 'cloud', rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu' },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    audienceId: '32589526',
                    audienceType: 'user',
                    isHashRequired: true,
                  },
                  source: {},
                },
              },
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {},
                channel: 'sources',
                identifiers: { sha256Email: 'random@rudderstack.com' },
              },
              metadata: {
                jobId: 2,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: { accessToken: 'commonAccessToken' },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: { connectionMode: 'cloud', rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu' },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    audienceId: '32589526',
                    audienceType: 'user',
                    isHashRequired: true,
                  },
                  source: {},
                },
              },
            },
            {
              message: {
                type: 'record',
                action: 'insert',
                fields: {},
                channel: 'sources',
                identifiers: { sha256Email: 'random@rudderstack.com' },
              },
              metadata: {
                jobId: 3,
                attemptNum: 1,
                userId: 'default-userId',
                sourceId: 'default-sourceId',
                destinationId: 'default-destinationId',
                workspaceId: 'workspace-disable-cdkv2',
                secret: { accessToken: 'commonAccessToken' },
                dontBatch: false,
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: { connectionMode: 'cloud', rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu' },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              connection: {
                sourceId: 'randomSourceId',
                destinationId: 'randomDestinationId',
                enabled: true,
                config: {
                  destination: {
                    audienceId: '32589526',
                    audienceType: 'user',
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
                        userIds: [
                          {
                            idType: 'SHA256_EMAIL',
                            idValue:
                              '52ac4b9ef8f745e007c19fac81ddb0a3f50b20029f6699ca1406225fc217f392',
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
                endpointPath: '/dmpSegments/<audienceId>/users',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: { connectionMode: 'cloud', rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu' },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: { accessToken: 'commonAccessToken' },
                  dontBatch: false,
                },
                {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: { accessToken: 'commonAccessToken' },
                  dontBatch: false,
                },
              ],
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    elements: [
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
                endpointPath: '/dmpSegments/<audienceId>/users',
                files: {},
                headers: {
                  Authorization: 'Bearer commonAccessToken',
                  'Content-Type': 'application/json',
                  'LinkedIn-Version': '202603',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                ID: '123',
                Name: 'Linkedin Audience',
                DestinationDefinition: {
                  ID: '2njmJIfG6JH3guvFHSjLQNiIYh5',
                  Name: 'LINKEDIN_AUDIENCE',
                  DisplayName: 'Linkedin Audience',
                  Config: {},
                },
                Config: { connectionMode: 'cloud', rudderAccountId: '2nmIV6FMXvyyqRM9Ifj8V92yElu' },
                Enabled: true,
                WorkspaceID: 'workspace-disable-cdkv2',
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 3,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: 'workspace-disable-cdkv2',
                  secret: { accessToken: 'commonAccessToken' },
                  dontBatch: false,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: () => {
      jest.replaceProperty(config, 'MAX_BATCH_SIZE', 2);
    },
  },
];
