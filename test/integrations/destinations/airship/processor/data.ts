export const data = [
  {
    name: 'airship',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Clicked',
              userId: 'testuserId1',
              properties: {
                description: 'Sneaker purchase',
                brand: 'Victory Sneakers',
                colors: ['red', 'blue'],
                items: [
                  { text: 'New Line Sneakers', price: '$ 79.95' },
                  { text: 'Old Line Sneakers', price: '$ 79.95' },
                  { text: 'Blue Line Sneakers', price: '$ 79.95' },
                ],
                name: 'Hugh Manbeing',
                userLocation: { state: 'CO', zip: '80202' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/custom-events',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                'X-UA-Appkey': 'O2YARRI15I',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  occured: '2019-10-14T09:03:17.562Z',
                  user: { named_user_id: 'testuserId1' },
                  body: {
                    name: 'product_clicked',
                    properties: {
                      description: 'Sneaker purchase',
                      brand: 'Victory Sneakers',
                      colors: ['red', 'blue'],
                      items: [
                        { text: 'New Line Sneakers', price: '$ 79.95' },
                        { text: 'Old Line Sneakers', price: '$ 79.95' },
                        { text: 'Blue Line Sneakers', price: '$ 79.95' },
                      ],
                      name: 'Hugh Manbeing',
                      userLocation: { state: 'CO', zip: '80202' },
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
    name: 'airship',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'testuserId1',
              properties: {
                description: 'Sneaker purchase',
                brand: 'Victory Sneakers',
                colors: ['red', 'blue'],
                items: [
                  { text: 'New Line Sneakers', price: '$ 79.95' },
                  { text: 'Old Line Sneakers', price: '$ 79.95' },
                  { text: 'Blue Line Sneakers', price: '$ 79.95' },
                ],
                name: 'Hugh Manbeing',
                userLocation: { state: 'CO', zip: '80202' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                dataCenter: false,
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
            error: 'event name is required for track',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Clicked',
              userId: 'testuserId1',
              properties: {
                description: 'Sneaker purchase',
                brand: 'Victory Sneakers',
                colors: ['red', 'blue'],
                items: [
                  { text: 'New Line Sneakers', price: '$ 79.95' },
                  { text: 'Old Line Sneakers', price: '$ 79.95' },
                  { text: 'Blue Line Sneakers', price: '$ 79.95' },
                ],
                name: 'Hugh Manbeing',
                userLocation: { state: 'CO', zip: '80202' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', dataCenter: false },
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
            error: 'App Key is required for authorization for track events',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
    description: 'Test 3',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Clicked',
              userId: 'testuserId1',
              properties: {
                description: 'Sneaker purchase',
                brand: 'Victory Sneakers',
                colors: ['red', 'blue'],
                items: [
                  { text: 'New Line Sneakers', price: '$ 79.95' },
                  { text: 'Old Line Sneakers', price: '$ 79.95' },
                  { text: 'Blue Line Sneakers', price: '$ 79.95' },
                ],
                name: 'Hugh Manbeing',
                userLocation: { state: 'CO', zip: '80202' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                dataCenter: true,
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
              endpoint: 'https://go.airship.eu/api/custom-events',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                'X-UA-Appkey': 'O2YARRI15I',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  occured: '2019-10-14T09:03:17.562Z',
                  user: { named_user_id: 'testuserId1' },
                  body: {
                    name: 'product_clicked',
                    properties: {
                      description: 'Sneaker purchase',
                      brand: 'Victory Sneakers',
                      colors: ['red', 'blue'],
                      items: [
                        { text: 'New Line Sneakers', price: '$ 79.95' },
                        { text: 'Old Line Sneakers', price: '$ 79.95' },
                        { text: 'Blue Line Sneakers', price: '$ 79.95' },
                      ],
                      name: 'Hugh Manbeing',
                      userLocation: { state: 'CO', zip: '80202' },
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
    name: 'airship',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'Peter Gibbons',
                age: 34,
                email: 'peter@example.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
              },
              type: 'identify',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      action: 'set',
                      key: 'full_name',
                      value: 'Peter Gibbons',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'age', value: 34, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'email',
                      value: 'peter@example.com',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'plan',
                      value: 'premium',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'logins', value: 5, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'address_street',
                      value: '6th St',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'city',
                      value: 'San Francisco',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'region',
                      value: 'CA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'zipcode',
                      value: '94103',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'country',
                      value: 'USA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                  ],
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
    name: 'airship',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: { name: true, email: true, favColor: false },
              type: 'identify',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/named_users/tags',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  audience: { named_user_id: '97980cfea0067' },
                  add: { rudderstack_integration: ['name', 'email'] },
                  remove: { rudderstack_integration: ['favcolor'] },
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
    name: 'airship',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'Peter Gibbons',
                age: 34,
                email: 'peter@example.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
                firstName: true,
                lastName: false,
                favColor: true,
              },
              type: 'identify',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/named_users/tags',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  audience: { named_user_id: '97980cfea0067' },
                  add: { rudderstack_integration: ['firstname', 'favcolor'] },
                  remove: { rudderstack_integration: ['lastname'] },
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
              endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      action: 'set',
                      key: 'full_name',
                      value: 'Peter Gibbons',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'age', value: 34, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'email',
                      value: 'peter@example.com',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'plan',
                      value: 'premium',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'logins', value: 5, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'address_street',
                      value: '6th St',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'city',
                      value: 'San Francisco',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'region',
                      value: 'CA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'zipcode',
                      value: '94103',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'country',
                      value: 'USA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                  ],
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
    name: 'airship',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'Peter Gibbons',
                age: 34,
                email: 'peter@example.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
                firstName: true,
                lastName: false,
                favColor: true,
              },
              type: 'identify',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', dataCenter: true },
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
              endpoint: 'https://go.airship.eu/api/named_users/tags',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  audience: { named_user_id: '97980cfea0067' },
                  add: { rudderstack_integration: ['firstname', 'favcolor'] },
                  remove: { rudderstack_integration: ['lastname'] },
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
              endpoint: 'https://go.airship.eu/api/named_users/97980cfea0067/attributes',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      action: 'set',
                      key: 'full_name',
                      value: 'Peter Gibbons',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'age', value: 34, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'email',
                      value: 'peter@example.com',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'plan',
                      value: 'premium',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'logins', value: 5, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'address_street',
                      value: '6th St',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'city',
                      value: 'San Francisco',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'region',
                      value: 'CA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'zipcode',
                      value: '94103',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'country',
                      value: 'USA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                  ],
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
    name: 'airship',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {},
              type: 'identify',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                appSecret: 'fhf',
                dataCenter: true,
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
            error: 'For identify, tags or attributes properties are required under traits',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'Peter Gibbons',
                age: 34,
                email: 'peter@example.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
              },
              type: 'group',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', dataCenter: false },
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
              endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      action: 'set',
                      key: 'full_name',
                      value: 'Peter Gibbons',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'age', value: 34, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'email',
                      value: 'peter@example.com',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'plan',
                      value: 'premium',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'logins', value: 5, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'address_street',
                      value: '6th St',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'city',
                      value: 'San Francisco',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'region',
                      value: 'CA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'zipcode',
                      value: '94103',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'country',
                      value: 'USA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                  ],
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
    name: 'airship',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: { name: true, email: true, favColor: false },
              type: 'group',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', dataCenter: false },
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
              endpoint: 'https://go.urbanairship.com/api/named_users/tags',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  audience: { named_user_id: '97980cfea0067' },
                  add: { rudderstack_integration_group: ['name', 'email'] },
                  remove: { rudderstack_integration_group: ['favcolor'] },
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
    name: 'airship',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'Peter Gibbons',
                age: 34,
                email: 'peter@example.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
                firstName: true,
                lastName: false,
                favColor: true,
              },
              type: 'group',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', dataCenter: false },
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
              endpoint: 'https://go.urbanairship.com/api/named_users/tags',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  audience: { named_user_id: '97980cfea0067' },
                  add: { rudderstack_integration_group: ['firstname', 'favcolor'] },
                  remove: { rudderstack_integration_group: ['lastname'] },
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
              endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      action: 'set',
                      key: 'full_name',
                      value: 'Peter Gibbons',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'age', value: 34, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'email',
                      value: 'peter@example.com',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'plan',
                      value: 'premium',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'logins', value: 5, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'address_street',
                      value: '6th St',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'city',
                      value: 'San Francisco',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'region',
                      value: 'CA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'zipcode',
                      value: '94103',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'country',
                      value: 'USA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                  ],
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
    name: 'airship',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'Peter Gibbons',
                age: 34,
                email: 'peter@example.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
                firstName: true,
                lastName: false,
                favColor: true,
              },
              type: 'group',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', dataCenter: true },
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
              endpoint: 'https://go.airship.eu/api/named_users/tags',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  audience: { named_user_id: '97980cfea0067' },
                  add: { rudderstack_integration_group: ['firstname', 'favcolor'] },
                  remove: { rudderstack_integration_group: ['lastname'] },
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
              endpoint: 'https://go.airship.eu/api/named_users/97980cfea0067/attributes',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      action: 'set',
                      key: 'full_name',
                      value: 'Peter Gibbons',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'age', value: 34, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'email',
                      value: 'peter@example.com',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'plan',
                      value: 'premium',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'logins', value: 5, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'address_street',
                      value: '6th St',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'city',
                      value: 'San Francisco',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'region',
                      value: 'CA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'zipcode',
                      value: '94103',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'country',
                      value: 'USA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                  ],
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
    name: 'airship',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {},
              type: 'group',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'O2YARRI15I',
                appSecret: 'fhf',
                dataCenter: true,
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
            error: 'For group, tags or attributes properties are required under traits',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: {
                name: 'Peter Gibbons',
                age: 34,
                email: 'peter@example.com',
                plan: 'premium',
                logins: 5,
                address: {
                  street: '6th St',
                  city: 'San Francisco',
                  state: 'CA',
                  postalCode: '94103',
                  country: 'USA',
                },
                firstName: true,
                lastName: false,
                favColor: true,
              },
              type: 'group',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: {
              Config: { apiKey: 'dummyApiKey', dataCenter: false },
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
              endpoint: 'https://go.urbanairship.com/api/named_users/tags',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  audience: { named_user_id: '97980cfea0067' },
                  add: { rudderstack_integration_group: ['firstname', 'favcolor'] },
                  remove: { rudderstack_integration_group: ['lastname'] },
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
              endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  attributes: [
                    {
                      action: 'set',
                      key: 'full_name',
                      value: 'Peter Gibbons',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'age', value: 34, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'email',
                      value: 'peter@example.com',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'plan',
                      value: 'premium',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    { action: 'set', key: 'logins', value: 5, timestamp: '2015-02-23T22:28:55Z' },
                    {
                      action: 'set',
                      key: 'address_street',
                      value: '6th St',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'city',
                      value: 'San Francisco',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'region',
                      value: 'CA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'zipcode',
                      value: '94103',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                    {
                      action: 'set',
                      key: 'country',
                      value: 'USA',
                      timestamp: '2015-02-23T22:28:55Z',
                    },
                  ],
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
    name: 'airship',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1Tdi0lpXwSVwXG1lcdP2pXHKrJ6',
              Name: 'Titli Test',
              DestinationDefinition: {
                ID: '1SujZGrVEPqYmpUJcV4vSl9tfxn',
                Name: 'MC',
                DisplayName: 'MailChimp',
              },
              Config: {
                apiKey: 'airshipApiKEy',
                audienceId: 'df42a82d07',
                datacenterId: 'us20',
              },
              Enabled: true,
              Transformations: [],
            },
            message: {
              type: 'page',
              sentAt: '2021-05-18T07:02:17.675Z',
              userId: '',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.18',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'https://app.rudderstack.com/signup?type=freetrial',
                  path: '/signup',
                  title: '',
                  search: '?type=freetrial',
                  tab_url: 'https://app.rudderstack.com/signup?type=freetrial',
                  referrer:
                    'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                  initial_referrer:
                    'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                  referring_domain: 'rudderstack.medium.com',
                  initial_referring_domain: 'rudderstack.medium.com',
                },
                locale: 'en-GB',
                screen: { density: 2 },
                traits: {},
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.18' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
              },
              rudderId: '4dbe224c-6aea-4d89-8da6-09d27c0d2908',
              messageId: '72df8cb0-54ab-417c-8e87-e97e9d339feb',
              timestamp: '2021-05-18T07:02:18.566Z',
              properties: {
                url: 'https://app.rudderstack.com/signup?type=freetrial',
                path: '/signup',
                title: '',
                search: '?type=freetrial',
                tab_url: 'https://app.rudderstack.com/signup?type=freetrial',
                referrer:
                  'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                initial_referrer:
                  'https://rudderstack.medium.com/kafka-vs-postgresql-how-we-implemented-our-queueing-system-using-postgresql-ec128650e3e',
                referring_domain: 'rudderstack.medium.com',
                initial_referring_domain: 'rudderstack.medium.com',
              },
              receivedAt: '2021-05-18T07:02:18.566Z',
              request_ip: '162.44.150.11',
              anonymousId: '58ec7b39-48f1-4d83-9d45-a48c64f96fa0',
              integrations: { All: true },
              originalTimestamp: '2021-05-18T07:02:17.675Z',
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
            error: 'message type page not supported',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Clicked',
              userId: 'testuserId1',
              properties: { value: 'dfd' },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'ffdf',
                appSecret: 'fhf',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/custom-events',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                'X-UA-Appkey': 'ffdf',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  occured: '2019-10-14T09:03:17.562Z',
                  user: { named_user_id: 'testuserId1' },
                  body: { name: 'product_clicked', value: 'dfd' },
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
    name: 'airship',
    description: 'Test 17',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Clicked',
              userId: 'testuserId1',
              properties: {},
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'ffdf',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/custom-events',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                'X-UA-Appkey': 'ffdf',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  occured: '2019-10-14T09:03:17.562Z',
                  user: { named_user_id: 'testuserId1' },
                  body: { name: 'product_clicked' },
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
    name: 'airship',
    description: 'Test 18',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product    Clicked',
              userId: 'testuserId1',
              properties: {},
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'ffdf',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/custom-events',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                'X-UA-Appkey': 'ffdf',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  occured: '2019-10-14T09:03:17.562Z',
                  user: { named_user_id: 'testuserId1' },
                  body: { name: 'product_clicked' },
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
    name: 'airship',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: { name: true, email: true, favColor: false },
              type: 'identify',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: { Config: { dataCenter: false } },
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
            error: 'API Key is required for authorization for Identify events',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '507f191e810c19729de860ea',
              channel: 'browser',
              context: {
                ip: '8.8.8.8',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '022bb90c-bbac-11e4-8dfc-aa07a5b093db',
              receivedAt: '2015-02-23T22:28:55.387Z',
              sentAt: '2015-02-23T22:28:55.111Z',
              timestamp: '2015-02-23T22:28:55.111Z',
              traits: { name: true, email: true, favColor: false },
              type: 'group',
              userId: '97980cfea0067',
              version: '1',
            },
            destination: { Config: { dataCenter: false } },
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
            error: 'API Key is required for authorization for group events',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
    description: 'Test 21',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'Product Clicked',
              userId: 'testuserId1',
              properties: {
                description: 'Sneaker purchase',
                brand: 'Victory Sneakers',
                colors: ['red', 'blue'],
                items: [
                  { text: 'New Line Sneakers', price: '$ 79.95' },
                  { text: 'Old Line Sneakers', price: '$ 79.95' },
                  { text: 'Blue Line Sneakers', price: '$ 79.95' },
                ],
                name: 'Hugh Manbeing',
                userLocation: { state: 'CO', zip: '80202' },
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: { appKey: 'dummyApiKey', dataCenter: false },
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
            error: 'API Key is required for authorization for track events',
            statTags: {
              destType: 'AIRSHIP',
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
    name: 'airship',
    description: 'Test 22',
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
                traits: { email: 'testone@gmail.com', firstName: 'test', lastName: 'one' },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
                sessionId: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              },
              type: 'track',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              anonymousId: '123456',
              event: 'Product    Clicked',
              userId: 'testuserId1',
              properties: {},
              integrations: { All: true },
            },
            destination: {
              Config: {
                apiKey: 'dummyApiKey',
                appKey: 'ffdf',
                dataCenter: false,
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
              endpoint: 'https://go.urbanairship.com/api/custom-events',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.urbanairship+json; version=3',
                'X-UA-Appkey': 'ffdf',
                Authorization: 'Bearer dummyApiKey',
              },
              params: {},
              body: {
                JSON: {
                  user: { named_user_id: 'testuserId1' },
                  body: {
                    name: 'product_clicked',
                    session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
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
];
