const data = [
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
      pathSuffix: '',
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
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            destination: {
              Config: {
                factorsAIApiKey: 'sdgerghsdfhsdhsdh432141dfgdfsg',
              },
            },
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
      pathSuffix: '',
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
      pathSuffix: '',
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
];

module.exports = {
  data,
};
