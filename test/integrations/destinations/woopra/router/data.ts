export const data = [
  {
    name: 'woopra',
    description: 'Succesfull Idenitfy Call',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                context: {
                  app: {
                    build: '4',
                    name: 'RuddCDN',
                  },
                  device: {
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    name: 'generic_x86_arm',
                  },
                  os: {
                    name: 'Android',
                    version: '9',
                  },
                  timezone: 'Asia/Kolkata',
                  traits: {
                    anonymousId: '21e13f4bc7ceddad',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                integrations: {
                  woopra: {
                    projectName: 'abc.com',
                  },
                },
                messageId: '1601322811899-d9c7dd00-50dc-4364-95c8-e89423eb3cfb',
                originalTimestamp: '2020-09-28T19:53:31.900Z',
                traits: {
                  Name: 'Anant jain',
                  email: 'anant@r.com',
                  hasPurchased: 'yes',
                  address: 'H.No. abc Street PQRS ',
                  state: 'Delhi',
                  title: 'Mr',
                },
                receivedAt: '2020-09-29T14:50:43.005+05:30',
                sentAt: '2020-09-28T19:53:44.998Z',
                timestamp: '2020-09-29T14:50:29.907+05:30',
                type: 'identify',
              },
              destination: {
                Config: {
                  projectName: 'int.com',
                },
              },
              metadata: {
                jobId: 1,
              },
            },
          ],
          destType: 'woopra',
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
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {},
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'GET',
                params: {
                  os: 'Android',
                  app: 'RuddCDN',
                  cookie: '21e13f4bc7ceddad',
                  Project: 'abc.com',
                  cv_email: 'anant@r.com',
                  cv_state: 'Delhi',
                  cv_title: 'Mr',
                  cv_hasPurchased: 'yes',
                  cv_address: 'H.No. abc Street PQRS ',
                  timestamp: '1601371229907',
                  cv_Name: 'Anant jain',
                },
                headers: {},
                version: '1',
                endpoint: 'https://www.woopra.com/track/identify',
              },
              destination: {
                Config: {
                  projectName: 'int.com',
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'woopra',
    description: 'Successful Track Call ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'mobile',
                context: {
                  app: {
                    build: '4',
                    name: 'RuddCDN',
                  },
                  device: {
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    name: 'generic_x86_arm',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '1.0.6',
                  },
                  os: {
                    name: 'Android',
                    version: '9',
                  },
                  timezone: 'Asia/Kolkata',
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                event: 'First Investment',
                integrations: {
                  woopra: 'int.com',
                },
                messageId: '1601322811899-d9c7dd00-50dc-4364-95c8-e89423eb3cfb',
                originalTimestamp: '2020-09-28T19:53:31.900Z',
                properties: {
                  currency: 'EUR',
                  revenue: 20.37566,
                },
                receivedAt: '2020-09-29T14:50:43.005+05:30',
                sentAt: '2020-09-28T19:53:44.998Z',
                timestamp: '2020-09-29T14:50:29.907+05:30',
                type: 'track',
              },
              destination: {
                Config: {
                  projectName: 'int.com',
                },
              },
              metadata: {
                jobId: 2,
              },
            },
          ],
          destType: 'woopra',
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
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {},
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'GET',
                params: {
                  os: 'Android',
                  app: 'RuddCDN',
                  event: 'First Investment',
                  Project: 'int.com',
                  timestamp: '1601371229907',
                  ce_revenue: 20.37566,
                  ce_currency: 'EUR',
                  cookie: '21e13f4bc7ceddad',
                },
                headers: {},
                version: '1',
                endpoint: 'https://www.woopra.com/track/ce',
              },
              destination: {
                Config: {
                  projectName: 'int.com',
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'woopra',
    description: 'Unsupported Message Type',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                channel: 'mobile',
                event: 'First Investment',
                integrations: {
                  woopra: 'int.com',
                },
                type: 'group',
              },
              destination: {
                Config: {
                  projectName: 'int.com',
                },
              },
              metadata: {
                jobId: 3,
              },
            },
          ],
          destType: 'woopra',
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
              destination: {
                Config: {
                  projectName: 'int.com',
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                implementation: 'native',
                feature: 'router',
                destType: 'WOOPRA',
                module: 'destination',
                errorType: 'instrumentation',
              },
              batched: false,
              statusCode: 400,
              error: 'Message type group is not supported',
            },
          ],
        },
      },
    },
  },
];
