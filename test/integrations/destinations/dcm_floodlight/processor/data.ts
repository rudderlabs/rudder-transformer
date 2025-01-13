export const data = [
  {
    name: 'dcm_floodlight',
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
                advertiserId: '22448662',
                activityTag: '',
                groupTag: '',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'rudder2',
                        to: '2',
                      },
                    ],
                    eventName: 'Product viewed',
                    floodlightActivityTag: 'signu01',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'signu01',
                    floodlightGroupTag: 'conv02',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Product viewed',
              properties: {
                orderId: 111,
                quantity: 2,
                revenue: 800,
                rudder1: 'rudder-v1',
                rudder2: 'rudder-v2',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=22448662;cat=signu01;type=conv01;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1;u1=rudder-v1;u2=rudder-v2',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'akash2',
                        to: '2',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Sign up Completed',
              properties: {
                orderId: 111,
                quantity: 2,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=signu0;type=conv01;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'akash2',
                        to: '2',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order Complete',
              properties: {
                orderId: 111,
                quantity: 2,
                revenue: 800,
                rudder1: 'rudder-v1',
                akash2: 'akash-v2',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=order0;type=conv000;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1;u1=rudder-v1;u2=akash-v2',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'akash2',
                        to: '2',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Checkout Started',
              properties: {
                orderId: 111,
                quantity: 2,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv00;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=2;cost=800;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'akash1',
                        to: '2',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder2',
                        to: '1',
                      },
                      {
                        from: 'akash2',
                        to: '2',
                      },
                      {
                        from: 'friendlyName2',
                        to: '3',
                      },
                      {
                        from: 'name2',
                        to: '4',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Purchase',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                rudder2: 'rudder2',
                akash2: 'akash2',
                friendlyName2: 'friendlyName2',
                name2: 'name2',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=Pur0;type=conv111;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1;u1=rudder2;u2=akash2;u3=friendlyName2;u4=name2',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'akash1',
                        to: '2',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder2',
                        to: '1',
                      },
                      {
                        from: 'akash2',
                        to: '2',
                      },
                      {
                        from: 'friendlyName2',
                        to: '3',
                      },
                      {
                        from: 'name2',
                        to: '4',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Sign up Completed',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'advertisingId is required: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: advertisingId is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'akash1',
                        to: '2',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
              },
              event: 'Sign up Completed',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'track:: userAgent is required: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: track:: userAgent is required',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Checkout Started',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                akash1: 'akash-v1',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv00;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=3;cost=800;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1;u1=akash-v1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Checkout Started',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv00;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=3;cost=800;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Sample event',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'track:: Conversion event not found: Workflow: procWorkflow, Step: handleConversionEvents, ChildStep: undefined, OriginalError: track:: Conversion event not found',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Checkout Started',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                ],
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv00;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=1;cost=800;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Checkout Started',
              properties: {
                orderId: 111,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 4,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv00;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=6;cost=800;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Checkout Started',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv00;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=999999;cost=800;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'OrDeR complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                rudder1: 'rudder-v1',
                akash1: 'akash-v1',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=order0;type=conv000;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1;u1=rudder-v1;u2=akash-v1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                rudder1: 'rudder-v1',
                akash1: 'akash-v1',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {},
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=order0;type=conv000;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;u1=rudder-v1;u2=akash-v1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
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
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                rudder1: 100,
                akash1: 5987,
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=order0;type=conv000;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;u1=100;u2=5987',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                rudder1: 'rudder-v1',
                akash1: 'akash-v1',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 1,
                  GDPR: 1,
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=order0;type=conv000;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=1;tfua=1;npa=1;u1=rudder-v1;u2=akash-v1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'Yes',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'COPPA: valid parameters are [1|true] or [0|false]: Workflow: procWorkflow, Step: handleIntegrationsObject, ChildStep: undefined, OriginalError: COPPA: valid parameters are [1|true] or [0|false]',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: 'Yes',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'GDPR: valid parameters are [1|true] or [0|false]: Workflow: procWorkflow, Step: handleIntegrationsObject, ChildStep: undefined, OriginalError: GDPR: valid parameters are [1|true] or [0|false]',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: true,
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: 'No',
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'npa: valid parameters are [1|true] or [0|false]: Workflow: procWorkflow, Step: handleIntegrationsObject, ChildStep: undefined, OriginalError: npa: valid parameters are [1|true] or [0|false]',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'Yes',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Order complete',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: 'true',
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'dc_lat: valid parameters are [1|true] or [0|false]: Workflow: procWorkflow, Step: cleanPayload, ChildStep: undefined, OriginalError: dc_lat: valid parameters are [1|true] or [0|false]',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'page',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'Yes',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: 'true',
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'page:: Conversion event not found: Workflow: procWorkflow, Step: handleConversionEvents, ChildStep: undefined, OriginalError: page:: Conversion event not found',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'DCM_FLOODLIGHT',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Viewed Sign up Completed Page',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'page',
              channel: 'web',
              name: 'Sign up Completed',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: 'true',
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=signu0;type=conv01;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '22448662',
                activityTag: '',
                groupTag: '',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'rudder2',
                        to: '2',
                      },
                    ],
                    eventName: 'Product viewed',
                    floodlightActivityTag: 'signu01',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'signu01',
                    floodlightGroupTag: 'conv02',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Product viewed',
              properties: {
                orderId: 111,
                quantity: 2,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=22448662;cat=signu01;type=conv01;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 24',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: 'rudder1',
                        to: '1',
                      },
                      {
                        from: 'akash1',
                        to: '2',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        from: '',
                        to: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Purchase',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                rudder2: 0,
                akash2: 'akash2',
                friendlyName2: false,
                name2: '1234',
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=Pur0;type=conv111;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1;u1=0;u2=akash2;u4=1234',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                advertiserId: '12649566',
                activityTag: 'check0',
                groupTag: 'conv00',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Viewed Page',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    eventName: 'Checkout Started',
                    floodlightActivityTag: '',
                    floodlightGroupTag: '',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'page',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: 'true',
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=signu0;type=conv01;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'dcm_floodlight',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                activityTag: '',
                advertiserId: '12649566',
                conversionEvents: [
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Sign up Completed',
                    floodlightActivityTag: 'signu0',
                    floodlightGroupTag: 'conv01',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder1',
                      },
                      {
                        to: '2',
                        from: 'akash1',
                      },
                    ],
                    eventName: 'Order Complete',
                    floodlightActivityTag: 'order0',
                    floodlightGroupTag: 'conv000',
                    salesTag: false,
                  },
                  {
                    customVariables: [
                      {
                        to: '',
                        from: '',
                      },
                    ],
                    eventName: 'Checkout Started',
                    floodlightActivityTag: 'check0',
                    floodlightGroupTag: 'conv00',
                    salesTag: true,
                  },
                  {
                    customVariables: [
                      {
                        to: '1',
                        from: 'rudder2',
                      },
                      {
                        to: '2',
                        from: 'akash2',
                      },
                      {
                        to: '3',
                        from: 'friendlyName2',
                      },
                      {
                        to: '4',
                        from: 'name2',
                      },
                    ],
                    eventName: 'Purchase',
                    floodlightActivityTag: 'Pur0',
                    floodlightGroupTag: 'conv111',
                    salesTag: false,
                  },
                ],
                groupTag: '',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            message: {
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
              userId: '1234',
              type: 'track',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                device: {
                  adTrackingEnabled: 'true',
                  advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                  id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  manufacturer: 'Google',
                  model: 'AOSP on IA Emulator',
                  name: 'generic_x86_arm',
                  type: 'ios',
                  attTrackingStatus: 3,
                  brand: 'Google2',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: 'iOS',
                  version: '14.4.1',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  name2: 'traits-v1',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              event: 'Purchase',
              properties: {
                orderId: 111,
                quantity: 999999,
                revenue: 800,
                products: [
                  {
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    category: 'Games',
                    quantity: 1,
                    image_url: 'https:///www.example.com/product/path.jpg',
                    product_id: '507f1f77bcf86cd799439011',
                  },
                  {
                    sku: '46493-32',
                    name: 'Uno Card Game',
                    price: 3,
                    category: 'Games',
                    quantity: 2,
                    product_id: '505bd76785ebb509fc183733',
                  },
                ],
                rudder2: '0',
                akash2: 'akash2',
                friendlyName2: false,
              },
              integrations: {
                All: true,
                'DCM Floodlight': {
                  COPPA: 'false',
                  GDPR: '1',
                  npa: true,
                },
              },
              messageId: 'ea5cfab2-3961-4d8a-8187-3d1858c90a9f',
              originalTimestamp: '2020-01-17T04:53:51.185Z',
              receivedAt: '2020-01-17T10:23:52.688+05:30',
              sentAt: '2020-01-17T04:53:52.667Z',
              timestamp: '2020-01-17T10:23:51.206+05:30',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
              method: 'GET',
              endpoint:
                'https://ad.doubleclick.net/ddm/activity/src=12649566;cat=Pur0;type=conv111;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=ea5cfab2-3961-4d8a-8187-3d1858c90a9f;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1;u1=0;u2=akash2;u4=traits-v1',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
