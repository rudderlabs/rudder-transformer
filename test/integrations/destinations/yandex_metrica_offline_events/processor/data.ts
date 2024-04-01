export const data = [
  {
    name: 'yandex_metrica_offline_events',
    description: 'Successful identify event with YCLID identifier type',
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
                Price: '100',
                Target: 'GOAL1',
                Currency: 'RUB',
                DateTime: '1481718166',
              },
              userId: '',
              channel: 'sources',
              context: {
                sources: {
                  job_id: '2du7rQyxlbIJl4LKgZAaaErEjcE',
                  version: '1849/merge',
                  job_run_id: 'cnsn3tt5fleigsfclr6g',
                  task_run_id: 'cnsn3tt5fleigsfclr70',
                },
                externalId: [
                  {
                    id: '133591247640966458',
                    type: 'YANDEX_METRICA_OFFLINE_EVENTS-conversions',
                    identifierType: 'YCLID',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '14a58046-23a5-46bd-afbf-87c8acaa9d2e',
              messageId: '91ef85d9-b170-440c-bae2-6284d4070338',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                counterId: '574342423',
                goalId: '23432565',
                rudderAccountId: '2du7fLeK82nk9L2Xd1X507uiD1B',
                authStatus: 'active',
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
                  Currency: 'RUB',
                  DateTime: '1481718166',
                  Price: '100',
                  Target: 'GOAL1',
                  Yclid: '133591247640966458',
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
    name: 'yandex_metrica_offline_events',
    description: 'Successful identify event with ClientId identifier type',
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
                Price: '100',
                Target: 'GOAL1',
                Currency: 'RUB',
                DateTime: '1481718166',
              },
              userId: '',
              channel: 'sources',
              context: {
                sources: {
                  job_id: '2du7rQyxlbIJl4LKgZAaaErEjcE',
                  version: '1849/merge',
                  job_run_id: 'cnsn3tt5fleigsfclr6g',
                  task_run_id: 'cnsn3tt5fleigsfclr70',
                },
                externalId: [
                  {
                    id: '133591247640966458',
                    type: 'YANDEX_METRICA_OFFLINE_EVENTS-conversions',
                    identifierType: 'ClientId',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '14a58046-23a5-46bd-afbf-87c8acaa9d2e',
              messageId: '91ef85d9-b170-440c-bae2-6284d4070338',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                counterId: '574342423',
                goalId: '23432565',
                rudderAccountId: '2du7fLeK82nk9L2Xd1X507uiD1B',
                authStatus: 'active',
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
                  Currency: 'RUB',
                  DateTime: '1481718166',
                  Price: '100',
                  Target: 'GOAL1',
                  ClientId: '133591247640966458',
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
    name: 'yandex_metrica_offline_events',
    description: 'Successful identify event with UserId identifier type',
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
                Price: '100',
                Target: 'GOAL1',
                Currency: 'RUB',
                DateTime: '1481718166',
              },
              userId: '',
              channel: 'sources',
              context: {
                sources: {
                  job_id: '2du7rQyxlbIJl4LKgZAaaErEjcE',
                  version: '1849/merge',
                  job_run_id: 'cnsn3tt5fleigsfclr6g',
                  task_run_id: 'cnsn3tt5fleigsfclr70',
                },
                externalId: [
                  {
                    id: '133591247640966458',
                    type: 'YANDEX_METRICA_OFFLINE_EVENTS-conversions',
                    identifierType: 'UserId',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '14a58046-23a5-46bd-afbf-87c8acaa9d2e',
              messageId: '91ef85d9-b170-440c-bae2-6284d4070338',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                counterId: '574342423',
                goalId: '23432565',
                rudderAccountId: '2du7fLeK82nk9L2Xd1X507uiD1B',
                authStatus: 'active',
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
                  Currency: 'RUB',
                  DateTime: '1481718166',
                  Price: '100',
                  Target: 'GOAL1',
                  UserId: '133591247640966458',
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
