const data = [
  {
    name: 'zapier',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'first',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              sentAt: '2020-04-17T14:42:44.724Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkEnabled: true,
                },
              },
              Config: {
                zapUrl: 'abcd.zap-hook',
                trackEventsToZap: {},
                pageScreenEventsToZap: {},
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'abcd.zap-hook',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'first',
                  userId: 'identified user id',
                  type: 'track',
                  anonymousId: 'anon-id-new',
                  context: {
                    traits: {
                      trait1: 'new-val',
                    },
                    ip: '14.5.67.21',
                    library: {
                      name: 'http',
                    },
                  },
                  properties: {
                    abc: '123',
                    key: {
                      abc: 123,
                    },
                    array: [
                      {
                        abc: 123,
                      },
                      {
                        def: 123,
                      },
                    ],
                  },
                  timestamp: '2020-02-02T00:23:09.544Z',
                  originalTimestamp: '2020-04-17T14:42:44.724Z',
                  sentAt: '2020-04-17T14:42:44.724Z',
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
    name: 'zapier',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'def',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              sentAt: '2020-04-17T14:42:44.724Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkEnabled: true,
                },
              },
              Config: {
                zapUrl: 'abcd.zap-hook',
                trackEventsToZap: [
                  {
                    from: 'def',
                    to: 'def.zap-hook',
                  },
                  {
                    from: 'ghi',
                    to: 'ghi.zap-hook',
                  },
                ],
                pageScreenEventsToZap: {},
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'def.zap-hook',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'def',
                  userId: 'identified user id',
                  type: 'track',
                  anonymousId: 'anon-id-new',
                  context: {
                    traits: {
                      trait1: 'new-val',
                    },
                    ip: '14.5.67.21',
                    library: {
                      name: 'http',
                    },
                  },
                  properties: {
                    abc: '123',
                    key: {
                      abc: 123,
                    },
                    array: [
                      {
                        abc: 123,
                      },
                      {
                        def: 123,
                      },
                    ],
                  },
                  timestamp: '2020-02-02T00:23:09.544Z',
                  originalTimestamp: '2020-04-17T14:42:44.724Z',
                  sentAt: '2020-04-17T14:42:44.724Z',
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
    name: 'zapier',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              name: 'page_test',
              userId: 'identified user id',
              type: 'page',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              sentAt: '2020-04-17T14:42:44.724Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkEnabled: true,
                },
              },
              Config: {
                zapUrl: 'abcd.zap-hook',
                trackEventsToZap: [
                  {
                    from: 'def',
                    to: 'def.zap-hook',
                  },
                  {
                    from: 'ghi',
                    to: 'ghi.zap-hook',
                  },
                ],
                pageScreenEventsToZap: [
                  {
                    from: 'page_test',
                    to: 'page.zap-hook',
                  },
                  {
                    from: 'ghi',
                    to: 'ghi.zap-hook',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'page.zap-hook',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  name: 'page_test',
                  userId: 'identified user id',
                  type: 'page',
                  anonymousId: 'anon-id-new',
                  context: {
                    traits: {
                      trait1: 'new-val',
                    },
                    ip: '14.5.67.21',
                    library: {
                      name: 'http',
                    },
                  },
                  properties: {
                    abc: '123',
                    key: {
                      abc: 123,
                    },
                    array: [
                      {
                        abc: 123,
                      },
                      {
                        def: 123,
                      },
                    ],
                  },
                  timestamp: '2020-02-02T00:23:09.544Z',
                  originalTimestamp: '2020-04-17T14:42:44.724Z',
                  sentAt: '2020-04-17T14:42:44.724Z',
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
    name: 'zapier',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              name: 'screen_test',
              userId: 'identified user id',
              type: 'screen',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              sentAt: '2020-04-17T14:42:44.724Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkEnabled: true,
                },
              },
              Config: {
                zapUrl: 'abcd.zap-hook',
                trackEventsToZap: [
                  {
                    from: 'def',
                    to: 'def.zap-hook',
                  },
                  {
                    from: 'ghi',
                    to: 'ghi.zap-hook',
                  },
                ],
                pageScreenEventsToZap: [
                  {
                    from: 'page_test',
                    to: 'page.zap-hook',
                  },
                  {
                    from: 'screen_test',
                    to: 'screen.zap-hook',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'screen.zap-hook',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  name: 'screen_test',
                  userId: 'identified user id',
                  type: 'screen',
                  anonymousId: 'anon-id-new',
                  context: {
                    traits: {
                      trait1: 'new-val',
                    },
                    ip: '14.5.67.21',
                    library: {
                      name: 'http',
                    },
                  },
                  properties: {
                    abc: '123',
                    key: {
                      abc: 123,
                    },
                    array: [
                      {
                        abc: 123,
                      },
                      {
                        def: 123,
                      },
                    ],
                  },
                  timestamp: '2020-02-02T00:23:09.544Z',
                  originalTimestamp: '2020-04-17T14:42:44.724Z',
                  sentAt: '2020-04-17T14:42:44.724Z',
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
    name: 'zapier',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'def',
              userId: 'identified user id',
              type: 'track',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              properties: {
                abc: '123',
                key: {
                  abc: 123,
                },
                array: [
                  {
                    abc: 123,
                  },
                  {
                    def: 123,
                  },
                ],
              },
              timestamp: '2020-02-02T00:23:09.544Z',
              originalTimestamp: '2020-04-17T14:42:44.724Z',
              sentAt: '2020-04-17T14:42:44.724Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkEnabled: true,
                },
              },
              Config: {
                zapUrl: 'abcd.zap-hook',
                trackEventsToZap: [
                  {
                    from: 'def',
                    to: 'def.zap-hook',
                  },
                  {
                    from: 'def',
                    to: 'ghi.zap-hook',
                  },
                ],
                pageScreenEventsToZap: [{}],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
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
              endpoint: 'ghi.zap-hook',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  event: 'def',
                  userId: 'identified user id',
                  type: 'track',
                  anonymousId: 'anon-id-new',
                  context: {
                    traits: {
                      trait1: 'new-val',
                    },
                    ip: '14.5.67.21',
                    library: {
                      name: 'http',
                    },
                  },
                  properties: {
                    abc: '123',
                    key: {
                      abc: 123,
                    },
                    array: [
                      {
                        abc: 123,
                      },
                      {
                        def: 123,
                      },
                    ],
                  },
                  timestamp: '2020-02-02T00:23:09.544Z',
                  originalTimestamp: '2020-04-17T14:42:44.724Z',
                  sentAt: '2020-04-17T14:42:44.724Z',
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
];

module.exports = {
  data,
};
