export const data = [
  {
    name: 'mailchimp',
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
                ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
                Name: 'test-mc',
                DestinationDefinition: {
                  ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                  Name: 'MC',
                  DisplayName: 'MailChimp',
                },
                Config: {
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 2,
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
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 3,
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
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 4,
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
                    subscriptionStatus: 'subscrib',
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
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 5,
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
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 6,
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
                  is_syncing: false,
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
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 7,
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
          destType: 'mailchimp',
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
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://usXX.api.mailchimp.com/3.0/lists/aud111?skip_merge_validation=true&skip_duplicate_check=false',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic YXBpS2V5OmFwaWtleQ==',
                },
                params: {},
                body: {
                  JSON: {
                    members: [
                      {
                        email_address: 'bob.dole@initech.com',
                        merge_fields: {
                          FNAME: 'Bob',
                          LNAME: 'Dole',
                          ANONYMOUSI: 'userId12345',
                        },
                        status: 'subscribed',
                      },
                      {
                        email_address: 'bob.dole@initech.com',
                        merge_fields: {
                          ANONYMOUSI: 'userId12345',
                        },
                        status: 'subscribed',
                      },
                    ],
                    update_existing: true,
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
                {
                  jobId: 3,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
                Name: 'test-mc',
                DestinationDefinition: {
                  ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                  Name: 'MC',
                  DisplayName: 'MailChimp',
                },
                Config: {
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab/events',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic YXBpS2V5OmFwaWtleQ==',
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
              },
              metadata: [
                {
                  jobId: 5,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
                Name: 'test-mc',
                DestinationDefinition: {
                  ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                  Name: 'MC',
                  DisplayName: 'MailChimp',
                },
                Config: {
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://usXX.api.mailchimp.com/3.0/lists/aud111/members/48cd6232dc124497369f59c33d3eb4ab/events',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic YXBpS2V5OmFwaWtleQ==',
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
                      products:
                        '[{"product_id":"123","price":"14"},{"product_id":"123","price":14}]',
                      purchased: 'false',
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                audienceId: 'aud111',
              },
              metadata: [
                {
                  jobId: 7,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
                Name: 'test-mc',
                DestinationDefinition: {
                  ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                  Name: 'MC',
                  DisplayName: 'MailChimp',
                },
                Config: {
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
            },
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
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 6,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Missing required value from "event"',
              statTags: {
                destType: 'MAILCHIMP',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
            },
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
                  apiKey: 'apikey',
                  audienceId: 'aud111',
                  datacenterId: 'usXX',
                  enableMergeFields: true,
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 4,
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]',
              statTags: {
                destType: 'MAILCHIMP',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'mailchimp',
    description: 'events batching',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
                  apiKey: 'apiKey-dummyApiKey',
                  audienceId: '1232yyqw22',
                  datacenterId: 'us20',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 2,
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
                  apiKey: 'apiKey-dummyApiKey',
                  audienceId: '1232yyqw22',
                  datacenterId: 'us20',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 3,
              },
              message: {
                type: 'identify',
                traits: {
                  status: 'subscribed',
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
                  apiKey: 'apiKey-dummyApiKey',
                  audienceId: '1232yyqw22',
                  datacenterId: 'us20',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 4,
              },
              message: {
                type: 'identify',
                traits: {
                  status: 'subscribed',
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
                  apiKey: 'apiKey-dummyApiKey',
                  audienceId: '1232yyqw22',
                  datacenterId: 'us20',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 5,
              },
              message: {
                type: 'identify',
                traits: {
                  status: 'subscrib',
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
          destType: 'mailchimp',
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
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://us20.api.mailchimp.com/3.0/lists/1232yyqw22?skip_merge_validation=false&skip_duplicate_check=false',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic YXBpS2V5OmFwaUtleS1kdW1teUFwaUtleQ==',
                },
                params: {},
                body: {
                  JSON: {
                    members: [
                      {
                        merge_fields: {
                          FIRSTNAME: 'Bob',
                        },
                        status: 'subscribed',
                        email_address: 'bob.dole@initech.com',
                      },
                      {
                        status: 'subscribed',
                        email_address: 'emrichardson820+22822@gmail.com',
                      },
                      {
                        status: 'subscribed',
                        email_address: 'emrichardson820+22822@gmail.com',
                      },
                    ],
                    update_existing: true,
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
                {
                  jobId: 3,
                },
                {
                  jobId: 4,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
                Name: 'test-mc',
                DestinationDefinition: {
                  ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                  Name: 'MC',
                  DisplayName: 'MailChimp',
                },
                Config: {
                  apiKey: 'apiKey-dummyApiKey',
                  audienceId: '1232yyqw22',
                  datacenterId: 'us20',
                },
                Enabled: true,
                Transformations: [],
              },
            },
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
                  apiKey: 'apiKey-dummyApiKey',
                  audienceId: '1232yyqw22',
                  datacenterId: 'us20',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 5,
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]',
              statTags: {
                destType: 'MAILCHIMP',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
            },
          ],
        },
      },
    },
  },
];
