export const data = [
  {
    name: 'monday',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiToken:
                    'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                  boardId: '339283933',
                  groupTitle: '',
                  columnToPropertyMapping: [],
                  whitelistedEvents: [{ eventName: 'create an item' }],
                },
              },
              metadata: {
                jobId: 1,
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
                    { from: 'Email', to: 'emailId' },
                  ],
                  whitelistedEvents: [{ eventName: 'create an item' }],
                },
              },
              metadata: {
                jobId: 2,
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
          destType: 'monday',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
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
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiToken:
                    'eywwakzdjiksjhriherniSFsjhnskdojsSDFhsdns.sSRSSREWdnfnsjshfjsjskshfiskskdS__Fskilhih',
                  boardId: '339283933',
                  groupTitle: '',
                  columnToPropertyMapping: [],
                  whitelistedEvents: [{ eventName: 'create an item' }],
                },
              },
            },
            {
              batchedRequest: {
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
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
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
                    { from: 'Email', to: 'emailId' },
                  ],
                  whitelistedEvents: [{ eventName: 'create an item' }],
                },
              },
            },
          ],
        },
      },
    },
  },
];
