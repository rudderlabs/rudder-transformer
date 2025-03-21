import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  overrideDestination,
  transformResultBuilder,
} from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'AF',
  DestinationDefinition: {
    ID: '123',
    Name: 'AF',
    DisplayName: 'Appsflyer',
    Config: {},
  },
  Config: {
    androidAppId: 'com.rudderlabs.javascript',
    groupTypeTrait: 'email',
    groupValueTrait: 'age',
    trackProductsOnce: false,
    trackRevenuePerProduct: false,
    addPropertiesAtRoot: true,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const commonProperties = {
  tax: 2,
  total: 27.5,
  coupon: 'hasbros',
  revenue: 48,
  price: 25,
  quantity: 2,
};

const commonPropertiesWithProduct = {
  tax: 2,
  total: 27.5,
  coupon: 'hasbros',
  revenue: 48,
  price: 25,
  quantity: 2,
  currency: 'ZAR',
  discount: 2.5,
  order_id: '50314b8e9bcf000000000000',
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
  shipping: 3,
  subtotal: 22.5,
  affiliation: 'Google Store',
  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
};

const commonContextWithExternalId = {
  externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
  source: 'test',
  app: { namespace: 'com.rudderlabs.javascript' },
  os: { name: 'android' },
  traits: { anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1' },
  library: { name: 'rudder-sdk-ruby-sync', version: '1.0.6' },
};

const commonHeader = { 'Content-Type': 'application/json', authentication: 'abcde' };

const commonV2EndPoint = 'https://api3.appsflyer.com/inappevent/com.rudderlabs.javascript';
const commonV1EndPoint = 'https://api2.appsflyer.com/inappevent/com.rudderlabs.javascript';

export const existingTestCases = [
  {
    name: 'af',
    description: 'Test 0',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                page: { path: '', referrer: '', search: '', title: '', url: '' },
                screen: { density: 2 },
              },
              type: 'identify',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              userProperties: { test_key: 'test value' },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: { devKey: 'abcde', androidAppId: 'appId' },
              Enabled: true,
              addPropertiesAtRoot: false,
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
            error: 'message type not supported',
            statTags: {
              destType: 'AF',
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
    name: 'af',
    description: 'Test 1',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                addPropertiesAtRoot: false,
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              method: 'POST',
              params: {},
              body: {
                JSON: {
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: JSON.stringify({
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  }),
                  eventName: 'page',
                  appsflyer_id: 'afUid',
                  os: '',
                  ip: '0.0.0.0',
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
    name: 'af',
    description: 'Test 2',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: { email: 'testhubspot2@email.com', name: 'Test Hubspot' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              properties: { user_actual_role: 'system_admin, system_user', user_actual_id: 12345 },
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  eventValue: JSON.stringify({
                    properties: {
                      user_actual_role: 'system_admin, system_user',
                      user_actual_id: 12345,
                    },
                  }),
                  eventName: 'test track event HS',
                  customer_user_id: '12345',
                  ip: '0.0.0.0',
                  os: '',
                  appsflyer_id: 'afUid',
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
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
    name: 'af',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'LeanPlumIntegrationAndroid',
                  namespace: 'com.android.SampleLeanPlum',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.1-beta.1' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '8.1.0' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
                traits: { anonymousId: '5094f5704b9cf2b3' },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: { All: true },
              messageId: 'id1',
              properties: { name: 'MainActivity', automatic: true },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'screen',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                addPropertiesAtRoot: false,
              },
              Enabled: true,
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
            error: 'Appsflyer id is not set. Rejecting the event',
            statTags: {
              destType: 'AF',
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
    name: 'af',
    description: 'Test 4',
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
                traits: { email: 'test@rudderstack.com' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'checkout started',
              properties: {
                currency: 'CAD',
                products: [
                  {
                    product_id: 'pr1',
                    quantity: 1,
                    price: 24.75,
                    name: 'my product',
                    sku: 'p-298',
                  },
                  {
                    product_id: 'pr2',
                    quantity: 1,
                    price: 24.75,
                    name: 'my product 2',
                    sku: 'p-299',
                  },
                ],
                step: 1,
                paymentMethod: 'Visa',
                testDimension: true,
                testMetric: true,
              },
              integrations: { All: true },
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
              },
              Enabled: true,
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
            error: 'Appsflyer id is not set. Rejecting the event',
            statTags: {
              destType: 'AF',
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
    name: 'af',
    description: 'Test 5',
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
                externalId: [
                  { id: 'some_other2345_sample_external_id', type: 'appsflyerExternalId' },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: JSON.stringify({
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  }),
                  eventName: 'page',
                  appsflyer_id: 'some_other2345_sample_external_id',
                  os: '',
                  ip: '0.0.0.0',
                  app_version_name: '1.0.0',
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
    name: 'af',
    description: 'Test 6',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              method: 'POST',
              params: {},
              body: {
                JSON: {
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: JSON.stringify({
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  }),
                  eventName: 'page',
                  appsflyer_id: 'afUid',
                  os: '',
                  ip: '0.0.0.0',
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
    name: 'af',
    description: 'Test 7',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'ios', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: { devKey: 'abcde', appleAppId: '123456789' },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              endpoint: 'https://api2.appsflyer.com/inappevent/id123456789',
              headers: commonHeader,
              method: 'POST',
              params: {},
              body: {
                JSON: {
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: JSON.stringify({
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  }),
                  eventName: 'page',
                  appsflyer_id: 'afUid',
                  os: '',
                  ip: '0.0.0.0',
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
    name: 'af',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonPropertiesWithProduct,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
              },
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  eventValue: JSON.stringify({
                    properties: {
                      tax: 2,
                      total: 27.5,
                      coupon: 'hasbros',
                      revenue: 48,
                      price: 25,
                      quantity: 2,
                      currency: 'ZAR',
                      discount: 2.5,
                      order_id: '50314b8e9bcf000000000000',
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
                      shipping: 3,
                      subtotal: 22.5,
                      affiliation: 'Google Store',
                      checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                    },
                    af_revenue: 48,
                    af_price: [19, 3],
                    af_quantity: [1, 2],
                    af_order_id: '50314b8e9bcf000000000000',
                    af_content_id: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                  }),
                  eventName: 'Order Completed',
                  eventCurrency: 'ZAR',
                  eventTime: '2020-08-14T05:30:30.118Z',
                  appsflyer_id: 'afUid',
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
    name: 'af',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: {
                tax: 2,
                total: 27.5,
                coupon: 'hasbros',
                revenue: 48,
                price: 25,
                quantity: 2,
                currency: 'ZAR',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                shipping: 3,
                subtotal: 22.5,
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
              },
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
              },
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  eventValue: JSON.stringify({
                    properties: {
                      tax: 2,
                      total: 27.5,
                      coupon: 'hasbros',
                      revenue: 48,
                      price: 25,
                      quantity: 2,
                      currency: 'ZAR',
                      discount: 2.5,
                      order_id: '50314b8e9bcf000000000000',
                      shipping: 3,
                      subtotal: 22.5,
                      affiliation: 'Google Store',
                      checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                    },
                    af_revenue: 48,
                    af_price: 25,
                    af_quantity: 2,
                    af_order_id: '50314b8e9bcf000000000000',
                  }),
                  eventName: 'Order Completed',
                  eventCurrency: 'ZAR',
                  eventTime: '2020-08-14T05:30:30.118Z',
                  appsflyer_id: 'afUid',
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
    name: 'af',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
              },
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  eventValue: '',
                  eventName: 'Order Completed',
                  eventTime: '2020-08-14T05:30:30.118Z',
                  appsflyer_id: 'afUid',
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
    name: 'af',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'normal track event',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonPropertiesWithProduct,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
                afCurrencyAtRoot: true,
              },
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  eventValue: JSON.stringify({
                    properties: {
                      tax: 2,
                      total: 27.5,
                      coupon: 'hasbros',
                      revenue: 48,
                      price: 25,
                      quantity: 2,
                      currency: 'ZAR',
                      discount: 2.5,
                      order_id: '50314b8e9bcf000000000000',
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
                      shipping: 3,
                      subtotal: 22.5,
                      affiliation: 'Google Store',
                      checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                    },
                    af_revenue: 48,
                    af_quantity: 2,
                    af_price: 25,
                    af_currency: 'ZAR',
                  }),
                  eventName: 'normal track event',
                  eventTime: '2020-08-14T05:30:30.118Z',
                  eventCurrency: 'ZAR',
                  appsflyer_id: 'afUid',
                  bundleIdentifier: 'com.rudderlabs.javascript',
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
    name: 'af',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'normal track event',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
              },
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  eventValue: '',
                  eventName: 'normal track event',
                  eventTime: '2020-08-14T05:30:30.118Z',
                  appsflyer_id: 'afUid',
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
    name: 'af',
    description: 'Test 13',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: '',
                  eventName: 'page',
                  appsflyer_id: 'afUid',
                  os: '',
                  ip: '0.0.0.0',
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
    name: 'af',
    description: 'Test 14',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                sharingFilter: ['hello'],
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              method: 'POST',
              params: {},
              body: {
                JSON: {
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: JSON.stringify({
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  }),
                  eventName: 'page',
                  appsflyer_id: 'afUid',
                  os: '',
                  ip: '0.0.0.0',
                  sharing_filter: ['hello'],
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
    name: 'af',
    description: 'Test 15',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                sharingFilter: 'all',
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              method: 'POST',
              params: {},
              body: {
                JSON: {
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: JSON.stringify({
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  }),
                  eventName: 'page',
                  appsflyer_id: 'afUid',
                  os: '',
                  ip: '0.0.0.0',
                  sharing_filter: 'all',
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
    name: 'af',
    description: 'Test 16',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
              },
              Enabled: true,
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
            error:
              'os name is required along with the respective appId eg. (os->android & Android App Id is required) or (os->ios & Apple App Id is required)',
            statTags: {
              destType: 'AF',
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
    name: 'af',
    description: 'Place Properties at root level Page Call',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'testhubspot2@email.com',
                  name: 'Test Hubspot',
                  anonymousId: '12345',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'page',
              messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
              originalTimestamp: '2019-10-15T09:35:31.289Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: { path: '', referrer: '', search: '', title: '', url: '' },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                sharingFilter: 'all',
                addPropertiesAtRoot: true,
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              method: 'POST',
              params: {},
              body: {
                JSON: {
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  customer_user_id: '12345',
                  eventValue: JSON.stringify({
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  }),
                  eventName: 'page',
                  appsflyer_id: 'afUid',
                  os: '',
                  ip: '0.0.0.0',
                  sharing_filter: 'all',
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
    name: 'af',
    description: 'Place properties at root level track call',
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
                externalId: [{ type: 'appsflyerExternalId', id: 'afUid' }],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: { email: 'testhubspot2@email.com', name: 'Test Hubspot' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-GB',
                ip: '0.0.0.0',
                os: { name: 'android', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
              originalTimestamp: '2019-10-15T09:35:31.291Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              event: 'test track event HS',
              properties: { user_actual_role: 'system_admin, system_user', user_actual_id: 12345 },
              sentAt: '2019-10-14T11:15:53.296Z',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                addPropertiesAtRoot: true,
              },
              Enabled: true,
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  eventValue: JSON.stringify({
                    user_actual_role: 'system_admin, system_user',
                    user_actual_id: 12345,
                  }),
                  eventName: 'test track event HS',
                  customer_user_id: '12345',
                  ip: '0.0.0.0',
                  os: '',
                  appsflyer_id: 'afUid',
                  app_version_name: '1.0.0',
                  bundleIdentifier: 'com.rudderlabs.javascript',
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
    name: 'af',
    description: 'Place properties at root track call with af data',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonPropertiesWithProduct,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            destination: {
              Config: {
                devKey: 'abcde',
                androidAppId: 'com.rudderlabs.javascript',
                groupTypeTrait: 'email',
                groupValueTrait: 'age',
                trackProductsOnce: false,
                trackRevenuePerProduct: false,
                addPropertiesAtRoot: true,
              },
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              params: {},
              body: {
                JSON: {
                  bundleIdentifier: 'com.rudderlabs.javascript',
                  eventValue: JSON.stringify({
                    tax: 2,
                    total: 27.5,
                    coupon: 'hasbros',
                    revenue: 48,
                    price: 25,
                    quantity: 2,
                    currency: 'ZAR',
                    discount: 2.5,
                    order_id: '50314b8e9bcf000000000000',
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
                    shipping: 3,
                    subtotal: 22.5,
                    affiliation: 'Google Store',
                    checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                    af_revenue: 48,
                    af_price: [19, 3],
                    af_quantity: [1, 2],
                    af_order_id: '50314b8e9bcf000000000000',
                    af_content_id: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                  }),
                  eventName: 'Order Completed',
                  eventCurrency: 'ZAR',
                  eventTime: '2020-08-14T05:30:30.118Z',
                  appsflyer_id: 'afUid',
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
];

export const newConfigValidationTests: ProcessorTestData[] = [
  {
    id: 'af-config-validation-test-1',
    name: 'af',
    description: 'No authentication Key is present',
    scenario: 'Framework',
    successCriteria:
      'The request should fail as atleast one authentication key is must to propagate request',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {},
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonProperties,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            metadata: generateMetadata(1),
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
            error: 'No authentication key is present. Aborting.',
            statTags: {
              destinationId: 'default-destinationId',
              destType: 'AF',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'af-config-validation-test-2',
    name: 'af',
    description: 'No dev key present even if v1 authorization is chosen',
    scenario: 'Framework',
    successCriteria:
      'The request should fail when authorization is of v1 type and there is no dev key',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, {
              authVersion: 'v1',
              s2sKey: 'dummy',
            }),
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {},
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonProperties,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            metadata: generateMetadata(1),
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
            error: 'dev key is mandatory for v1 authorization. Aborting.',
            statTags: {
              destType: 'AF',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'af-config-validation-test-3',
    name: 'af',
    description: 'No dev key present even if v1 authorization is chosen',
    scenario: 'Framework',
    successCriteria:
      'The request should fail when authorization is of v1 type and there is no dev key',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, {
              authVersion: 'v2',
              devKey: 'abcde',
            }),
            message: {
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: {},
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonProperties,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            },
            metadata: generateMetadata(1),
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
            error: 's2s key is mandatory for v2 authorization. Aborting.',
            statTags: {
              destType: 'AF',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'af-config-validation-test-4',
    name: 'af',
    description: 'New Config and old way of authentication',
    scenario: 'Business',
    successCriteria: 'Response should contain only event payload and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, {
              authVersion: 'v1',
              devKey: 'abcde',
            }),
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonPropertiesWithProduct,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: commonV1EndPoint,
              headers: commonHeader,
              JSON: {
                customer_user_id: 'default-user-id',
                bundleIdentifier: 'com.rudderlabs.javascript',
                eventValue: JSON.stringify({
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'ZAR',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
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
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                  af_revenue: 48,
                  af_price: [19, 3],
                  af_quantity: [1, 2],
                  af_order_id: '50314b8e9bcf000000000000',
                  af_content_id: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                }),
                eventName: 'Order Completed',
                eventCurrency: 'ZAR',
                appsflyer_id: 'afUid',
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'af-config-validation-test-5',
    name: 'af',
    description: 'New Config and new way of authentication',
    scenario: 'Business',
    successCriteria: 'Response should contain only event payload and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, {
              authVersion: 'v2',
              s2sKey: 'dummy',
            }),
            message: generateSimplifiedTrackPayload({
              type: 'track',
              event: 'Order Completed',
              sentAt: '2020-08-14T05:30:30.118Z',
              context: commonContextWithExternalId,
              messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
              timestamp: '2020-08-14T05:30:30.118Z',
              properties: commonPropertiesWithProduct,
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
              integrations: { AF: { af_uid: 'afUid' } },
            }),
            metadata: generateMetadata(1),
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
            output: transformResultBuilder({
              method: 'POST',
              endpoint: commonV2EndPoint,
              headers: { ...commonHeader, authentication: 'dummy' },
              JSON: {
                bundleIdentifier: 'com.rudderlabs.javascript',
                eventValue: JSON.stringify({
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'ZAR',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
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
                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                  af_revenue: 48,
                  af_price: [19, 3],
                  af_quantity: [1, 2],
                  af_order_id: '50314b8e9bcf000000000000',
                  af_content_id: ['507f1f77bcf86cd799439011', '505bd76785ebb509fc183733'],
                }),
                eventName: 'Order Completed',
                eventCurrency: 'ZAR',
                customer_user_id: 'default-user-id',
                appsflyer_id: 'afUid',
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
