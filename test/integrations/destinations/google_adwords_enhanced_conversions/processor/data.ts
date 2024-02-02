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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
              endpoint:
                'https://googleads.googleapis.com/v15/customers/1234567890:uploadConversionAdjustments',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '1234567890',
              },
              params: {
                event: 'Page View',
                customerId: '1234567890',
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
                          hashedPhoneNumber:
                            '04387707e6cbed8c4538c81cc570ed9252d579469f36c273839b26d784e4bdbe',
                        },
                        {
                          addressInfo: {
                            hashedFirstName:
                              'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                            hashedLastName:
                              '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                            state: 'UK',
                            city: 'London',
                            countryCode: 'us',
                            hashedStreetAddress:
                              '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550',
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
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
                access_token: 'abcd1234',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
                access_token: 'abcd1234',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
                access_token: 'abcd1234',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
              endpoint:
                'https://googleads.googleapis.com/v15/customers/1234567890:uploadConversionAdjustments',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '11',
              },
              params: {
                event: 'Product Added',
                customerId: '1234567890',
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
                            hashedFirstName:
                              'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                            hashedLastName:
                              '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                            state: 'UK',
                            city: 'London',
                            countryCode: 'us',
                            hashedStreetAddress:
                              'b28c94b2195c8ed259f0b415aaee3f39b0b2920a4537611499fa044956917a21',
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
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
                access_token: 'abcd1234',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error: 'LoginCustomerId is required as subAccount is true.',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
                access_token: 'abcd1234',
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
            error: 'OAuth - access token not found',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
                access_token: 'abcd1234',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v15/customers/1234567890:uploadConversionAdjustments',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '1234567890',
              },
              params: {
                event: 'Page View',
                customerId: '1234567890',
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
                          hashedPhoneNumber:
                            '04387707e6cbed8c4538c81cc570ed9252d579469f36c273839b26d784e4bdbe',
                        },
                        {
                          addressInfo: {
                            hashedFirstName:
                              'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                            hashedLastName:
                              '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                            state: 'UK',
                            city: 'London',
                            countryCode: 'us',
                            hashedStreetAddress:
                              '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550',
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
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
                access_token: 'abcd1234',
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
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {
              secret: {
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://googleads.googleapis.com/v15/customers/1234567890:uploadConversionAdjustments',
              headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '1234567890',
              },
              params: {
                event: 'Page View',
                customerId: '1234567890',
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
                          hashedPhoneNumber: '912382193',
                        },
                        {
                          addressInfo: {
                            hashedFirstName: 'John',
                            hashedLastName: 'Gomes',
                            state: 'UK',
                            city: 'London',
                            countryCode: 'us',
                            hashedStreetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                          },
                        },
                      ],
                      adjustmentType: 'ENHANCEMENT',
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
                access_token: 'abcd1234',
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
                access_token: 'abcd1234',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
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
                access_token: 'abcd1234',
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
];
