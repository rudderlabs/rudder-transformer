export const data = [
  {
    name: 'mailchimp',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
                enableMergeFields: true,
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                  firstName: 'Bob',
                  lastName: 'Dole',
                  zip: '123',
                  state: 'test',
                  city: 'test',
                  addressLine1: 'test',
                  birthday: '2000-05-06',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
              method: 'PUT',
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  merge_fields: {
                    ADDRESS: {
                      addr1: 'test',
                      city: 'test',
                      state: 'test',
                      zip: '123',
                    },
                    FNAME: 'Bob',
                    LNAME: 'Dole',
                    ANONYMOUSI: 'userId12345',
                    BIRTHDAY: '05/06',
                  },
                  email_address: 'bob.dole@initech.com',
                  status: 'subscribed',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
                enableMergeFields: true,
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                MailChimp: {
                  subscriptionStatus: 'subscribed',
                },
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'identify',
              userId: 'userId12345',
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
              method: 'PUT',
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  status: 'subscribed',
                  email_address: 'bob.dole@initech.com',
                  merge_fields: {
                    ANONYMOUSI: 'userId12345',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'Titli Test',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'apiKey-dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              type: 'identify',
              sentAt: '2021-05-18T06:58:57.186Z',
              userId: 'test.rudderlabs@yara.com',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.18',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'https://app.rudderstack.com/sources/1qHR2Qzd894ievNGc4aBHmjltLD',
                  path: '/sources/1qHR2Qzd894ievNGc4aBHmjltLD',
                  title: 'RudderStack',
                  search: '',
                  tab_url: 'https://app.rudderstack.com/sources/1qHR2Qzd894ievNGc4aBHmjltLD',
                  referrer: '$direct',
                  initial_referrer: 'https://www.google.com/',
                  referring_domain: '',
                  initial_referring_domain: 'www.google.com',
                },
                locale: 'en-US',
                screen: {
                  width: 1792,
                  height: 1120,
                  density: 2,
                },
                traits: {
                  name: 'test rudderlabs',
                  email: 'test.rudderlabs@yara.com',
                  userId: '1sWVaQTxoVwjvShC0295E6OqMaP',
                  first_login: false,
                  workspaceId: '1jWrHYPjNGSHbvKwzow0ZFPIQll',
                  account_type: 'invited',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.18',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
              },
              rudderId: '6d612dda-9c8c-4062-9d09-af9425b846ce',
              messageId: 'c6d49688-89f2-45cf-b061-0ae3c212a4e5',
              timestamp: '2021-05-18T06:58:57.811Z',
              receivedAt: '2021-05-18T06:58:57.812Z',
              request_ip: '122.172.221.51',
              anonymousId: '6914679f-fd34-45ef-86e0-4930e6e8b91a',
              integrations: {
                Salesforce: true,
              },
              originalTimestamp: '2021-05-18T06:58:57.185Z',
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
            error: 'User does not have access to the requested operation',
            statTags: {
              destType: 'MAILCHIMP',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 401,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'Titli Test',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              type: 'page',
              sentAt: '2021-05-18T07:02:17.675Z',
              userId: '',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.18',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'https://app.rudderstack.com/signup?type=freetrial',
                  path: '/signup',
                  title: '',
                  search: '?type=freetrial',
                  tab_url: 'https://app.rudderstack.com/signup?type=freetrial',
                  referrer:
                    'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                  initial_referrer:
                    'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                  referring_domain: 'rudderstack.medium.com',
                  initial_referring_domain: 'rudderstack.medium.com',
                },
                locale: 'en-GB',
                screen: {
                  density: 2,
                },
                traits: {},
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.18',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
              },
              rudderId: '4dbe224c-6aea-4d89-8da6-09d27c0d2908',
              messageId: '72df8cb0-54ab-417c-8e87-e97e9d339feb',
              timestamp: '2021-05-18T07:02:18.566Z',
              properties: {
                url: 'https://app.rudderstack.com/signup?type=freetrial',
                path: '/signup',
                title: '',
                search: '?type=freetrial',
                tab_url: 'https://app.rudderstack.com/signup?type=freetrial',
                referrer:
                  'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                initial_referrer:
                  'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                referring_domain: 'rudderstack.medium.com',
                initial_referring_domain: 'rudderstack.medium.com',
              },
              receivedAt: '2021-05-18T07:02:18.566Z',
              request_ip: '162.44.150.11',
              anonymousId: '58ec7b39-48f1-4d83-9d45-a48c64f96fa0',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-05-18T07:02:17.675Z',
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
            error: 'message type page is not supported',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    identifierType: 'email_address',
                    id: 'bob.dole@initech.com',
                    type: 'audience',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              traits: {
                merge_fields: {
                  FIRSTNAME: 'Bob',
                },
                status: 'subscribed',
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
              method: 'PUT',
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  merge_fields: {
                    FIRSTNAME: 'Bob',
                  },
                  status: 'subscribed',
                  email_address: 'bob.dole@initech.com',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              type: 'identify',
              traits: {
                status: 'subscri',
              },
              userId: 'emrichardson820+22822@gmail.com',
              channel: 'sources',
              context: {
                sources: {
                  job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
                  task_id: 'vw_rs_mailchimp_mocked_hg_data',
                  version: 'v1.8.1',
                  batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
                  job_run_id: 'c8el40l6e87v0c4hkbl0',
                  task_run_id: 'c8el40l6e87v0c4hkblg',
                },
                externalId: [
                  {
                    id: 'emrichardson820+22822@gmail.com',
                    type: 'MAILCHIMP-92e1f1ad2c',
                    identifierType: 'email_address',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '4d5d0ed0-9db8-41cc-9bb0-a032f6bfa97a',
              messageId: 'b3bee036-fc26-4f6d-9867-c17f85708a82',
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
            error:
              'The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
            error: 'Email is required for identify',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud112',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'jhon@gmail.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
                XML: {},
                FORM: {},
                JSON: {
                  status: 'subscribed',
                  email_address: 'jhon@gmail.com',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              audienceId: 'aud112',
              version: '1',
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud112/members/7f3863b197eeff650876bb89eca08e57',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'bob.dole@initech.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
                XML: {},
                FORM: {},
                JSON: {
                  email_address: 'bob.dole@initech.com',
                  status: 'subscribed',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              audienceId: 'aud111',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              version: '1',
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                MailChimp: {
                  subscriptionStatus: 'subscribed',
                },
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'identify',
              userId: 'userId12345',
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
              method: 'PUT',
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  status: 'subscribed',
                  email_address: 'bob.dole@initech.com',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: '',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'test-rudderlabs',
                  email: 'test-rudderlabs-test@initech.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
            error: 'API Key not found. Aborting',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'test-rudderlabs',
                  email: 'test-rudderlabs-test@initech.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
            error: 'Audience Id not found. Aborting',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: '',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'test-rudderlabs',
                  email: 'test-rudderlabs-test@initech.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'identify',
              userId: 'userId12345',
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
            error: 'DataCenter Id not found. Aborting',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: 'test-rudderlabs',
                  email: 'test-rudderlabs-test@initech.com',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '21e475b2-3694-477b-afb6-5b94a81aac21',
              originalTimestamp: '2019-11-15T10:22:32Z',
              receivedAt: '2019-11-15T15:52:37+05:30',
              request_ip: '[::1]:62921',
              sentAt: '2019-11-15T10:22:37Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:52:32+05:30',
              type: 'group',
              userId: 'userId12345',
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
            error: 'message type group is not supported',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              properties: {
                brand: 'Aster',
                product: 'Garments',
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 'local testing',
              userId: 'userId12345',
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
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  name: 'local_testing',
                  occurred_at: '2019-11-15T10:26:53+00:00',
                  properties: {
                    brand: 'Aster',
                    product: 'Garments',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              properties: {
                brand: 'Aster',
                product: 'Garments',
                isSyncing: false,
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 'local testing',
              userId: 'userId12345',
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
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  name: 'local_testing',
                  occurred_at: '2019-11-15T10:26:53+00:00',
                  is_syncing: false,
                  properties: {
                    brand: 'Aster',
                    product: 'Garments',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                },
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 'local testing',
              userId: 'userId12345',
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
            error: 'Email is required for track',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              properties: {
                brand: 'Aster',
                product: 'Garments',
                isSyncing: false,
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              userId: 'userId12345',
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
            error: 'Missing required value from "event"',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 'local testing',
              userId: 'userId12345',
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
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  name: 'local_testing',
                  occurred_at: '2019-11-15T10:26:53+00:00',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              properties: {
                brand: 'Aster',
                product: 'Garments',
                isSyncing: false,
                products: [
                  {
                    product_id: '123',
                    price: '14',
                  },
                  {
                    product_id: '123',
                    price: 14,
                  },
                ],
                purchased: false,
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 'local testing',
              userId: 'userId12345',
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
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  name: 'local_testing',
                  occurred_at: '2019-11-15T10:26:53+00:00',
                  is_syncing: false,
                  properties: {
                    brand: 'Aster',
                    product: 'Garments',
                    products: '[{"product_id":"123","price":"14"},{"product_id":"123","price":14}]',
                    purchased: 'false',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              properties: {
                brand: 'Aster',
                product: 'Garments',
                isSyncing: false,
                products: [
                  {
                    product_id: '123',
                    price: '14',
                  },
                  {
                    product_id: '123',
                    price: 14,
                  },
                ],
                purchased: false,
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 22,
              userId: 'userId12345',
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
              endpoint:
                'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab/events',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YXBpS2V5OmR1bW15QXBpS2V5',
              },
              params: {},
              body: {
                JSON: {
                  name: '22',
                  occurred_at: '2019-11-15T10:26:53+00:00',
                  is_syncing: false,
                  properties: {
                    brand: 'Aster',
                    product: 'Garments',
                    products: '[{"product_id":"123","price":"14"},{"product_id":"123","price":14}]',
                    purchased: 'false',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              audienceId: 'aud111',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              properties: {
                brand: 'Aster',
                product: 'Garments',
                isSyncing: false,
                products: [
                  {
                    product_id: '123',
                    price: '14',
                  },
                  {
                    product_id: '123',
                    price: 14,
                  },
                ],
                purchased: false,
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 'E',
              userId: 'userId12345',
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
            error: 'Event name should be between 2 and 30 characters',
            statTags: {
              destType: 'MAILCHIMP',
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
    name: 'mailchimp',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'test-mc',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'dummyApiKey',
                audienceId: 'aud111',
                datacenterId: 'usXX',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              anonymousId: 'userId12345',
              channel: 'web',
              context: {
                traits: {
                  anonymousId: 'userId12345',
                  email: 'bob.dole@initech.com',
                },
              },
              properties: {
                brand: 'Aster',
                product: 'Garments',
                isSyncing: false,
                products: [
                  {
                    product_id: '123',
                    price: '14',
                  },
                  {
                    product_id: '123',
                    price: 14,
                  },
                ],
                purchased: false,
              },
              messageId: '6d1f3ca8-e2d0-4d34-9926-44596171af0c',
              originalTimestamp: '2019-11-15T10:26:53Z',
              receivedAt: '2019-11-15T15:56:58+05:30',
              sentAt: '2019-11-15T10:26:58Z',
              source_id: '1TdhTcwsUVOeEMWyPUpQIgF3pYr',
              timestamp: '2019-11-15T15:56:53+05:30',
              type: 'track',
              event: 'Event Name more than 30 characters abcdefghijklmno',
              userId: 'userId12345',
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
            error: 'Event name should be between 2 and 30 characters',
            statTags: {
              destType: 'MAILCHIMP',
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
];
