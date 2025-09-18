import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { defaultAccessTokenAuthHeader } from '../../../common/secrets';

export const businessTestData: ProcessorTestData[] = [
  {
    id: 'linkedin_audience-business-test-1',
    name: 'linkedin_audience',
    description: 'Record call : non string values provided as email',
    scenario: 'Business',
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
                sha256Email: 12345,
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
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'The "string" argument must be of type string. Received type number (12345): Workflow: procWorkflow, Step: prepareUserTypeBasePayload, ChildStep: prepareUserIds, OriginalError: The "string" argument must be of type string. Received type number (12345)',
            metadata: generateMetadata(1),
            statTags: {
              destType: 'LINKEDIN_AUDIENCE',
              destinationId: 'default-destinationId',
              errorCategory: 'transformation',
              feature: 'processor',
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
  {
    id: 'linkedin_audience-business-test-2',
    name: 'linkedin_audience',
    description: 'Record call : Valid event with action type insert without any field mappings',
    scenario: 'Business',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateRecordPayload({
              fields: {},
              identifiers: {
                sha256Email: 'random@rudderstack.com',
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
        method: 'POST',
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
                'LinkedIn-Version': '202509',
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
    id: 'linkedin_audience-business-test-2',
    name: 'linkedin_audience',
    description:
      'Record call : customer provided hashed value, isHashRequired is false and action type is update',
    scenario: 'Business',
    successCriteria: 'should pass with 200 status code and transformed message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateRecordPayload({
              fields: {},
              identifiers: {
                sha256Email: '52ac4b9ef8f745e007c19fac81ddb0a3f50b20029f6699ca1406225fc217f392',
                sha512Email:
                  '631372c5eafe80f3fe1b5d067f6a1870f1f04a0f0c0d9298eeaa20b9e54224da9588e3164d2ec6e2a5545a5299ed7df563e4a60315e6782dfa7db4de6b1c5326',
              },
              action: 'update',
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
                  isHashRequired: false,
                },
                source: {},
              },
            },
          },
        ],
        method: 'POST',
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
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202509',
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
    id: 'linkedin_audience-business-test-2',
    name: 'linkedin_audience',
    description: 'Record call : event with company audience details',
    scenario: 'Business',
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
                city: 'Dhaka',
                state: 'Dhaka',
                industries: 'Information Technology',
                postalCode: '123456',
              },
              identifiers: {
                companyName: 'Rudderstack',
                organizationUrn: 'urn:li:organization:456',
                companyWebsiteDomain: 'rudderstack.com',
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
        method: 'POST',
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
              files: {},
              headers: {
                Authorization: defaultAccessTokenAuthHeader,
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202509',
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
