import { authHeader1, authHeader2, secret2 } from '../maskedSecrets';
export const data = [
  {
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                  company: 'Initech',
                  address: {
                    city: 'east greenwich',
                    country: 'USA',
                    state: 'California',
                    street: '19123 forest lane',
                    postalCode: '94115',
                  },
                  email: 'peter.gibbons@initech.com',
                  name: 'Peter Gibbons',
                  phone: '570-690-4150',
                  rating: 'Hot',
                  title: 'VP of Derp',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              userId: '',
              endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  Email: 'peter.gibbons@initech.com',
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  PostalCode: '94115',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'Initech',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                company: 'Initech',
                address: {
                  city: 'east greenwich',
                  country: 'USA',
                  state: 'California',
                  street: '19123 forest lane',
                  postalCode: '94115',
                },
                email: 'peter.gibbons@initech.com',
                name: 'Peter Gibbons',
                phone: '570-690-4150',
                rating: 'Hot',
                title: 'VP of Derp',
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              userId: '',
              endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  Email: 'peter.gibbons@initech.com',
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  PostalCode: '94115',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'Initech',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                company: 'Initech',
                address: {
                  city: 'east greenwich',
                  country: 'USA',
                  state: 'California',
                  street: '19123 forest lane',
                  postalCode: '94115',
                },
                email: 'peter.gibbons@initech.com',
                name: 'Peter Gibbons',
                phone: '570-690-4150',
                rating: 'Hot',
                title: 'VP of Derp',
                LeadSource: 'RudderLabs',
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  Email: 'peter.gibbons@initech.com',
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  PostalCode: '94115',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'Initech',
                  LeadSource: 'RudderLabs',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                company: 'Initech',
                address: {
                  city: 'east greenwich',
                  country: 'USA',
                  state: 'California',
                  street: '19123 forest lane',
                  postalCode: '94115',
                },
                email: 'peter.gibbons@initech.com',
                name: 'Peter Gibbons',
                phone: '570-690-4150',
                rating: 'Hot',
                title: 'VP of Derp',
                LeadSource: 'RudderLabs',
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'track',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            error: 'message type track is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'SALESFORCE',
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
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                company: 'Initech',
                address: {
                  city: 'east greenwich',
                  country: 'USA',
                  state: 'California',
                  street: '19123 forest lane',
                  postalCode: '94115',
                },
                email: 'peter.gibbons@initech.com',
                name: 'Peter Gibbons',
                phone: '570-690-4150',
                rating: 'Hot',
                title: 'VP of Derp',
                LeadSource: 'RudderLabs',
                customKey: 'customValue',
                customNullValue: null,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  Email: 'peter.gibbons@initech.com',
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  PostalCode: '94115',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'Initech',
                  LeadSource: 'RudderLabs',
                  customKey__c: 'customValue',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                address: {
                  city: 'east greenwich',
                  country: 'USA',
                  state: 'California',
                  street: '19123 forest lane',
                  postalCode: '94115',
                },
                email: 'peter.gibbons@initech.com',
                phone: '570-690-4150',
                rating: 'Hot',
                title: 'VP of Derp',
                LeadSource: 'RudderLabs',
                customKey: 'customValue',
                customNullValue: null,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  Email: 'peter.gibbons@initech.com',
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  PostalCode: '94115',
                  LastName: 'n/a',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'n/a',
                  LeadSource: 'RudderLabs',
                  customKey__c: 'customValue',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  City: 'east greenwich',
                  Company: 'Initech',
                  Country: 'USA',
                  Email: 'peter.gibbons@initech.com',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  Phone: '570-690-4150',
                  PostalCode: '94115',
                  Rating: 'Hot',
                  State: 'California',
                  Street: '19123 forest lane',
                  Title: 'VP of Derp',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                externalId: [
                  {
                    type: 'Salesforce-Contact',
                    id: 'sf-contact-id',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://ap15.salesforce.com/services/data/v50.0/sobjects/Contact/sf-contact-id?_HttpMethod=PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  Email__c: 'peter.gibbons@initech.com',
                  Phone__c: '570-690-4150',
                  Rating__c: 'Hot',
                  Title__c: 'VP of Derp',
                  FirstName__c: 'Peter',
                  LastName: 'n/a',
                  LastName__c: 'Gibbons',
                  PostalCode__c: '94115',
                  City__c: 'east greenwich',
                  Country__c: 'USA',
                  State__c: 'California',
                  Street__c: '19123 forest lane',
                  Company__c: 'Initech',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: 'dummyInitialAccessToken',
                password: 'dummyPassword1',
                userName: 'testsalesforce1453@gmail.com',
                mapProperty: false,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
              Name: 'tst',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  PostalCode: '94115',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'Initech',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                externalId: [
                  {
                    type: 'Salesforce-Lead',
                    id: 'sf-contact-id',
                  },
                ],
              },
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead/sf-contact-id?_HttpMethod=PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              userId: '',
              body: {
                JSON: {
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  PostalCode: '94115',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'Initech',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: '7fiy1FKcO9sohsxq1v6J88sg',
                password: 'dummyPassword2',
                userName: 'test.c97-qvpd@force.com.test',
                sandbox: true,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1ut7LcVW1QC56y2EoTNo7ZwBWSY',
              Name: 'Test SF',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                  company: 'Initech',
                  address: {
                    city: 'east greenwich',
                    country: 'USA',
                    state: 'California',
                    street: '19123 forest lane',
                    postalCode: '94115',
                  },
                  email: 'peter.gibbons@initech.com',
                  name: 'Peter Gibbons',
                  phone: '570-690-4150',
                  rating: 'Hot',
                  title: 'VP of Derp',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  Email: 'peter.gibbons@initech.com',
                  Phone: '570-690-4150',
                  Rating: 'Hot',
                  Title: 'VP of Derp',
                  FirstName: 'Peter',
                  LastName: 'Gibbons',
                  PostalCode: '94115',
                  City: 'east greenwich',
                  Country: 'USA',
                  State: 'California',
                  Street: '19123 forest lane',
                  Company: 'Initech',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: '7fiy1FKcO9sohsxq1v6J88sg',
                password: 'dummyPassword2',
                userName: 'test.c97-qvpd@force.com.test',
                sandbox: true,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1ut7LcVW1QC56y2EoTNo7ZwBWSY',
              Name: 'Test SF',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    id: 'a005g0000383kmUAAQ',
                    type: 'SALESFORCE-custom_object__c',
                    identifierType: 'Id',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'john@rs.com',
                  firstname: 'john doe',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              userId: '',
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://ap15.salesforce.com/services/data/v50.0/sobjects/custom_object__c/a005g0000383kmUAAQ?_HttpMethod=PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  email: 'john@rs.com',
                  firstname: 'john doe',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: '7fiy1FKcO9sohsxq1v6J88sg',
                password: 'dummyPassword2',
                userName: 'test.c97-qvpd@force.com.test',
                sandbox: true,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE',
              },
              Enabled: true,
              ID: '1ut7LcVW1QC56y2EoTNo7ZwBWSY',
              Name: 'Test SF',
              Transformations: [],
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    id: 'a005g0000383kmUAAQ',
                    type: 'SALESFORCE-custom_object__c',
                    identifierType: 'Id',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'john@rs.com',
                  firstname: 'john doe',
                  Id: 'some-id',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://ap15.salesforce.com/services/data/v50.0/sobjects/custom_object__c/a005g0000383kmUAAQ?_HttpMethod=PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader1,
              },
              params: {},
              body: {
                JSON: {
                  email: 'john@rs.com',
                  firstname: 'john doe',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
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
                initialAccessToken: '7fiy1FKcO9sohsxq1v6J88sg',
                password: 'dummyPassword2',
                userName: 'test.c97-qvpd@force.com.test',
                sandbox: true,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce Sandbox',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE_OAUTH_SANDBOX',
              },
              Enabled: true,
              ID: '1ut7LcVW1QC56y2EoTNo7ZwBWSY',
              Name: 'Test SF',
              Transformations: [],
            },
            metadata: {
              secret: {
                access_token: secret2,
                instance_url: 'https://dummyurl.com',
              },
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              context: {
                mappedToDestination: true,
                externalId: [
                  {
                    id: 'a005g0000383kmUAAQ',
                    type: 'SALESFORCE_OAUTH_SANDBOX-custom_object__c',
                    identifierType: 'Id',
                  },
                ],
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                locale: 'en-US',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'john@rs.com',
                  firstname: 'john doe',
                  Id: 'some-id',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
            statusCode: 200,
            metadata: {
              secret: {
                access_token: secret2,
                instance_url: 'https://dummyurl.com',
              },
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://dummyurl.com/services/data/v50.0/sobjects/custom_object__c/a005g0000383kmUAAQ?_HttpMethod=PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader2,
              },
              params: {},
              body: {
                JSON: {
                  email: 'john@rs.com',
                  firstname: 'john doe',
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
          },
        ],
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 12 : Retry happens when no secret information is found',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                initialAccessToken: '7fiy1FKcO9sohsxq1v6J88sg',
                password: 'dummyPassword2',
                userName: 'test.c97-qvpd@force.com.test',
                sandbox: true,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce Sandbox',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE_OAUTH_SANDBOX',
              },
              Enabled: true,
              ID: '1ut7LcVW1QC56y2EoTNo7ZwBWSY',
              Name: 'Test SF',
              Transformations: [],
            },
            metadata: {
              jobId: 1,
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
              'Secret is undefined/null. This might be a platform issue. Please contact RudderStack support for assistance.',
            metadata: {
              jobId: 1,
            },
            statTags: {
              errorCategory: 'platform',
              errorType: 'oAuthSecret',
              destType: 'SALESFORCE',
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
    name: 'salesforce',
    description: 'Test 13 : Retry happens when access_token is undefined in secret',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                initialAccessToken: '7fiy1FKcO9sohsxq1v6J88sg',
                password: 'dummyPassword2',
                userName: 'test.c97-qvpd@force.com.test',
                sandbox: true,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce Sandbox',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE_OAUTH_SANDBOX',
              },
              Enabled: true,
              ID: '1ut7LcVW1QC56y2EoTNo7ZwBWSY',
              Name: 'Test SF',
              Transformations: [],
            },
            metadata: {
              jobId: 1,
              secret: {},
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
              'access_token is undefined/null. This might be a platform issue. Please contact RudderStack support for assistance.',
            metadata: {
              jobId: 1,
              secret: {},
            },
            statTags: {
              errorCategory: 'platform',
              errorType: 'oAuthSecret',
              destType: 'SALESFORCE',
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
    name: 'salesforce',
    description: 'Test 14 : Retry happens when instance_url is undefined in secret',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                initialAccessToken: '7fiy1FKcO9sohsxq1v6J88sg',
                password: 'dummyPassword2',
                userName: 'test.c97-qvpd@force.com.test',
                sandbox: true,
              },
              DestinationDefinition: {
                DisplayName: 'Salesforce Sandbox',
                ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                Name: 'SALESFORCE_OAUTH_SANDBOX',
              },
              Enabled: true,
              ID: '1ut7LcVW1QC56y2EoTNo7ZwBWSY',
              Name: 'Test SF',
              Transformations: [],
            },
            metadata: {
              jobId: 1,
              secret: {
                access_token: secret2,
              },
            },
            message: {
              anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              channel: 'web',
              integrations: {
                All: true,
              },
              messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
              userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
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
              'instance_url is undefined/null. This might be a platform issue. Please contact RudderStack support for assistance.',
            metadata: {
              jobId: 1,
              secret: {
                access_token: secret2,
              },
            },
            statTags: {
              errorCategory: 'platform',
              errorType: 'oAuthSecret',
              destType: 'SALESFORCE',
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
