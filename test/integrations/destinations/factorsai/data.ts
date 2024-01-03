export const data = [
  {
    name: 'factorsai',
    description: 'Track Call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              context: {
                page: {
                  url: 'myurl',
                  path: '/workspace/index.html',
                  title: 'test track',
                  search: '?s=ek8reb577tu65kfc2fv41fbm3j',
                  referrer: '$direct',
                  initial_referrer: '$direct',
                  referring_domain: '',
                  initial_referring_domain: '',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
                ip: '108.0.78.21',
              },
              event: 'finalPageTest',
              properties: {
                title: 'Intro to Test final segemt context page added context last',
              },
              userId: 'PageTestAnonymousUser',
              type: 'track',
              messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
              originalTimestamp: '2022-10-17T15:32:44.202+05:30',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'track',
                  event: 'finalPageTest',
                  context: {
                    ip: '108.0.78.21',
                    page: {
                      url: 'myurl',
                      path: '/workspace/index.html',
                      title: 'test track',
                      search: '?s=ek8reb577tu65kfc2fv41fbm3j',
                      referrer: '$direct',
                      initial_referrer: '$direct',
                      referring_domain: '',
                      initial_referring_domain: '',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
                  },
                  messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
                  timestamp: '2022-10-17T15:32:44.202+05:30',
                  properties: {
                    title: 'Intro to Test final segemt context page added context last',
                  },
                  userId: 'PageTestAnonymousUser',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'factorsai',
    description: 'Unsupported message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              type: 'screen',
              messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
              originalTimestamp: '2022-10-17T15:32:44.202+05:30',
              context: {
                page: {
                  url: 'myurl',
                  path: '/workspace/index.html',
                  title: 'test track',
                  search: '?s=ek8reb577tu65kfc2fv41fbm3j',
                  referrer: '$direct',
                  initial_referrer: '$direct',
                  referring_domain: '',
                  initial_referring_domain: '',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
                ip: '108.0.78.21',
              },
              event: 'finalPageTest',
              properties: {
                title: 'Intro to Test final segemt context page added context last',
              },
              anonymousId: 'PageTestAnonymousUser',
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
            error: 'Message type screen is not supported',
            statTags: {
              destType: 'FACTORSAI',
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
    name: 'factorsai',
    description: 'Track Call without userId Mentioned',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              type: 'track',
              messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
              originalTimestamp: '2022-10-17T15:32:44.202+05:30',
              context: {
                page: {
                  url: 'myurl',
                  path: '/workspace/index.html',
                  title: 'test track',
                  search: '?s=ek8reb577tu65kfc2fv41fbm3j',
                  referrer: '$direct',
                  initial_referrer: '$direct',
                  referring_domain: '',
                  initial_referring_domain: '',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
                ip: '108.0.78.21',
              },
              event: 'finalPageTest',
              properties: {
                title: 'Intro to Test final segemt context page added context last',
              },
              anonymousId: 'PageTestAnonymousUser',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'track',
                  event: 'finalPageTest',
                  context: {
                    ip: '108.0.78.21',
                    page: {
                      url: 'myurl',
                      path: '/workspace/index.html',
                      title: 'test track',
                      search: '?s=ek8reb577tu65kfc2fv41fbm3j',
                      referrer: '$direct',
                      initial_referrer: '$direct',
                      referring_domain: '',
                      initial_referring_domain: '',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
                  },
                  messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
                  timestamp: '2022-10-17T15:32:44.202+05:30',
                  properties: {
                    title: 'Intro to Test final segemt context page added context last',
                  },
                  anonymousId: 'PageTestAnonymousUser',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'factorsai',
    description: 'Identify Call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
              },
              traits: {
                name: 'Joe Doe',
                email: 'joe@example.com',
                plan: 'basic',
                age: 27,
              },
              type: 'identify',
              userId: 'userIdTest',
              originalTimestamp: '2022-10-17T15:53:10.566+05:30',
              messageId: '8d04cc30-fc15-49bd-901f-c5c3f72a7d82',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  context: {
                    ip: '8.8.8.8',
                  },
                  type: 'identify',
                  traits: {
                    age: 27,
                    name: 'Joe Doe',
                    plan: 'basic',
                    email: 'joe@example.com',
                  },
                  userId: 'userIdTest',
                  channel: 'browser',
                  messageId: '8d04cc30-fc15-49bd-901f-c5c3f72a7d82',
                  timestamp: '2022-10-17T15:53:10.566+05:30',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'factorsai',
    description: 'Group Call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              userId: 'user123',
              groupId: 'sdfgdfsgfsd-2a02-4f2f-bf07-7e7d2c2ed2b1',
              timestamp: '2023-06-20T15:47:56.362+05:30',
              traits: {
                company: '5055077684',
                type: 'IT',
              },
              messageId: 'dfb1c919-64b7-4073-8960-ad61b70cc68a',
              type: 'group',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'group',
                  traits: {
                    company: '5055077684',
                    type: 'IT',
                  },
                  userId: 'user123',
                  groupId: 'sdfgdfsgfsd-2a02-4f2f-bf07-7e7d2c2ed2b1',
                  messageId: 'dfb1c919-64b7-4073-8960-ad61b70cc68a',
                  timestamp: '2023-06-20T15:47:56.362+05:30',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: '',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'factorsai',
    description: 'Page Call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
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
              type: 'page',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              timestamp: '2023-06-20T15:47:56.362+05:30',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                path: '/abc',
                referrer: 'xyz',
                search: 'def',
                title: 'ghi',
                url: 'jkl',
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'page',
                  name: 'ApplicationLoaded',
                  userId: '12345',
                  context: {
                    ip: '0.0.0.0',
                    os: {
                      name: '',
                      version: '',
                    },
                    app: {
                      name: 'RudderLabs JavaScript SDK',
                      build: '1.0.0',
                      version: '1.0.0',
                      namespace: 'com.rudderlabs.javascript',
                    },
                    locale: 'en-US',
                    screen: {
                      density: 2,
                    },
                    library: {
                      name: 'RudderLabs JavaScript SDK',
                      version: '1.0.0',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  },
                  messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                  timestamp: '2023-06-20T15:47:56.362+05:30',
                  properties: {
                    url: 'jkl',
                    path: '/abc',
                    title: 'ghi',
                    search: 'def',
                    referrer: 'xyz',
                  },
                  anonymousId: '00000000000000000000000000',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              userId: '',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'factorsai',
    description: 'IP fetched from request_ip',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              context: {
                page: {
                  url: 'myurl',
                  path: '/workspace/index.html',
                  title: 'test track',
                  search: '?s=ek8reb577tu65kfc2fv41fbm3j',
                  referrer: '$direct',
                  initial_referrer: '$direct',
                  referring_domain: '',
                  initial_referring_domain: '',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
              },
              event: 'finalPageTest',
              properties: {
                title: 'Intro to Test final segemt context page added context last',
              },
              userId: 'PageTestAnonymousUser',
              type: 'track',
              messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
              originalTimestamp: '2022-10-17T15:32:44.202+05:30',
              request_ip: '104.205.211.60',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'track',
                  event: 'finalPageTest',
                  context: {
                    ip: '104.205.211.60',
                    page: {
                      url: 'myurl',
                      path: '/workspace/index.html',
                      title: 'test track',
                      search: '?s=ek8reb577tu65kfc2fv41fbm3j',
                      referrer: '$direct',
                      initial_referrer: '$direct',
                      referring_domain: '',
                      initial_referring_domain: '',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
                  },
                  messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
                  timestamp: '2022-10-17T15:32:44.202+05:30',
                  properties: {
                    title: 'Intro to Test final segemt context page added context last',
                  },
                  userId: 'PageTestAnonymousUser',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'factorsai',
    description: 'IP fetched from request_ip',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              context: {
                locale: 'en-US',
                screen: {
                  density: 2,
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              },
              event: 'finalPageTest',
              properties: {
                title: 'Intro to Test final segemt context page added context last',
              },
              userId: 'PageTestAnonymousUser',
              type: 'track',
              messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
              originalTimestamp: '2022-10-17T15:32:44.202+05:30',
              request_ip: '0.0.0.0',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'track',
                  event: 'finalPageTest',
                  context: {
                    ip: '0.0.0.0',
                    locale: 'en-US',
                    screen: {
                      density: 2,
                    },
                    library: {
                      name: 'RudderLabs JavaScript SDK',
                      version: '1.0.0',
                    },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  },
                  messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
                  timestamp: '2022-10-17T15:32:44.202+05:30',
                  properties: {
                    title: 'Intro to Test final segemt context page added context last',
                  },
                  userId: 'PageTestAnonymousUser',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'factorsai',
    description: 'IP fetched from request_ip withput context in payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
            message: {
              event: 'finalPageTest',
              properties: {
                title: 'Intro to Test final segemt context page added context last',
              },
              userId: 'PageTestAnonymousUser',
              type: 'track',
              messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
              originalTimestamp: '2022-10-17T15:32:44.202+05:30',
              request_ip: '1.1.1.1',
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
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  type: 'track',
                  event: 'finalPageTest',
                  context: {
                    ip: '1.1.1.1',
                  },
                  messageId: '3c0abc14-96a2-4aed-9dfc-ee463832cc24',
                  timestamp: '2022-10-17T15:32:44.202+05:30',
                  properties: {
                    title: 'Intro to Test final segemt context page added context last',
                  },
                  userId: 'PageTestAnonymousUser',
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              userId: '',
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic c2RnZXJnaHNkZmhzZGhzZGg0MzIxNDFkZmdkZnNnOg==',
              },
              version: '1',
              endpoint: 'https://api.factors.ai/integrations/rudderstack_platform',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
