export const data = [
  {
    name: 'mautic',
    description: 'Successfull Identify Call with all traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: 'anon-id-new',
                context: {
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                  traits: {
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                    role: 'Manager',
                    address: 'Flat No 58 ABC building XYZ Area near PQRS , 354408',
                    hasPurchased: 'yes',
                    email: 'abc@xyz.com',
                    title: 'Mr',
                    phone: '9876543210',
                    state: 'Uttar Pradesh',
                    zipcode: '243001',
                    prospectOrCustomer: 'Prospect',
                    country: 'India',
                    website: 'abc.com',
                    subscriptionStatus: 'New',
                  },
                },
                messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
                originalTimestamp: '2020-02-02T00:23:09.544Z',
                receivedAt: '2022-08-17T10:40:21.162+05:30',
                request_ip: '[::1]',
                rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
                sentAt: '2022-08-17T10:40:21.728+05:30',
                timestamp: '2020-02-02T05:53:08.977+05:30',
                type: 'identify',
                userId: 'identified user id',
              },
              destination: {
                Config: {
                  lookUpField: 'email',
                  password: 'dummyPassword',
                  subDomainName: 'ruddertest2',
                  userName: 'TestRudderlabs45823@gmail.com',
                },
              },
              metadata: {
                jobId: 1,
              },
            },
          ],
          destType: 'mautic',
        },
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://ruddertest2.mautic.net/api/contacts/new',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic VGVzdFJ1ZGRlcmxhYnM0NTgyM0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
                },
                params: {},
                body: {
                  JSON: {
                    email: 'abc@xyz.com',
                    title: 'Mr',
                    firstname: 'Test',
                    lastname: 'Rudderlabs',
                    phone: '9876543210',
                    website: 'abc.com',
                    state: 'Uttar Pradesh',
                    zipcode: '243001',
                    ipAddress: '14.5.67.21',
                    last_active: '2020-02-02T05:53:08.977+05:30',
                    country: 'India',
                    haspurchased: 'yes',
                    role: 'Manager',
                    subscription_status: 'New',
                    prospect_or_customer: 'Prospect',
                    address1: 'Flat No 58 ABC building XYZ Area near PQRS , 354408',
                    address2: '',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  lookUpField: 'email',
                  password: 'dummyPassword',
                  subDomainName: 'ruddertest2',
                  userName: 'TestRudderlabs45823@gmail.com',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'mautic',
    description: 'Invalid user name provided in the destination configuration',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: 'anon-id-new',
                context: {
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                  traits: {
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                    role: 'Manager',
                    address: 'Flat No 58 ABC building XYZ Area near PQRS , 354408',
                    hasPurchased: 'yes',
                    email: 'abc@xyz.com',
                    title: 'Mr',
                    phone: '9876543210',
                    state: 'Uttar Pradesh',
                    zipcode: '243001',
                    prospectOrCustomer: 'Prospect',
                    country: 'India',
                    website: 'abc.com',
                    subscriptionStatus: 'New',
                  },
                },
                messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
                originalTimestamp: '2020-02-02T00:23:09.544Z',
                receivedAt: '2022-08-17T10:40:21.162+05:30',
                request_ip: '[::1]',
                rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
                sentAt: '2022-08-17T10:40:21.728+05:30',
                timestamp: '2020-02-02T05:53:08.977+05:30',
                type: 'identify',
                userId: 'identified user id',
              },
              destination: {
                Config: {
                  lookUpField: 'email',
                  password: 'dummyPassword',
                  subDomainName: '',
                  domainName: '',
                  userName: 'abcdef',
                },
              },
              metadata: {
                jobId: 2,
              },
            },
          ],
          destType: 'mautic',
        },
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [
                {
                  jobId: 2,
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'MAUTIC',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination: {
                Config: {
                  domainName: '',
                  lookUpField: 'email',
                  password: 'dummyPassword',
                  subDomainName: '',
                  userName: 'abcdef',
                },
              },
              batched: false,
              statusCode: 400,
              error: 'Please Provide either subDomain or Domain Name',
            },
          ],
        },
      },
    },
  },
  {
    name: 'mautic',
    description: 'Successfull Segment Group Call',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                userId: 'user123',
                groupId: '17',
                context: {
                  externalId: [
                    {
                      type: 'mauticContactId',
                      id: '246',
                    },
                  ],
                },
                traits: {
                  type: 'Segments',
                },
                type: 'group',
              },
              destination: {
                Config: {
                  lookUpField: 'lastName',
                  password: 'dummyPassword',
                  subDomainName: 'ruddertest2',
                  userName: 'TestRudderlabs45823@gmail.com',
                },
              },
              metadata: {
                jobId: 3,
              },
            },
          ],
          destType: 'mautic',
        },
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://ruddertest2.mautic.net/api/segments/17/contact/246/add',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic VGVzdFJ1ZGRlcmxhYnM0NTgyM0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
                },
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  lookUpField: 'lastName',
                  password: 'dummyPassword',
                  subDomainName: 'ruddertest2',
                  userName: 'TestRudderlabs45823@gmail.com',
                },
              },
            },
          ],
        },
      },
    },
  },
];
