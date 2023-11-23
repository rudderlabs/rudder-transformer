export const data = [
  {
    name: 'eloqua',
    description: 'identify payload pass',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              traits: {
                C_FirstName: 'Test User',
                C_patient_id1: 1,
                C_MobilePhone: '+008822773355',
                C_City: 'Scranton',
                C_date_of_birth_1life1: '22/12/01',
              },
              userId: 'testUser1234@keeptesting.com',
              context: {
                sources: {
                  job_id: '2RVkqlV1adBiIpj33kWlQzchMP1/Syncher',
                  version: 'v1.28.0',
                  job_run_id: 'cja699onfuet3te5obc0',
                  task_run_id: 'cja699onfuet3te5obcg',
                },
                externalId: [
                  {
                    id: 'testUser1234@keeptesting.com',
                    type: 'ELOQUA-contacts',
                    identifierType: 'C_EmailAddress',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '3606d3c7-8741-4245-a254-450e137d3866',
              messageId: '40def17a-1b6a-4d2d-a851-2a8d96f913bd',
            },
            destination: {
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'POST',
              endpoint: '',
              headers: {},
              params: {},
              body: {
                JSON: {
                  identifierFieldName: 'C_EmailAddress',
                  data: {
                    C_FirstName: 'Test User',
                    C_patient_id1: '1',
                    C_MobilePhone: '+008822773355',
                    C_City: 'Scranton',
                    C_date_of_birth_1life1: '22/12/01',
                    C_EmailAddress: 'testUser1234@keeptesting.com',
                  },
                  customObjectId: 'contacts',
                  type: 'identify',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'eloqua',
    description: 'type not correect',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'audiencelist',
              traits: {
                C_FirstName: 'Test User',
                C_patient_id1: 1,
                C_MobilePhone: '+008822773355',
                C_City: 'Scranton',
                C_date_of_birth_1life1: '22/12/01',
              },
              userId: 'testUser1234@keeptesting.com',
              context: {
                sources: {
                  job_id: '2RVkqlV1adBiIpj33kWlQzchMP1/Syncher',
                  version: 'v1.28.0',
                  job_run_id: 'cja699onfuet3te5obc0',
                  task_run_id: 'cja699onfuet3te5obcg',
                },
                externalId: [
                  {
                    id: 'testUser1234@keeptesting.com',
                    type: 'ELOQUA-contacts',
                    identifierType: 'C_EmailAddress',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '3606d3c7-8741-4245-a254-450e137d3866',
              messageId: '40def17a-1b6a-4d2d-a851-2a8d96f913bd',
            },
            destination: {
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              'Event type audiencelist is not supported. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event type audiencelist is not supported. Aborting message.',
            statTags: {
              destType: 'ELOQUA',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'eloqua',
    description: 'trits not correect',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              userId: 'testUser1234@keeptesting.com',
              context: {
                sources: {
                  job_id: '2RVkqlV1adBiIpj33kWlQzchMP1/Syncher',
                  version: 'v1.28.0',
                  job_run_id: 'cja699onfuet3te5obc0',
                  task_run_id: 'cja699onfuet3te5obcg',
                },
                externalId: [
                  {
                    id: 'testUser1234@keeptesting.com',
                    type: 'ELOQUA-contacts',
                    identifierType: 'C_EmailAddress',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '3606d3c7-8741-4245-a254-450e137d3866',
              messageId: '40def17a-1b6a-4d2d-a851-2a8d96f913bd',
            },
            destination: {
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              'Message traits/properties not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Message traits/properties not present. Aborting message.',
            statTags: {
              destType: 'ELOQUA',
              destinationId: 'destId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'eloqua',
    description: 'identify payload pass 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              traits: {
                C_FirstName: 'Test User',
                C_patient_id1: 1,
                C_MobilePhone: '+008822773355',
                C_City: 'Scranton',
                C_date_of_birth_1life1: '22/12/01',
              },
              userId: 'testUser1234@keeptesting.com',
              context: {
                sources: {
                  job_id: '2RVkqlV1adBiIpj33kWlQzchMP1/Syncher',
                  version: 'v1.28.0',
                  job_run_id: 'cja699onfuet3te5obc0',
                  task_run_id: 'cja699onfuet3te5obcg',
                },
                externalId: [
                  {
                    id: 'testUser1234@keeptesting.com',
                    type: 'ELOQUA-contacts',
                    identifierType: 'C_EmailAddress',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '3606d3c7-8741-4245-a254-450e137d3866',
              messageId: '40def17a-1b6a-4d2d-a851-2a8d96f913bd',
            },
            destination: {
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'POST',
              endpoint: '',
              headers: {},
              params: {},
              body: {
                JSON: {
                  identifierFieldName: 'C_EmailAddress',
                  data: {
                    C_FirstName: 'Test User',
                    C_patient_id1: '1',
                    C_MobilePhone: '+008822773355',
                    C_City: 'Scranton',
                    C_date_of_birth_1life1: '22/12/01',
                    C_EmailAddress: 'testUser1234@keeptesting.com',
                  },
                  customObjectId: 'contacts',
                  type: 'identify',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'eloqua',
    description: 'track payload pass',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              properties: {
                key11: 'Test User',
                key21: 1,
                contactID11: '+008822773355',
              },
              userId: 'testUser1234@keeptesting.com',
              channel: 'sources',
              context: {
                sources: {
                  job_id: '2RVkqlV1adBiIpj33kWlQzchMP1/Syncher',
                  version: 'v1.28.0',
                  job_run_id: 'cja699onfuet3te5obc0',
                  task_run_id: 'cja699onfuet3te5obcg',
                },
                externalId: [
                  {
                    id: 'testUser1234@keeptesting.com',
                    type: 'ELOQUA-172',
                    identifierType: 'contactID1',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '3606d3c7-8741-4245-a254-450e137d3866',
              messageId: '40def17a-1b6a-4d2d-a851-2a8d96f913bd',
            },
            destination: {
              Config: {
                customerAccountId: '89236978',
                customerId: '78678678',
                audienceId: '564567',
                hashEmail: false,
              },
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'POST',
              endpoint: '',
              headers: {},
              params: {},
              body: {
                JSON: {
                  identifierFieldName: 'contactID1',
                  data: {
                    key11: 'Test User',
                    key21: '1',
                    contactID11: '+008822773355',
                    contactID1: 'testUser1234@keeptesting.com',
                  },
                  customObjectId: '172',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
