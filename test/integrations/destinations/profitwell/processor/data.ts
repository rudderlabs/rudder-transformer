import { secretApiKey } from '../maskedSecrets';

export const data = [
  {
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
            error: 'userId or userAlias is required for identify',
            statTags: {
              destType: 'PROFITWELL',
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              context: {
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: '23453',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
            error: 'No user found for profitwell user_id',
            statTags: {
              destType: 'PROFITWELL',
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
              endpoint: 'https://api.profitwell.com/v2/subscriptions/',
              headers: {
                'Content-Type': 'application/json',
                Authorization: secretApiKey,
              },
              params: {},
              body: {
                JSON: {
                  subscription_alias: 'samual',
                  email: 'sample@sample.com',
                  plan_id: '23',
                  plan_interval: 'month',
                  plan_currency: 'usd',
                  status: 'active',
                  value: '23',
                  user_alias: 'sp_245',
                  effective_date: 1630917906,
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  status: 'active',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
            error: 'subscriptionId or subscriptionAlias is required for identify',
            statTags: {
              destType: 'PROFITWELL',
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: '1234',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
            error: 'No user found for profitwell user_id',
            statTags: {
              destType: 'PROFITWELL',
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: 'pwu_Oea7HXV3bnTP',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
              endpoint: 'https://api.profitwell.com/v2/subscriptions/',
              headers: {
                'Content-Type': 'application/json',
                Authorization: secretApiKey,
              },
              params: {},
              body: {
                JSON: {
                  subscription_alias: 'samual',
                  email: 'sample@sample.com',
                  plan_id: '23',
                  plan_interval: 'month',
                  plan_currency: 'usd',
                  status: 'active',
                  value: '23',
                  user_id: 'pwu_Oea7HXV3bnTP',
                  user_alias: 'sp_245',
                  effective_date: 1630917906,
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: 'pwu_Oea7HXV3bnTP',
                  },
                  {
                    type: 'profitwellSubscriptionId',
                    id: 'pws_FecTCEyo17rV',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
              'Missing required value from ["traits.effectiveDate","context.traits.effectiveDate"]',
            statTags: {
              destType: 'PROFITWELL',
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: 'pwu_Oea7HXV3bnTP',
                  },
                  {
                    type: 'profitwellSubscriptionId',
                    id: 'pws_FecTCEyo17rV',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                  effectiveDate: '1609748705',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
              endpoint: 'https://api.profitwell.com/v2/subscriptions/pws_FecTCEyo17rV/',
              headers: {
                'Content-Type': 'application/json',
                Authorization: secretApiKey,
              },
              params: {},
              body: {
                JSON: {
                  plan_id: '23',
                  plan_interval: 'month',
                  value: '23',
                  status: 'active',
                  effective_date: 1609748705,
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: 'pwu_Oea7HXV3bnTP',
                  },
                  {
                    type: 'profitwellSubscriptionId',
                    id: 'pws_FecTCEyo17rV',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'monthly',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                  effectiveDate: '1609748705',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
            error: 'invalid format for planInterval. Aborting',
            statTags: {
              destType: 'PROFITWELL',
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: 'pwu_Oea7HXV3bnTP',
                  },
                  {
                    type: 'profitwellSubscriptionId',
                    id: 'pws_FecTCEyo17rV',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'activate',
                  effectiveDate: '1609748705',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
              endpoint: 'https://api.profitwell.com/v2/subscriptions/pws_FecTCEyo17rV/',
              headers: {
                'Content-Type': 'application/json',
                Authorization: secretApiKey,
              },
              params: {},
              body: {
                JSON: {
                  plan_id: '23',
                  plan_interval: 'month',
                  value: '23',
                  effective_date: 1609748705,
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
    name: 'profitwell',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {},
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: 'pwu_Oea7HXV3bnTP',
                  },
                  {
                    type: 'profitwellSubscriptionId',
                    id: 'pws_FecTCEyo17rV',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                  effectiveDate: '1609748705',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
            error: 'Private API Key not found. Aborting.',
            statTags: {
              destType: 'PROFITWELL',
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
    name: 'profitwell',
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
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                externalId: [
                  {
                    type: 'profitwellUserId',
                    id: 'pwu_Oea7HXV3bnTP',
                  },
                  {
                    type: 'profitwellSubscriptionId',
                    id: 'pws_FecTCEyo17',
                  },
                ],
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                  effectiveDate: '1609748705',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
            error: 'Profitwell subscription_id not found',
            statTags: {
              destType: 'PROFITWELL',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              meta: 'instrumentation',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'profitwell',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                privateApiKey: secretApiKey,
              },
            },
            message: {
              channel: 'web',
              userId: 'sp_245',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.9',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.9',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'sample@sample.com',
                  planId: '23',
                  planInterval: 'month',
                  planCurrency: 'usd',
                  value: '23',
                  subscriptionAlias: 'samual',
                  status: 'active',
                  effectiveDate: 1609748705,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
              },
              messageId: '6a5f38c0-4e75-4268-a066-2b73fbcad01f',
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              receivedAt: '2021-01-04T13:55:04.799+05:30',
              request_ip: '[::1]',
              rudderId: '79881a62-980a-4d76-89ca-7099440f8c13',
              sentAt: '2021-01-04T08:25:04.781Z',
              timestamp: '2021-09-06T14:15:06.798+05:30',
              type: 'identify',
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
              endpoint: 'https://api.profitwell.com/v2/subscriptions/',
              headers: {
                'Content-Type': 'application/json',
                Authorization: secretApiKey,
              },
              params: {},
              body: {
                JSON: {
                  subscription_alias: 'samual',
                  email: 'sample@sample.com',
                  plan_id: '23',
                  plan_interval: 'month',
                  plan_currency: 'usd',
                  status: 'active',
                  value: '23',
                  effective_date: 1609748705,
                  user_alias: 'sp_245',
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
