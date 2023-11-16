export const data = [
  {
    name: 'mautic',
    description: 'Sub-Domain Not given and Domain Field is given, domainMethod is domainNameOption',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { library: { name: 'http' } },
              traits: {
                address: {
                  addressLine1: 'abcde',
                  addressLine2: 'fghjikld',
                  area: 'Model Town',
                  city: 'Bareilly',
                },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: '',
                domainMethod: 'domainNameOption',
                domainName: 'https://testmautic.com',
                userName: 'abcdef@gmail.com',
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
              endpoint: 'https://testmautic.com/api/contacts/new',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmQGdtYWlsLmNvbTpkdW1teVBhc3N3b3Jk',
              },
              params: {},
              body: {
                JSON: {
                  city: 'Bareilly',
                  address1: 'abcde',
                  address2: 'fghjikld',
                  last_active: '2020-02-02T05:53:08.977+05:30',
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
    name: 'mautic',
    description: 'Both Sub-Domain and Domain Field are given, domainMethod is subDomainNameOption',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { library: { name: 'http' } },
              traits: {
                address: {
                  addressLine1: 'abcde',
                  addressLine2: 'fghjikld',
                  area: 'Model Town',
                  city: 'Bareilly',
                  last_active: '2020-02-02T05:53:08.977+05:30',
                },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'test',
                domainMethod: 'subDomainNameOption',
                domainName: 'https://testmautic.com/',
                userName: 'abcdef@gmail.com',
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
              endpoint: 'https://test.mautic.net/api/contacts/new',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmQGdtYWlsLmNvbTpkdW1teVBhc3N3b3Jk',
              },
              params: {},
              body: {
                JSON: {
                  city: 'Bareilly',
                  address1: 'abcde',
                  address2: 'fghjikld',
                  last_active: '2020-02-02T05:53:08.977+05:30',
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
    name: 'mautic',
    description: 'Both Sub-Domain and Domain Field are given, domainMethod is domainNameOption',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { library: { name: 'http' } },
              traits: {
                address: {
                  addressLine1: 'abcde',
                  addressLine2: 'fghjikld',
                  area: 'Model Town',
                  city: 'Bareilly',
                },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'test',
                domainMethod: 'domainNameOption',
                domainName: 'https://testmautic.com',
                userName: 'abcdef@gmail.com',
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
              endpoint: 'https://testmautic.com/api/contacts/new',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmQGdtYWlsLmNvbTpkdW1teVBhc3N3b3Jk',
              },
              params: {},
              body: {
                JSON: {
                  city: 'Bareilly',
                  address1: 'abcde',
                  address2: 'fghjikld',
                  last_active: '2020-02-02T05:53:08.977+05:30',
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
    name: 'mautic',
    description: 'Password Not Provided for Authentication',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                password: '',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
            error: 'Invalid password value specified in the destination configuration',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: 'Empty Sub-Domain and Domain Field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                userName: 'opiogfuebj',
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
            error: 'Please Provide either subDomain or Domain Name',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: 'Create a new Contact with address as String',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
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
              endpoint: 'https://ruddertest2.mautic.net/api/contacts/new',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic VGVzdFJ1ZGRlcmxhYnM0NTgyM0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mautic',
    description: 'Update an existing Contact',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
                traits: {
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  role: 'Manager',
                  address: 'Flat No 58 ABC building XYZ Area near PQRS , 354408',
                  hasPurchased: 'yes',
                  email: 'hijibi@gmail.com',
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
              method: 'PATCH',
              endpoint: 'https://ruddertest2.mautic.net/api/contacts/247/edit',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic VGVzdFJ1ZGRlcmxhYnM0NTgyM0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
              },
              params: {},
              body: {
                JSON: {
                  email: 'hijibi@gmail.com',
                  title: 'Mr',
                  last_active: '2020-02-02T05:53:08.977+05:30',
                  firstname: 'Test',
                  lastname: 'Rudderlabs',
                  phone: '9876543210',
                  website: 'abc.com',
                  state: 'Uttar Pradesh',
                  zipcode: '243001',
                  ipAddress: '14.5.67.21',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mautic',
    description: 'Invalid userName',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
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
                subDomainName: 'testapi3',
                userName: '',
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
            error: 'Invalid userName value specified in the destination configuration',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: 'Password Not Provided for Authentication',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
                traits: { firstName: 'Test', lastName: 'Rudderlabs' },
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
                password: '',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
            error: 'Invalid password value specified in the destination configuration',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: 'Empty Sub-Domain Field ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
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
                userName: 'abcdef@gmail.com',
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
            error: 'Please Provide either subDomain or Domain Name',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Message type not given',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
                traits: { state: 'uttar pradesh' },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
            error: 'Event type is required',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Message type not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
                traits: { state: 'uttar pradesh' },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'Alias',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'TestRudderlabs45823@gmail.com',
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
            error: 'Event type "alias" is not supported',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: 'Invalid Title',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { ip: '14.5.67.21', library: { name: 'http' }, traits: { title: 'jhdv11' } },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
            error: 'Invalid entry for key title',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: 'Invalid Phone No. ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { ip: '14.5.67.21', library: { name: 'http' }, traits: { phone: '765798' } },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
            error: 'The provided phone number is invalid',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Invalid hasPurchased',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
                traits: { hasPurchased: 'Mightbe' },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
            error: 'Invalid entry for key haspurchased',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Invalid role',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { ip: '14.5.67.21', library: { name: 'http' }, traits: { role: 'Xyz' } },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'TestRudderlabs45823@gmail.com',
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
            error: 'Invalid entry for key role',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Invalid subscriptionStatus',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
                traits: { subscriptionStatus: 'NA' },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'TestRudderlabs45823@gmail.com',
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
            error: 'Invalid entry for key subscription_status',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Invalid email',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { ip: '14.5.67.21', library: { name: 'http' }, traits: { email: 'abc123' } },
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'TestRudderlabs45823@gmail.com',
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
            error: 'The provided email is invalid',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Invalid POC',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: {
                ip: '14.5.67.21',
                library: { name: 'http' },
                traits: { prospectOrCustomer: 'random' },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'TestRudderlabs45823@gmail.com',
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
            error: 'Invalid entry for key prospect_or_customer',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Address as object and city included in it and state Conversion ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { library: { name: 'http' } },
              traits: { address: { area: 'Model Town', city: 'Bareilly' } },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
              endpoint: 'https://testapi3.mautic.net/api/contacts/new',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmQGdtYWlsLmNvbTpkdW1teVBhc3N3b3Jk',
              },
              params: {},
              body: {
                JSON: {
                  city: 'Bareilly',
                  address1: 'Model Town Bareilly ',
                  address2: '',
                  last_active: '2020-02-02T05:53:08.977+05:30',
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
    name: 'mautic',
    description: ' Address as object with adress line 1, line 2 and city included in it  ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { library: { name: 'http' } },
              traits: {
                address: {
                  addressLine1: 'abcde',
                  addressLine2: 'fghjikld',
                  area: 'Model Town',
                  city: 'Bareilly',
                },
              },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi3',
                userName: 'abcdef@gmail.com',
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
              endpoint: 'https://testapi3.mautic.net/api/contacts/new',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic YWJjZGVmQGdtYWlsLmNvbTpkdW1teVBhc3N3b3Jk',
              },
              params: {},
              body: {
                JSON: {
                  city: 'Bareilly',
                  address1: 'abcde',
                  address2: 'fghjikld',
                  last_active: '2020-02-02T05:53:08.977+05:30',
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
    name: 'mautic',
    description: ' Update contact with contactId inside externalId ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon-id-new',
              context: { externalId: [{ type: 'mauticContactId', id: '246' }] },
              traits: { firstName: 'Test', role: 'Manager' },
              messageId: '25ea6605-c788-4cab-8fed-2cf0b831c4a8',
              originalTimestamp: '2020-02-02T00:23:09.544Z',
              receivedAt: '2022-08-17T10:40:21.162+05:30',
              request_ip: '[::1]',
              rudderId: 'daf823fb-e8d3-413a-8313-d34cd756f968',
              sentAt: '2022-08-17T10:40:21.728+05:30',
              timestamp: '2020-02-02T05:53:08.977+05:30',
              userId: 'identified user id',
              type: 'identify',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'testapi5',
                userName: 'Test45823Rudderlabs@gmail.com',
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
              method: 'PATCH',
              endpoint: 'https://testapi5.mautic.net/api/contacts/246/edit',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic VGVzdDQ1ODIzUnVkZGVybGFic0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
              },
              params: {},
              body: {
                JSON: {
                  last_active: '2020-02-02T05:53:08.977+05:30',
                  firstname: 'Test',
                  role: 'Manager',
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
    name: 'mautic',
    description: ' Group Id not given ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              context: { externalId: [{ type: 'mauticContactId', id: '246' }] },
              traits: { type: 'Segments' },
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'lastName',
                password: 'dummyPassword',
                subDomainName: 'testapi5',
                userName: 'Test45823Rudderlabs@gmail.com',
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
            error: '`groupId` is missing in the event',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description:
      'Remove contact with segment with ConatctId given inside externalId and operation given as remove',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              groupId: '17',
              context: { externalId: [{ type: 'mauticContactId', id: '246' }] },
              traits: { lastName: 'garwal', type: 'Segments', operation: 'remove' },
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'lastName',
                password: 'dummyPassword',
                subDomainName: 'testapi5',
                userName: 'Test45823Rudderlabs@gmail.com',
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
              endpoint: 'https://testapi5.mautic.net/api/segments/17/contact/246/remove',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic VGVzdDQ1ODIzUnVkZGVybGFic0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
              },
              params: {},
              body: { JSON: {}, JSON_ARRAY: {}, XML: {}, FORM: {} },
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
    name: 'mautic',
    description:
      'Group contact with segment with contactId inside externalId with operation givenn as add',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              groupId: '17',
              context: { externalId: [{ type: 'mauticContactId', id: '246' }] },
              traits: { type: 'Segments' },
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'lastName',
                password: 'dummyPassword',
                subDomainName: 'testapi5',
                userName: 'Test45823Rudderlabs@gmail.com',
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
              endpoint: 'https://testapi5.mautic.net/api/segments/17/contact/246/add',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic VGVzdDQ1ODIzUnVkZGVybGFic0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
              },
              params: {},
              body: { JSON: {}, JSON_ARRAY: {}, XML: {}, FORM: {} },
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
    name: 'mautic',
    description: ' Group type not given  ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              context: { externalId: [{ type: 'mauticContactId', id: '246' }] },
              traits: {},
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'lastName',
                password: 'dummyPassword',
                subDomainName: 'testapi5',
                userName: 'abcdef@gmail.com',
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
            error: '`type` is missing in the traits',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' Group type not supported  ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              groupId: '17',
              context: { externalId: [{ type: 'mauticContactId', id: '246' }] },
              traits: { type: 'Alias' },
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'lastName',
                password: 'dummyPassword',
                subDomainName: 'testapi5',
                userName: 'abcdef@gmail.com',
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
            error:
              'Grouping type "alias" is not supported. Only "Segments", "Companies", and "Campaigns" are supported',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: 'Group contact with Company without contactId inside externalId ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              groupId: '20',
              context: { traits: { email: 'hijibi@gmail.com' } },
              traits: { type: 'Companies' },
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'email',
                password: 'dummyPassword',
                subDomainName: 'ruddertest2',
                userName: 'Test45823Rudderlabs@gmail.com',
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
              endpoint: 'https://ruddertest2.mautic.net/api/companies/20/contact/247/add',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic VGVzdDQ1ODIzUnVkZGVybGFic0BnbWFpbC5jb206ZHVtbXlQYXNzd29yZA==',
              },
              params: {},
              body: { JSON: {}, JSON_ARRAY: {}, XML: {}, FORM: {} },
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
    name: 'mautic',
    description:
      ' Group contact with campaign with contactId found by lookUpField with no operation field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              groupId: '20',
              traits: { lastName: 'kumar', type: 'Campaigns' },
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'lastName',
                password: 'dummyPassword',
                subDomainName: 'ruddertest2',
                userName: 'Test45823Rudderlabs@gmail.com',
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
            error: 'Found more than one contact on lookup',
            statTags: {
              destType: 'MAUTIC',
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
    name: 'mautic',
    description: ' No contact found for lookup field and email to group ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user123',
              groupId: '20',
              traits: { lastName: 'Singh', type: 'Campaigns' },
              type: 'group',
            },
            destination: {
              Config: {
                lookUpField: 'lastName',
                password: 'dummyPassword',
                subDomainName: 'ruddertest2',
                userName: 'Test45823Rudderlabs@gmail.com',
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
            error: 'Could not find any contact ID on lookup',
            statTags: {
              destType: 'MAUTIC',
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
];
