export const data = [
  {
    name: 'monday',
    description: 'Track call with empty columnToPropertyMapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: '',
                columnToPropertyMapping: [],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              body: {
                FORM: {},
                JSON: {
                  query:
                    'mutation { create_item (board_id: 339283933,  item_name: "Task 1", column_values: "{}") {id}}',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.monday.com/v2',
              files: {},
              headers: {
                Authorization:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                'Content-Type': 'application/json',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'monday',
    description: 'Track call with undefined columnToPropertyMapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: '',
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              body: {
                FORM: {},
                JSON: {
                  query:
                    'mutation { create_item (board_id: 339283933,  item_name: "Task 1", column_values: "{}") {id}}',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://api.monday.com/v2',
              files: {},
              headers: {
                Authorization:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                'Content-Type': 'application/json',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              version: '1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'monday',
    description: 'Check Unsupported message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: '',
                columnToPropertyMapping: [],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'identify',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'Event type identify is not supported',
            statTags: {
              destType: 'MONDAY',
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
    name: 'monday',
    description: 'Check for empty message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: '',
                columnToPropertyMapping: [],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: '',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'Event type is required',
            statTags: {
              destType: 'MONDAY',
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
    name: 'monday',
    description: 'Check for empty API Token',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken: '',
                boardId: '339283933',
                groupTitle: '',
                columnToPropertyMapping: [],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'ApiToken is a required field',
            statTags: {
              destType: 'MONDAY',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'monday',
    description: 'Check for empty board Id',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '',
                groupTitle: '',
                columnToPropertyMapping: [],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'boardId is a required field',
            statTags: {
              destType: 'MONDAY',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'monday',
    description: 'Check for event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: '',
                columnToPropertyMapping: [],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: '',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'Event is a required field and should be a string',
            statTags: {
              destType: 'MONDAY',
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
    name: 'monday',
    description: 'Track call with columnToPropertyMapping and with empty groupTitle',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: '',
                columnToPropertyMapping: [
                  {
                    from: 'Status',
                    to: 'status',
                  },
                  {
                    from: 'Email',
                    to: 'emailId',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
                status: 'Done',
                emailId: 'abc@email.com',
                emailText: 'emailId',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              endpoint: 'https://api.monday.com/v2',
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
              },
              params: {},
              body: {
                JSON: {
                  query:
                    'mutation { create_item (board_id: 339283933,  item_name: "Task 1", column_values: "{\\"status\\":{\\"label\\":\\"Done\\"},\\"email\\":{\\"email\\":\\"abc@email.com\\",\\"text\\":\\"emailId\\"}}") {id}}',
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
    name: 'monday',
    description: 'Track call with columnToPropertyMapping and with groupTitle',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: 'Next month',
                columnToPropertyMapping: [
                  {
                    from: 'Status',
                    to: 'status',
                  },
                  {
                    from: 'Email',
                    to: 'emailId',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
                status: 'Done',
                emailId: 'abc@email.com',
                emailText: 'emailId',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              endpoint: 'https://api.monday.com/v2',
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
              },
              params: {},
              body: {
                JSON: {
                  query:
                    'mutation { create_item (board_id: 339283933, group_id: group_title item_name: "Task 1", column_values: "{\\"status\\":{\\"label\\":\\"Done\\"},\\"email\\":{\\"email\\":\\"abc@email.com\\",\\"text\\":\\"emailId\\"}}") {id}}',
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
    name: 'monday',
    description: 'Non-existing group title check',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: 'Next year',
                columnToPropertyMapping: [
                  {
                    from: 'Status',
                    to: 'status',
                  },
                  {
                    from: 'Email',
                    to: 'emailId',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
                status: 'Done',
                emailId: 'abc@email.com',
                emailText: 'emailId',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: "Group Next year doesn't exist in the board",
            statTags: {
              destType: 'MONDAY',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'monday',
    description: 'check for item name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: 'Next month',
                columnToPropertyMapping: [
                  {
                    from: 'Status',
                    to: 'status',
                  },
                  {
                    from: 'Email',
                    to: 'emailId',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: '',
                status: 'Done',
                emailId: 'abc@email.com',
                emailText: 'emailId',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'Item name is required to create an item',
            statTags: {
              destType: 'MONDAY',
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
    name: 'monday',
    description:
      'Track call with columnToPropertyMapping and with groupTitle with all supported columns',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: 'Next month',
                columnToPropertyMapping: [
                  {
                    from: 'Status',
                    to: 'status',
                  },
                  {
                    from: 'Email',
                    to: 'emailId',
                  },
                  {
                    from: 'Checkbox',
                    to: 'checked',
                  },
                  {
                    from: 'Numbers',
                    to: 'number',
                  },
                  {
                    from: 'Name',
                    to: 'textKey',
                  },
                  {
                    from: 'Country',
                    to: 'countryName',
                  },
                  {
                    from: 'Location',
                    to: 'address',
                  },
                  {
                    from: 'Phone',
                    to: 'phone',
                  },
                  {
                    from: 'Rating',
                    to: 'rating',
                  },
                  {
                    from: 'Link',
                    to: 'url',
                  },
                  {
                    from: 'Long Text',
                    to: 'description',
                  },
                  {
                    from: 'World Clock',
                    to: 'timezone',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
                status: 'Done',
                emailId: 'abc@email.com',
                emailText: 'emailId',
                countryCode: 'US',
                latitude: '51.23',
                longitude: '35.3',
                rating: '3',
                linkText: 'websiteLink',
                checked: 'true',
                number: '45',
                textKey: 'texting',
                countryName: 'Unites States',
                countryShortName: 'US',
                address: 'New York',
                phone: '2626277272',
                url: 'demo.com',
                description: 'property description',
                timezone: 'America/New_York',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              endpoint: 'https://api.monday.com/v2',
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
              },
              params: {},
              body: {
                JSON: {
                  query:
                    'mutation { create_item (board_id: 339283933, group_id: group_title item_name: "Task 1", column_values: "{\\"status\\":{\\"label\\":\\"Done\\"},\\"email\\":{\\"email\\":\\"abc@email.com\\",\\"text\\":\\"emailId\\"},\\"checkbox\\":{\\"checked\\":true},\\"numbers\\":\\"45\\",\\"text\\":\\"texting\\",\\"country\\":{\\"countryName\\":\\"Unites States\\",\\"countryCode\\":\\"US\\"},\\"location\\":{\\"address\\":\\"New York\\",\\"lat\\":\\"51.23\\",\\"lng\\":\\"35.3\\"},\\"phone\\":{\\"phone\\":\\"2626277272\\",\\"countryShortName\\":\\"US\\"},\\"rating\\":3,\\"link\\":{\\"url\\":\\"demo.com\\",\\"text\\":\\"websiteLink\\"},\\"long_text\\":{\\"text\\":\\"property description\\"},\\"world_clock\\":{\\"timezone\\":\\"America/New_York\\"}}") {id}}',
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
    name: 'monday',
    description: 'check for allowed event name from UI',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken:
                  'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                boardId: '339283933',
                groupTitle: 'Next month',
                columnToPropertyMapping: [
                  {
                    from: 'Status',
                    to: 'status',
                  },
                  {
                    from: 'Email',
                    to: 'emailId',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: '',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: '',
                status: 'Done',
                emailId: 'abc@email.com',
                emailText: 'emailId',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'Event Discarded. To allow this event, add this in Allowlist',
            statTags: {
              destType: 'MONDAY',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'monday',
    description: 'check for deleted boards (configured boards are deleted)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken: 'failedApiToken',
                boardId: '339283934',
                groupTitle: 'Next year',
                columnToPropertyMapping: [
                  {
                    from: 'Status',
                    to: 'status',
                  },
                  {
                    from: 'Email',
                    to: 'emailId',
                  },
                ],
                whitelistedEvents: [
                  {
                    eventName: 'create an item',
                  },
                ],
              },
            },
            message: {
              event: 'create an item',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@27',
              channel: 'web',
              properties: {
                name: 'Task 1',
                status: 'Done',
                emailId: 'abc@email.com',
                emailText: 'emailId',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.11',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'The board with boardId 339283934 does not exist',
            statTags: {
              destType: 'MONDAY',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
];
