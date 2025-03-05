import {
  authHeader1,
  secret1,
  authHeader2,
  secret2,
  authHeader3,
  secret3,
  authHeader4,
  secret4,
} from '../maskedSecrets';
export const data = [
  {
    name: 'revenue_cat',
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
                apiKey: secret1,
                xPlatform: 'stripe',
              },
            },
            message: {
              userId: 'rudder1235678',
              channel: 'web',
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '0.1.4',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Mumbai',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              type: 'identify',
              traits: {
                email: 'chandan@companyname.com',
                phone: '92374162212',
                lastname: 'Doe',
                density: '420',
                height: '1794',
                width: '1080',
                iterableCampaignId: '1234',
                iterableTemplateId: '1234',
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
              method: 'GET',
              endpoint: 'https://api.revenuecat.com/v1/subscribers/rudder1235678',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
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
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/subscribers/rudder1235678/attributes',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  attributes: {
                    app_user_id: {
                      value: 'rudder1235678',
                    },
                    $email: {
                      value: 'chandan@companyname.com',
                    },
                    $phoneNumber: {
                      value: '92374162212',
                    },
                    $ip: {
                      value: '14.5.67.21',
                    },
                    $iterableCampaignId: {
                      value: '1234',
                    },
                    $iterableTemplateId: {
                      value: '1234',
                    },
                    $displayName: {
                      value: 'Doe',
                    },
                    lastname: {
                      value: 'Doe',
                    },
                    density: {
                      value: '420',
                    },
                    height: {
                      value: '1794',
                    },
                    width: {
                      value: '1080',
                    },
                  },
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
    name: 'revenue_cat',
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
                apiKey: secret2,
                xPlatform: 'stripe',
              },
            },
            message: {
              userId: 'rudder1235678',
              channel: 'web',
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '0.1.4',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Mumbai',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              type: 'identify',
              traits: {
                email: 'chandan@companyname.com',
                phone: '92374162212',
                firstname: 'James',
                density: 420,
                height: 1794,
                width: 1080,
                iterableCampaignId: '1234',
                iterableTemplateId: '1234',
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
              method: 'GET',
              endpoint: 'https://api.revenuecat.com/v1/subscribers/rudder1235678',
              headers: {
                Authorization: authHeader2,
                'Content-Type': 'application/json',
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
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/subscribers/rudder1235678/attributes',
              headers: {
                Authorization: authHeader2,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  attributes: {
                    app_user_id: {
                      value: 'rudder1235678',
                    },
                    $email: {
                      value: 'chandan@companyname.com',
                    },
                    $phoneNumber: {
                      value: '92374162212',
                    },
                    $ip: {
                      value: '14.5.67.21',
                    },
                    $iterableCampaignId: {
                      value: '1234',
                    },
                    $iterableTemplateId: {
                      value: '1234',
                    },
                    $displayName: {
                      value: 'James',
                    },
                    firstname: {
                      value: 'James',
                    },
                    density: {
                      value: '420',
                    },
                    height: {
                      value: '1794',
                    },
                    width: {
                      value: '1080',
                    },
                  },
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
    name: 'revenue_cat',
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
                xPlatform: 'stripe',
              },
            },
            message: {
              userId: 'rudder1235678',
              channel: 'web',
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '0.1.4',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Mumbai',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              type: 'identify',
              traits: {
                email: 'chandan@companyname.com',
                phone: '92374162212',
                name: 'John Doe',
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
            error: 'Public API Key required for Authentication',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'REVENUE_CAT',
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
    name: 'revenue_cat',
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
                apiKey: secret3,
              },
            },
            message: {
              userId: 'rudder1235678',
              channel: 'web',
              context: {
                ip: '14.5.67.21',
                app: {
                  build: '1',
                  name: 'RudderAndroidClient',
                  namespace: 'com.rudderstack.demo.android',
                  version: '1.0',
                },
                device: {
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '0.1.4',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Mumbai',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              type: 'identify',
              traits: {
                email: 'chandan@companyname.com',
                phone: '92374162212',
                name: 'John Doe',
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
              method: 'GET',
              endpoint: 'https://api.revenuecat.com/v1/subscribers/rudder1235678',
              headers: {
                Authorization: authHeader3,
                'Content-Type': 'application/json',
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
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/subscribers/rudder1235678/attributes',
              headers: {
                Authorization: authHeader3,
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  attributes: {
                    app_user_id: {
                      value: 'rudder1235678',
                    },
                    $displayName: {
                      value: 'John Doe',
                    },
                    $email: {
                      value: 'chandan@companyname.com',
                    },
                    $phoneNumber: {
                      value: '92374162212',
                    },
                    $ip: {
                      value: '14.5.67.21',
                    },
                  },
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
    name: 'revenue_cat',
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
                apiKey: secret4,
              },
            },
            message: {
              type: 'track',
              userId: 'rudder123',
              properties: {
                checkout_id: '12345',
                order_id: '1234',
                affiliation: 'Apple Store',
                total: 20,
                revenue: 15,
                shipping: 22,
                tax: 1,
                discount: 1.5,
                coupon: 'ImagePro',
                currency: 'USD',
                fetch_token: 'dummyFetchToken',
                product_id: '123',
                products: [
                  {
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    introductory_price: '350',
                    is_restore: true,
                    presented_offering_identifier: '123erd',
                  },
                  {
                    product_id: '345',
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    quantity: 2,
                    category: 'Games',
                    introductory_price: '250',
                    is_restore: false,
                    presented_offering_identifier: '123erd',
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
            error: 'X-Platform is required field',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'REVENUE_CAT',
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
    name: 'revenue_cat',
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
                apiKey: secret4,
                xPlatform: 'stripe',
              },
            },
            message: {
              type: 'track',
              userId: 'rudder123',
              properties: {
                checkout_id: '12345',
                order_id: '1234',
                affiliation: 'Apple Store',
                total: 20,
                revenue: 15,
                shipping: 22,
                tax: 1,
                discount: 1.5,
                coupon: 'ImagePro',
                currency: 'USD',
                fetch_token: 'dummyFetchToken',
                product_id: '123',
                products: [
                  {
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    introductory_price: '350',
                    is_restore: true,
                    presented_offering_identifier: '123erd',
                  },
                  {
                    product_id: '345',
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    quantity: 2,
                    category: 'Games',
                    introductory_price: '250',
                    is_restore: false,
                    presented_offering_identifier: '123erd',
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
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/receipts',
              headers: {
                Authorization: authHeader4,
                'Content-Type': 'application/json',
                'X-Platform': 'stripe',
              },
              params: {},
              body: {
                JSON: {
                  app_user_id: 'rudder123',
                  fetch_token: 'dummyFetchToken',
                  product_id: '123',
                  currency: 'USD',
                  price: 14,
                  introductory_price: '350',
                  is_restore: true,
                  presented_offering_identifier: '123erd',
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/receipts',
              headers: {
                Authorization: authHeader4,
                'Content-Type': 'application/json',
                'X-Platform': 'stripe',
              },
              params: {},
              body: {
                JSON: {
                  app_user_id: 'rudder123',
                  fetch_token: 'dummyFetchToken',
                  product_id: '345',
                  currency: 'USD',
                  price: 3.45,
                  introductory_price: '250',
                  is_restore: false,
                  presented_offering_identifier: '123erd',
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
    name: 'revenue_cat',
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
                apiKey: secret4,
                xPlatform: 'stripe',
              },
            },
            message: {
              type: 'track',
              userId: 'rudder123',
              properties: {
                checkout_id: '12345',
                order_id: '1234',
                affiliation: 'Apple Store',
                total: 20,
                revenue: 15,
                shipping: 22,
                tax: 1,
                discount: 1.5,
                coupon: 'ImagePro',
                currency: 'USD',
                fetch_token: 'dummyFetchToken',
                product_id: '123-sa',
                products: [
                  {
                    sku: 'G-32',
                    name: 'Monopoly',
                    price: 14,
                    quantity: 1,
                    introductory_price: '350',
                    is_restore: true,
                    presented_offering_identifier: '123erd',
                  },
                  {
                    product_id: '345',
                    sku: 'F-32',
                    name: 'UNO',
                    price: 3.45,
                    quantity: 2,
                    category: 'Games',
                    introductory_price: '250',
                    is_restore: false,
                    presented_offering_identifier: '123erd',
                  },
                  {
                    sku: 'G-33',
                    name: 'SunGlass',
                    price: 14,
                    quantity: 1,
                    introductory_price: '350',
                    is_restore: true,
                    presented_offering_identifier: '123erd',
                  },
                  {
                    sku: 'G-35',
                    product_id: '1234sb',
                    name: 'Real-me',
                    price: 14,
                    quantity: 1,
                    introductory_price: '350',
                    is_restore: true,
                    presented_offering_identifier: '123erd',
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
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/receipts',
              headers: {
                Authorization: authHeader4,
                'Content-Type': 'application/json',
                'X-Platform': 'stripe',
              },
              params: {},
              body: {
                JSON: {
                  app_user_id: 'rudder123',
                  fetch_token: 'dummyFetchToken',
                  product_id: '123-sa',
                  currency: 'USD',
                  price: 14,
                  introductory_price: '350',
                  is_restore: true,
                  presented_offering_identifier: '123erd',
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/receipts',
              headers: {
                Authorization: authHeader4,
                'Content-Type': 'application/json',
                'X-Platform': 'stripe',
              },
              params: {},
              body: {
                JSON: {
                  app_user_id: 'rudder123',
                  fetch_token: 'dummyFetchToken',
                  product_id: '345',
                  currency: 'USD',
                  price: 3.45,
                  introductory_price: '250',
                  is_restore: false,
                  presented_offering_identifier: '123erd',
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/receipts',
              headers: {
                Authorization: authHeader4,
                'Content-Type': 'application/json',
                'X-Platform': 'stripe',
              },
              params: {},
              body: {
                JSON: {
                  app_user_id: 'rudder123',
                  fetch_token: 'dummyFetchToken',
                  product_id: '123-sa',
                  currency: 'USD',
                  price: 14,
                  introductory_price: '350',
                  is_restore: true,
                  presented_offering_identifier: '123erd',
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
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/receipts',
              headers: {
                Authorization: authHeader4,
                'Content-Type': 'application/json',
                'X-Platform': 'stripe',
              },
              params: {},
              body: {
                JSON: {
                  app_user_id: 'rudder123',
                  fetch_token: 'dummyFetchToken',
                  product_id: '1234sb',
                  currency: 'USD',
                  price: 14,
                  introductory_price: '350',
                  is_restore: true,
                  presented_offering_identifier: '123erd',
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
    name: 'revenue_cat',
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
                apiKey: secret4,
                xPlatform: 'stripe',
              },
            },
            message: {
              type: 'track',
              userId: 'rudder123',
              properties: {
                checkout_id: '12345',
                order_id: '1234',
                affiliation: 'Apple Store',
                total: 20,
                revenue: 15,
                shipping: 22,
                tax: 1,
                discount: 1.5,
                coupon: 'ImagePro',
                currency: 'USD',
                fetch_token: 'dummyFetchToken',
                product_id: '123-sa',
                sku: 'G-32',
                name: 'Monopoly',
                price: 14,
                quantity: 1,
                introductory_price: '350',
                is_restore: true,
                presented_offering_identifier: '123erd',
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
              method: 'POST',
              endpoint: 'https://api.revenuecat.com/v1/receipts',
              headers: {
                Authorization: authHeader4,
                'Content-Type': 'application/json',
                'X-Platform': 'stripe',
              },
              params: {},
              body: {
                JSON: {
                  app_user_id: 'rudder123',
                  fetch_token: 'dummyFetchToken',
                  product_id: '123-sa',
                  price: 14,
                  currency: 'USD',
                  introductory_price: '350',
                  is_restore: true,
                  presented_offering_identifier: '123erd',
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
