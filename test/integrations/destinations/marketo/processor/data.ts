export const data = [
  {
    name: 'marketo',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'email',
                    type: 'MARKETO-new_user',
                  },
                ],
                mappedToDestination: 'true',
                sources: {
                  batch_id: 'f5f240d0-0acb-46e0-b043-57fb0aabbadd',
                  job_id: '1zAj94bEy8komdqnYtSoDp0VmGs/Syncher',
                  job_run_id: 'c5tar6cqgmgmcjvupdhg',
                  task_id: 'tt_10_rows_check',
                  task_run_id: 'c5tar6cqgmgmcjvupdi0',
                  version: 'release.v1.6.8',
                },
              },
              messageId: '2f052f7c-f694-4849-a7ed-a432f7ffa0a4',
              originalTimestamp: '2021-10-28T14:03:50.503Z',
              receivedAt: '2021-10-28T14:03:46.567Z',
              recordId: '8',
              request_ip: '10.1.94.92',
              rudderId: 'c0f6843e-e3d6-4946-9752-fa339fbadef2',
              sentAt: '2021-10-28T14:03:50.503Z',
              timestamp: '2021-10-28T14:03:46.566Z',
              traits: {
                marketoGUID: '23',
                administrative_unit: 'Minnesota',
                am_pm: 'AM',
                boolean: true,
                firstname: 'Jacqueline',
                pPower: 'AM',
                userId: 'Jacqueline',
              },
              type: 'identify',
              userId: 'lynnanderson@smith.net',
            },
            destination: {
              ID: '1zia9wKshXt80YksLmUdJnr7IHI',
              Name: 'test_marketo',
              DestinationDefinition: {
                ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
                Name: 'MARKETO',
                DisplayName: 'Marketo',
                Config: {
                  destConfig: {
                    defaultConfig: [],
                  },
                  excludeKeys: [],
                  includeKeys: [],
                  saveDestinationResponse: true,
                  secretKeys: [],
                  supportedMessageTypes: ['identify', 'page', 'screen', 'track'],
                  supportedSourceTypes: [
                    'android',
                    'ios',
                    'web',
                    'unity',
                    'amp',
                    'cloud',
                    'warehouse',
                    'reactnative',
                    'flutter',
                    'cordova',
                  ],
                  supportsVisualMapper: true,
                  transformAt: 'processor',
                  transformAtV1: 'processor',
                },
                ResponseRules: null,
              },
              Config: {
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                accountId: 'marketo_acct_id_success',
                rudderEventsMapping: [],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            libraries: [],
            request: {
              query: {},
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
              userId: '',
              method: 'POST',
              endpoint:
                'https://marketo_acct_id_success.mktorest.com/rest/v1/customobjects/new_user.json',
              headers: {
                Authorization: 'Bearer access_token_success',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  action: 'createOrUpdate',
                  dedupeBy: 'dedupeFields',
                  input: [
                    {
                      administrative_unit: 'Minnesota',
                      am_pm: 'AM',
                      boolean: true,
                      firstname: 'Jacqueline',
                      pPower: 'AM',
                      userId: 'Jacqueline',
                      email: 'lynnanderson@smith.net',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              type: 'track',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                customActivityPrimaryKeyMap: [
                  {
                    from: 'Product Clicked',
                    to: 'name',
                  },
                ],
                customActivityEventMap: [
                  {
                    from: 'Product Clicked',
                    to: '100001',
                  },
                ],
              },
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
              userId: '',
              method: 'POST',
              endpoint:
                'https://marketo_acct_id_success.mktorest.com/rest/v1/activities/external.json',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer access_token_success',
              },
              params: {},
              body: {
                JSON: {
                  input: [
                    {
                      activityDate: '2020-12-17T21:00:59.176Z',
                      activityTypeId: 100001,
                      attributes: [],
                      leadId: 4,
                      primaryAttributeValue: 'Test Product',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'Test Product',
                product_id: 'prod_1',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              type: 'track',
              sentAt: '2020-12-17T21:00:59.176Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                  {
                    from: 'product_id',
                    to: 'productId',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
              userId: '',
              method: 'POST',
              endpoint:
                'https://marketo_acct_id_success.mktorest.com/rest/v1/activities/external.json',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer access_token_success',
              },
              params: {},
              body: {
                JSON: {
                  input: [
                    {
                      activityDate: '2020-12-17T21:00:59.176Z',
                      activityTypeId: 100001,
                      attributes: [
                        {
                          name: 'productId',
                          value: 'prod_1',
                        },
                      ],
                      leadId: 4,
                      primaryAttributeValue: 'Test Product',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              userId: 'user_id_success',
              type: 'track',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: false,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
              userId: '',
              method: 'POST',
              endpoint:
                'https://marketo_acct_id_success.mktorest.com/rest/v1/activities/external.json',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer access_token_success',
              },
              params: {},
              body: {
                JSON: {
                  input: [
                    {
                      activityDate: '2020-12-17T21:00:59.176Z',
                      activityTypeId: 100001,
                      attributes: [],
                      leadId: 4,
                      primaryAttributeValue: 'Test Product',
                    },
                  ],
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 4: ERROR - Request Failed for marketo, Access Token Expired',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              userId: 'user_id_success',
              type: 'track',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBerte',
              Config: {
                accountId: 'marketo_acct_id_token_failure',
                clientId: 'marketo_acct_id_token_failure',
                clientSecret: 'marketo_acct_id_token_failure',
                trackAnonymousEvents: false,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 500,
            error:
              '{"message":"Request Failed for marketo, Access Token Expired (Retryable).During fetching auth token","destinationResponse":{"access_token":"access_token_expired","expires_in":0,"scope":"integrations@rudderstack.com","token_type":"bearer"}}',
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 5: ERROR - Request Failed for marketo, Access Token Expired',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              userId: 'user_id_success',
              type: 'track',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBerte',
              Config: {
                accountId: 'marketo_acct_id_failed',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: false,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 500,
            error:
              '{"message":"Request Failed for marketo, Access Token Expired (Retryable).During fetching auth token","destinationResponse":{"response":{"success":false,"errors":[{"code":"601","message":"Access Token Expired"}]},"status":200}}',
            statTags: {
              errorCategory: 'network',
              errorType: 'retryable',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 6: ERROR - Invalid traits value for Marketo',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
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
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                  {
                    from: 'product_id',
                    to: 'productId',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 400,
            error: 'Invalid traits value for Marketo',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 7: ERROR - Anonymous event tracking is turned off and invalid userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              type: 'track',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: false,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 400,
            error: 'Anonymous event tracking is turned off and invalid userId',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 8: ERROR - Event is not mapped to Custom Activity',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Purchased',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              type: 'track',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 400,
            error: 'Event is not mapped to Custom Activity',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 9: ERROR - Primary Key value is invalid for the event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                product_name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              type: 'track',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 400,
            error: 'Primary Key value is invalid for the event',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 10: ERROR - Message Type is not present. Aborting message.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                product_name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 400,
            error: 'Message Type is not present. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 11: ERROR - Message type not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_id_success',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'TestAppName',
                  namespace: 'com.android.sample',
                  version: '1.0',
                },
                device: {
                  id: 'anon_id_success',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.1-beta.1',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: 'anon_id_success',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Clicked',
              integrations: {
                All: true,
              },
              messageId: 'id1',
              properties: {
                product_name: 'Test Product',
              },
              originalTimestamp: '2020-12-17T21:00:59.176Z',
              type: 'screen',
              sentAt: '2020-03-12T09:05:03.421Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'leadScore',
                    to: 'customLeadScore',
                  },
                ],
                createIfNotExist: true,
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
            statusCode: 400,
            error: 'Message type not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'MARKETO',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
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
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '00000000000000000000000000',
              integrations: {
                All: true,
              },
              traits: {
                score: '0.5',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
              Config: {
                accountId: 'marketo_acct_id_success',
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                trackAnonymousEvents: true,
                customActivityPropertyMap: [
                  {
                    from: 'name',
                    to: 'productName',
                  },
                  {
                    from: 'product_id',
                    to: 'productId',
                  },
                ],
                leadTraitMapping: [
                  {
                    from: 'score',
                    to: 'customLeadScore',
                  },
                ],
                rudderEventsMapping: [
                  {
                    event: 'Product Clicked',
                    marketoPrimarykey: 'name',
                    marketoActivityId: '100001',
                  },
                ],
              },
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
              userId: '',
              method: 'POST',
              endpoint: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json',
              headers: {
                Authorization: 'Bearer access_token_success',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  action: 'createOrUpdate',
                  input: [
                    {
                      customLeadScore: '0.5',
                      id: 4,
                    },
                  ],
                  lookupField: 'id',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'marketo',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                externalId: [
                  {
                    id: 'lynnanderson@smith.net',
                    identifierType: 'email',
                    type: 'MARKETO-new_user',
                  },
                ],
                traits: {
                  marketoGUID: '23',
                  administrative_unit: 'Minnesota',
                  am_pm: 'AM',
                  boolean: true,
                  firstname: 'Jacqueline',
                  pPower: 'AM',
                  userId: 'Jacqueline',
                },
                sources: {
                  batch_id: 'f5f240d0-0acb-46e0-b043-57fb0aabbadd',
                  job_id: '1zAj94bEy8komdqnYtSoDp0VmGs/Syncher',
                  job_run_id: 'c5tar6cqgmgmcjvupdhg',
                  task_id: 'tt_10_rows_check',
                  task_run_id: 'c5tar6cqgmgmcjvupdi0',
                  version: 'release.v1.6.8',
                },
              },
              messageId: '2f052f7c-f694-4849-a7ed-a432f7ffa0a4',
              originalTimestamp: '2021-10-28T14:03:50.503Z',
              receivedAt: '2021-10-28T14:03:46.567Z',
              recordId: '8',
              request_ip: '10.1.94.92',
              rudderId: 'c0f6843e-e3d6-4946-9752-fa339fbadef2',
              sentAt: '2021-10-28T14:03:50.503Z',
              timestamp: '2021-10-28T14:03:46.566Z',
              type: 'identify',
              userId: 'dummyMail@dummyDomain.com',
            },
            destination: {
              ID: '1zia9wKshXt80YksLmUdJnr7IHI',
              Name: 'test_marketo',
              DestinationDefinition: {
                ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
                Name: 'MARKETO',
                DisplayName: 'Marketo',
                Config: {
                  destConfig: {
                    defaultConfig: [],
                  },
                  excludeKeys: [],
                  includeKeys: [],
                  saveDestinationResponse: true,
                  secretKeys: [],
                  supportedMessageTypes: ['identify', 'page', 'screen', 'track'],
                  supportedSourceTypes: [
                    'android',
                    'ios',
                    'web',
                    'unity',
                    'amp',
                    'cloud',
                    'warehouse',
                    'reactnative',
                    'flutter',
                    'cordova',
                  ],
                  supportsVisualMapper: true,
                  transformAt: 'processor',
                  transformAtV1: 'processor',
                },
                ResponseRules: null,
              },
              Config: {
                clientId: 'marketo_client_id_success',
                clientSecret: 'marketo_client_secret_success',
                accountId: 'marketo_acct_id_success',
                rudderEventsMapping: [],
              },
              Enabled: true,
              Transformations: [],
              IsProcessorEnabled: true,
            },
            libraries: [],
            request: {
              query: {},
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
              userId: '',
              method: 'POST',
              endpoint: 'https://marketo_acct_id_success.mktorest.com/rest/v1/leads.json',
              headers: {
                Authorization: 'Bearer access_token_success',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  action: 'createOrUpdate',
                  input: [{ id: 4, userId: 'dummyMail@dummyDomain.com' }],
                  lookupField: 'id',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
