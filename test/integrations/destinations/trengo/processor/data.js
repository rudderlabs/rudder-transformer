const data = [
  {
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_email_channel',
                channelIdentifier: 'email',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'identify',
              context: {
                traits: { name: 'Jimothy Halpert', email: 'jimbo@dunmiff.com' },
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/channels/trengo_email_channel/contacts',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Jimothy Halpert',
                  identifier: 'jimbo@dunmiff.com',
                  channel_id: 'trengo_email_channel',
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_email_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'identify',
              context: {
                traits: { name: 'Jimothy Halpert', email: 'jimbo@dunmiff.com' },
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_email_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            error:
              'LookupContact failed for term:null update failed, aborting as dedup option is enabled',
            statTags: {
              destType: 'TRENGO',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              meta: 'instrumentation',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'identify',
              context: {
                traits: { name: 'Dwight Schrute', phone: '12345678910' },
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/channels/trengo_phone_channel/contacts',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Dwight Schrute',
                  identifier: '12345678910',
                  channel_id: 'trengo_phone_channel',
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'identify',
              context: {
                traits: { name: 'Angela Martin', phone: '99999666661' },
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            error:
              'LookupContact failed for term:99999666661 update failed, aborting as dedup option is enabled',
            statTags: {
              destType: 'TRENGO',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              meta: 'instrumentation',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'identify',
              context: {
                traits: { name: 'Michael Gary Scott', phone: '98765432100' },
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            error: 'Inside lookupContact, duplicates present for identifier : 98765432100',
            statTags: {
              destType: 'TRENGO',
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'identify',
              context: {
                traits: { name: 'Dr Manhatten', phone: '5678943215' },
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/channels/trengo_phone_channel/contacts',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: {
                  name: 'Dr Manhatten',
                  identifier: '5678943215',
                  channel_id: 'trengo_phone_channel',
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_email_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Product Purchased',
              properties: {
                name: 'Random_Track_call',
                cart_value: 5000,
                email: 'utsab@outlook.com',
              },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/tickets',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: {
                  contact_id: 97694755,
                  channel_id: 'trengo_email_channel',
                  subject: 'Product Purchased from Rudderstack',
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_email_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'checkedOut',
              properties: { name: 'Random_Track_call', value: 5000, email: 'utsab@outlook.com' },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/tickets',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: {
                  contact_id: 97694755,
                  channel_id: 'trengo_email_channel',
                  subject: 'Total cart value 5000 shipped',
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Order Completed',
              properties: { name: 'Random_Track_call', value: 5000, phone: '98765432100' },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                externalId: [{ type: 'trengoChannelId', value: 'trengo_phoneext_channel' }],
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            error: 'Inside lookupContact, duplicates present for identifier : 98765432100',
            statTags: {
              destType: 'TRENGO',
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Order Completed',
              properties: {
                name: 'Random_Track_call',
                value: 5000,
                phone: '9830311521',
                email: 'utsab@outlook.com',
              },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                externalId: [{ type: 'trengoChannelId', id: 'trengo_emailext_channel' }],
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/tickets',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: {
                  contact_id: 97694755,
                  channel_id: 'trengo_emailext_channel',
                  subject: 'Completed Order',
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
    name: 'trengo',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Stress Test',
              properties: {
                name: 'Random_Track_call',
                value: 5000,
                phone: '9830311521',
                email: 'utsab@outlook.com',
              },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                externalId: [{ type: 'trengoChannelId', id: 'trengo_emailext_channel' }],
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/tickets',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: { contact_id: 97694755, channel_id: 'trengo_emailext_channel' },
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Stress test2',
              properties: {
                name: 'Random_Track_call',
                value: 5000,
                phone: '9830311521',
                email: 'utsab@outlook.com',
              },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                externalId: [{ type: 'trengoChannelId', id: 'trengo_emailext_channel' }],
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/tickets',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: { contact_id: 97694755, channel_id: 'trengo_emailext_channel' },
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
    name: 'trengo',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Stress test3',
              properties: {
                name: 'Random_Track_call',
                value: 5000,
                phone: '9830311521',
                email: 'utsab@outlook.com',
              },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                externalId: [{ type: 'trengoChannelId', id: 'trengo_emailext_channel' }],
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/tickets',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: {
                  contact_id: 97694755,
                  channel_id: 'trengo_emailext_channel',
                  subject: '{event} Stress test',
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
    name: 'trengo',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Stress test4',
              properties: {
                name: 'Random_Track_call',
                value: 5000,
                phone: '9830311521',
                email: 'utsab@outlook.com',
              },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                externalId: [{ type: 'trengoChannelId', id: 'trengo_emailext_channel' }],
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            error: 'Stress test4 is not present in Event-Map template keys, aborting event',
            statTags: {
              destType: 'TRENGO',
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
    name: 'trengo',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'phone',
                enableDedup: true,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'identify',
              context: {
                traits: { name: 'Thalmor Bretz 2', phone: '9830311521' },
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'PUT',
              endpoint: 'https://app.trengo.com/api/v2/contacts/90002431001',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: { JSON: { name: 'Thalmor Bretz 2' }, XML: {}, JSON_ARRAY: {}, FORM: {} },
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
    name: 'trengo',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiToken: 'trengo_integration_test_api_token',
                channelId: 'trengo_phone_channel',
                channelIdentifier: 'email',
                enableDedup: false,
                eventTemplateMap: [
                  { from: 'Product Purchased', to: '{{event}} from Rudderstack' },
                  { from: 'checkedOut', to: 'Total cart value {{value}} shipped' },
                  { from: 'Order Completed', to: 'Completed Order' },
                  { from: 'Stress Test' },
                  { from: 'Stress test2', to: '' },
                  { from: 'Stress test3', to: '{event} Stress test' },
                ],
              },
            },
            message: {
              userId: 'randomUserId',
              type: 'track',
              event: 'Stress test2',
              properties: { name: 'Random_Track_call', value: 5000 },
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                externalId: [
                  { type: 'trengoChannelId', id: 'trengo_emailext_channel' },
                  { type: 'trengoContactId', id: 97694755 },
                ],
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '0.1.4' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '9' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://app.trengo.com/api/v2/tickets',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer trengo_integration_test_api_token',
              },
              params: {},
              body: {
                JSON: { contact_id: 97694755, channel_id: 'trengo_emailext_channel' },
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
module.exports = {
  data,
};
