export const data = [
  {
    name: 'woopra',
    description:
      'Create a new Visitor with projectName inside Integration Object and no externalId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              context: {
                app: { build: '4', name: 'RuddCDN' },
                device: { id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a', name: 'generic_x86_arm' },
                os: { name: 'Android', version: '9' },
                timezone: 'Asia/Kolkata',
                traits: { anonymousId: '21e13f4bc7ceddad' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
              },
              event: 'First Investment',
              integrations: { woopra: { projectName: 'abc.com' } },
              messageId: '1601322811899-d9c7dd00-50dc-4364-95c8-e89423eb3cfb',
              originalTimestamp: '2020-09-28T19:53:31.900Z',
              traits: {
                name: 'Anant jain',
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
            destination: { Config: { projectName: 'int.com' } },
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
              body: { XML: {}, FORM: {}, JSON: {}, JSON_ARRAY: {} },
              type: 'REST',
              files: {},
              method: 'GET',
              params: {
                os: 'Android',
                app: 'RuddCDN',
                browser: 'Chrome86.0.4240.111',
                cookie: '21e13f4bc7ceddad',
                Project: 'abc.com',
                cv_email: 'anant@r.com',
                cv_name: 'Anant jain',
                cv_state: 'Delhi',
                cv_title: 'Mr',
                cv_hasPurchased: 'yes',
                timestamp: '1601371229907',
                cv_address: 'H.No. abc Street PQRS ',
              },
              headers: {},
              version: '1',
              endpoint: 'https://www.woopra.com/track/identify',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'woopra',
    description: 'Send track event with app name but no app build and woopraid inside externalid',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'mobile',
              context: {
                externalId: [{ type: 'woopraId', id: 'abcd123451' }],
                app: { build: '4' },
                device: { id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a', name: 'generic_x86_arm' },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.6' },
                os: { name: 'Android', version: '9' },
                timezone: 'Asia/Kolkata',
                traits: { anonymousId: '21e13f4bc7ceddad', customProp: 'customValue' },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              event: 'First Investment',
              messageId: '1601322811899-d9c7dd00-50dc-4364-95c8-e89423eb3cfb',
              originalTimestamp: '2020-09-28T19:53:31.900Z',
              properties: { currency: 'EUR', revenue: 20.37566 },
              receivedAt: '2020-09-29T14:50:43.005+05:30',
              sentAt: '2020-09-28T19:53:44.998Z',
              timestamp: '2020-09-29T14:50:29.907+05:30',
              type: 'track',
            },
            destination: { Config: { projectName: 'int.com' } },
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
              body: { XML: {}, FORM: {}, JSON: {}, JSON_ARRAY: {} },
              type: 'REST',
              files: {},
              method: 'GET',
              params: {
                os: 'Android',
                event: 'First Investment',
                cookie: 'abcd123451',
                Project: 'int.com',
                timestamp: '1601371229907',
                ce_currency: 'EUR',
                ce_revenue: 20.37566,
                cv_customProp: 'customValue',
                cv_anonymousId: '21e13f4bc7ceddad',
              },
              headers: {},
              version: '1',
              endpoint: 'https://www.woopra.com/track/ce',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'woopra',
    description: 'Send Page event with projectName from Config and no cv_id sources',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'mobile',
              context: {
                app: { build: '4', name: 'RuddCDN' },
                page: { referrer: 'google.com' },
                device: { id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a', name: 'generic_x86_arm' },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.6' },
                os: { name: 'Android', version: '9' },
                timezone: 'Asia/Kolkata',
                traits: { customProp: 'customValue' },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              name: 'Home',
              messageId: '1601322811899-d9c7dd00-50dc-4364-95c8-e89423eb3cfb',
              originalTimestamp: '2020-09-28T19:53:31.900Z',
              properties: { title: 'Home | RudderStack', url: 'http://www.rudderstack.com' },
              receivedAt: '2020-09-29T14:50:43.005+05:30',
              sentAt: '2020-09-28T19:53:44.998Z',
              timestamp: '2020-09-29T14:50:29.907+05:30',
              type: 'page',
            },
            destination: { Config: { projectName: 'abc.com' } },
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
              body: { XML: {}, FORM: {}, JSON: {}, JSON_ARRAY: {} },
              type: 'REST',
              files: {},
              method: 'GET',
              params: {
                os: 'Android',
                app: 'RuddCDN',
                event: 'Viewed Home Page',
                ce_url: 'http://www.rudderstack.com',
                timestamp: '1601371229907',
                Project: 'abc.com',
                ce_title: 'Home | RudderStack',
                cv_customProp: 'customValue',
                cookie: '21e13f4bc7ceddad',
                ce_referrer: 'google.com',
              },
              headers: {},
              version: '1',
              endpoint: 'https://www.woopra.com/track/ce',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'woopra',
    description: 'Unsupported Message Type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'mobile',
              event: 'First Investment',
              integrations: { woopra: 'int.com' },
              type: 'group',
            },
            destination: { Config: { projectName: 'int.com' } },
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
            error: 'Message type group is not supported',
            statTags: {
              destType: 'WOOPRA',
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
    name: 'woopra',
    description: 'Event Name Not Provided ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '21e13f4bc7ceddad',
              channel: 'mobile',
              integrations: { woopra: 'int.com' },
              type: 'track',
            },
            destination: { Config: { projectName: 'int.com' } },
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
            error: 'Event Name can not be empty',
            statTags: {
              destType: 'WOOPRA',
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
