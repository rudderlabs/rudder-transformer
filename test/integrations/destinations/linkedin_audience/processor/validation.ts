import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, generateRecordPayload } from '../../../testUtils';

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'linkedin_audience-validation-test-1',
    name: 'linkedin_audience',
    description: 'Record call : event is valid with all required elements',
    scenario: 'Validation',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: generateMetadata(1),
            output: {
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
              files: {},
              headers: {
                Authorization: 'Bearer default-accessToken',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202409',
                'X-RestLi-Method': 'BATCH_CREATE',
                'X-Restli-Protocol-Version': '2.0.0',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-2',
    name: 'linkedin_audience',
    description: 'Record call : event is not valid with all required elements',
    scenario: 'Validation',
    successCriteria: 'should fail with 400 status code and error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Audience Id is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Audience Id is not present. Aborting',
            metadata: generateMetadata(1),
            statTags: {
              destType: 'LINKEDIN_AUDIENCE',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_audience-validation-test-3',
    name: 'linkedin_audience',
    description: 'Record call : isHashRequired is not provided',
    scenario: 'Validation',
    successCriteria:
      'should succeed with 200 status code and transformed message with provided values of identifiers',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                  audienceId: 1234,
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
                },
                source: {},
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
            metadata: generateMetadata(1),
            output: {
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
                          idValue: 'random@rudderstack.com',
                        },
                        {
                          idType: 'SHA512_EMAIL',
                          idValue: 'random@rudderstack.com',
                        },
                      ],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.linkedin.com/rest/dmpSegments/1234/users',
              files: {},
              headers: {
                Authorization: 'Bearer default-accessToken',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202409',
                'X-RestLi-Method': 'BATCH_CREATE',
                'X-Restli-Protocol-Version': '2.0.0',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
