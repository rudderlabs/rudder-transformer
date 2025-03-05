import { RedisTc, SupportedEventTypes, TraitsLocation } from '../types';

const getRedisTestCase = (tc: RedisTc) => {
  const context = {
    app: {
      build: '1.0.0',
      name: 'RudderLabs JavaScript SDK',
      namespace: 'com.rudderlabs.javascript',
      version: '1.0.5',
    },
    ip: '0.0.0.0',
    library: {
      name: 'RudderLabs JavaScript SDK',
      version: '1.0.5',
    },
    locale: 'en-GB',
    os: {
      name: '',
      version: '',
    },
    screen: {
      density: 2,
    },
    traits: {},
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
  };
  return {
    name: 'redis',
    description: tc.description,
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              workspaceId: tc.workspaceId || 'wspId',
            },
            destination: {
              Config: {
                address: 'localhost:6379',
                database: 'test',
                prefix: ' ',
                ...tc.destinationConfig,
              },
              DestinationDefinition: {
                DisplayName: 'Redis',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'REDIS',
              },
              Enabled: true,
              ID: tc.destId || '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Redis',

              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              ...(tc.traitsLocation === TraitsLocation.Traits ? { traits: tc.traits } : {}),
              context: {
                ...context,
                ...(tc.traitsLocation === TraitsLocation.ContextTraits
                  ? { traits: tc.traits }
                  : {}),
                ...(tc.profilesContext ?? {}),
              },
              integrations: {
                All: true,
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: tc.eventType,
              userId: tc.userId || 'myUserId',
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
            metadata: {
              workspaceId: tc.workspaceId || 'wspId',
            },
            output: tc.expectedResponse,
            statusCode: tc.expectedStatusCode,
          },
        ],
      },
    },
  };
};

const jsonTestCases: RedisTc[] = [
  {
    description:
      'Test 6: [Event-stream] when useJSONModule is enabled with traits in context.traits, should transform successfully',
    destinationConfig: {
      useJSONModule: true,
    },
    traitsLocation: TraitsLocation.ContextTraits,
    traits: {
      prop1: 'k',
      prop2: 2,
      prop3: {
        p4: 'a',
      },
    },
    eventType: SupportedEventTypes.Identify,
    userId: 'user-1',
    expectedResponse: {
      message: {
        key: 'user:user-1',
        value: {
          prop1: 'k',
          prop2: 2,
          prop3: {
            p4: 'a',
          },
        },
      },
      userId: 'user-1',
    },
    expectedStatusCode: 200,
  },
  {
    description:
      'Test 7: [Event-stream] when useJSONModule is enabled with traits in traits, should transform successfully',
    destinationConfig: {
      useJSONModule: true,
    },
    traitsLocation: TraitsLocation.Traits,
    traits: {
      prop1: 'k',
      prop2: 2,
      prop3: {
        p4: 'a',
      },
    },
    eventType: SupportedEventTypes.Identify,
    userId: 'user-1',
    expectedResponse: {
      message: {
        key: 'user:user-1',
        value: {
          prop1: 'k',
          prop2: 2,
          prop3: {
            p4: 'a',
          },
        },
      },
      userId: 'user-1',
    },
    expectedStatusCode: 200,
  },
  {
    description:
      'Test 8: [Profiles] when useJSONModule is enabled with traits in traits, should transform successfully',
    destinationConfig: {
      useJSONModule: true,
    },
    destId: 'd1',
    workspaceId: 'w1',
    traitsLocation: TraitsLocation.Traits,
    traits: {
      field: 'k',
      model_name: 'analytics_app',
    },
    profilesContext: {
      sources: {
        profiles_entity: 'e1',
        profiles_model: 'model1',
        profiles_id_type: 'id-1',
      },
    },
    eventType: SupportedEventTypes.Identify,
    userId: 'user-2',
    expectedResponse: {
      message: {
        key: 'w1:d1:e1:id-1:user-2',
        path: 'model1',
        value: {
          field: 'k',
          model_name: 'analytics_app',
        },
      },
      userId: 'user-2',
    },
    expectedStatusCode: 200,
  },
];

