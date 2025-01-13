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
              jobId: 1,
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
                              jobIdentifier: 'user1:1',
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
              jobId: 1,
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
              jobId: 1,
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
                              jobIdentifier: 'user1:1',
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
              jobId: 1,
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
              jobId: 1,
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
                              jobIdentifier: 'user1:1',
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
              jobId: 1,
            },
          },
        ],
      },
    },
  },
  {
    name: 'klaviyo_bulk_upload',
    description: 'Successful identify event with custom properties',
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
                last_visit_date: '2020-10-01T00:00:00Z',
                lastVisitService: ['Brazilian'],
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
              jobId: 1,
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
                              jobIdentifier: 'user1:1',
                              properties: {
                                lastVisitService: ['Brazilian'],
                                last_visit_date: '2020-10-01T00:00:00Z',
                              },
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
              jobId: 1,
            },
          },
        ],
      },
    },
  },
];
