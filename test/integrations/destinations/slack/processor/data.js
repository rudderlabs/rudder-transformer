const data = [
  {
    name: 'slack',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.1',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.1' },
                locale: 'en-US',
                os: { name: '', version: '' },
                page: {
                  path: '/tests/html/script-test.html',
                  referrer: 'http://localhost:1111/tests/html/',
                  search: '',
                  title: '',
                  url: 'http://localhost:1111/tests/html/script-test.html',
                },
                screen: { density: 1.7999999523162842 },
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              originalTimestamp: '2020-03-23T03:46:30.916Z',
              properties: {
                path: '/tests/html/script-test.html',
                referrer: 'http://localhost:1111/tests/html/',
                search: '',
                title: '',
                url: 'http://localhost:1111/tests/html/script-test.html',
              },
              receivedAt: '2020-03-23T09:16:31.041+05:30',
              request_ip: '[::1]:52056',
              sentAt: '2020-03-23T03:46:30.916Z',
              timestamp: '2020-03-23T09:16:31.041+05:30',
              type: 'page',
              userId: '12345',
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
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            error: 'Event type page is not supported',
            statTags: {
              destType: 'SLACK',
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
    name: 'slack',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.1',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.1' },
                locale: 'en-US',
                os: { name: '', version: '' },
                page: { path: '', referrer: '', search: '', title: '', url: '' },
                screen: { density: 1.7999999523162842 },
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              traits: {
                country: 'USA',
                email: 'test@domain.com',
                hiji: 'hulala-1',
                name: 'my-name-1',
              },
              integrations: { All: true },
              messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
              originalTimestamp: '2020-03-23T03:41:46.122Z',
              receivedAt: '2020-03-23T09:11:46.244+05:30',
              request_ip: '[::1]:52055',
              sentAt: '2020-03-23T03:41:46.123Z',
              timestamp: '2020-03-23T09:11:46.243+05:30',
              type: 'identify',
              userId: '12345',
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
              endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  payload:
                    '{"text":"identified my-name-1 with hiji: hulala-1 ","username":"RudderStack","icon_url":"https://cdn.rudderlabs.com/rudderstack.png"}',
                },
              },
              files: {},
              userId: '12345',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'slack',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}} and traits {{traitsList.hiji}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '00000000000000000000000000',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.1',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.1' },
                locale: 'en-US',
                os: { name: '', version: '' },
                page: {
                  path: '/tests/html/script-test.html',
                  referrer: 'http://localhost:1111/tests/html/',
                  search: '',
                  title: '',
                  url: 'http://localhost:1111/tests/html/script-test.html',
                },
                screen: { density: 1.7999999523162842 },
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              event: 'test_isent1',
              integrations: { All: true },
              messageId: '78102118-56ac-4c5a-a495-8cd7c8f71cc2',
              originalTimestamp: '2020-03-23T03:46:30.921Z',
              properties: {
                currency: 'USD',
                key1: 'test_val1',
                key2: 'test_val2',
                revenue: 30,
                user_actual_id: 12345,
              },
              receivedAt: '2020-03-23T09:16:31.064+05:30',
              request_ip: '[::1]:52057',
              sentAt: '2020-03-23T03:46:30.921Z',
              timestamp: '2020-03-23T09:16:31.064+05:30',
              type: 'track',
              userId: '12345',
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
              endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  payload:
                    '{"channel":"#slack_integration","text":"my-name performed test_isent1 with test_val1 test_val2 and traits hulala","username":"RudderStack","icon_url":"https://cdn.rudderlabs.com/rudderstack.png"}',
                },
              },
              files: {},
              userId: '12345',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'slack',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '00000000000000000000000000',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.1',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.1' },
                locale: 'en-US',
                os: { name: '', version: '' },
                page: {
                  path: '/tests/html/script-test.html',
                  referrer: 'http://localhost:1111/tests/html/',
                  search: '',
                  title: '',
                  url: 'http://localhost:1111/tests/html/script-test.html',
                },
                screen: { density: 1.7999999523162842 },
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              event: 'test_eventing_testis',
              integrations: { All: true },
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              originalTimestamp: '2020-03-23T03:46:30.922Z',
              properties: {
                currency: 'USD',
                key1: 'test_val1',
                key2: 'test_val2',
                revenue: 30,
                user_actual_id: 12345,
              },
              receivedAt: '2020-03-23T09:16:31.064+05:30',
              request_ip: '[::1]:52054',
              sentAt: '2020-03-23T03:46:30.923Z',
              timestamp: '2020-03-23T09:16:31.063+05:30',
              type: 'track',
              userId: '12345',
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
              endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  payload:
                    '{"channel":"#slack_integration","text":"my-name performed test_eventing_testis with test_val1 test_val2","username":"RudderStack","icon_url":"https://cdn.rudderlabs.com/rudderstack.png"}',
                },
              },
              files: {},
              userId: '12345',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'slack',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '00000000000000000000000000',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.1',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.1' },
                locale: 'en-US',
                os: { name: '', version: '' },
                page: {
                  path: '/tests/html/script-test.html',
                  referrer: 'http://localhost:1111/tests/html/',
                  search: '',
                  title: '',
                  url: 'http://localhost:1111/tests/html/script-test.html',
                },
                screen: { density: 1.7999999523162842 },
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              event: 'test_eventing_testis',
              integrations: { All: true },
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              originalTimestamp: '2020-03-23T03:46:30.922Z',
              properties: {
                currency: 'USD',
                key1: 'test_val1',
                key2: 'test_val2',
                revenue: 30,
                user_actual_id: 12345,
              },
              receivedAt: '2020-03-23T09:16:31.064+05:30',
              request_ip: '[::1]:52054',
              sentAt: '2020-03-23T03:46:30.923Z',
              timestamp: '2020-03-23T09:16:31.063+05:30',
              userId: '12345',
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
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            error: 'Event type is required',
            statTags: {
              destType: 'SLACK',
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
    name: 'slack',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '00000000000000000000000000',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.1',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.1' },
                locale: 'en-US',
                os: { name: '', version: '' },
                page: {
                  path: '/tests/html/script-test.html',
                  referrer: 'http://localhost:1111/tests/html/',
                  search: '',
                  title: '',
                  url: 'http://localhost:1111/tests/html/script-test.html',
                },
                screen: { density: 1.7999999523162842 },
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              originalTimestamp: '2020-03-23T03:46:30.922Z',
              properties: {
                currency: 'USD',
                key1: 'test_val1',
                key2: 'test_val2',
                revenue: 30,
                user_actual_id: 12345,
              },
              receivedAt: '2020-03-23T09:16:31.064+05:30',
              request_ip: '[::1]:52054',
              sentAt: '2020-03-23T03:46:30.923Z',
              timestamp: '2020-03-23T09:16:31.063+05:30',
              type: 'track',
              userId: '12345',
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
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            error: 'Event name is required',
            statTags: {
              destType: 'SLACK',
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
    name: 'slack',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties. key1}} {{properties.key2}} and traits {{traitsList.hiji}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '00000000000000000000000000',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.1',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.1' },
                locale: 'en-US',
                os: { name: '', version: '' },
                page: {
                  path: '/tests/html/script-test.html',
                  referrer: 'http://localhost:1111/tests/html/',
                  search: '',
                  title: '',
                  url: 'http://localhost:1111/tests/html/script-test.html',
                },
                screen: { density: 1.7999999523162842 },
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              event: 'test_isent1',
              integrations: { All: true },
              messageId: '78102118-56ac-4c5a-a495-8cd7c8f71cc2',
              originalTimestamp: '2020-03-23T03:46:30.921Z',
              properties: {
                currency: 'USD',
                key1: 'test_val1',
                key2: 'test_val2',
                revenue: 30,
                user_actual_id: 12345,
              },
              receivedAt: '2020-03-23T09:16:31.064+05:30',
              request_ip: '[::1]:52057',
              sentAt: '2020-03-23T03:46:30.921Z',
              timestamp: '2020-03-23T09:16:31.064+05:30',
              type: 'track',
              userId: '12345',
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
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-slack',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'SLACK',
                DisplayName: 'Slack',
                Config: { excludeKeys: [], includeKeys: [] },
              },
              Config: {
                eventChannelSettings: [
                  { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
                  { eventChannel: '', eventName: '', eventRegex: false },
                  { eventChannel: '', eventName: '', eventRegex: false },
                ],
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties. key1}} {{properties.key2}} and traits {{traitsList.hiji}}',
                  },
                  { eventName: '', eventRegex: false, eventTemplate: '' },
                ],
                identifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            error:
              "Something is wrong with the event template: '{{name}} performed {{event}} with {{properties. key1}} {{properties.key2}} and traits {{traitsList.hiji}}'",
            statTags: {
              destType: 'SLACK',
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
module.exports = {
  data,
};
