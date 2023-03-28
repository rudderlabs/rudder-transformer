const data = [
  {
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '',
                enableUserCreation: true,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'identify',
              traits: {
                email: 'test1@gmail.com',
                firstName: 'James',
                lastName: 'Doe',
                phone: '237416221',
                customFields: { filter1: 'filterval1' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v2/1809802/subscribers',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  subscribers: [
                    {
                      email: 'test1@gmail.com',
                      first_name: 'James',
                      last_name: 'Doe',
                      phone: '237416221',
                      ip_address: '0.0.0.0',
                      custom_fields: { filter1: 'filterval1' },
                    },
                  ],
                },
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '',
                enableUserCreation: true,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'identify',
              traits: {
                email: '12324adfgs',
                firstName: 'James',
                lastName: 'Doe',
                phone: '237416221',
                customFields: { filter1: 'filterval1' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
            destination: {
              Config: {
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '',
                enableUserCreation: true,
              },
            },
            error: 'dripId or email is required for the call',
            statTags: {
              destType: 'DRIP',
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '',
                enableUserCreation: true,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'identify',
              traits: {
                email: 'test1@gmail.com',
                name: 'James Doe',
                phone: '237416221',
                filter1: 'filterval1',
                filter2: 'filterval2',
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v2/1809802/subscribers',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  subscribers: [
                    {
                      email: 'test1@gmail.com',
                      first_name: 'James',
                      last_name: 'Doe',
                      phone: '237416221',
                      ip_address: '0.0.0.0',
                      custom_fields: { filter1: 'filterval1', filter2: 'filterval2' },
                    },
                  ],
                },
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: true,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'identify',
              traits: {
                email: 'test1@gmail.com',
                name: 'James Doe',
                phone: '237416221',
                filter1: 'filterval1',
                filter2: 'filterval2',
                tags: ['tag1', 'tag2'],
                startingEmailIndex: 1,
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v2/1809802/campaigns/915194776/subscribers',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: { subscribers: [{ email: 'test1@gmail.com', starting_email_index: 1 }] },
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: true,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: 'testing',
              properties: { email: 'user1@gmail.com', customFields: { field1: 'val1' } },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v2/1809802/events',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      email: 'user1@gmail.com',
                      properties: { field1: 'val1' },
                      action: 'testing',
                      occurred_at: '2019-10-14T09:03:17.562Z',
                    },
                  ],
                },
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: true,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: '',
              properties: { email: 'user1@gmail.com', custom_fields: { field1: 'val1' } },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
            destination: {
              Config: {
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: true,
              },
            },
            error: 'Event name is required',
            statTags: {
              destType: 'DRIP',
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: false,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: 'testing',
              properties: { email: 'identified_user@gmail.com', customFields: { field1: 'val1' } },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v2/1809802/events',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      email: 'identified_user@gmail.com',
                      properties: { field1: 'val1' },
                      action: 'testing',
                      occurred_at: '2019-10-14T09:03:17.562Z',
                    },
                  ],
                },
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: false,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: 'testing',
              properties: { email: 'identified_user@gmail.com', field1: 'val1' },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v2/1809802/events',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      email: 'identified_user@gmail.com',
                      properties: { field1: 'val1' },
                      action: 'testing',
                      occurred_at: '2019-10-14T09:03:17.562Z',
                    },
                  ],
                },
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
    name: 'drip',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: false,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: 'testing',
              properties: { email: 'unidentified_user@gmail.com', field1: 'val1' },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
            destination: {
              Config: {
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: false,
              },
            },
            error: 'Error occurred while checking user : ',
            statTags: {
              destType: 'DRIP',
              errorCategory: 'network',
              errorType: 'aborted',
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
    name: 'drip',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: false,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: 'checkout started',
              properties: {
                email: 'identified_user@gmail.com',
                field1: 'val1',
                affiliation: 'my_custom_order',
                order_id: '456445746',
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v3/1809802/shopper_activity/order',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  action: 'placed',
                  email: 'identified_user@gmail.com',
                  occurred_at: '2019-10-14T09:03:17.562Z',
                  order_id: '456445746',
                  provider: 'my_custom_order',
                },
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: false,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: 'checkout started',
              properties: {
                email: 'identified_user@gmail.com',
                field1: 'val1',
                affiliation: 'my_custom_order',
                order_id: '456445746',
                products: [{ name: 'shirt', price: 11.16 }],
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v3/1809802/shopper_activity/order',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  action: 'placed',
                  email: 'identified_user@gmail.com',
                  occurred_at: '2019-10-14T09:03:17.562Z',
                  order_id: '456445746',
                  provider: 'my_custom_order',
                  items: [{ name: 'shirt', price: 11.16 }],
                },
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
    name: 'drip',
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
                apiKey: 'e8592245ee0fcf9e9997dfe538fb8b22',
                accountId: '1809802',
                campaignId: '915194776',
                enableUserCreation: false,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              type: 'track',
              event: 'checkout',
              properties: {
                email: 'identified_user@gmail.com',
                field1: 'val1',
                customFields: { field2: 'val2' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
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
              endpoint: 'https://api.getdrip.com/v2/1809802/events',
              headers: {
                Authorization: 'Basic ZTg1OTIyNDVlZTBmY2Y5ZTk5OTdkZmU1MzhmYjhiMjI=',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  events: [
                    {
                      action: 'checkout',
                      email: 'identified_user@gmail.com',
                      occurred_at: '2019-10-14T09:03:17.562Z',
                      properties: { field2: 'val2' },
                    },
                  ],
                },
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
