export const data = [
  {
    name: 'sendinblue',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                event: 'Order Completed',
                properties: {
                  orderId: '1341394-3812392190',
                  products: [
                    {
                      product_id: 1234,
                      product_name: 'Track Pants',
                      amount: 1,
                      price: 220,
                    },
                    {
                      product_id: 5768,
                      product_name: 'T-Shirt',
                      amount: 5,
                      price: 1058,
                    },
                  ],
                },
                context: {
                  traits: {
                    first_name: 'John',
                    lastName: 'Doe',
                    age: 19,
                    email: 'john_doe@example.com',
                    phone: '+919876543210',
                    location: 'Mumbai',
                    role: 'SDE',
                  },
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  doi: false,
                  contactAttributeMapping: [
                    {
                      from: 'location',
                      to: 'LOCATION',
                    },
                  ],
                  sendTraitsInTrack: true,
                },
              },
            },
            {
              message: {
                type: 'page',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                name: 'New Page',
                properties: {
                  url: 'https://www.google.com/',
                  title: 'Google home',
                },
                context: {
                  traits: {
                    email: 'john_doe@example.com',
                  },
                  page: {
                    url: 'http://127.0.0.1:7307/Testing/test/ourSdk.html',
                    path: '/Testing/test/ourSdk.html',
                    title: 'Document',
                    search: '',
                    tab_url: 'http://127.0.0.1:7307/Testing/test/ourSdk.html',
                    referrer: 'http://127.0.0.1:7307/Testing/test/',
                    initial_referrer: '$direct',
                    referring_domain: '127.0.0.1:7307',
                    initial_referring_domain: '',
                  },
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  templateId: 3,
                  doi: false,
                  redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
                },
              },
            },
            {
              message: {
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                traits: {
                  first_name: 'John',
                  lastName: 'Doe',
                  age: 19,
                  email: 'john_doe@example.com',
                  phone: '+919876543210',
                  location: 'Mumbai',
                  newEmail: 'alex_root@example.com',
                  role: 'SDE',
                },
                context: {
                  externalId: [
                    {
                      type: 'sendinblueIncludeListIds',
                      id: [1, 2],
                    },
                  ],
                },
                integrations: {
                  All: true,
                  sendinblue: {
                    emailBlacklisted: true,
                  },
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  doi: false,
                  contactAttributeMapping: [
                    {
                      from: 'location',
                      to: 'LOCATION',
                    },
                  ],
                },
              },
            },
            {
              message: {
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                traits: {
                  first_name: 'John',
                  lastName: 'Doe',
                  age: 19,
                  email: 'john_doe@example.com',
                  phone: '+919876543210',
                  location: 'Mumbai',
                  role: 'SDE',
                },
                context: {},
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
              metadata: {
                jobId: 4,
              },
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  templateId: 3,
                  doi: true,
                  redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
                },
              },
            },
          ],
          destType: 'sendinblue',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    email: 'john_doe@example.com',
                    event: 'Order Completed',
                    eventdata: {
                      data: {
                        orderId: '1341394-3812392190',
                        products: [
                          {
                            amount: 1,
                            price: 220,
                            product_id: 1234,
                            product_name: 'Track Pants',
                          },
                          {
                            amount: 5,
                            price: 1058,
                            product_id: 5768,
                            product_name: 'T-Shirt',
                          },
                        ],
                      },
                      id: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                    },
                    properties: {
                      FIRSTNAME: 'John',
                      LASTNAME: 'Doe',
                      LOCATION: 'Mumbai',
                      SMS: '+919876543210',
                      age: 19,
                      role: 'SDE',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://in-automate.sendinblue.com/api/v2/trackEvent',
                files: {},
                headers: {
                  'Content-Type': 'application/json',
                  'ma-key': 'clientKey123',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  contactAttributeMapping: [
                    {
                      from: 'location',
                      to: 'LOCATION',
                    },
                  ],
                  doi: false,
                  sendTraitsInTrack: true,
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    email: 'john_doe@example.com',
                    page: 'https://www.google.com/',
                    properties: {
                      ma_path: '/Testing/test/ourSdk.html',
                      ma_referrer: 'http://127.0.0.1:7307/Testing/test/',
                      ma_title: 'Google home',
                      sib_name: 'New Page',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://in-automate.sendinblue.com/api/v2/trackPage',
                files: {},
                headers: {
                  'Content-Type': 'application/json',
                  'ma-key': 'clientKey123',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  doi: false,
                  redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
                  templateId: 3,
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    attributes: {
                      EMAIL: 'alex_root@example.com',
                      FIRSTNAME: 'John',
                      LASTNAME: 'Doe',
                      LOCATION: 'Mumbai',
                      SMS: '+919876543210',
                      age: 19,
                      role: 'SDE',
                    },
                    email: 'john_doe@example.com',
                    emailBlacklisted: true,
                    listIds: [1, 2],
                    updateEnabled: true,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.sendinblue.com/v3/contacts',
                files: {},
                headers: {
                  'Content-Type': 'application/json',
                  'api-key': 'apiKey123',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  contactAttributeMapping: [
                    {
                      from: 'location',
                      to: 'LOCATION',
                    },
                  ],
                  doi: false,
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              error: 'sendinblueIncludeListIds is required to create a contact using DOI',
              metadata: [
                {
                  jobId: 4,
                },
              ],
              statTags: {
                destType: 'SENDINBLUE',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              destination: {
                Config: {
                  apiKey: 'apiKey123',
                  clientKey: 'clientKey123',
                  templateId: 3,
                  doi: true,
                  redirectionUrl: 'https://app.sendinblue.com/marketing-dashboard',
                },
              },
            },
          ],
        },
      },
    },
  },
];
