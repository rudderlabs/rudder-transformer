export const data = [
  {
    name: 'salesforce',
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
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
                integrations: { All: true },
                messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
                originalTimestamp: '2020-01-27T12:20:55.301Z',
                receivedAt: '2020-01-27T17:50:58.657+05:30',
                request_ip: '14.98.244.60',
                sentAt: '2020-01-27T12:20:56.849Z',
                timestamp: '2020-01-27T17:50:57.109+05:30',
                type: 'identify',
                userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              },
              metadata: { jobId: 1, userId: 'u1' },
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
            },
          ],
          destType: 'salesforce',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer dummy.access.token',
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
              ],
              metadata: [
                { destInfo: { authKey: '1WqFFH5esuVPnUgHkvEoYxDcX3y' }, jobId: 1, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
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
            },
          ],
        },
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
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
                    email: 'ddv_ua+{{1234*245}}@bugFix.com',
                    name: 'Peter Gibbons',
                    phone: '570-690-4150',
                    rating: 'Hot',
                    title: 'VP of Derp',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                },
                integrations: { All: true },
                messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
                originalTimestamp: '2020-01-27T12:20:55.301Z',
                receivedAt: '2020-01-27T17:50:58.657+05:30',
                request_ip: '14.98.244.60',
                sentAt: '2020-01-27T12:20:56.849Z',
                timestamp: '2020-01-27T17:50:57.109+05:30',
                type: 'identify',
                userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              },
              metadata: { jobId: 2, userId: 'u1' },
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
            },
          ],
          destType: 'salesforce',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead/leadId?_HttpMethod=PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer dummy.access.token',
                  },
                  params: {},
                  body: {
                    JSON: {
                      Email: 'ddv_ua+{{1234*245}}@bugFix.com',
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
              ],
              metadata: [
                { destInfo: { authKey: '1WqFFH5esuVPnUgHkvEoYxDcX3y' }, jobId: 2, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
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
            },
          ],
        },
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                },
                integrations: { All: true },
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
              metadata: { jobId: 3, userId: 'u1' },
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
            },
          ],
          destType: 'salesforce',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer dummy.access.token',
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
              ],
              metadata: [
                { destInfo: { authKey: '1WqFFH5esuVPnUgHkvEoYxDcX3y' }, jobId: 3, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
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
            },
          ],
        },
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 3',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummy.access.token',
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
                statusCode: 200,
              },
              metadata: { jobId: 4, userId: 'u1' },
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
            },
          ],
          destType: 'salesforce',
        },
        method: 'POST',
      },
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
                endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/Lead',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummy.access.token',
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
                statusCode: 200,
              },
              metadata: [
                { destInfo: { authKey: '1WqFFH5esuVPnUgHkvEoYxDcX3y' }, jobId: 4, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
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
            },
          ],
        },
      },
    },
  },
  {
    name: 'salesforce',
    description: 'Test 4 : Sending custom object for Salesforce-Oauth ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                channel: 'web',
                context: {
                  externalId: [
                    {
                      id: 72727,
                      type: 'SALESFORCE_OAUTH-CUSTOMOBJECT',
                      identifierType: 'CustomObject__c',
                    },
                  ],
                  mappedToDestination: 'true',
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
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
                integrations: { All: true },
                messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
                originalTimestamp: '2020-01-27T12:20:55.301Z',
                receivedAt: '2020-01-27T17:50:58.657+05:30',
                request_ip: '14.98.244.60',
                sentAt: '2020-01-27T12:20:56.849Z',
                timestamp: '2020-01-27T17:50:57.109+05:30',
                type: 'identify',
                userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                Config: {
                  initialAccessToken: 'dummyInitialAccessToken',
                  password: 'dummyPassword1',
                  userName: 'testsalesforce1453@gmail.com',
                },
                DestinationDefinition: {
                  DisplayName: 'Salesforce-Oauth',
                  ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                  Name: 'SALESFORCE_OAUTH',
                },
                Enabled: true,
                ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
                Name: 'tst',
                Transformations: [],
              },
            },
          ],
          destType: 'salesforce',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://ap15.salesforce.com/services/data/v50.0/sobjects/customobject',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer dummy.access.token',
                  },
                  params: {},
                  body: {
                    JSON: {
                      CustomObject__c: 72727,
                      address: {
                        postalCode: '94115',
                        city: 'east greenwich',
                        country: 'USA',
                        state: 'California',
                        street: '19123 forest lane',
                      },
                      anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                      company: 'Initech',
                      email: 'peter.gibbons@initech.com',
                      name: 'Peter Gibbons',
                      phone: '570-690-4150',
                      rating: 'Hot',
                      title: 'VP of Derp',
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { destInfo: { authKey: '1WqFFH5esuVPnUgHkvEoYxDcX3y' }, jobId: 1, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  initialAccessToken: 'dummyInitialAccessToken',
                  password: 'dummyPassword1',
                  userName: 'testsalesforce1453@gmail.com',
                },
                DestinationDefinition: {
                  DisplayName: 'Salesforce-Oauth',
                  ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                  Name: 'SALESFORCE_OAUTH',
                },
                Enabled: true,
                ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
                Name: 'tst',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'salesforce_oauth',
    description:
      'Test 5: Sending custom object with external id of different type for Salesforce-Oauth (extId number, apiResponse string) ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                channel: 'web',
                context: {
                  externalId: [
                    {
                      id: 72728,
                      type: 'SALESFORCE_OAUTH-CUSTOMOBJECT2',
                      identifierType: 'CustomObject2__c',
                    },
                  ],
                  mappedToDestination: 'true',
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
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
                integrations: { All: true },
                messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
                originalTimestamp: '2020-01-27T12:20:55.301Z',
                receivedAt: '2020-01-27T17:50:58.657+05:30',
                request_ip: '14.98.244.60',
                sentAt: '2020-01-27T12:20:56.849Z',
                timestamp: '2020-01-27T17:50:57.109+05:30',
                type: 'identify',
                userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                Config: {
                  initialAccessToken: 'dummyInitialAccessToken',
                  password: 'dummyPassword1',
                  userName: 'testsalesforce1453@gmail.com',
                },
                DestinationDefinition: {
                  DisplayName: 'Salesforce-Oauth',
                  ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                  Name: 'SALESFORCE_OAUTH',
                },
                Enabled: true,
                ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
                Name: 'tst',
                Transformations: [],
              },
            },
          ],
          destType: 'salesforce_oauth',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://ap15.salesforce.com/services/data/v50.0/sobjects/customobject2/id1101?_HttpMethod=PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer dummy.access.token',
                  },
                  params: {},
                  body: {
                    JSON: {
                      CustomObject2__c: 72728,
                      address: {
                        postalCode: '94115',
                        city: 'east greenwich',
                        country: 'USA',
                        state: 'California',
                        street: '19123 forest lane',
                      },
                      anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                      company: 'Initech',
                      email: 'peter.gibbons@initech.com',
                      name: 'Peter Gibbons',
                      phone: '570-690-4150',
                      rating: 'Hot',
                      title: 'VP of Derp',
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { destInfo: { authKey: '1WqFFH5esuVPnUgHkvEoYxDcX3y' }, jobId: 1, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  initialAccessToken: 'dummyInitialAccessToken',
                  password: 'dummyPassword1',
                  userName: 'testsalesforce1453@gmail.com',
                },
                DestinationDefinition: {
                  DisplayName: 'Salesforce-Oauth',
                  ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                  Name: 'SALESFORCE_OAUTH',
                },
                Enabled: true,
                ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
                Name: 'tst',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'salesforce_oauth',
    description:
      'Test 6: Sending custom object with external id of different type for Salesforce-Oauth (extId string, apiResponse number) ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                channel: 'web',
                context: {
                  externalId: [
                    {
                      id: '72729',
                      type: 'SALESFORCE_OAUTH-CUSTOMOBJECT2',
                      identifierType: 'CustomObject2__c',
                    },
                  ],
                  mappedToDestination: 'true',
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  ip: '0.0.0.0',
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
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
                integrations: { All: true },
                messageId: 'f19c35da-e9de-4c6e-b6e5-9e60cccc12c8',
                originalTimestamp: '2020-01-27T12:20:55.301Z',
                receivedAt: '2020-01-27T17:50:58.657+05:30',
                request_ip: '14.98.244.60',
                sentAt: '2020-01-27T12:20:56.849Z',
                timestamp: '2020-01-27T17:50:57.109+05:30',
                type: 'identify',
                userId: '1e7673da-9473-49c6-97f7-da848ecafa76',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                Config: {
                  initialAccessToken: 'dummyInitialAccessToken',
                  password: 'dummyPassword1',
                  userName: 'testsalesforce1453@gmail.com',
                },
                DestinationDefinition: {
                  DisplayName: 'Salesforce-Oauth',
                  ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                  Name: 'SALESFORCE_OAUTH',
                },
                Enabled: true,
                ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
                Name: 'tst',
                Transformations: [],
              },
            },
          ],
          destType: 'salesforce_oauth',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://ap15.salesforce.com/services/data/v50.0/sobjects/customobject2/id1102?_HttpMethod=PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer dummy.access.token',
                  },
                  params: {},
                  body: {
                    JSON: {
                      CustomObject2__c: '72729',
                      address: {
                        postalCode: '94115',
                        city: 'east greenwich',
                        country: 'USA',
                        state: 'California',
                        street: '19123 forest lane',
                      },
                      anonymousId: '1e7673da-9473-49c6-97f7-da848ecafa76',
                      company: 'Initech',
                      email: 'peter.gibbons@initech.com',
                      name: 'Peter Gibbons',
                      phone: '570-690-4150',
                      rating: 'Hot',
                      title: 'VP of Derp',
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { destInfo: { authKey: '1WqFFH5esuVPnUgHkvEoYxDcX3y' }, jobId: 1, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  initialAccessToken: 'dummyInitialAccessToken',
                  password: 'dummyPassword1',
                  userName: 'testsalesforce1453@gmail.com',
                },
                DestinationDefinition: {
                  DisplayName: 'Salesforce-Oauth',
                  ID: '1T96GHZ0YZ1qQSLULHCoJkow9KC',
                  Name: 'SALESFORCE_OAUTH',
                },
                Enabled: true,
                ID: '1WqFFH5esuVPnUgHkvEoYxDcX3y',
                Name: 'tst',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
];
