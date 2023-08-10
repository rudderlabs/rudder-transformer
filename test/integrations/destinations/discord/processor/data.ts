export const data = [
  {
    name: 'discord',
    description: 'Unsupported Message Type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-Discord',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'DISCORD',
                DisplayName: 'Discord',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                eventChannelSettings: [],
                eventTemplateSettings: [],
                IdentifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
                whitelistedTraitsSettings: [],
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
              destinationType: 'DISCORD',
              jobId: 126,
              messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type page is not supported',
            metadata: {
              anonymousId: '4de817fb-7f8e-4e23-b9be-f6736dbda20f',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 126,
              messageId: '9ecc0183-89ed-48bd-87eb-b2d8e1ca6780',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
            statTags: {
              destType: 'DISCORD',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
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
    name: 'discord',
    description:
      'Identify Call with Default Template with whitelist Traits and default embed Message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-Discord',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'DISCORD',
                DisplayName: 'Discord',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                embedTitleTemplate: '',
                embedDescriptionTemplate: '',
                embedFlag: true,
                eventChannelSettings: [],
                eventTemplateSettings: [],
                webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
                whitelistedTraitsSettings: [
                  {
                    trait: 'country',
                  },
                  {
                    trait: 'email',
                  },
                  {
                    trait: 'name',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '12345',
              channel: 'web',
              context: {
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
              type: 'Identify',
              userId: '12345',
            },
            metadata: {
              anonymousId: '12345',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 123,
              messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              anonymousId: '12345',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 123,
              messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://abcd.com/efgh/89078/979868/98678',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content:
                    'Identified my-name-1 with country: USA email: test@domain.com name: my-name-1 ',
                  embeds: [
                    {
                      description: 'Identify call made',
                      title: 'Message from Rudderstack ',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'discord',
    description: 'Identify Call with user Template without whitelist Traits and no embed Message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-Discord',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'DISCORD',
                DisplayName: 'Discord',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                embedTitleTemplate: '',
                embedDescriptionTemplate: '',
                embedFlag: false,
                eventChannelSettings: [],
                eventTemplateSettings: [],
                identifyTemplate: '{{name}} having {{traits}} has been identified',
                webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '12345',
              channel: 'web',
              context: {
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
              destinationType: 'DISCORD',
              jobId: 123,
              messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              anonymousId: '12345',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 123,
              messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://abcd.com/efgh/89078/979868/98678',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content:
                    'my-name-1 having country: USA email: test@domain.com hiji: hulala-1 name: my-name-1  has been identified',
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'discord',
    description: 'Identify Call with default Template without whitelist Traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-Discord',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'DISCORD',
                DisplayName: 'Discord',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                embedTitleTemplate: '',
                embedDescriptionTemplate: '',
                embedFlag: false,
                eventChannelSettings: [],
                eventTemplateSettings: [],
                webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '12345',
              channel: 'web',
              context: {
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name3: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              traits: {
                country: 'USA',
                email: 'test@domain.com',
                hiji: 'hulala-1',
                name: 'my-name-3',
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
              destinationType: 'DISCORD',
              jobId: 123,
              messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              anonymousId: '12345',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 123,
              messageId: '4aaecff2-a513-4bbf-9824-c471f4ac9777',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://abcd.com/efgh/89078/979868/98678',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content:
                    'Identified my-name-3 with country: USA email: test@domain.com hiji: hulala-1 name: my-name-3 ',
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'discord',
    description:
      'track Call with multiple userTemplate for a single channel with properties.keys with Title Template',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-Discord',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'DISCORD',
                DisplayName: 'Discord',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                embedTitleTemplate: '{{name}}',
                embedDescriptionTemplate: '',
                embedFlag: true,
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  {
                    eventName: 'test',
                    eventRegex: true,
                    eventTemplate: '{{event}} is performed by {{name}} with {{properties}}',
                  },
                ],
                IdentifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
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
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '00000000000000000000000000',
              channel: 'web',
              context: {
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
              integrations: {
                All: true,
              },
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
            metadata: {
              anonymousId: '00000000000000000000000000',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 129,
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              anonymousId: '00000000000000000000000000',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 129,
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://abcd.com/efgh/89078/979868/98678',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content: 'my-name performed test_eventing_testis with test_val1 test_val2',
                  embeds: [
                    {
                      description: 'Track call made',
                      title: 'my-name',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'discord',
    description:
      'track Call with one userTemplate for one channel with whitelist traits and regex as false with embed',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-Discord',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'DISCORD',
                DisplayName: 'Discord',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                embedTitleTemplate: '{{name}}',
                embedDescriptionTemplate: 'user Template {{event}}',
                embedFlag: true,
                eventTemplateSettings: [
                  {
                    eventName: 'is',
                    eventRegex: true,
                    eventTemplate:
                      '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
                  },
                  {
                    eventName: 'test_eventing_test',
                    eventRegex: false,
                    eventTemplate: '{{event}} is performed by {{name}} with {{traits}}',
                  },
                ],
                IdentifyTemplate: 'identified {{name}} with {{traits}}',
                webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
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
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: '00000000000000000000000000',
              channel: 'web',
              context: {
                traits: {
                  country: 'India',
                  email: 'name@domain.com',
                  hiji: 'hulala',
                  name: 'my-name',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              event: 'test_eventing_test',
              integrations: {
                All: true,
              },
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
            metadata: {
              anonymousId: '00000000000000000000000000',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 129,
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              anonymousId: '00000000000000000000000000',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 129,
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://abcd.com/efgh/89078/979868/98678',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content: 'test_eventing_test is performed by my-name with hiji: hulala ',
                  embeds: [
                    {
                      description: 'user Template test_eventing_test',
                      title: 'my-name',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'discord',
    description: 'track Call with deafult settings',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              Name: 'test-Discord',
              DestinationDefinition: {
                ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
                Name: 'DISCORD',
                DisplayName: 'Discord',
                Config: {
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                eventTemplateSettings: [],
                webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            message: {
              anonymousId: 'A1',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              event: 'test_eventing_test',
              integrations: {
                All: true,
              },
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
            },
            metadata: {
              anonymousId: '00000000000000000000000000',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 129,
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              anonymousId: '00000000000000000000000000',
              destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
              destinationType: 'DISCORD',
              jobId: 129,
              messageId: '8b8d5937-09bc-49dc-a35e-8cd6370575f8',
              sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://abcd.com/efgh/89078/979868/98678',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  content:
                    'Anonymous user A1 did test_eventing_test with currency: USD key1: test_val1 key2: test_val2 revenue: 30 user_actual_id: 12345 ',
                },
                XML: {},
                JSON_ARRAY: {},
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
