import sha256 from 'sha256';
import { authHeader1, secret1 } from '../maskedSecrets';

const defaultConsent = {
  adPersonalization: 'UNSPECIFIED',
  adUserData: 'UNSPECIFIED',
};

export const data = [
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  countryCode: 'us',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              endpoint: '',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'login-customer-id': '1234567890',
              },
              params: {
                accessToken: 'google_adwords_enhanced_conversions1',
                event: 'Page View',
                customerId: '1234567890',
                loginCustomerId: '1234567890',
                subAccount: true,
              },
              body: {
                JSON: {
                  conversionAdjustments: [
                    {
                      gclidDateTimePair: {
                        gclid: 'gclid1234',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                      },
                      restatementValue: {
                        adjustedValue: 10,
                        currencyCode: 'INR',
                      },
                      orderId: '10000',
                      adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                      userAgent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                      userIdentifiers: [
                        {
                          hashedPhoneNumber: sha256('+912382193'),
                        },
                        {
                          addressInfo: {
                            hashedFirstName: sha256('john'),
                            hashedLastName: sha256('gomes'),
                            state: 'UK',
                            city: 'London',
                            countryCode: 'us',
                            hashedStreetAddress: sha256('71 cherry court southampton so53 5pd uk'),
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
                      consent: defaultConsent,
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Checkout Started',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              'Conversion named "Checkout Started" was not specified in the RudderStack destination configuration',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
              event: 'Product Added',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              'Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  firstName: 'John',
                  lastName: 'Gomes',
                  address: {
                    city: 'London',
                    state: 'UK',
                    streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                    country: 'us',
                  },
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
              event: 'Product Added',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currencyCode: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: 'true',
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              endpoint: '',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'login-customer-id': '11',
              },
              params: {
                accessToken: 'google_adwords_enhanced_conversions1',
                event: 'Product Added',
                customerId: '1234567890',
                loginCustomerId: '11',
                subAccount: true,
              },
              body: {
                JSON: {
                  conversionAdjustments: [
                    {
                      gclidDateTimePair: {
                        gclid: 'gclid1234',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                      },
                      restatementValue: {
                        adjustedValue: 10,
                        currencyCode: 'INR',
                      },
                      orderId: '10000',
                      adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                      userAgent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                      userIdentifiers: [
                        {
                          addressInfo: {
                            hashedFirstName: sha256('john'),
                            hashedLastName: sha256('gomes'),
                            state: 'UK',
                            city: 'London',
                            countryCode: 'us',
                            // no hashedStreetAddress: the mapping's context.traits.address
                            // fallback resolves to an object here, which is dropped rather
                            // than hashed as String(object)
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
                      consent: defaultConsent,
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Product Added',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currencyCode: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                orderId: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'loginCustomerId is required as subAccount is true.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
              },
            },
            message: {
              type: 'identify',
              traits: {
                status: 'elizabeth',
              },
              userId: 'emrichardson820+22822@gmail.com',
              channel: 'sources',
              context: {
                sources: {
                  job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
                  task_id: 'vw_rs_mailchimp_mocked_hg_data',
                  version: 'v1.8.1',
                  batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
                  job_run_id: 'c8el40l6e87v0c4hkbl0',
                  task_run_id: 'c8el40l6e87v0c4hkblg',
                },
                externalId: [
                  {
                    id: 'emrichardson820+22822@gmail.com',
                    type: 'MAILCHIMP-92e1f1ad2c',
                    identifierType: 'email_address',
                  },
                ],
                mappedToDestination: 'true',
              },
              recordId: '1',
              rudderId: '4d5d0ed0-9db8-41cc-9bb0-a032f6bfa97a',
              messageId: 'b3bee036-fc26-4f6d-9867-c17f85708a82',
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
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'Message Type identify is not supported. Aborting message.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: null,
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              secret: null,
            },
            statusCode: 500,
            error:
              'Failed to get access token for authentication. This might be a platform issue. Please contact RudderStack support for assistance.',
            statTags: {
              errorCategory: 'platform',
              errorType: 'oAuthSecret',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  countryCode: 'us',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Product Viewed',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                orde_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              'Conversion named "Product Viewed" was not specified in the RudderStack destination configuration',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                requireHash: true,
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: ' John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  countryCode: 'us',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              endpoint: '',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'login-customer-id': '1234567890',
              },
              params: {
                accessToken: 'google_adwords_enhanced_conversions1',
                event: 'Page View',
                customerId: '1234567890',
                loginCustomerId: '1234567890',
                subAccount: true,
              },
              body: {
                JSON: {
                  conversionAdjustments: [
                    {
                      gclidDateTimePair: {
                        gclid: 'gclid1234',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                      },
                      restatementValue: {
                        adjustedValue: 10,
                        currencyCode: 'INR',
                      },
                      orderId: '10000',
                      adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                      userAgent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                      userIdentifiers: [
                        {
                          hashedPhoneNumber: sha256('+912382193'),
                        },
                        {
                          addressInfo: {
                            hashedFirstName: sha256('john'),
                            hashedLastName: sha256('gomes'),
                            state: 'UK',
                            city: 'London',
                            countryCode: 'us',
                            hashedStreetAddress: sha256('71 cherry court southampton so53 5pd uk'),
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
                      consent: defaultConsent,
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 9: raw (unhashed) phone with requireHash:false aborts with hashing-consistency error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                requireHash: false,
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  countryCode: 'us',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              'Hashing is disabled but the value for field hashedPhoneNumber appears to be unhashed. Either enable hashing or send pre-hashed data.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                requireHash: false,
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  countryCode: 'us',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'Missing required value from ["properties.orderId","properties.order_id"]',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 11: Invalid event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
              },
            },
            message: {
              userId: 'identified user id',
              anonymousId: 'anon-id-new',
              context: {
                traits: {
                  trait1: 'new-val',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
              timestamp: '2020-02-02T00:23:09.544Z',
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
            error: 'Invalid payload. Message Type is not present',
            metadata: {
              secret: {
                access_token: 'google_adwords_enhanced_conversions1',
                developer_token: 'ijkl91011',
                refresh_token: 'efgh5678',
              },
            },
            statTags: {
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 12: Custom adjustment type supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
              workspaceId: 'workspaceId1',
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                adjustmentType: 'RESTATEMENT',
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [
                  {
                    conversions: 'Page View',
                  },
                  {
                    conversions: 'Product Added',
                  },
                ],
                authStatus: 'active',
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
                traits: {
                  phone: '912382193',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'UK',
                  countryCode: 'us',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
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
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              originalTimestamp: '2019-10-14T11:15:18.299Z',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                partialFailure: true,
                campaignId: '1',
                templateId: '0',
                order_id: 10000,
                total: 1000,
                products: [
                  {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: '19',
                    position: '1',
                    category: 'cars',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https://www.example.com/product/path.jpg',
                    quantity: '2',
                  },
                  {
                    product_id: '507f1f77bcf86cd7994390112',
                    sku: '45790-322',
                    name: 'Monopoly: 3rd Edition2',
                    price: '192',
                    quantity: 22,
                    position: '12',
                    category: 'Cars2',
                    url: 'https://www.example.com/product/path2',
                    image_url: 'https://www.example.com/product/path.jpg2',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
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
              endpoint: '',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'login-customer-id': '1234567890',
              },
              params: {
                accessToken: 'google_adwords_enhanced_conversions1',
                event: 'Page View',
                customerId: '1234567890',
                loginCustomerId: '1234567890',
                subAccount: true,
              },
              body: {
                JSON: {
                  conversionAdjustments: [
                    {
                      gclidDateTimePair: {
                        gclid: 'gclid1234',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                      },
                      restatementValue: {
                        adjustedValue: 10,
                        currencyCode: 'INR',
                      },
                      orderId: '10000',
                      adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                      adjustmentType: 'RESTATEMENT',
                      consent: defaultConsent,
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
              workspaceId: 'workspaceId1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 13: mixed-case identifiers are normalized before hashing (gmail dots/plus-suffix stripped, names lowercased, phone E.164-cleaned)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [{ conversions: 'Page View' }],
                authStatus: 'active',
              },
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: ' Alex.Doe+shop@GMAIL.com',
                  phone: '(91) 238-2193',
                  firstName: ' MARY ',
                },
              },
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                order_id: 10000,
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
              endpoint: '',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'login-customer-id': '11',
              },
              params: {
                accessToken: 'google_adwords_enhanced_conversions1',
                event: 'Page View',
                customerId: '1234567890',
                loginCustomerId: '11',
                subAccount: true,
              },
              body: {
                JSON: {
                  conversionAdjustments: [
                    {
                      gclidDateTimePair: {
                        gclid: 'gclid1234',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                      },
                      orderId: '10000',
                      userIdentifiers: [
                        {
                          hashedEmail: sha256('alexdoe@gmail.com'),
                        },
                        {
                          hashedPhoneNumber: sha256('+912382193'),
                        },
                        {
                          addressInfo: {
                            hashedFirstName: sha256('mary'),
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
                      consent: defaultConsent,
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 14: pre-hashed email with hashing enabled (requireHash not disabled) aborts with a hashing-consistency error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [{ conversions: 'Page View' }],
                authStatus: 'active',
              },
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: sha256('alexdoe@gmail.com'),
                },
              },
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                order_id: 10000,
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
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              'Hashing is enabled but the value for field hashedEmail appears to already be hashed. Either disable hashing or send unhashed data.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 15: invalid email is dropped while the valid phone identifier is kept and hashed',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [{ conversions: 'Page View' }],
                authStatus: 'active',
              },
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'not-an-email',
                  phone: '912382193',
                },
              },
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                order_id: 10000,
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
              endpoint: '',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'login-customer-id': '11',
              },
              params: {
                accessToken: 'google_adwords_enhanced_conversions1',
                event: 'Page View',
                customerId: '1234567890',
                loginCustomerId: '11',
                subAccount: true,
              },
              body: {
                JSON: {
                  conversionAdjustments: [
                    {
                      gclidDateTimePair: {
                        gclid: 'gclid1234',
                      },
                      orderId: '10000',
                      userIdentifiers: [
                        {
                          hashedPhoneNumber: sha256('+912382193'),
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
                      consent: defaultConsent,
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 16: event aborts when every identifier is dropped by validation (invalid email only)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '1234567890',
                subAccount: true,
                loginCustomerId: '11',
                listOfConversions: [{ conversions: 'Page View' }],
                authStatus: 'active',
              },
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'not-an-email',
                },
              },
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                order_id: 10000,
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
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              'Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
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
    name: 'google_adwords_enhanced_conversions',
    description:
      'Test 17: RESTATEMENT adjustment with pre-hashed identifiers succeeds — identifiers are deleted before the hashing pipeline, so no hashing-consistency error fires',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
              workspaceId: 'workspaceId1',
            },
            destination: {
              hasDynamicConfig: false,
              Config: {
                adjustmentType: 'RESTATEMENT',
                rudderAccountId: '25u5whFH7gVTnCiAjn4ykoCLGoC',
                customerId: '123-456-7890',
                subAccount: true,
                loginCustomerId: '123-456-7890',
                listOfConversions: [{ conversions: 'Page View' }],
                authStatus: 'active',
              },
            },
            message: {
              channel: 'web',
              context: {
                traits: {
                  phone: sha256('+912382193'),
                  firstName: sha256('john'),
                  lastName: sha256('gomes'),
                  city: 'London',
                  state: 'UK',
                  countryCode: 'us',
                  streetAddress: sha256('71 cherry court southampton so53 5pd uk'),
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
              },
              event: 'Page View',
              type: 'track',
              messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
              anonymousId: '00000000000000000000000000',
              userId: '12345',
              properties: {
                gclid: 'gclid1234',
                conversionDateTime: '2022-01-01 12:32:45-08:00',
                adjustedValue: '10',
                currency: 'INR',
                adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                order_id: 10000,
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
              endpoint: '',
              headers: {
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                'login-customer-id': '1234567890',
              },
              params: {
                accessToken: 'google_adwords_enhanced_conversions1',
                event: 'Page View',
                customerId: '1234567890',
                loginCustomerId: '1234567890',
                subAccount: true,
              },
              body: {
                JSON: {
                  conversionAdjustments: [
                    {
                      gclidDateTimePair: {
                        gclid: 'gclid1234',
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                      },
                      restatementValue: {
                        adjustedValue: 10,
                        currencyCode: 'INR',
                      },
                      orderId: '10000',
                      adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                      adjustmentType: 'RESTATEMENT',
                      consent: defaultConsent,
                    },
                  ],
                  partialFailure: true,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: secret1,
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
              workspaceId: 'workspaceId1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
