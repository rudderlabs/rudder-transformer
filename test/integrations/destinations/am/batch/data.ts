export const data = [
  {
    name: 'am',
    description: 'Test 0: ERROR - Both userId and deviceId cannot be undefined',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          destType: 'am',
          input: [
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '0.0.0.0',
                        time: 1603132665557,
                        os_name: '',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          name: 'some campaign',
                          plan: 'Open source',
                          term: 'keyword',
                          test: 'other value',
                          email: 'test@rudderstack.com',
                          logins: 5,
                          medium: 'medium',
                          source: 'google',
                          content: 'some content',
                          category: 'SampleIdentify',
                          createdAt: 1599264000,
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api.eu.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'EU',
                },
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            batched: false,
            error: 'Both userId and deviceId cannot be undefined',
            metadata: [
              {
                jobId: 1,
                userId: 'u1',
              },
            ],
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
            },
            statusCode: 400,
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'EU',
              },
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 1',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          destType: 'am',
          input: [
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '0.0.0.0',
                        time: 1603132665557,
                        os_name: '',
                        user_id: '123',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          name: 'some campaign',
                          plan: 'Open source',
                          term: 'keyword',
                          test: 'other value',
                          email: 'test@rudderstack.com',
                          logins: 5,
                          medium: 'medium',
                          source: 'google',
                          content: 'some content',
                          category: 'SampleIdentify',
                          createdAt: 1599264000,
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api.eu.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'EU',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132712347,
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: 'Simple track call',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        event_properties: {
                          key: 'val',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132719505,
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: 'Simple track call',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        event_properties: {
                          key: 'val',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132726413,
                        groups: {
                          Company: 'Comapny-ABC',
                        },
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          Company: 'Comapny-ABC',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132726413,
                        groups: {
                          Company: 'Comapny-ABC',
                        },
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          Company: 'Comapny-ABC',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 5,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    identification: [
                      JSON.stringify({
                        group_type: 'Company',
                        group_value: 'Comapny-ABC',
                        group_properties: {
                          KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          name_trait: 'Company',
                          value_trait: 'Comapny-ABC',
                        },
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/groupidentify',
                endpointPath: 'groupidentify',
              },
              metadata: {
                jobId: 6,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    mapping: [
                      JSON.stringify({
                        global_user_id: 'newUserIdAlias',
                        user_id: 'sampleusrRudder3',
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/usermap',
                endpointPath: 'usermap',
              },
              metadata: {
                jobId: 7,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '0.0.0.0',
                      time: 1603132665557,
                      os_name: '',
                      user_id: '123',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        name: 'some campaign',
                        plan: 'Open source',
                        term: 'keyword',
                        test: 'other value',
                        email: 'test@rudderstack.com',
                        logins: 5,
                        medium: 'medium',
                        source: 'google',
                        content: 'some content',
                        category: 'SampleIdentify',
                        createdAt: 1599264000,
                      },
                    },
                  ],
                  api_key: 'dummyApiKey',
                  options: {
                    min_id_length: 1,
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api.eu.amplitude.com/2/httpapi',
              endpointPath: '2/httpapi',
            },
            metadata: [
              {
                jobId: 1,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'EU',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  identification: [
                    JSON.stringify({
                      group_type: 'Company',
                      group_value: 'Comapny-ABC',
                      group_properties: {
                        KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        name_trait: 'Company',
                        value_trait: 'Comapny-ABC',
                      },
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/groupidentify',
              endpointPath: 'groupidentify',
            },
            metadata: [
              {
                jobId: 6,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  mapping: [
                    JSON.stringify({
                      global_user_id: 'newUserIdAlias',
                      user_id: 'sampleusrRudder3',
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/usermap',
              endpointPath: 'usermap',
            },
            metadata: [
              {
                jobId: 7,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '[::1]',
                      time: 1603132712347,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132719505,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                  ],
                  api_key: 'dummyApiKey',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/batch',
              endpointPath: 'batch',
            },
            metadata: [
              {
                jobId: 2,
                userId: 'u1',
              },
              {
                jobId: 3,
                userId: 'u1',
              },
              {
                jobId: 4,
                userId: 'u1',
              },
              {
                jobId: 5,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 2',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          destType: 'am',
          input: [
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '0.0.0.0',
                      time: 1603132665557,
                      os_name: '',
                      user_id: '123',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        name: 'some campaign',
                        plan: 'Open source',
                        term: 'keyword',
                        test: 'other value',
                        email: 'test@rudderstack.com',
                        logins: 5,
                        medium: 'medium',
                        source: 'google',
                        content: 'some content',
                        category: 'SampleIdentify',
                        createdAt: 1599264000,
                      },
                    },
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1603132712347,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1603132719505,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 5,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    identification: [
                      JSON.stringify({
                        group_type: 'Company',
                        group_value: 'Comapny-ABC',
                        group_properties: {
                          KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          name_trait: 'Company',
                          value_trait: 'Comapny-ABC',
                        },
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/groupidentify',
                endpointPath: 'groupidentify',
              },
              metadata: {
                jobId: 6,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    mapping: [
                      JSON.stringify({
                        global_user_id: 'newUserIdAlias',
                        user_id: 'sampleusrRudder3',
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/usermap',
                endpointPath: 'usermap',
              },
              metadata: {
                jobId: 7,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: {
                    ip: '0.0.0.0',
                    time: 1603132665557,
                    os_name: '',
                    user_id: '123',
                    app_name: 'RudderLabs JavaScript SDK',
                    language: 'en-US',
                    device_id: 'my-anonymous-id-new',
                    library: 'rudderstack',
                    event_type: '$identify',
                    os_version: '',
                    session_id: -1,
                    app_version: '1.1.5',
                    user_properties: {
                      name: 'some campaign',
                      plan: 'Open source',
                      term: 'keyword',
                      test: 'other value',
                      email: 'test@rudderstack.com',
                      logins: 5,
                      medium: 'medium',
                      source: 'google',
                      content: 'some content',
                      category: 'SampleIdentify',
                      createdAt: 1599264000,
                    },
                  },
                  api_key: 'dummyApiKey',
                  options: {
                    min_id_length: 1,
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              endpointPath: '2/httpapi',
            },
            metadata: [
              {
                jobId: 1,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  identification: [
                    JSON.stringify({
                      group_type: 'Company',
                      group_value: 'Comapny-ABC',
                      group_properties: {
                        KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        name_trait: 'Company',
                        value_trait: 'Comapny-ABC',
                      },
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/groupidentify',
              endpointPath: 'groupidentify',
            },
            metadata: [
              {
                jobId: 6,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  mapping: [
                    JSON.stringify({
                      global_user_id: 'newUserIdAlias',
                      user_id: 'sampleusrRudder3',
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/usermap',
              endpointPath: 'usermap',
            },
            metadata: [
              {
                jobId: 7,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '[::1]',
                      time: 1603132712347,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132719505,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                  ],
                  api_key: 'dummyApiKey',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/batch',
              endpointPath: 'batch',
            },
            metadata: [
              {
                jobId: 2,
                userId: 'u1',
              },
              {
                jobId: 3,
                userId: 'u1',
              },
              {
                jobId: 4,
                userId: 'u1',
              },
              {
                jobId: 5,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 3',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          destType: 'am',
          input: [
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: 'dd4c4493-a3ff-49c9-9071-6cb72e37cd55',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    api_key: 'afasf',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'anon_id',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 12,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:29.633+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              destination: {
                ID: '1iuPwfigf4Fk5F5OBF2T3EVTGlY',
                Name: 'braze dev',
                DestinationDefinition: {
                  ID: '1XQoHKJnI6Uf67wN20RlvAQSUB9',
                  Name: 'BRAZE',
                  DisplayName: 'Braze',
                  Config: {
                    destConfig: {
                      android: ['useNativeSDK'],
                      defaultConfig: ['appKey', 'dataCenter', 'restApiKey'],
                      ios: ['useNativeSDK'],
                      web: ['useNativeSDK'],
                    },
                    excludeKeys: [],
                    includeKeys: ['appKey', 'dataCenter'],
                    secretKeys: ['restApiKey'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                },
                Config: {
                  appKey: 'asdf',
                  dataCenter: 'asdfasdf',
                  residencyServer: 'standard',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: false,
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '69283c05-bbe9-4aba-bb98-3f065d39cf54',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    api_key: 'afasf',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'anon_id',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 13,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:29.914+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              destination: {
                ID: '1iuPwfigf4Fk5F5OBF2T3EVTGlY',
                Name: 'braze dev',
                DestinationDefinition: {
                  ID: '1XQoHKJnI6Uf67wN20RlvAQSUB9',
                  Name: 'BRAZE',
                  DisplayName: 'Braze',
                  Config: {
                    destConfig: {
                      android: ['useNativeSDK'],
                      defaultConfig: ['appKey', 'dataCenter', 'restApiKey'],
                      ios: ['useNativeSDK'],
                      web: ['useNativeSDK'],
                    },
                    excludeKeys: [],
                    includeKeys: ['appKey', 'dataCenter'],
                    secretKeys: ['restApiKey'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                },
                Config: {
                  appKey: 'asdf',
                  dataCenter: 'asdfasdf',
                  residencyServer: 'standard',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: false,
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '39f7a1fa-ff79-4fd1-a329-d637f018de7e',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    api_key: 'afasf',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'anon_id',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 14,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:30.166+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              destination: {
                ID: '1iuPwfigf4Fk5F5OBF2T3EVTGlY',
                Name: 'braze dev',
                DestinationDefinition: {
                  ID: '1XQoHKJnI6Uf67wN20RlvAQSUB9',
                  Name: 'BRAZE',
                  DisplayName: 'Braze',
                  Config: {
                    destConfig: {
                      android: ['useNativeSDK'],
                      defaultConfig: ['appKey', 'dataCenter', 'restApiKey'],
                      ios: ['useNativeSDK'],
                      web: ['useNativeSDK'],
                    },
                    excludeKeys: [],
                    includeKeys: ['appKey', 'dataCenter'],
                    secretKeys: ['restApiKey'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                },
                Config: {
                  appKey: 'asdf',
                  dataCenter: 'asdfasdf',
                  residencyServer: 'standard',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: false,
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '4314aa01-46a3-4f45-b67d-debe4bc01717',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    api_key: 'afasf',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'anon_id',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 15,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:30.424+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              destination: {
                ID: '1iuPwfigf4Fk5F5OBF2T3EVTGlY',
                Name: 'braze dev',
                DestinationDefinition: {
                  ID: '1XQoHKJnI6Uf67wN20RlvAQSUB9',
                  Name: 'BRAZE',
                  DisplayName: 'Braze',
                  Config: {
                    destConfig: {
                      android: ['useNativeSDK'],
                      defaultConfig: ['appKey', 'dataCenter', 'restApiKey'],
                      ios: ['useNativeSDK'],
                      web: ['useNativeSDK'],
                    },
                    excludeKeys: [],
                    includeKeys: ['appKey', 'dataCenter'],
                    secretKeys: ['restApiKey'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                },
                Config: {
                  appKey: 'asdf',
                  dataCenter: 'asdfasdf',
                  residencyServer: 'standard',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: false,
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '4d958d40-2762-44aa-bf83-d47f881bc615',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    api_key: 'afasf',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'anon_id',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 16,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:30.668+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              destination: {
                ID: '1iuPwfigf4Fk5F5OBF2T3EVTGlY',
                Name: 'braze dev',
                DestinationDefinition: {
                  ID: '1XQoHKJnI6Uf67wN20RlvAQSUB9',
                  Name: 'BRAZE',
                  DisplayName: 'Braze',
                  Config: {
                    destConfig: {
                      android: ['useNativeSDK'],
                      defaultConfig: ['appKey', 'dataCenter', 'restApiKey'],
                      ios: ['useNativeSDK'],
                      web: ['useNativeSDK'],
                    },
                    excludeKeys: [],
                    includeKeys: ['appKey', 'dataCenter'],
                    secretKeys: ['restApiKey'],
                    supportedSourceTypes: [
                      'android',
                      'ios',
                      'web',
                      'unity',
                      'amp',
                      'cloud',
                      'reactnative',
                    ],
                  },
                },
                Config: {
                  appKey: 'asdf',
                  dataCenter: 'asdfasdf',
                  residencyServer: 'standard',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: false,
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: 'dd4c4493-a3ff-49c9-9071-6cb72e37cd55',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '69283c05-bbe9-4aba-bb98-3f065d39cf54',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '39f7a1fa-ff79-4fd1-a329-d637f018de7e',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '4314aa01-46a3-4f45-b67d-debe4bc01717',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                    {
                      ip: '[::1]',
                      time: 1565586510909,
                      carrier: 'Android',
                      app_name: 'RudderAndroidClient',
                      language: 'en-US',
                      device_id: 'anon_id',
                      library: 'rudderstack',
                      insert_id: '4d958d40-2762-44aa-bf83-d47f881bc615',
                      event_type: 'Demo Track',
                      session_id: -1,
                      app_version: '1.0',
                      device_model: 'Android SDK built for x86',
                      event_properties: {
                        label: 'Demo Label',
                        value: 5,
                        category: 'Demo Category',
                      },
                      device_manufacturer: 'Google',
                    },
                  ],
                  api_key: 'afasf',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'anon_id',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/batch',
              endpointPath: 'batch',
            },
            metadata: [
              {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 12,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:29.633+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 13,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:29.914+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 14,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:30.166+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 15,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:30.424+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
              {
                userId: '90ca6da0-292e-4e79-9880-f8009e0ae4a3',
                jobId: 16,
                sourceId: '1fMCVYZboDlYlauh4GFsEo2JU77',
                destinationId: '1gXSYmSd7vkfFfJ4vtMCL0i43Lb',
                attemptNum: 0,
                receivedAt: '2020-10-20T23:47:30.668+05:30',
                createdAt: '2020-10-20T18:17:32.465Z',
              },
            ],
            destination: {
              ID: '1iuPwfigf4Fk5F5OBF2T3EVTGlY',
              Name: 'braze dev',
              DestinationDefinition: {
                ID: '1XQoHKJnI6Uf67wN20RlvAQSUB9',
                Name: 'BRAZE',
                DisplayName: 'Braze',
                Config: {
                  destConfig: {
                    android: ['useNativeSDK'],
                    defaultConfig: ['appKey', 'dataCenter', 'restApiKey'],
                    ios: ['useNativeSDK'],
                    web: ['useNativeSDK'],
                  },
                  excludeKeys: [],
                  includeKeys: ['appKey', 'dataCenter'],
                  secretKeys: ['restApiKey'],
                  supportedSourceTypes: [
                    'android',
                    'ios',
                    'web',
                    'unity',
                    'amp',
                    'cloud',
                    'reactnative',
                  ],
                },
              },
              Config: {
                appKey: 'asdf',
                dataCenter: 'asdfasdf',
                residencyServer: 'standard',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: false,
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 4',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          destType: 'am',
          input: [
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '0.0.0.0',
                        time: 1603132665557,
                        os_name: '',
                        user_id: '123',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          name: 'some campaign',
                          plan: 'Open source',
                          term: 'keyword',
                          test: 'other value',
                          email: 'test@rudderstack.com',
                          logins: 5,
                          medium: 'medium',
                          source: 'google',
                          content: 'some content',
                          category: 'SampleIdentify',
                          createdAt: 1599264000,
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132712347,
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: 'Simple track call',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        event_properties: {
                          key: 'val',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132719505,
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: 'Simple track call',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        event_properties: {
                          key: 'val',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132726413,
                        groups: {
                          Company: 'Comapny-ABC',
                        },
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          Company: 'Comapny-ABC',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132726413,
                        groups: {
                          Company: 'Comapny-ABC',
                        },
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          Company: 'Comapny-ABC',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 5,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    identification: [
                      JSON.stringify({
                        group_type: 'Company',
                        group_value: 'Comapny-ABC',
                        group_properties: {
                          KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          name_trait: 'Company',
                          value_trait: 'Comapny-ABC',
                        },
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/groupidentify',
                endpointPath: 'groupidentify',
              },
              metadata: {
                jobId: 6,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    mapping: [
                      JSON.stringify({
                        global_user_id: 'newUserIdAlias',
                        user_id: 'sampleusrRudder3',
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/usermap',
                endpointPath: 'usermap',
              },
              metadata: {
                jobId: 7,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '0.0.0.0',
                      time: 1603132665557,
                      os_name: '',
                      user_id: '123',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        name: 'some campaign',
                        plan: 'Open source',
                        term: 'keyword',
                        test: 'other value',
                        email: 'test@rudderstack.com',
                        logins: 5,
                        medium: 'medium',
                        source: 'google',
                        content: 'some content',
                        category: 'SampleIdentify',
                        createdAt: 1599264000,
                      },
                    },
                  ],
                  api_key: 'dummyApiKey',
                  options: {
                    min_id_length: 1,
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              endpointPath: '2/httpapi',
            },
            metadata: [
              {
                jobId: 1,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  identification: [
                    JSON.stringify({
                      group_type: 'Company',
                      group_value: 'Comapny-ABC',
                      group_properties: {
                        KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        name_trait: 'Company',
                        value_trait: 'Comapny-ABC',
                      },
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/groupidentify',
              endpointPath: 'groupidentify',
            },
            metadata: [
              {
                jobId: 6,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  mapping: [
                    JSON.stringify({
                      global_user_id: 'newUserIdAlias',
                      user_id: 'sampleusrRudder3',
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/usermap',
              endpointPath: 'usermap',
            },
            metadata: [
              {
                jobId: 7,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '[::1]',
                      time: 1603132712347,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132719505,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                  ],
                  api_key: 'dummyApiKey',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/batch',
              endpointPath: 'batch',
            },
            metadata: [
              {
                jobId: 2,
                userId: 'u1',
              },
              {
                jobId: 3,
                userId: 'u1',
              },
              {
                jobId: 4,
                userId: 'u1',
              },
              {
                jobId: 5,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
        ],
      },
    },
  },
  {
    name: 'am',
    description: 'Test 5',
    feature: 'batch',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          destType: 'am',
          input: [
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '0.0.0.0',
                        time: 1603132665557,
                        os_name: '',
                        user_id: '123',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          name: 'some campaign',
                          plan: 'Open source',
                          term: 'keyword',
                          test: 'other value',
                          email: 'test@rudderstack.com',
                          logins: 5,
                          medium: 'medium',
                          source: 'google',
                          content: 'some content',
                          category: 'SampleIdentify',
                          createdAt: 1599264000,
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132712347,
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: 'Simple track call',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        event_properties: {
                          key: 'val',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 2,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132719505,
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: 'Simple track call',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        event_properties: {
                          key: 'val',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 3,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132726413,
                        groups: {
                          Company: 'Comapny-ABC',
                        },
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          Company: 'Comapny-ABC',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 4,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ip: '[::1]',
                        time: 1603132726413,
                        groups: {
                          Company: 'Comapny-ABC',
                        },
                        os_name: '',
                        user_id: 'sampleusrRudder3',
                        app_name: 'RudderLabs JavaScript SDK',
                        language: 'en-US',
                        device_id: 'my-anonymous-id-new',
                        library: 'rudderstack',
                        event_type: '$identify',
                        os_version: '',
                        session_id: -1,
                        app_version: '1.1.5',
                        user_properties: {
                          Company: 'Comapny-ABC',
                        },
                      },
                    ],
                    api_key: 'dummyApiKey',
                    options: {
                      min_id_length: 1,
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api2.amplitude.com/2/httpapi',
                endpointPath: '2/httpapi',
              },
              metadata: {
                jobId: 5,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    identification: [
                      JSON.stringify({
                        group_type: 'Company',
                        group_value: 'Comapny-ABC',
                        group_properties: {
                          KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                          name_trait: 'Company',
                          value_trait: 'Comapny-ABC',
                        },
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/groupidentify',
                endpointPath: 'groupidentify',
              },
              metadata: {
                jobId: 6,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
            {
              message: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {
                    api_key: 'dummyApiKey',
                    mapping: [
                      JSON.stringify({
                        global_user_id: 'newUserIdAlias',
                        user_id: 'sampleusrRudder3',
                      }),
                    ],
                  },
                  JSON: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                userId: 'my-anonymous-id-new',
                headers: {},
                version: '1',
                endpoint: 'https://api2.amplitude.com/usermap',
                endpointPath: 'usermap',
              },
              metadata: {
                jobId: 7,
                userId: 'u1',
              },
              destination: {
                ID: 'a',
                url: 'a',
                Config: {
                  residencyServer: 'standard',
                },
              },
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '0.0.0.0',
                      time: 1603132665557,
                      os_name: '',
                      user_id: '123',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        name: 'some campaign',
                        plan: 'Open source',
                        term: 'keyword',
                        test: 'other value',
                        email: 'test@rudderstack.com',
                        logins: 5,
                        medium: 'medium',
                        source: 'google',
                        content: 'some content',
                        category: 'SampleIdentify',
                        createdAt: 1599264000,
                      },
                    },
                  ],
                  api_key: 'dummyApiKey',
                  options: {
                    min_id_length: 1,
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/2/httpapi',
              endpointPath: '2/httpapi',
            },
            metadata: [
              {
                jobId: 1,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  identification: [
                    JSON.stringify({
                      group_type: 'Company',
                      group_value: 'Comapny-ABC',
                      group_properties: {
                        KEY_2: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        KEY_3: { CHILD_KEY_102: 'value_103', CHILD_KEY_92: 'value_95' },
                        name_trait: 'Company',
                        value_trait: 'Comapny-ABC',
                      },
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/groupidentify',
              endpointPath: 'groupidentify',
            },
            metadata: [
              {
                jobId: 6,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  api_key: 'dummyApiKey',
                  mapping: [
                    JSON.stringify({
                      global_user_id: 'newUserIdAlias',
                      user_id: 'sampleusrRudder3',
                    }),
                  ],
                },
                JSON: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {},
              version: '1',
              endpoint: 'https://api2.amplitude.com/usermap',
              endpointPath: 'usermap',
            },
            metadata: [
              {
                jobId: 7,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
          {
            batchedRequest: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      ip: '[::1]',
                      time: 1603132712347,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132719505,
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: 'Simple track call',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      event_properties: {
                        key: 'val',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                    {
                      ip: '[::1]',
                      time: 1603132726413,
                      groups: {
                        Company: 'Comapny-ABC',
                      },
                      os_name: '',
                      user_id: 'sampleusrRudder3',
                      app_name: 'RudderLabs JavaScript SDK',
                      language: 'en-US',
                      device_id: 'my-anonymous-id-new',
                      library: 'rudderstack',
                      event_type: '$identify',
                      os_version: '',
                      session_id: -1,
                      app_version: '1.1.5',
                      user_properties: {
                        Company: 'Comapny-ABC',
                      },
                    },
                  ],
                  api_key: 'dummyApiKey',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: 'my-anonymous-id-new',
              headers: {
                'Content-Type': 'application/json',
              },
              version: '1',
              endpoint: 'https://api2.amplitude.com/batch',
              endpointPath: 'batch',
            },
            metadata: [
              {
                jobId: 2,
                userId: 'u1',
              },
              {
                jobId: 3,
                userId: 'u1',
              },
              {
                jobId: 4,
                userId: 'u1',
              },
              {
                jobId: 5,
                userId: 'u1',
              },
            ],
            destination: {
              ID: 'a',
              url: 'a',
              Config: {
                residencyServer: 'standard',
              },
            },
          },
        ],
      },
    },
  },
];
