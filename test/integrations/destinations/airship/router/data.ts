import { getBatchedRequest } from '../../../testUtils';

const destination = {
  Config: { apiKey: 'dummyApiKey', appKey: 'O2YARRI15I', dataCenter: false },
};

function getAttribute(action, key, value, timestamp) {
  return {
    action: action,
    key: key,
    value: value,
    timestamp: timestamp,
  };
}

export const data = [
  {
    name: 'airship',
    description: 'Test 0', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: destination,
              metadata: { jobId: 1, userId: 'u1' },
              message: {
                type: 'track',
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
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'airship',
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
              batchedRequest: getBatchedRequest({
                endpoint: 'https://go.urbanairship.com/api/custom-events',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/vnd.urbanairship+json; version=3',
                  'X-UA-Appkey': 'O2YARRI15I',
                  Authorization: 'Bearer dummyApiKey',
                },
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
                },
              }),
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'airship',
    description: 'Test 1', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: destination,
              metadata: { jobId: 2, userId: 'u1' },
              message: {
                anonymousId: '507f191e810c19729de860ea',
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
              },
            },
          ],
          destType: 'airship',
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
                getBatchedRequest({
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
                  },
                }),
                getBatchedRequest({
                  endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.urbanairship+json; version=3',
                    Authorization: 'Bearer dummyApiKey',
                  },
                  body: {
                    JSON: {
                      attributes: [
                        getAttribute('set', 'full_name', 'Peter Gibbons', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'age', 34, '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'email', 'peter@example.com', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'plan', 'premium', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'logins', 5, '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'address_street', '6th St', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'city', 'San Francisco', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'region', 'CA', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'zipcode', '94103', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'country', 'USA', '2015-02-23T22:28:55Z'),
                      ],
                    },
                  },
                }),
              ],
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'airship',
    description: 'Test 2', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: destination,
              metadata: { jobId: 3, userId: 'u1' },
              message: {
                anonymousId: '507f191e810c19729de860ea',
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
              },
            },
          ],
          destType: 'airship',
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
                getBatchedRequest({
                  endpoint: 'https://go.urbanairship.com/api/named_users/tags',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.urbanairship+json; version=3',
                    Authorization: 'Bearer dummyApiKey',
                  },
                  body: {
                    JSON: {
                      audience: { named_user_id: '97980cfea0067' },
                      add: { rudderstack_integration_group: ['firstname', 'favcolor'] },
                      remove: { rudderstack_integration_group: ['lastname'] },
                    },
                  },
                }),
                getBatchedRequest({
                  endpoint: 'https://go.urbanairship.com/api/named_users/97980cfea0067/attributes',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.urbanairship+json; version=3',
                    Authorization: 'Bearer dummyApiKey',
                  },
                  body: {
                    JSON: {
                      attributes: [
                        getAttribute('set', 'full_name', 'Peter Gibbons', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'age', 34, '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'email', 'peter@example.com', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'plan', 'premium', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'logins', 5, '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'address_street', '6th St', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'city', 'San Francisco', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'region', 'CA', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'zipcode', '94103', '2015-02-23T22:28:55Z'),
                        getAttribute('set', 'country', 'USA', '2015-02-23T22:28:55Z'),
                      ],
                    },
                  },
                }),
              ],
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
];
