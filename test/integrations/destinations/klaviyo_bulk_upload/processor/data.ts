export const data = [
  {
    name: 'klaviyo_bulk_upload',
    description: 'Successful identify event with location data',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'user1',
                    identifierType: 'userId',
                    type: 'KLAVIYO_BULK_UPLOAD-userProfiles',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  job_id: '2gif2bMzsX1Nt0rbV1vcbAE3cxC',
                  job_run_id: 'cp5p5ilq47pqg38v2nfg',
                  task_run_id: 'cp5p5ilq47pqg38v2ng0',
                  version: '2051/merge',
                },
              },
              traits: {
                address1: 'dallas street',
                address2: 'oppenheimer market',
                city: 'delhi',
                email: 'qwe22@mail.com',
                first_name: 'Testqwe0022',
                last_name: 'user',
                country: 'India',
                phone_number: '+919902330123',
                ip: '213.5.6.41',
              },
              type: 'identify',
              userId: '1',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                privateApiKey: 'pk_dummy_123',
                listId: 'list101',
              },
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
                  data: {
                    type: 'profile-bulk-import-job',
                    attributes: {
                      profiles: {
                        data: [
                          {
                            type: 'profile',
                            attributes: {
                              email: 'qwe22@mail.com',
                              first_name: 'Testqwe0022',
                              last_name: 'user',
                              phone_number: '+919902330123',
                              location: {
                                address1: 'dallas street',
                                address2: 'oppenheimer market',
                                city: 'delhi',
                                country: 'India',
                                ip: '213.5.6.41',
                              },
                              anonymous_id: 'user1',
                            },
                          },
                        ],
                      },
                    },
                    relationships: {
                      lists: {
                        data: [
                          {
                            type: 'list',
                            id: 'list101',
                          },
                        ],
                      },
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
    name: 'klaviyo_bulk_upload',
    description: 'Successful identify event without location data',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'user1',
                    identifierType: 'userId',
                    type: 'KLAVIYO_BULK_UPLOAD-userProfiles',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  job_id: '2gif2bMzsX1Nt0rbV1vcbAE3cxC',
                  job_run_id: 'cp5p5ilq47pqg38v2nfg',
                  task_run_id: 'cp5p5ilq47pqg38v2ng0',
                  version: '2051/merge',
                },
              },
              traits: {
                email: 'qwe22@mail.com',
                first_name: 'Testqwe0022',
                last_name: 'user',
                phone_number: '+919902330123',
                ip: '213.5.6.41',
              },
              type: 'identify',
              userId: '1',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                privateApiKey: 'pk_dummy_123',
                listId: 'list101',
              },
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
                  data: {
                    type: 'profile-bulk-import-job',
                    attributes: {
                      profiles: {
                        data: [
                          {
                            type: 'profile',
                            attributes: {
                              email: 'qwe22@mail.com',
                              first_name: 'Testqwe0022',
                              last_name: 'user',
                              phone_number: '+919902330123',
                              location: {
                                ip: '213.5.6.41',
                              },
                              anonymous_id: 'user1',
                            },
                          },
                        ],
                      },
                    },
                    relationships: {
                      lists: {
                        data: [
                          {
                            type: 'list',
                            id: 'list101',
                          },
                        ],
                      },
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
    name: 'klaviyo_bulk_upload',
    description: 'Successful identify event without listId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'user1',
                    identifierType: 'userId',
                    type: 'KLAVIYO_BULK_UPLOAD-userProfiles',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  job_id: '2gif2bMzsX1Nt0rbV1vcbAE3cxC',
                  job_run_id: 'cp5p5ilq47pqg38v2nfg',
                  task_run_id: 'cp5p5ilq47pqg38v2ng0',
                  version: '2051/merge',
                },
              },
              traits: {
                email: 'qwe22@mail.com',
                first_name: 'Testqwe0022',
                last_name: 'user',
                phone_number: '+919902330123',
                ip: '213.5.6.41',
              },
              type: 'identify',
              userId: '1',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                privateApiKey: 'pk_dummy_123',
              },
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
                  data: {
                    type: 'profile-bulk-import-job',
                    attributes: {
                      profiles: {
                        data: [
                          {
                            type: 'profile',
                            attributes: {
                              email: 'qwe22@mail.com',
                              first_name: 'Testqwe0022',
                              last_name: 'user',
                              phone_number: '+919902330123',
                              location: {
                                ip: '213.5.6.41',
                              },
                              anonymous_id: 'user1',
                            },
                          },
                        ],
                      },
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
    name: 'klaviyo_bulk_upload',
    description: 'Failed identify event with missing Private Api Key',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'user1',
                    identifierType: 'userId',
                    type: 'KLAVIYO_BULK_UPLOAD-userProfiles',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  job_id: '2gif2bMzsX1Nt0rbV1vcbAE3cxC',
                  job_run_id: 'cp5p5ilq47pqg38v2nfg',
                  task_run_id: 'cp5p5ilq47pqg38v2ng0',
                  version: '2051/merge',
                },
              },
              traits: {
                email: 'qwe22@mail.com',
                first_name: 'Testqwe0022',
                last_name: 'user',
                phone_number: '+919902330123',
                ip: '213.5.6.41',
              },
              type: 'identify',
              userId: '1',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                privateApiKey: '',
                listId: 'list101',
              },
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
      metadata: {
        jobId: 1,
      },
      statusCode: 400,
      error:
        'Private Api Key is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Private Api Key is not present. Aborting',
      statTags: {
        errorCategory: 'dataValidation',
        errorType: 'configuration',
        implementation: 'cdkV2',
        destType: 'KLAVIYO_BULK_UPLOAD',
        module: 'destination',
        feature: 'processor',
      },
    },
  },
  {
    name: 'klaviyo_bulk_upload',
    description: 'Failed event with invalid event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'user1',
                    identifierType: 'userId',
                    type: 'KLAVIYO_BULK_UPLOAD-userProfiles',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  job_id: '2gif2bMzsX1Nt0rbV1vcbAE3cxC',
                  job_run_id: 'cp5p5ilq47pqg38v2nfg',
                  task_run_id: 'cp5p5ilq47pqg38v2ng0',
                  version: '2051/merge',
                },
              },
              traits: {
                email: 'qwe22@mail.com',
                first_name: 'Testqwe0022',
                last_name: 'user',
                phone_number: '+919902330123',
                ip: '213.5.6.41',
              },
              type: 'identify',
              userId: '1',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                privateApiKey: 'pk_dummy_123',
                listId: 'list101',
              },
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
      metadata: {
        jobId: 1,
      },
      statusCode: 400,
      error:
        'message type track is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type track is not supported',
      statTags: {
        errorCategory: 'dataValidation',
        errorType: 'instrumentation',
        implementation: 'cdkV2',
        destType: 'KLAVIYO_BULK_UPLOAD',
        module: 'destination',
        feature: 'processor',
      },
    },
  },
];
