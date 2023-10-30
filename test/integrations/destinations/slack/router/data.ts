export const data = [
  {
    name: 'slack',
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
                ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                Name: 'test-slack',
                DestinationDefinition: {
                  ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                  Name: 'SLACK',
                  DisplayName: 'Slack',
                  Config: {
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  eventChannelSettings: [
                    {
                      eventChannel: '#slack_integration',
                      eventName: 'is',
                      eventRegex: true,
                    },
                    {
                      eventChannel: '',
                      eventName: '',
                      eventRegex: false,
                    },
                    {
                      eventChannel: '',
                      eventName: '',
                      eventRegex: false,
                    },
                  ],
                  eventTemplateSettings: [
                    {
                      eventName: 'is',
                      eventRegex: true,
                      eventTemplate:
                        '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                    },
                    {
                      eventName: '',
                      eventRegex: false,
                      eventTemplate: '',
                    },
                  ],
                  identifyTemplate: 'identified {{name}} with {{traits}}',
                  webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                  whitelistedTraitsSettings: [
                    {
                      trait: 'hiji',
                    },
                    {
                      trait: '',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
                IsrouterEnabled: true,
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.1',
                  },
                  locale: 'en-US',
                  os: {
                    name: '',
                    version: '',
                  },
                  page: {
                    path: '/tests/html/script-test.html',
                    referrer: 'http://localhost:1111/tests/html/',
                    search: '',
                    title: '',
                    url: 'http://localhost:1111/tests/html/script-test.html',
                  },
                  screen: {
                    density: 1.7999999523162842,
                  },
                  traits: {
                    country: 'India',
                    email: 'name@domain.com',
                    hiji: 'hulala',
                    name: 'my-name',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
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
              metadata: {
                anonymousId: '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
                destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                destinationType: 'SLACK',
                jobId: 126,
                messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
                sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
              },
            },
          ],
          destType: 'slack',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              destination: {
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
                DestinationDefinition: {
                  Config: { excludeKeys: [], includeKeys: [] },
                  DisplayName: 'Slack',
                  ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                  Name: 'SLACK',
                },
                Enabled: true,
                ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                IsrouterEnabled: true,
                Name: 'test-slack',
                Transformations: [],
              },
              error: 'Event type page is not supported',
              metadata: [
                {
                  anonymousId: '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
                  destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                  destinationType: 'SLACK',
                  jobId: 126,
                  messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
                  sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
                },
              ],
              statTags: {
                destType: 'SLACK',
                destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    name: 'slack',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                Name: 'test-slack',
                DestinationDefinition: {
                  ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                  Name: 'SLACK',
                  DisplayName: 'Slack',
                  Config: {
                    excludeKeys: [],
                    includeKeys: [],
                  },
                },
                Config: {
                  eventChannelSettings: [
                    {
                      eventChannel: '#slack_integration',
                      eventName: 'is',
                      eventRegex: true,
                    },
                    {
                      eventChannel: '',
                      eventName: '',
                      eventRegex: false,
                    },
                    {
                      eventChannel: '',
                      eventName: '',
                      eventRegex: false,
                    },
                  ],
                  eventTemplateSettings: [
                    {
                      eventName: 'is',
                      eventRegex: true,
                      eventTemplate:
                        '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                    },
                    {
                      eventName: '',
                      eventRegex: false,
                      eventTemplate: '',
                    },
                  ],
                  identifyTemplate: 'identified {{name}} with {{traits}}',
                  webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                  whitelistedTraitsSettings: [
                    {
                      trait: 'hiji',
                    },
                    {
                      trait: '',
                    },
                  ],
                },
                Enabled: true,
                Transformations: [],
                IsrouterEnabled: true,
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.1',
                  },
                  locale: 'en-US',
                  os: {
                    name: '',
                    version: '',
                  },
                  page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                  screen: {
                    density: 1.7999999523162842,
                  },
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
                integrations: {
                  All: true,
                },
                messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
                originalTimestamp: '2020-03-23T03:41:46.122Z',
                receivedAt: '2020-03-23T09:11:46.244+05:30',
                request_ip: '[::1]:52055',
                sentAt: '2020-03-23T03:41:46.123Z',
                timestamp: '2020-03-23T09:11:46.243+05:30',
                type: 'identify',
                userId: '12345',
              },
              metadata: {
                anonymousId: '12345',
                destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                destinationType: 'SLACK',
                jobId: 123,
                messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
                sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
              },
            },
          ],
          destType: 'slack',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: [
                {
                  body: {
                    FORM: {
                      payload:
                        '{"text":"identified my-name-1 with hiji: hulala-1 ","username":"RudderStack","icon_url":"https://cdn.rudderlabs.com/rudderstack.png"}',
                    },
                    JSON: {},
                    JSON_ARRAY: {},
                    XML: {},
                  },
                  endpoint: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
                  files: {},
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  method: 'POST',
                  params: {},
                  statusCode: 200,
                  type: 'REST',
                  userId: '12345',
                  version: '1',
                },
              ],
              destination: {
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
                DestinationDefinition: {
                  Config: { excludeKeys: [], includeKeys: [] },
                  DisplayName: 'Slack',
                  ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                  Name: 'SLACK',
                },
                Enabled: true,
                ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                IsrouterEnabled: true,
                Name: 'test-slack',
                Transformations: [],
              },
              metadata: [
                {
                  anonymousId: '12345',
                  destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
                  destinationType: 'SLACK',
                  jobId: 123,
                  messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
                  sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
