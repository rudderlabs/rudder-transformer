import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data = [
  {
    name: 'cordial',
    description: 'Simple Single object Input event with normal channel and action',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            contact: {
              _id: '6690fe3655e334xx028xxx',
              channels: {
                email: {
                  address: 'jondoe@example.com',
                  subscribeStatus: 'subscribed',
                  subscribedAt: '2024-07-12T09:58:14+0000',
                },
              },
              createdAt: '2024-07-12T09:58:14+0000',
              address: {
                city: 'San Miego',
              },
              first_name: 'John',
              last_name: 'Doe',
              lastUpdateSource: 'api',
              lastModified: '2024-07-12T13:00:49+0000',
              cID: '6690fe3655e334xx028xxx',
            },
            event: {
              _id: '669141857b8cxxx1ba0da2xx',
              cID: '6690fe3655e334xx028xxx',
              ts: '2024-07-12T14:45:25+00:00',
              ats: '2024-07-12T14:45:25+0000',
              d: {
                type: 'computer',
                device: false,
                platform: false,
                browser: false,
                robot: true,
              },
              a: 'browse',
              tzo: -7,
              rl: 'a',
              UID: '4934ee07118197xx3f74d5xxxx7b0076',
              time: '2024-07-12T14:45:25+0000',
              action: 'browse',
              bmID: '',
              first: 0,
              properties: {
                category: 'Shirts',
                url: 'http://example.com/shirts',
                description: 'A really cool khaki shirt.',
                price: 9.99,
                title: 'Khaki Shirt',
                test_key: 'value',
              },
            },
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    integration: {
                      name: 'Cordial',
                    },
                    traits: {
                      userId: '6690fe3655e334xx028xxx',
                      email: 'jondoe@example.com',
                      _id: '6690fe3655e334xx028xxx',
                      channels: {
                        email: {
                          address: 'jondoe@example.com',
                          subscribeStatus: 'subscribed',
                          subscribedAt: '2024-07-12T09:58:14+0000',
                        },
                      },
                      createdAt: '2024-07-12T09:58:14+0000',
                      address: {
                        city: 'San Miego',
                      },
                      first_name: 'John',
                      last_name: 'Doe',
                      lastUpdateSource: 'api',
                      lastModified: '2024-07-12T13:00:49+0000',
                      cID: '6690fe3655e334xx028xxx',
                    },
                    device: {
                      type: 'computer',
                      device: false,
                      platform: false,
                      browser: false,
                      robot: true,
                    },
                    externalId: [],
                  },
                  integrations: {
                    Cordial: false,
                  },
                  type: 'track',
                  event: 'browse',
                  originalTimestamp: '2024-07-12T14:45:25+00:00',
                  properties: {
                    event_id: '669141857b8cxxx1ba0da2xx',
                    email: 'jondoe@example.com',
                    category: 'Shirts',
                    url: 'http://example.com/shirts',
                    description: 'A really cool khaki shirt.',
                    price: 9.99,
                    title: 'Khaki Shirt',
                    test_key: 'value',
                    _id: '669141857b8cxxx1ba0da2xx',
                    cID: '6690fe3655e334xx028xxx',
                    ts: '2024-07-12T14:45:25+00:00',
                    ats: '2024-07-12T14:45:25+0000',
                    d: {
                      type: 'computer',
                      device: false,
                      platform: false,
                      browser: false,
                      robot: true,
                    },
                    a: 'browse',
                    tzo: -7,
                    rl: 'a',
                    UID: '4934ee07118197xx3f74d5xxxx7b0076',
                    time: '2024-07-12T14:45:25+0000',
                    action: 'browse',
                    bmID: '',
                    first: 0,
                  },
                  userId: '6690fe3655e334xx028xxx',
                  timestamp: '2024-07-12T14:45:25+00:00',
                  sentAt: '2024-07-12T14:45:25+00:00',
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
];