const jsonTcs = jsonTestCases.map((tc) => getRedisTestCase(tc));

export const data = [
  {
    name: 'redis',
    description:
      'Test 0: Covering flattened json, removing empty values, stringify array, prefix key from the config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                address: 'localhost:6379',
                database: 'test',
                prefix: ' ',
              },
              DestinationDefinition: {
                DisplayName: 'Redis',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'REDIS',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Redis',
              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.5',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  country: 'UK',
                  lastname: 'Mouse',
                  omega: 'test',
                  'omega v2': 'test',
                  '9mega': 'test',
                  'mega&': 'test',
                  ome$ga: 'test',
                  alpha$: 'test',
                  'ome_ ga': 'test',
                  '9mega________-________90': 'test',
                  Cízǔ: 'test',
                  CamelCase123Key: 'test',
                  '1CComega': 'test',
                  arrayProp: [
                    {
                      x: 1,
                      y: 2,
                    },
                  ],
                  nestedProp: {
                    innerProp1: 'innerPropVal1',
                    innerProp2: 'innerPropVal2',
                    innerProp3: {},
                  },
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
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
              message: {
                key: 'user:9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
                fields: {
                  country: 'UK',
                  lastname: 'Mouse',
                  omega: 'test',
                  'omega v2': 'test',
                  '9mega': 'test',
                  'mega&': 'test',
                  ome$ga: 'test',
                  alpha$: 'test',
                  'ome_ ga': 'test',
                  '9mega________-________90': 'test',
                  Cízǔ: 'test',
                  CamelCase123Key: 'test',
                  '1CComega': 'test',
                  arrayProp: JSON.stringify([{ x: 1, y: 2 }]),
                  'nestedProp.innerProp1': 'innerPropVal1',
                  'nestedProp.innerProp2': 'innerPropVal2',
                },
              },
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'redis',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                address: 'localhost:6379',
                database: 'test',
                prefix: 'TestPrefix',
              },
              DestinationDefinition: {
                DisplayName: 'Redis',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'REDIS',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Redis',
              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.5',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  country: 'UK',
                  lastname: 'Mouse',
                  omega: 'test',
                  'omega v2': 'test',
                  '9mega': 'test',
                  'mega&': 'test',
                  ome$ga: 'test',
                  alpha$: 'test',
                  'ome_ ga': 'test',
                  '9mega________-________90': 'test',
                  Cízǔ: 'test',
                  CamelCase123Key: 'test',
                  '1CComega': 'test',
                  arrayProp: [
                    {
                      x: 1,
                      y: 2,
                    },
                  ],
                  nestedProp: {
                    innerProp1: 'innerPropVal1',
                    innerProp2: 'innerPropVal2',
                    innerProp3: {},
                  },
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
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
              message: {
                key: 'TestPrefix:user:9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
                fields: {
                  country: 'UK',
                  lastname: 'Mouse',
                  omega: 'test',
                  'omega v2': 'test',
                  '9mega': 'test',
                  'mega&': 'test',
                  ome$ga: 'test',
                  alpha$: 'test',
                  'ome_ ga': 'test',
                  '9mega________-________90': 'test',
                  Cízǔ: 'test',
                  CamelCase123Key: 'test',
                  '1CComega': 'test',
                  arrayProp: JSON.stringify([{ x: 1, y: 2 }]),
                  'nestedProp.innerProp1': 'innerPropVal1',
                  'nestedProp.innerProp2': 'innerPropVal2',
                },
              },
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'redis',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                address: 'localhost:6379',
                database: 'test',
                prefix: 'TestPrefix',
              },
              DestinationDefinition: {
                DisplayName: 'Redis',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'REDIS',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Redis',
              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.5',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  country: 'UK',
                  lastname: 'Mouse',
                  arrayProp: [
                    {
                      x: 1,
                      y: 2,
                    },
                  ],
                  nestedProp: {
                    innerProp1: 'innerPropVal1',
                    innerProp2: 'innerPropVal2',
                    innerProp3: {},
                  },
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              traits: {
                country: 'USA',
                firstname: 'Mickey',
              },
              integrations: {
                All: true,
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
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
              message: {
                key: 'TestPrefix:user:9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
                fields: {
                  country: 'USA',
                  lastname: 'Mouse',
                  arrayProp: JSON.stringify([{ x: 1, y: 2 }]),
                  'nestedProp.innerProp1': 'innerPropVal1',
                  'nestedProp.innerProp2': 'innerPropVal2',
                  firstname: 'Mickey',
                },
              },
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'redis',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                address: 'localhost:6379',
                database: 'test',
                prefix: 'TestEmptyKey',
              },
              DestinationDefinition: {
                DisplayName: 'Redis',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'REDIS',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Redis',
              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.5',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  country: 'UK',
                  lastname: 'Mouse',
                  arrayProp: [
                    {
                      x: 1,
                      y: 2,
                    },
                  ],
                  emptyKey: '',
                  nestedProp: {
                    innerProp1: 'innerPropVal1',
                    innerProp2: 'innerPropVal2',
                    innerProp3: {},
                  },
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              traits: {
                country: 'USA',
                firstname: 'Mickey',
              },
              integrations: {
                All: true,
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
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
              message: {
                key: 'TestEmptyKey:user:9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
                fields: {
                  country: 'USA',
                  lastname: 'Mouse',
                  arrayProp: JSON.stringify([{ x: 1, y: 2 }]),
                  emptyKey: '',
                  'nestedProp.innerProp1': 'innerPropVal1',
                  'nestedProp.innerProp2': 'innerPropVal2',
                  firstname: 'Mickey',
                },
              },
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'redis',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                address: 'localhost:6379',
                database: 'test',
                prefix: 'TestPrefix',
              },
              DestinationDefinition: {
                DisplayName: 'Redis',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'REDIS',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Redis',
              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.5',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33',
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
            statusCode: 400,
            error: 'context or context.traits or traits is empty',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'REDIS',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'redis',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                address: 'localhost:6379',
                database: 'test',
                prefix: 'TestPrefix',
              },
              DestinationDefinition: {
                DisplayName: 'Redis',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'REDIS',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Redis',
              Transformations: [],
            },
            metadata: {
              workspaceId: 'some-workspace-id',
            },
            message: {
              userId: 'some-user-id',
              channel: 'sources',
              context: {
                sources: {
                  job_id: 'some-job-id',
                  version: 'some-version',
                  job_run_id: 'c8el40l6e87v0c4hkbl0',
                  task_run_id: 'c8el40l6e87v0c4hkblg',
                  profiles_model: 'some-model',
                  profiles_entity: 'some-entity',
                  profiles_id_type: 'some-id-type',
                },
              },
              traits: {
                MODEL_ID: '1691755780',
                VALID_AT: '2023-08-11T11:32:44.963062Z',
                USER_MAIN_ID: 'rid5530313526204a95efe71d98cd17d5a1',
                CHURN_SCORE_7_DAYS: 0.027986,
                PERCENTILE_CHURN_SCORE_7_DAYS: 0,
              },
              messageId: 'some-message-id',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
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
              message: {
                hash: 'some-workspace-id:1WhcOCGgj9asZu850HvugU2C3Aq:some-entity:some-id-type:some-user-id',
                key: 'some-model',
                value: JSON.stringify({
                  MODEL_ID: '1691755780',
                  VALID_AT: '2023-08-11T11:32:44.963062Z',
                  USER_MAIN_ID: 'rid5530313526204a95efe71d98cd17d5a1',
                  CHURN_SCORE_7_DAYS: 0.027986,
                  PERCENTILE_CHURN_SCORE_7_DAYS: 0,
                }),
              },
              userId: 'some-user-id',
            },
            metadata: {
              workspaceId: 'some-workspace-id',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  ...jsonTcs,
];
