export const data = [
  {
    name: 'braze',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                  closed_at: null,
                  orderTotal: 0,
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
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://rest.iad-01.braze.com/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      city: 'Disney',
                      country: 'USA',
                      firstname: 'Mickey',
                      closed_at: null,
                      orderTotal: 0,
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 1: ERROR - No attributes found to update the user profile',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: 'mickeyMouse',
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
            error: 'No attributes found to update the user profile',
            statTags: {
              destType: 'BRAZE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
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
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'braze revenue test',
              integrations: {
                All: true,
              },
              messageId: 'a6a0ad5a-bd26-4f19-8f75-38484e580fc7',
              originalTimestamp: '2020-01-24T06:29:02.364Z',
              properties: {
                currency: 'USD',
                revenue: 50,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53710',
              sentAt: '2020-01-24T06:29:02.364Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'track',
              userId: 'mickeyMouse',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  events: [
                    {
                      name: 'braze revenue test',
                      time: '2020-01-24T11:59:02.403+05:30',
                      properties: {
                        revenue: 50,
                      },
                      external_id: 'mickeyMouse',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'mickeyMouse',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
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
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  email: 'mickey@disney.com',
                  closed_at: null,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'braze revenue test',
              integrations: {
                All: true,
              },
              messageId: 'a6a0ad5a-bd26-4f19-8f75-38484e580fc7',
              originalTimestamp: '2020-01-24T06:29:02.364Z',
              properties: {
                currency: 'USD',
                revenue: 50,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53710',
              sentAt: '2020-01-24T06:29:02.364Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'track',
              userId: 'mickeyMouse',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      closed_at: null,
                      external_id: 'mickeyMouse',
                    },
                  ],
                  events: [
                    {
                      name: 'braze revenue test',
                      time: '2020-01-24T11:59:02.403+05:30',
                      properties: {
                        revenue: 50,
                      },
                      external_id: 'mickeyMouse',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'mickeyMouse',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
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
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'eu-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'page',
              userId: '',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  events: [
                    {
                      name: 'Page Viewed',
                      time: '2020-01-24T11:59:02.402+05:30',
                      properties: {
                        path: '/tests/html/index2.html',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'http://localhost/tests/html/index2.html',
                      },
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
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
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
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
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://rest.iad-01.braze.com/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      city: 'Disney',
                      country: 'USA',
                      email: 'mickey@disney.com',
                      firstname: 'Mickey',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                enableNestedArrayOperations: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  gender: 'woman',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'braze revenue test',
              integrations: {
                All: true,
              },
              messageId: 'a6a0ad5a-bd26-4f19-8f75-38484e580fc7',
              originalTimestamp: '2020-01-24T06:29:02.364Z',
              properties: {
                currency: 'USD',
                revenue: 50,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53710',
              sentAt: '2020-01-24T06:29:02.364Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'track',
              userId: '',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      first_name: 'Mickey',
                      gender: 'F',
                      city: 'Disney',
                      country: 'USA',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  events: [
                    {
                      name: 'braze revenue test',
                      time: '2020-01-24T11:59:02.403+05:30',
                      properties: {
                        revenue: 50,
                      },
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: {
                All: true,
              },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 3,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                revenue: 25,
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      city: 'Disney',
                      country: 'USA',
                      firstname: 'Mickey',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  events: [
                    {
                      name: 'KM Order Completed',
                      time: '2020-01-24T11:59:02.402+05:30',
                      properties: {
                        affiliation: 'Google Store',
                        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                        coupon: 'hasbros',
                        discount: 2.5,
                        order_id: '50314b8e9bcf000000000000',
                        products: [
                          {
                            category: 'Games',
                            image_url: 'https:///www.example.com/product/path.jpg',
                            name: 'Monopoly: 3rd Edition',
                            price: 19,
                            product_id: '507f1f77bcf86cd799439011',
                            quantity: 1,
                            sku: '45790-32',
                            url: 'https://www.example.com/product/path',
                          },
                          {
                            category: 'Games',
                            name: 'Uno Card Game',
                            price: 3,
                            product_id: '505bd76785ebb509fc183733',
                            quantity: 2,
                            sku: '46493-32',
                          },
                        ],
                        revenue: 25,
                        shipping: 3,
                        subtotal: 22.5,
                        tax: 2,
                        total: 27.5,
                      },
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-09-14T12:09:37.491Z',
              userId: 'Randomuser2222',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.3',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'file:///Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  path: '/Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  title: 'Fullstory Test',
                  search: '',
                  referrer: '',
                },
                locale: 'en-GB',
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'manashi@gmaiol.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.3',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
              },
              messageId: '24ecc509-ce3e-473c-8483-ba1ea2c195cb',
              properties: {
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    key1: {
                      key11: 'value1',
                      key22: 'value2',
                    },
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    currency78: 'USD',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price23: 3,
                    category: 'Games',
                    quantity: 2,
                    currency78: 'USD',
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
              },
              anonymousId: 'c6ff1462-b692-43d6-8f6a-659efedc99ea',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-14T12:09:37.491Z',
            },
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
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
            error:
              'Invalid Order Completed event: Message properties and product at index: 0 is missing currency',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BRAZE',
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
    name: 'braze',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              event: 'Order Completed',
              sentAt: '2020-09-14T12:09:37.491Z',
              userId: 'Randomuser2222',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.3',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'file:///Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  path: '/Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  title: 'Fullstory Test',
                  search: '',
                  referrer: '',
                },
                locale: 'en-GB',
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'manashi@gmaiol.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.3',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
              },
              messageId: '24ecc509-ce3e-473c-8483-ba1ea2c195cb',
              traits: {
                groupId: '1234',
              },
              anonymousId: 'c6ff1462-b692-43d6-8f6a-659efedc99ea',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-14T12:09:37.491Z',
            },
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      ab_rudder_group_1234: true,
                      external_id: 'Randomuser2222',
                    },
                  ],
                  partner: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'Randomuser2222',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    identifierType: 'external_id',
                    id: 'mickey@disney.com',
                  },
                ],
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
                  home_city: 'Disney',
                  country: 'USA',
                  first_name: 'Mickey',
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
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://rest.iad-01.braze.com/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      home_city: 'Disney',
                      country: 'USA',
                      external_id: 'mickey@disney.com',
                      first_name: 'Mickey',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: 'mickey@disney.com',
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'Order Completed',
              integrations: {
                All: true,
              },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 0,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 0,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                revenue: 25,
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      city: 'Disney',
                      country: 'USA',
                      firstname: 'Mickey',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  purchases: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      price: 0,
                      currency: 'USD',
                      quantity: 1,
                      time: '2020-01-24T11:59:02.402+05:30',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                    {
                      product_id: '505bd76785ebb509fc183733',
                      price: 0,
                      currency: 'USD',
                      quantity: 2,
                      time: '2020-01-24T11:59:02.402+05:30',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  partner: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'Order Completed',
              integrations: {
                All: true,
              },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 0,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 10,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                revenue: 25,
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      city: 'Disney',
                      country: 'USA',
                      firstname: 'Mickey',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  purchases: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      price: 0,
                      currency: 'USD',
                      quantity: 1,
                      time: '2020-01-24T11:59:02.402+05:30',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                    {
                      product_id: '505bd76785ebb509fc183733',
                      price: 10,
                      currency: 'USD',
                      quantity: 2,
                      time: '2020-01-24T11:59:02.402+05:30',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  partner: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                enableNestedArrayOperations: true,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  cars2: {
                    update: [
                      {
                        age: 30,
                        id: 2,
                        identifier: 'id',
                        name: 'abcd',
                      },
                      {
                        age: 27,
                        id: 1,
                        identifier: 'id',
                        name: 'abcd',
                      },
                    ],
                  },
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  gender: 'woman',
                  pets: {
                    add: [
                      {
                        age: 27,
                        id: 1,
                        name: 'abc',
                      },
                    ],
                    remove: [
                      {
                        id: 3,
                        identifier: 'id',
                      },
                      {
                        id: 4,
                        identifier: 'id',
                      },
                    ],
                    update: [
                      {
                        age: 27,
                        id: 2,
                        identifier: 'id',
                        name: 'abc',
                      },
                    ],
                  },
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'braze revenue test',
              integrations: {
                All: true,
              },
              messageId: '89140820-c187-4e62-9599-3c633771ee58',
              originalTimestamp: '2023-03-14T02:06:26.501+05:30',
              properties: {
                currency: 'USD',
                mergeObjectsUpdateOperation: false,
                revenue: 50,
              },
              receivedAt: '2023-03-14T02:06:22.433+05:30',
              request_ip: '[::1]',
              rudderId: '2686e376-7e08-42f7-8edc-ff67eb238a91',
              sentAt: '2023-03-14T02:06:26.501+05:30',
              timestamp: '2023-03-14T02:06:22.432+05:30',
              type: 'track',
              userId: 'finalUserTestCA',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      first_name: 'Mickey',
                      gender: 'F',
                      cars2: {
                        $update: [
                          {
                            $identifier_key: 'id',
                            $identifier_value: 2,
                            $new_object: {
                              age: 30,
                              name: 'abcd',
                            },
                          },
                          {
                            $identifier_key: 'id',
                            $identifier_value: 1,
                            $new_object: {
                              age: 27,
                              name: 'abcd',
                            },
                          },
                        ],
                      },
                      city: 'Disney',
                      country: 'USA',
                      pets: {
                        $update: [
                          {
                            $identifier_key: 'id',
                            $identifier_value: 2,
                            $new_object: {
                              age: 27,
                              name: 'abc',
                            },
                          },
                        ],
                        $remove: [
                          {
                            $identifier_key: 'id',
                            $identifier_value: 3,
                          },
                          {
                            $identifier_key: 'id',
                            $identifier_value: 4,
                          },
                        ],
                        $add: [
                          {
                            age: 27,
                            id: 1,
                            name: 'abc',
                          },
                        ],
                      },
                      _merge_objects: false,
                      external_id: 'finalUserTestCA',
                    },
                  ],
                  events: [
                    {
                      name: 'braze revenue test',
                      time: '2023-03-14T02:06:22.432+05:30',
                      properties: {
                        mergeObjectsUpdateOperation: false,
                        revenue: 50,
                      },
                      external_id: 'finalUserTestCA',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'finalUserTestCA',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                enableNestedArrayOperations: true,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  cars: {
                    add: [
                      {
                        age: 27,
                        id: 1,
                        name: 'abc',
                      },
                    ],
                    update: [
                      {
                        age: 30,
                        id: 2,
                        identifier: 'id',
                        name: 'abcd',
                      },
                      {
                        age: 27,
                        id: 1,
                        identifier: 'id',
                        name: 'abcd',
                      },
                    ],
                  },
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  gender: 'woman',
                  pets: [
                    {
                      breed: 'beagle',
                      id: 1,
                      name: 'Gus',
                      type: 'dog',
                    },
                    {
                      breed: 'calico',
                      id: 2,
                      name: 'Gerald',
                      type: 'cat',
                    },
                  ],
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'braze revenue test',
              integrations: {
                All: true,
              },
              messageId: 'd1e049af-913c-46ee-8f5c-5b26966e896f',
              originalTimestamp: '2023-03-14T02:13:10.758+05:30',
              properties: {
                currency: 'USD',
                mergeObjectsUpdateOperation: false,
                revenue: 50,
              },
              receivedAt: '2023-03-14T02:13:10.519+05:30',
              request_ip: '[::1]',
              rudderId: '2686e376-7e08-42f7-8edc-ff67eb238a91',
              sentAt: '2023-03-14T02:13:10.758+05:30',
              timestamp: '2023-03-14T02:13:10.518+05:30',
              type: 'track',
              userId: 'finalUserTestCA',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      first_name: 'Mickey',
                      gender: 'F',
                      cars: {
                        $update: [
                          {
                            $identifier_key: 'id',
                            $identifier_value: 2,
                            $new_object: {
                              age: 30,
                              name: 'abcd',
                            },
                          },
                          {
                            $identifier_key: 'id',
                            $identifier_value: 1,
                            $new_object: {
                              age: 27,
                              name: 'abcd',
                            },
                          },
                        ],
                        $add: [
                          {
                            age: 27,
                            id: 1,
                            name: 'abc',
                          },
                        ],
                      },
                      city: 'Disney',
                      country: 'USA',
                      pets: [
                        {
                          breed: 'beagle',
                          id: 1,
                          name: 'Gus',
                          type: 'dog',
                        },
                        {
                          breed: 'calico',
                          id: 2,
                          name: 'Gerald',
                          type: 'cat',
                        },
                      ],
                      _merge_objects: false,
                      external_id: 'finalUserTestCA',
                    },
                  ],
                  events: [
                    {
                      name: 'braze revenue test',
                      time: '2023-03-14T02:13:10.518+05:30',
                      properties: {
                        mergeObjectsUpdateOperation: false,
                        revenue: 50,
                      },
                      external_id: 'finalUserTestCA',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'finalUserTestCA',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  address: {
                    city: 'Mathura',
                    country: 'India',
                  },
                  email: 'a@gmail.com',
                  phone: '9988123321',
                  firstName: 'anuj',
                  lastName: 'kumar',
                  gender: 'male',
                  birthday: '01/01/1971',
                  avatar: 'https://i.kym-cdn.com/entries/icons/mobile/000/034/772/anuj-1.jpg',
                  bio: 'Tech and tension go together',
                  language: 'en-IN',
                  job: 'Director',
                  company: 'Plinth India',
                },
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              request_ip: '[::1]:53709',
              type: 'identify',
              userId: 'ank101',
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
              endpoint: 'https://rest.iad-01.braze.com/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      country: 'India',
                      dob: '01/01/1971',
                      email: 'a@gmail.com',
                      first_name: 'anuj',
                      gender: 'M',
                      home_city: 'Mathura',
                      image_url:
                        'https://i.kym-cdn.com/entries/icons/mobile/000/034/772/anuj-1.jpg',
                      last_name: 'kumar',
                      phone: '9988123321',
                      bio: 'Tech and tension go together',
                      language: 'en-IN',
                      job: 'Director',
                      company: 'Plinth India',
                      external_id: 'ank101',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'ank101',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  address: {
                    city: 'Mathura',
                    country: 'India',
                  },
                  email: 'a@gmail.com',
                  phone: '9988123321',
                  firstName: 'anuj',
                  lastName: 'kumar',
                  gender: null,
                  birthday: '01/01/1971',
                  avatar: 'https://i.kym-cdn.com/entries/icons/mobile/000/034/772/anuj-1.jpg',
                  bio: 'Tech and tension go together',
                  language: 'en-IN',
                  job: 'Director',
                  company: null,
                },
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              request_ip: '[::1]:53709',
              type: 'identify',
              userId: 'ank101',
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
              endpoint: 'https://rest.iad-01.braze.com/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      country: 'India',
                      dob: '01/01/1971',
                      email: 'a@gmail.com',
                      first_name: 'anuj',
                      gender: null,
                      home_city: 'Mathura',
                      image_url:
                        'https://i.kym-cdn.com/entries/icons/mobile/000/034/772/anuj-1.jpg',
                      last_name: 'kumar',
                      phone: '9988123321',
                      bio: 'Tech and tension go together',
                      language: 'en-IN',
                      job: 'Director',
                      company: null,
                      external_id: 'ank101',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'ank101',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'US-03',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            message: {
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              request_ip: '[::1]:53709',
              type: 'alias',
              previousId: 'userId',
              userId: 'userMergeTest2',
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
              endpoint: 'https://rest.iad-03.braze.com/users/merge',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  merge_updates: [
                    {
                      identifier_to_merge: {
                        external_id: 'userId',
                      },
                      identifier_to_keep: {
                        external_id: 'userMergeTest2',
                      },
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'userMergeTest2',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 18: ERROR - previousId is required for alias call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'US-03',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            message: {
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              request_ip: '[::1]:53709',
              type: 'alias',
              userId: 'userMergeTest2',
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
            error: '[BRAZE]: previousId is required for alias call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BRAZE',
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
    name: 'braze',
    description: 'Test 19: ERROR - userId is required for alias call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'US-03',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            message: {
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              request_ip: '[::1]:53709',
              type: 'alias',
              previousId: 'userMergeTest2',
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
            error: '[BRAZE]: userId is required for alias call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'BRAZE',
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
    name: 'braze',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            metadata: {
              sourceType: 'metadata.sourceType',
              destinationType: 'metadata.destinationType',
              k8_namespace: 'metadata.namespace',
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'A@HOTMAIL.COM',
                  phone: '9988123321',
                  firstName: 'anil',
                  lastName: 'kumar',
                  gender: null,
                  birthday: '01/01/1971',
                  avatar: 'https://i.kym-cdn.com/entries/icons/mobile/000/034/772/anuj-1.jpg',
                  bio: 'Tech and tension go together',
                  language: 'en-IN',
                  job: 'Director',
                  company: null,
                },
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              request_ip: '[::1]:53709',
              type: 'identify',
              userId: 'ank101',
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
              endpoint: 'https://rest.iad-01.braze.com/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      dob: '01/01/1971',
                      email: 'a@hotmail.com',
                      first_name: 'anil',
                      gender: null,
                      image_url:
                        'https://i.kym-cdn.com/entries/icons/mobile/000/034/772/anuj-1.jpg',
                      last_name: 'kumar',
                      phone: '9988123321',
                      bio: 'Tech and tension go together',
                      language: 'en-IN',
                      job: 'Director',
                      company: null,
                      external_id: 'ank101',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'ank101',
            },
            metadata: {
              sourceType: 'metadata.sourceType',
              destinationType: 'metadata.destinationType',
              k8_namespace: 'metadata.namespace',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            metadata: {
              sourceType: 'metadata.sourceType',
              destinationType: 'metadata.destinationType',
              k8_namespace: 'metadata.namespace',
            },
            message: {
              anonymousId: 'e6ab2c5e-1cda-34a9-g962-r2f62df18abc',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'Order Completed',
              integrations: {
                All: true,
              },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 0,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                ],
                revenue: 25,
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
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
              endpoint: 'https://rest.iad-01.braze.com/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      city: 'Disney',
                      country: 'USA',
                      firstname: 'Mickey',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-1cda-34a9-g962-r2f62df18abc',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  purchases: [
                    {
                      product_id: '507f1f77bcf86cd799439011',
                      price: 0,
                      currency: 'USD',
                      quantity: 1,
                      time: '2020-01-24T11:59:02.402+05:30',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-1cda-34a9-g962-r2f62df18abc',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  partner: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-1cda-34a9-g962-r2f62df18abc',
            },
            metadata: {
              sourceType: 'metadata.sourceType',
              destinationType: 'metadata.destinationType',
              k8_namespace: 'metadata.namespace',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              event: 'Order Completed',
              sentAt: '2020-09-14T12:09:37.491Z',
              userId: 'Randomuser2222',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.3',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'file:///Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  path: '/Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  title: 'Fullstory Test',
                  search: '',
                  referrer: '',
                },
                locale: 'en-GB',
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'manashi@gmaiol.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.3',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
              },
              messageId: '24ecc509-ce3e-473c-8483-ba1ea2c195cb',
              groupId: '1234',
              traits: {
                phone: '5055077683',
                subscriptionState: 'subscribed',
              },
              anonymousId: 'c6ff1462-b692-43d6-8f6a-659efedc99ea',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-14T12:09:37.491Z',
            },
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                enableSubscriptionGroupInGroupCall: true,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
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
              endpoint: 'https://rest.fra-01.braze.eu/v2/subscription/status/set',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  subscription_groups: [
                    {
                      subscription_group_id: '1234',
                      subscription_state: 'subscribed',
                      external_id: ['Randomuser2222'],
                      phones: ['5055077683'],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              event: 'Order Completed',
              sentAt: '2020-09-14T12:09:37.491Z',
              userId: 'Randomuser2222',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.3',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'file:///Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  path: '/Users/manashi/Desktop/rudder-all-sdk-application-testing/Fullstory%20test%20By%20JS%20SDK/braze.html',
                  title: 'Fullstory Test',
                  search: '',
                  referrer: '',
                },
                locale: 'en-GB',
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'manashi@gmaiol.com',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.3',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
              },
              messageId: '24ecc509-ce3e-473c-8483-ba1ea2c195cb',
              groupId: '1234',
              traits: {
                email: 'abc@test.com',
                subscriptionState: 'unsubscribed',
              },
              anonymousId: 'c6ff1462-b692-43d6-8f6a-659efedc99ea',
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-09-14T12:09:37.491Z',
            },
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                enableSubscriptionGroupInGroupCall: true,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
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
              endpoint: 'https://rest.fra-01.braze.eu/v2/subscription/status/set',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  subscription_groups: [
                    {
                      subscription_group_id: '1234',
                      subscription_state: 'unsubscribed',
                      external_id: ['Randomuser2222'],
                      emails: ['abc@test.com'],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 24',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            metadata: {
              sourceType: '',
              destinationType: '',
              namespace: '',
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
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'braze revenue test',
              integrations: {
                All: true,
                braze: {
                  appId: '123',
                },
              },
              messageId: 'a6a0ad5a-bd26-4f19-8f75-38484e580fc7',
              originalTimestamp: '2020-01-24T06:29:02.364Z',
              properties: {
                currency: 'USD',
                revenue: 50,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53710',
              sentAt: '2020-01-24T06:29:02.364Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'track',
              userId: 'mickeyMouse',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  partner: 'RudderStack',
                  events: [
                    {
                      name: 'braze revenue test',
                      time: '2020-01-24T11:59:02.403+05:30',
                      properties: {
                        revenue: 50,
                      },
                      external_id: 'mickeyMouse',
                      app_id: '123',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'mickeyMouse',
            },
            metadata: {
              sourceType: '',
              destinationType: '',
              namespace: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                sendPurchaseEventWithExtraProperties: true,
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
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
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'Order Completed',
              integrations: {
                All: true,
              },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 0,
                    product_id: '507f1f77bcf86cd799439023',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 0,
                    product_id: '505bd76785ebb509fc183724',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                revenue: 25,
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
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
              endpoint: 'https://rest.fra-01.braze.eu/users/track',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      email: 'mickey@disney.com',
                      city: 'Disney',
                      country: 'USA',
                      firstname: 'Mickey',
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  purchases: [
                    {
                      product_id: '507f1f77bcf86cd799439023',
                      price: 0,
                      currency: 'USD',
                      quantity: 1,
                      time: '2020-01-24T11:59:02.402+05:30',
                      properties: {
                        category: 'Games',
                        image_url: 'https:///www.example.com/product/path.jpg',
                        name: 'Monopoly: 3rd Edition',
                        url: 'https://www.example.com/product/path',
                      },
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                    {
                      product_id: '505bd76785ebb509fc183724',
                      price: 0,
                      currency: 'USD',
                      quantity: 2,
                      time: '2020-01-24T11:59:02.402+05:30',
                      properties: {
                        category: 'Games',
                        name: 'Uno Card Game',
                      },
                      _update_existing_only: false,
                      user_alias: {
                        alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
                        alias_label: 'rudder_id',
                      },
                    },
                  ],
                  partner: 'RudderStack',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 25: ERROR - Invalid email, email must be a valid string',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                restApiKey: 'dummyApiKey',
                prefixProperties: true,
                useNativeSDK: false,
                dataCenter: 'us-01',
              },
              DestinationDefinition: {
                DisplayName: 'Braze',
                ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
                Name: 'BRAZE',
              },
              Enabled: true,
              ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
              Name: 'Braze',
              Transformations: [],
            },
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 123,
                  firstname: 'Mickey',
                  closed_at: null,
                  orderTotal: 0,
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
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
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
            error: 'Invalid email, email must be a valid string',
            statTags: {
              destType: 'BRAZE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            "destination": {
              "Config": {
                "restApiKey": "dummyApiKey",
                "prefixProperties": true,
                "useNativeSDK": false,
                "sendPurchaseEventWithExtraProperties": true
              },
              "DestinationDefinition": {
                "DisplayName": "Braze",
                "ID": "1WhbSZ6uA3H5ChVifHpfL2H6sie",
                "Name": "BRAZE"
              },
              "Enabled": true,
              "ID": "1WhcOCGgj9asZu850HvugU2C3Aq",
              "Name": "Braze",
              "Transformations": []
            },
            "message": {
              "anonymousId": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
              "channel": "web",
              "context": {
                "traits": {
                  "city": "Disney",
                  "country": "USA",
                  "email": null,
                  "firstname": "Mickey"
                },
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
              },
              "event": "Order Completed",
              "integrations": {
                "All": true
              },
              "messageId": "aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a",
              "originalTimestamp": "2020-01-24T06:29:02.367Z",
              "properties": {
                "affiliation": "Google Store",
                "checkout_id": "fksdjfsdjfisjf9sdfjsd9f",
                "coupon": "hasbros",
                "currency": "USD",
                "discount": 2.5,
                "order_id": "50314b8e9bcf000000000000",
                "products": [
                  {
                    "category": "Games",
                    "image_url": "https:///www.example.com/product/path.jpg",
                    "name": "Monopoly: 3rd Edition",
                    "price": 0,
                    "product_id": "507f1f77bcf86cd799439023",
                    "quantity": 1,
                    "sku": "45790-32",
                    "url": "https://www.example.com/product/path"
                  },
                  {
                    "category": "Games",
                    "name": "Uno Card Game",
                    "price": 0,
                    "product_id": "505bd76785ebb509fc183724",
                    "quantity": 2,
                    "sku": "46493-32"
                  }
                ],
                "revenue": 25,
                "shipping": 3,
                "subtotal": 22.5,
                "tax": 2,
                "total": 27.5
              },
              "receivedAt": "2020-01-24T11:59:02.403+05:30",
              "request_ip": "[::1]:53712",
              "sentAt": "2020-01-24T06:29:02.368Z",
              "timestamp": "2020-01-24T11:59:02.402+05:30",
              "type": "track",
              "userId": ""
            }
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [{
          output: {
            "body": {
              "FORM": {},
              "JSON": {
                "attributes": [
                  {
                    "_update_existing_only": false,
                    "city": "Disney",
                    "country": "USA",
                    "email": null,
                    "firstname": "Mickey",
                    "user_alias": {
                      "alias_label": "rudder_id",
                      "alias_name": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca"
                    }
                  }
                ],
                "partner": "RudderStack",
                "purchases": [
                  {
                    "_update_existing_only": false,
                    "currency": "USD",
                    "price": 0,
                    "product_id": "507f1f77bcf86cd799439023",
                    "properties": {
                      "category": "Games",
                      "image_url": "https:///www.example.com/product/path.jpg",
                      "name": "Monopoly: 3rd Edition",
                      "url": "https://www.example.com/product/path"
                    },
                    "quantity": 1,
                    "time": "2020-01-24T11:59:02.402+05:30",
                    "user_alias": {
                      "alias_label": "rudder_id",
                      "alias_name": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca"
                    }
                  },
                  {
                    "_update_existing_only": false,
                    "currency": "USD",
                    "price": 0,
                    "product_id": "505bd76785ebb509fc183724",
                    "properties": {
                      "category": "Games",
                      "name": "Uno Card Game"
                    },
                    "quantity": 2,
                    "time": "2020-01-24T11:59:02.402+05:30",
                    "user_alias": {
                      "alias_label": "rudder_id",
                      "alias_name": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca"
                    }
                  }
                ]
              },
              "JSON_ARRAY": {},
              "XML": {}
            },
            "endpoint": "https://rest.fra-01.braze.eu/users/track",
            "files": {},
            "headers": {
              "Accept": "application/json",
              "Authorization": "Bearer dummyApiKey",
              "Content-Type": "application/json"
            },
            "method": "POST",
            "params": {},
            "type": "REST",
            "userId": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            "version": "1"
          },
          statusCode: 200,
        },
        ],
      },
    },
  }
];
