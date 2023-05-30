const data = [
  {
    name: 'attribution',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'TODO',
              Name: 'Attribution',
              DestinationDefinition: {
                ID: 'TODO',
                Name: 'ATTRIBUTION',
                DisplayName: 'Attribution',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: 'abcdefghijklmnopqrstuvwxyz',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                ip: '12.12.12.12',
                library: {
                  name: 'SomeLib',
                  version: '1.0',
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
              },
              integrations: {
                All: true,
              },
              messageId: '258b77c6-442d-4bdc-8729-f0e4cef41353',
              name: 'home',
              originalTimestamp: '2020-04-17T14:55:31.367Z',
              properties: {
                path: '/tests/html/index4.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index4.html',
              },
              receivedAt: '2020-04-17T20:25:31.381+05:30',
              request_ip: '[::1]:57363',
              sentAt: '2020-04-17T14:55:31.367Z',
              timestamp: '2020-04-17T20:25:31.381+05:30',
              type: 'page',
              userId: 'user12345',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://track.attributionapp.com/v1/import',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo6',
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      channel: 'web',
                      context: {
                        ip: '12.12.12.12',
                        library: {
                          name: 'SomeLib',
                          version: '1.0',
                        },
                        traits: {
                          age: 23,
                          email: 'testmp@rudderstack.com',
                          firstname: 'Test Kafka',
                        },
                      },
                      type: 'page',
                      userId: 'user12345',
                      traits: {
                        age: 23,
                        email: 'testmp@rudderstack.com',
                        firstname: 'Test Kafka',
                      },
                      integrations: {
                        All: true,
                      },
                      messageId: '258b77c6-442d-4bdc-8729-f0e4cef41353',
                      name: 'home',
                      originalTimestamp: '2020-04-17T14:55:31.367Z',
                      properties: {
                        path: '/tests/html/index4.html',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'http://localhost/tests/html/index4.html',
                      },
                      receivedAt: '2020-04-17T20:25:31.381+05:30',
                      request_ip: '[::1]:57363',
                      sentAt: '2020-04-17T14:55:31.367Z',
                      timestamp: '2020-04-17T20:25:31.381+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'attribution',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'TODO',
              Name: 'Attribution',
              DestinationDefinition: {
                ID: 'TODO',
                Name: 'ATTRIBUTION',
                DisplayName: 'Attribution',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: 'abcdefghijklmnopqrstuvwxyz',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                ip: '12.12.12.12',
                library: {
                  name: 'SomeLib',
                  version: '1.0',
                },
              },
              traits: {
                age: 23,
                email: 'testmp@email.com',
                firstname: 'Test Transformer',
              },
              integrations: {
                All: true,
              },
              messageId: '023a3a48-190a-4968-9394-a8e99b81a3c0',
              originalTimestamp: '2020-04-17T14:55:31.37Z',
              receivedAt: '2020-04-17T20:25:31.401+05:30',
              request_ip: '[::1]:57364',
              sentAt: '2020-04-17T14:55:31.37Z',
              timestamp: '2020-04-17T20:25:31.401+05:30',
              type: 'identify',
              userId: 'user12345',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://track.attributionapp.com/v1/import',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo6',
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      channel: 'web',
                      type: 'identify',
                      userId: 'user12345',
                      context: {
                        ip: '12.12.12.12',
                        library: {
                          name: 'SomeLib',
                          version: '1.0',
                        },
                      },
                      traits: {
                        age: 23,
                        email: 'testmp@email.com',
                        firstname: 'Test Transformer',
                      },
                      integrations: {
                        All: true,
                      },
                      messageId: '023a3a48-190a-4968-9394-a8e99b81a3c0',
                      originalTimestamp: '2020-04-17T14:55:31.37Z',
                      receivedAt: '2020-04-17T20:25:31.401+05:30',
                      request_ip: '[::1]:57364',
                      sentAt: '2020-04-17T14:55:31.37Z',
                      timestamp: '2020-04-17T20:25:31.401+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'attribution',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'TODO',
              Name: 'Attribution',
              DestinationDefinition: {
                ID: 'TODO',
                Name: 'ATTRIBUTION',
                DisplayName: 'Attribution',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: 'abcdefghijklmnopqrstuvwxyz',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                ip: '12.12.12.12',
                library: {
                  name: 'SomeLib',
                  version: '1.0',
                },
              },
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '584fde02-901a-4964-a4a0-4078b999d5b2',
              originalTimestamp: '2020-04-17T14:55:31.372Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:25:31.401+05:30',
              request_ip: '[::1]:57365',
              sentAt: '2020-04-17T14:55:31.372Z',
              timestamp: '2020-04-17T20:25:31.401+05:30',
              type: 'track',
              userId: 'user12345',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://track.attributionapp.com/v1/import',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo6',
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      channel: 'web',
                      type: 'track',
                      userId: 'user12345',
                      event: 'test track with property',
                      integrations: {
                        All: true,
                      },
                      messageId: '584fde02-901a-4964-a4a0-4078b999d5b2',
                      originalTimestamp: '2020-04-17T14:55:31.372Z',
                      context: {
                        ip: '12.12.12.12',
                        library: {
                          name: 'SomeLib',
                          version: '1.0',
                        },
                      },
                      properties: { test_prop_1: 'test prop', test_prop_2: 1232 },
                      receivedAt: '2020-04-17T20:25:31.401+05:30',
                      request_ip: '[::1]:57365',
                      sentAt: '2020-04-17T14:55:31.372Z',
                      timestamp: '2020-04-17T20:25:31.401+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'attribution',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'TODO',
              Name: 'Attribution',
              DestinationDefinition: {
                ID: 'TODO',
                Name: 'ATTRIBUTION',
                DisplayName: 'Attribution',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: 'abcdefghijklmnopqrstuvwxyz',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              channel: 'web',
              context: {
                ip: '12.12.12.12',
                library: {
                  name: 'SomeLib',
                  version: '1.0',
                },
              },
              integrations: {
                All: true,
              },
              messageId: '258b77c6-442d-4bdc-8729-f0e4cef41353',
              name: 'home',
              originalTimestamp: '2020-04-17T14:55:31.367Z',
              properties: {
                path: '/tests/html/index4.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index4.html',
              },
              receivedAt: '2020-04-17T20:25:31.381+05:30',
              request_ip: '[::1]:57363',
              sentAt: '2020-04-17T14:55:31.367Z',
              timestamp: '2020-04-17T20:25:31.381+05:30',
              type: 'page',
              userId: 'user12345',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://track.attributionapp.com/v1/import',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo6',
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      type: 'page',
                      userId: 'user12345',
                      channel: 'web',
                      context: {
                        ip: '12.12.12.12',
                        library: {
                          name: 'SomeLib',
                          version: '1.0',
                        },
                      },
                      integrations: {
                        All: true,
                      },
                      messageId: '258b77c6-442d-4bdc-8729-f0e4cef41353',
                      name: 'home',
                      originalTimestamp: '2020-04-17T14:55:31.367Z',
                      properties: {
                        path: '/tests/html/index4.html',
                        referrer: '',
                        search: '',
                        title: '',
                        url: 'http://localhost/tests/html/index4.html',
                      },
                      receivedAt: '2020-04-17T20:25:31.381+05:30',
                      request_ip: '[::1]:57363',
                      sentAt: '2020-04-17T14:55:31.367Z',
                      timestamp: '2020-04-17T20:25:31.381+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'attribution',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'TODO',
              Name: 'Attribution',
              DestinationDefinition: {
                ID: 'TODO',
                Name: 'ATTRIBUTION',
                DisplayName: 'Attribution',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                writeKey: 'abcdefghijklmnopqrstuvwxyz',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
              channel: 'web',
              context: {
                ip: '12.12.12.12',
                library: {
                  name: 'SomeLib',
                  version: '1.0',
                },
              },
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: '584fde02-901a-4964-a4a0-4078b999d5b2',
              originalTimestamp: '2020-04-17T14:55:31.372Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-17T20:25:31.401+05:30',
              request_ip: '[::1]:57365',
              sentAt: '2020-04-17T14:55:31.372Z',
              timestamp: '2020-04-17T20:25:31.401+05:30',
              type: 'track',
              userId: 'user12345',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint: 'https://track.attributionapp.com/v1/import',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo6',
              },
              params: {},
              body: {
                JSON: {
                  batch: [
                    {
                      anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
                      channel: 'web',
                      context: {
                        ip: '12.12.12.12',
                        library: {
                          name: 'SomeLib',
                          version: '1.0',
                        },
                      },
                      type: 'track',
                      userId: 'user12345',
                      event: 'test track with property',
                      integrations: {
                        All: true,
                      },
                      messageId: '584fde02-901a-4964-a4a0-4078b999d5b2',
                      originalTimestamp: '2020-04-17T14:55:31.372Z',
                      properties: {
                        test_prop_1: 'test prop',
                        test_prop_2: 1232,
                      },
                      receivedAt: '2020-04-17T20:25:31.401+05:30',
                      request_ip: '[::1]:57365',
                      sentAt: '2020-04-17T14:55:31.372Z',
                      timestamp: '2020-04-17T20:25:31.401+05:30',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];

module.exports = {
  data,
};
