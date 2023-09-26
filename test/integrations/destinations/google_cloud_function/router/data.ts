export const data = [
  {
    name: 'google_cloud_function',
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
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl:
                    'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
                  maxBatchSize: '2',
                },
              },
              metadata: {
                jobId: '1',
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  email: 'cosmo@krammer.com',
                  name: 'Cosmo Krammer',
                  linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                  location: 'New York',
                  emailOptOut: true,
                  masterAvatarTypeCode: 10,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
            {
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl: '',
                  maxBatchSize: '2',
                },
              },
              metadata: {
                jobId: '2',
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  email: 'cosmo@krammer.com',
                  name: 'Cosmo Krammer',
                  linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                  location: 'New York',
                  emailOptOut: true,
                  masterAvatarTypeCode: 10,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
            {
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl:
                    'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
                  maxBatchSize: '2',
                },
              },
              metadata: {
                jobId: '3',
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  email: 'cosmo@krammer.com',
                  name: 'Cosmo Krammer',
                  linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                  location: 'New York',
                  emailOptOut: true,
                  masterAvatarTypeCode: 10,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'google_cloud_function',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  channel: 'web',
                  context: {
                    app: {
                      build: '1.0.0',
                      name: 'RudderLabs JavaScript SDK',
                      namespace: 'com.rudderlabs.javascript',
                      version: '1.0.0',
                    },
                    library: {
                      name: 'RudderLabs JavaScript SDK',
                      version: '1.0.0',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    locale: 'en-US',
                    ip: '0.0.0.0',
                    os: {
                      name: '',
                      version: '',
                    },
                    screen: {
                      density: 2,
                    },
                  },
                  messageId: '84e26acc-56a5-4835-8233-591137fca468',
                  session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                  originalTimestamp: '2019-10-14T09:03:17.562Z',
                  anonymousId: 'anon_id',
                  type: 'identify',
                  traits: {
                    email: 'cosmo@krammer.com',
                    name: 'Cosmo Krammer',
                    linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                    location: 'New York',
                    emailOptOut: true,
                    masterAvatarTypeCode: 10,
                  },
                  integrations: {
                    All: true,
                  },
                  sentAt: '2019-10-14T09:03:22.563Z',
                },
                {
                  channel: 'web',
                  context: {
                    app: {
                      build: '1.0.0',
                      name: 'RudderLabs JavaScript SDK',
                      namespace: 'com.rudderlabs.javascript',
                      version: '1.0.0',
                    },
                    library: {
                      name: 'RudderLabs JavaScript SDK',
                      version: '1.0.0',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    locale: 'en-US',
                    ip: '0.0.0.0',
                    os: {
                      name: '',
                      version: '',
                    },
                    screen: {
                      density: 2,
                    },
                  },
                  messageId: '84e26acc-56a5-4835-8233-591137fca468',
                  session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                  originalTimestamp: '2019-10-14T09:03:17.562Z',
                  anonymousId: 'anon_id',
                  type: 'identify',
                  traits: {
                    email: 'cosmo@krammer.com',
                    name: 'Cosmo Krammer',
                    linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                    location: 'New York',
                    emailOptOut: true,
                    masterAvatarTypeCode: 10,
                  },
                  integrations: {
                    All: true,
                  },
                  sentAt: '2019-10-14T09:03:22.563Z',
                },
              ],
              metadata: [{ jobId: '1' }, { jobId: '3' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl:
                    'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
                  maxBatchSize: '2',
                },
              },
            },
            {
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl: '',
                  maxBatchSize: '2',
                },
              },
              metadata: [{ jobId: '2' }],
              batched: false,
              statusCode: 400,
              error: '[GCF]:: Url not found. Aborting',
              statTags: {
                destType: 'GOOGLE_CLOUD_FUNCTION',
                errorCategory: 'dataValidation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                errorType: 'configuration',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'google_cloud_function',
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
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl:
                    'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
                  maxBatchSize: '2',
                },
              },
              metadata: {
                jobId: '1',
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  email: 'cosmo@krammer.com',
                  name: 'Cosmo Krammer',
                  linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                  location: 'New York',
                  emailOptOut: true,
                  masterAvatarTypeCode: 10,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
            {
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl: '',
                  maxBatchSize: '2',
                },
              },
              metadata: {
                jobId: '2',
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  email: 'cosmo@krammer.com',
                  name: 'Cosmo Krammer',
                  linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                  location: 'New York',
                  emailOptOut: true,
                  masterAvatarTypeCode: 10,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
            {
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl:
                    'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
                  maxBatchSize: '2',
                },
              },
              metadata: {
                jobId: '3',
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
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  email: 'cosmo@krammer.com',
                  name: 'Cosmo Krammer',
                  linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                  location: 'New York',
                  emailOptOut: true,
                  masterAvatarTypeCode: 10,
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'google_cloud_function',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  channel: 'web',
                  context: {
                    app: {
                      build: '1.0.0',
                      name: 'RudderLabs JavaScript SDK',
                      namespace: 'com.rudderlabs.javascript',
                      version: '1.0.0',
                    },
                    library: {
                      name: 'RudderLabs JavaScript SDK',
                      version: '1.0.0',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    locale: 'en-US',
                    ip: '0.0.0.0',
                    os: {
                      name: '',
                      version: '',
                    },
                    screen: {
                      density: 2,
                    },
                  },
                  messageId: '84e26acc-56a5-4835-8233-591137fca468',
                  session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                  originalTimestamp: '2019-10-14T09:03:17.562Z',
                  anonymousId: 'anon_id',
                  type: 'identify',
                  traits: {
                    email: 'cosmo@krammer.com',
                    name: 'Cosmo Krammer',
                    linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                    location: 'New York',
                    emailOptOut: true,
                    masterAvatarTypeCode: 10,
                  },
                  integrations: {
                    All: true,
                  },
                  sentAt: '2019-10-14T09:03:22.563Z',
                },
                {
                  channel: 'web',
                  context: {
                    app: {
                      build: '1.0.0',
                      name: 'RudderLabs JavaScript SDK',
                      namespace: 'com.rudderlabs.javascript',
                      version: '1.0.0',
                    },
                    library: {
                      name: 'RudderLabs JavaScript SDK',
                      version: '1.0.0',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    locale: 'en-US',
                    ip: '0.0.0.0',
                    os: {
                      name: '',
                      version: '',
                    },
                    screen: {
                      density: 2,
                    },
                  },
                  messageId: '84e26acc-56a5-4835-8233-591137fca468',
                  session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                  originalTimestamp: '2019-10-14T09:03:17.562Z',
                  anonymousId: 'anon_id',
                  type: 'identify',
                  traits: {
                    email: 'cosmo@krammer.com',
                    name: 'Cosmo Krammer',
                    linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                    location: 'New York',
                    emailOptOut: true,
                    masterAvatarTypeCode: 10,
                  },
                  integrations: {
                    All: true,
                  },
                  sentAt: '2019-10-14T09:03:22.563Z',
                },
              ],
              metadata: [{ jobId: '1' }, { jobId: '3' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl:
                    'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
                  maxBatchSize: '2',
                },
              },
            },
            {
              destination: {
                Config: {
                  triggerType: 'Http',
                  apiKeyId: 'randomAPI',
                  enableBatchInput: true,
                  googleCloudFunctionUrl: '',
                  maxBatchSize: '2',
                },
              },
              metadata: [{ jobId: '2' }],
              batched: false,
              statusCode: 400,
              error: '[GCF]:: Url not found. Aborting',
              statTags: {
                destType: 'GOOGLE_CLOUD_FUNCTION',
                errorCategory: 'dataValidation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                errorType: 'configuration',
              },
            },
          ],
        },
      },
    },
  },
];
