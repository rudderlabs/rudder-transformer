export const data = [
  {
    name: 'userpilot',
    description: 'Identify user test',
    module: 'destination',
    version: 'v0',
    feature: 'processor',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'userpilot-destination-id',
              Name: 'Userpilot',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'your-userpilot-api-key',
                apiEndpoint: 'https://analytex.userpilot.io',
              },
              enabled: true,
              transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            message: {
              userId: 'customUserID',
              type: 'identify',
              context: {
                traits: {
                  name: 'John Doe',
                  title: 'CEO',
                  email: 'name.surname@domain.com',
                  company: 'Company123',
                  phone: '123-456-7890',
                  rating: 'Hot',
                  city: 'Austin',
                  postalCode: '12345',
                  country: 'US',
                  street: 'Sample Address',
                  state: 'TX',
                },
                sessionId: 1742115400440,
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: 'dev-snapshot',
                  installType: 'cdn',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: 'dev-snapshot',
                  snippetVersion: '3.0.60',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                os: {
                  name: '',
                  version: '',
                },
                locale: 'en',
                screen: {
                  width: 1728,
                  height: 1117,
                  density: 2,
                  innerWidth: 1688,
                  innerHeight: 451,
                },
                campaign: {},
                page: {
                  path: '/cdn/legacy/iife/index.html',
                  referrer: 'http://localhost:3001/cdn/legacy/iife/index.html',
                  referring_domain: 'localhost:3001',
                  search: '',
                  title: '',
                  url: 'http://localhost:3001/cdn/legacy/iife/index.html',
                  tab_url: 'http://localhost:3001/cdn/legacy/iife/index.html',
                  initial_referrer: '$direct',
                  initial_referring_domain: 'localhost:3001',
                },
                timezone: 'GMT+0200',
              },
              channel: 'web',
              originalTimestamp: '2025-03-16T08:57:10.737Z',
              messageId: '5799e19f-57e9-4a36-a34b-369d455b8332',
              anonymousId: 'd681c65d-f3fd-4f2e-b9a7-d5c2ae3c8b9b',
              event: null,
              properties: null,
              integrations: {
                All: true,
              },
              sentAt: '2025-03-16T08:57:10.737Z',
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
              endpoint: 'https://analytex.userpilot.io/v1/identify',
              headers: {
                Authorization: 'Token your-userpilot-api-key',
                'Content-Type': 'application/json',
                'X-API-Version': '2020-09-22',
              },
              params: {},
              body: {
                user_id: 'customUserID',
                metadata: {
                  name: 'John Doe',
                  title: 'CEO',
                  email: 'name.surname@domain.com',
                  company: 'Company123',
                  phone: '123-456-7890',
                  rating: 'Hot',
                  city: 'Austin',
                  postalCode: '12345',
                  country: 'US',
                  street: 'Sample Address',
                  state: 'TX',
                },
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
    name: 'userpilot',
    description: 'Track event test',
    module: 'destination',
    version: 'v0',
    feature: 'processor',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'userpilot-destination-id',
              Name: 'Userpilot',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'your-userpilot-api-key',
                apiEndpoint: 'https://analytex.userpilot.io',
              },
              enabled: true,
              transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            message: {
              properties: {
                revenue: 30,
                currency: 'USD',
                user_actual_id: 12345,
              },
              event: 'test track event 1',
              type: 'track',
              channel: 'web',
              context: {
                traits: {
                  name: 'John Doe',
                  title: 'CEO',
                  email: 'name.surname@domain.com',
                  company: 'Company123',
                  phone: '123-456-7890',
                  rating: 'Hot',
                  city: 'Austin',
                  postalCode: '12345',
                  country: 'US',
                  street: 'Sample Address',
                  state: 'TX',
                },
                sessionId: 1742115400440,
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: 'dev-snapshot',
                  installType: 'cdn',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: 'dev-snapshot',
                  snippetVersion: '3.0.60',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                os: {
                  name: '',
                  version: '',
                },
                locale: 'en',
                screen: {
                  width: 1728,
                  height: 1117,
                  density: 2,
                  innerWidth: 1490,
                  innerHeight: 493,
                },
                campaign: {},
                page: {
                  path: '/cdn/legacy/iife/index.html',
                  referrer: '$direct',
                  referring_domain: '',
                  search: '',
                  title: '',
                  url: 'http://localhost:3001/cdn/legacy/iife/index.html',
                  tab_url: 'http://localhost:3001/cdn/legacy/iife/index.html',
                  initial_referrer: '$direct',
                  initial_referring_domain: 'localhost:3001',
                },
                timezone: 'GMT+0200',
              },
              originalTimestamp: '2025-03-16T09:12:35.009Z',
              messageId: '312ccd7b-c080-439e-bbb4-468c3bd4a55f',
              userId: 'customUserID',
              anonymousId: 'd681c65d-f3fd-4f2e-b9a7-d5c2ae3c8b9b',
              integrations: {
                All: true,
              },
              sentAt: '2025-03-16T09:12:35.009Z',
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
              endpoint: 'https://analytex.userpilot.io/v1/track',
              headers: {
                Authorization: 'Token your-userpilot-api-key',
                'Content-Type': 'application/json',
                'X-API-Version': '2020-09-22',
              },
              params: {},
              body: {
                user_id: 'customUserID',
                event: 'test track event 1',
                metadata: {
                  revenue: 30,
                  currency: 'USD',
                  user_actual_id: 12345,
                },
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
    name: 'userpilot',
    description: 'Group (company) test',
    module: 'destination',
    version: 'v0',
    feature: 'processor',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: 'userpilot-destination-id',
              Name: 'Userpilot',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'your-userpilot-api-key',
                apiEndpoint: 'https://analytex.userpilot.io',
              },
              enabled: true,
              transformations: [],
            },
            message: {
              type: 'group',
              groupId: 'sample_group_id',
              traits: {
                name: 'Apple Inc.',
                location: 'USA',
              },
              channel: 'web',
              context: {
                traits: {
                  name: 'John Doe',
                  title: 'CEO',
                  email: 'name.surname@domain.com',
                  company: 'Company123',
                  phone: '123-456-7890',
                  rating: 'Hot',
                  city: 'Austin',
                  postalCode: '12345',
                  country: 'US',
                  street: 'Sample Address',
                  state: 'TX',
                },
                sessionId: 1742115400440,
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: 'dev-snapshot',
                  installType: 'cdn',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: 'dev-snapshot',
                  snippetVersion: '3.0.60',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                os: {
                  name: '',
                  version: '',
                },
                locale: 'en',
                screen: {
                  width: 1728,
                  height: 1117,
                  density: 2,
                  innerWidth: 1490,
                  innerHeight: 493,
                },
                campaign: {},
                page: {
                  path: '/cdn/legacy/iife/index.html',
                  referrer: '$direct',
                  referring_domain: '',
                  search: '',
                  title: '',
                  url: 'http://localhost:3001/cdn/legacy/iife/index.html',
                  tab_url: 'http://localhost:3001/cdn/legacy/iife/index.html',
                  initial_referrer: '$direct',
                  initial_referring_domain: 'localhost:3001',
                },
                timezone: 'GMT+0200',
              },
              originalTimestamp: '2025-03-16T09:07:51.447Z',
              messageId: 'b169b724-00c1-4bda-9d95-d982d6b367c7',
              userId: 'customUserID',
              anonymousId: 'd681c65d-f3fd-4f2e-b9a7-d5c2ae3c8b9b',
              event: null,
              properties: null,
              integrations: {
                All: true,
              },
              sentAt: '2025-03-16T09:07:51.447Z',
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
              method: 'POST',
              endpoint: 'https://analytex.userpilot.io/v1/companies/identify',
              headers: {
                Authorization: 'Token your-userpilot-api-key',
                'Content-Type': 'application/json',
                'X-API-Version': '2020-09-22',
              },
              params: {},
              body: {
                company_id: 'sample_group_id',
                metadata: {
                  name: 'Apple Inc.',
                  location: 'USA',
                },
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
