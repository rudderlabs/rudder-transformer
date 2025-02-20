import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data = [
  {
    name: 'cordial',
    description: 'Simple Single object Input event with normal channel and action',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
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
                  address: { city: 'San Miego' },
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
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'Cordial' },
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
                      address: { city: 'San Miego' },
                      first_name: 'John',
                      last_name: 'Doe',
                      lastUpdateSource: 'api',
                      lastModified: '2024-07-12T13:00:49+0000',
                      cID: '6690fe3655e334xx028xxx',
                    },
                    externalId: [
                      {
                        id: '6690fe3655e334xx028xxx',
                        type: 'cordialContactId',
                      },
                    ],
                  },
                  integrations: { Cordial: false },
                  type: 'track',
                  event: 'browse',
                  originalTimestamp: '2024-07-12T14:45:25+00:00',
                  properties: {
                    event_id: '669141857b8cxxx1ba0da2xx',
                    category: 'Shirts',
                    url: 'http://example.com/shirts',
                    description: 'A really cool khaki shirt.',
                    price: 9.99,
                    title: 'Khaki Shirt',
                    test_key: 'value',
                    cID: '6690fe3655e334xx028xxx',
                    ts: '2024-07-12T14:45:25+00:00',
                    ats: '2024-07-12T14:45:25+0000',
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
  },
  {
    name: 'cordial',
    description: 'Multiple object Input event with batched payload',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify([
                {
                  contact: {
                    _id: '633b2fd70a12be027e0b0xxx',
                    lang_locale: 'EN-US',
                    channels: {
                      email: {
                        address: 'johndoe@example.com',
                        subscribeStatus: 'none',
                      },
                    },
                    createdAt: '2022-10-03T18:54:15+0000',
                    email_sha256_hash:
                      'f959bdf883831ebb96612eb9xxxx1e0c9481780adf5f70xxx862155531bf61df',
                    first_name: 'john',
                    last_name: 'doe',
                    lastUpdateSource: 'cordial',
                    lastModified: '2024-07-24T07:52:46+0000',
                    cID: '633b2fd70a12be027e0b0xxx',
                  },
                  event: {
                    _id: '66a0b2ce5344b55fxxxc5a64',
                    cID: '633b2fd70a12be027e0b0xxx',
                    ts: '2024-07-24T07:52:46+00:00',
                    ats: '2024-07-24T07:52:39+0000',
                    g: {
                      countryISO: 'PL',
                      country: 'Poland',
                      state: 'MZ',
                      city: 'Warszawa',
                      postalCode: '00-686',
                      geoLoc: {
                        lat: 52.22744369506836,
                        lon: 21.009017944335938,
                      },
                      tz: 'Europe/Warsaw',
                    },
                    d: {
                      type: 'computer',
                      device: 'Macintosh',
                      platform: 'OS X',
                      browser: 'Chrome',
                      robot: false,
                    },
                    a: 'browse',
                    UID: '471af949fffe749c2ebfxxx950ea73c',
                    sp: { bid: 'cf6de7f1-cce5-40xx-ac9c-7c82a2xxc09e' },
                    tzo: -7,
                    rl: '6',
                    time: '2024-07-24T07:52:39+0000',
                    action: 'browse',
                    bmID: '',
                    first: 0,
                    properties: {
                      url: 'https://aaff-008.dx.commercecloud.salesforce.com/s/UGG-US/cart',
                      product_item_group_id: ['1094269'],
                      product_category: ['allproducts'],
                      product_name: ['wtp ab'],
                      product_group: ['women'],
                    },
                  },
                },
                {
                  contact: {
                    _id: '633b2fd12312be027e0b0xxx',
                    lang_locale: 'EN-US',
                    channels: {
                      email: {
                        address: 'johndoe1@example.com',
                        subscribeStatus: 'none',
                      },
                    },
                    createdAt: '2022-10-03T18:54:15+0000',
                    email_sha256_hash:
                      'f95912b883831eab11612eb9xxxx1e0c9481780ad45770xxx862155531bf61df',
                    first_name: 'john',
                    last_name: 'doe',
                    lastUpdateSource: 'cordial',
                    lastModified: '2024-07-24T07:52:46+0000',
                    cID: '633b2fd12312be027e0b0xxx',
                  },
                  event: {
                    _id: '66aku0b2ce527b55fx1xc5a64',
                    cID: '633b2fd12312be027e0b0xxx',
                    ts: '2024-07-24T07:52:46+00:00',
                    ats: '2024-07-24T07:52:39+0000',
                    g: {
                      countryISO: 'PL',
                      country: 'Poland',
                      state: 'MZ',
                      city: 'Warszawa',
                      postalCode: '00-686',
                      geoLoc: {
                        lat: 52.22744369506836,
                        lon: 21.009017944335938,
                      },
                      tz: 'Europe/Warsaw',
                    },
                    d: {
                      type: 'computer',
                      device: 'Macintosh',
                      platform: 'OS X',
                      browser: 'Chrome',
                      robot: false,
                    },
                    a: 'browse',
                    UID: '471af949fffe74sdh382ebfxxx950ea73c',
                    sp: { bid: 'cf6de7f1-123ce5-20xx-ac9c-7c82a2xxc09e' },
                    tzo: -7,
                    rl: '6',
                    time: '2024-07-24T07:52:39+0000',
                    action: 'browse',
                    bmID: '',
                    first: 0,
                    properties: {
                      url: 'https://aaff-008.dx.commercecloud.salesforce.com/s/UGG-US/cart',
                      product_item_group_id: ['1094269'],
                      product_category: ['allproducts'],
                      product_name: ['wtp ab'],
                      product_group: ['women'],
                    },
                  },
                },
              ]),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'Cordial' },
                    traits: {
                      userId: '633b2fd70a12be027e0b0xxx',
                      email: 'johndoe@example.com',
                      _id: '633b2fd70a12be027e0b0xxx',
                      lang_locale: 'EN-US',
                      channels: {
                        email: {
                          address: 'johndoe@example.com',
                          subscribeStatus: 'none',
                        },
                      },
                      createdAt: '2022-10-03T18:54:15+0000',
                      email_sha256_hash:
                        'f959bdf883831ebb96612eb9xxxx1e0c9481780adf5f70xxx862155531bf61df',
                      first_name: 'john',
                      last_name: 'doe',
                      lastUpdateSource: 'cordial',
                      lastModified: '2024-07-24T07:52:46+0000',
                      cID: '633b2fd70a12be027e0b0xxx',
                    },
                    device: {
                      type: 'computer',
                      device: 'Macintosh',
                      platform: 'OS X',
                      browser: 'Chrome',
                      robot: false,
                    },
                    externalId: [
                      {
                        id: '633b2fd70a12be027e0b0xxx',
                        type: 'cordialContactId',
                      },
                    ],
                  },
                  integrations: { Cordial: false },
                  type: 'track',
                  event: 'browse',
                  properties: {
                    event_id: '66a0b2ce5344b55fxxxc5a64',
                    url: 'https://aaff-008.dx.commercecloud.salesforce.com/s/UGG-US/cart',
                    product_item_group_id: ['1094269'],
                    product_category: ['allproducts'],
                    product_name: ['wtp ab'],
                    product_group: ['women'],
                    cID: '633b2fd70a12be027e0b0xxx',
                    ts: '2024-07-24T07:52:46+00:00',
                    ats: '2024-07-24T07:52:39+0000',
                    g: {
                      countryISO: 'PL',
                      country: 'Poland',
                      state: 'MZ',
                      city: 'Warszawa',
                      postalCode: '00-686',
                      geoLoc: {
                        lat: 52.22744369506836,
                        lon: 21.009017944335938,
                      },
                      tz: 'Europe/Warsaw',
                    },
                    a: 'browse',
                    UID: '471af949fffe749c2ebfxxx950ea73c',
                    sp: { bid: 'cf6de7f1-cce5-40xx-ac9c-7c82a2xxc09e' },
                    tzo: -7,
                    rl: '6',
                    time: '2024-07-24T07:52:39+0000',
                    action: 'browse',
                    bmID: '',
                    first: 0,
                  },
                  userId: '633b2fd70a12be027e0b0xxx',
                  timestamp: '2024-07-24T07:52:46+00:00',
                  sentAt: '2024-07-24T07:52:46+00:00',
                  originalTimestamp: '2024-07-24T07:52:46+00:00',
                },
                {
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'Cordial' },
                    traits: {
                      userId: '633b2fd12312be027e0b0xxx',
                      email: 'johndoe1@example.com',
                      _id: '633b2fd12312be027e0b0xxx',
                      lang_locale: 'EN-US',
                      channels: {
                        email: {
                          address: 'johndoe1@example.com',
                          subscribeStatus: 'none',
                        },
                      },
                      createdAt: '2022-10-03T18:54:15+0000',
                      email_sha256_hash:
                        'f95912b883831eab11612eb9xxxx1e0c9481780ad45770xxx862155531bf61df',
                      first_name: 'john',
                      last_name: 'doe',
                      lastUpdateSource: 'cordial',
                      lastModified: '2024-07-24T07:52:46+0000',
                      cID: '633b2fd12312be027e0b0xxx',
                    },
                    device: {
                      type: 'computer',
                      device: 'Macintosh',
                      platform: 'OS X',
                      browser: 'Chrome',
                      robot: false,
                    },
                    externalId: [
                      {
                        id: '633b2fd12312be027e0b0xxx',
                        type: 'cordialContactId',
                      },
                    ],
                  },
                  integrations: { Cordial: false },
                  type: 'track',
                  event: 'browse',
                  properties: {
                    event_id: '66aku0b2ce527b55fx1xc5a64',
                    url: 'https://aaff-008.dx.commercecloud.salesforce.com/s/UGG-US/cart',
                    product_item_group_id: ['1094269'],
                    product_category: ['allproducts'],
                    product_name: ['wtp ab'],
                    product_group: ['women'],
                    cID: '633b2fd12312be027e0b0xxx',
                    ts: '2024-07-24T07:52:46+00:00',
                    ats: '2024-07-24T07:52:39+0000',
                    g: {
                      countryISO: 'PL',
                      country: 'Poland',
                      state: 'MZ',
                      city: 'Warszawa',
                      postalCode: '00-686',
                      geoLoc: {
                        lat: 52.22744369506836,
                        lon: 21.009017944335938,
                      },
                      tz: 'Europe/Warsaw',
                    },
                    a: 'browse',
                    UID: '471af949fffe74sdh382ebfxxx950ea73c',
                    sp: { bid: 'cf6de7f1-123ce5-20xx-ac9c-7c82a2xxc09e' },
                    tzo: -7,
                    rl: '6',
                    time: '2024-07-24T07:52:39+0000',
                    action: 'browse',
                    bmID: '',
                    first: 0,
                  },
                  userId: '633b2fd12312be027e0b0xxx',
                  timestamp: '2024-07-24T07:52:46+00:00',
                  sentAt: '2024-07-24T07:52:46+00:00',
                  originalTimestamp: '2024-07-24T07:52:46+00:00',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'cordial',
    description: 'Simple Single object Input event with no CId',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                contact: {
                  _id: '6690fe3655e334xx028xx1',
                  channels: {
                    email: {
                      address: 'jondoe@example.com',
                      subscribeStatus: 'subscribed',
                      subscribedAt: '2024-07-12T09:58:14+0000',
                    },
                  },
                  createdAt: '2024-07-12T09:58:14+0000',
                  address: { city: 'San Miego' },
                  first_name: 'John',
                  last_name: 'Doe',
                  lastUpdateSource: 'api',
                  lastModified: '2024-07-12T13:00:49+0000',
                },
                event: {
                  _id: '669141857b8cxxx1ba0da2x1',
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
                  UID: '4934ee07197xx3f74d5xxxx7b0076',
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
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'Cordial' },
                    traits: {
                      userId: '6690fe3655e334xx028xx1',
                      email: 'jondoe@example.com',
                      _id: '6690fe3655e334xx028xx1',
                      channels: {
                        email: {
                          address: 'jondoe@example.com',
                          subscribeStatus: 'subscribed',
                          subscribedAt: '2024-07-12T09:58:14+0000',
                        },
                      },
                      createdAt: '2024-07-12T09:58:14+0000',
                      address: { city: 'San Miego' },
                      first_name: 'John',
                      last_name: 'Doe',
                      lastUpdateSource: 'api',
                      lastModified: '2024-07-12T13:00:49+0000',
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
                  integrations: { Cordial: false },
                  type: 'track',
                  event: 'browse',
                  originalTimestamp: '2024-07-12T14:45:25+00:00',
                  properties: {
                    event_id: '669141857b8cxxx1ba0da2x1',
                    category: 'Shirts',
                    url: 'http://example.com/shirts',
                    description: 'A really cool khaki shirt.',
                    price: 9.99,
                    title: 'Khaki Shirt',
                    test_key: 'value',
                    ts: '2024-07-12T14:45:25+00:00',
                    ats: '2024-07-12T14:45:25+0000',
                    a: 'browse',
                    tzo: -7,
                    rl: 'a',
                    UID: '4934ee07197xx3f74d5xxxx7b0076',
                    time: '2024-07-12T14:45:25+0000',
                    action: 'browse',
                    bmID: '',
                    first: 0,
                  },
                  userId: '6690fe3655e334xx028xx1',
                  timestamp: '2024-07-12T14:45:25+00:00',
                  sentAt: '2024-07-12T14:45:25+00:00',
                },
              ],
            },
          },
        ],
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns: () => {
    defaultMockFns();
  },
}));
