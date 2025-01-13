export const data = [
  {
    name: 'pipedream',
    description: 'No type or userId  is given',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            anonymousId: '63767499ca6fb1b7c988d5bb',
            artist: 'Gautam',
            genre: 'Jazz',
            song: 'Take Five',
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
                  event: 'pipedream_source_event',
                  anonymousId: '63767499ca6fb1b7c988d5bb',
                  context: {
                    integration: { name: 'PIPEDREAM' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  integrations: { PIPEDREAM: false },
                  type: 'track',
                  properties: {
                    anonymousId: '63767499ca6fb1b7c988d5bb',
                    artist: 'Gautam',
                    genre: 'Jazz',
                    song: 'Take Five',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pipedream',
    description: 'No type or anonymousId is given',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [{ userId: '12', artist: 'Gautam', genre: 'Jazz', song: 'Take Five' }],
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
                  event: 'pipedream_source_event',
                  anonymousId: '12',
                  context: {
                    integration: { name: 'PIPEDREAM' },
                    library: { name: 'unknown', version: 'unknown' },
                  },
                  integrations: { PIPEDREAM: false },
                  type: 'track',
                  properties: { userId: '12', artist: 'Gautam', genre: 'Jazz', song: 'Take Five' },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pipedream',
    description: 'Track Call -> type and userId is given',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: 'Song Played',
            userId: 'R1234',
            context: {
              library: { name: 'unknown', version: 'unknown' },
              traits: {
                createdAt: '2022-10-15T05:41:06.016Z',
                custom: { key1: 'v1', key2: 'V2' },
                email: 'john@doe.com',
                name: 'John Doe',
                userDeleted: false,
              },
              locale: 'en',
              location: { country: 'IN', countryName: 'India', short: 'India', long: 'India' },
              device: { os: 'macOS', type: 'desktop' },
              page: { referrer: 'http://127.0.0.1:5500/testSm.html' },
            },
            type: 'track',
            properties: { artist: 'John', Album: 'ABCD' },
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
                  event: 'Song Played',
                  userId: 'R1234',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    traits: {
                      createdAt: '2022-10-15T05:41:06.016Z',
                      custom: { key1: 'v1', key2: 'V2' },
                      email: 'john@doe.com',
                      name: 'John Doe',
                      userDeleted: false,
                    },
                    locale: 'en',
                    location: {
                      country: 'IN',
                      countryName: 'India',
                      short: 'India',
                      long: 'India',
                    },
                    device: { os: 'macOS', type: 'desktop' },
                    page: { referrer: 'http://127.0.0.1:5500/testSm.html' },
                  },
                  type: 'track',
                  properties: { artist: 'John', Album: 'ABCD' },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pipedream',
    description: 'Identify type  -> type and userId is given',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            userId: '1',
            originalTimestamp: '2020-09-28T19:53:31.900Z',
            traits: {
              firstName: 'John',
              lastName: 'doe',
              email: 'John@r.com',
              hasPurchased: 'yes',
              address: { Home: { city: 'iudcb' }, Office: { abc: 'jbc' } },
              state: 'Delhi',
              title: 'Mr',
            },
            timestamp: '2020-09-29T14:50:29.907+05:30',
            type: 'identify',
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
                  userId: '1',
                  originalTimestamp: '2020-09-28T19:53:31.900Z',
                  context: {},
                  traits: {
                    firstName: 'John',
                    lastName: 'doe',
                    email: 'John@r.com',
                    hasPurchased: 'yes',
                    address: { Home: { city: 'iudcb' }, Office: { abc: 'jbc' } },
                    state: 'Delhi',
                    title: 'Mr',
                  },
                  timestamp: '2020-09-29T14:50:29.907+05:30',
                  type: 'identify',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pipedream',
    description: 'Group type  -> type and userId is given',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            userId: 'user123',
            groupId: '17',
            context: {},
            traits: { operation: 'add' },
            type: 'group',
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
                  userId: 'user123',
                  groupId: '17',
                  context: {},
                  traits: { operation: 'add' },
                  type: 'group',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pipedream',
    description: 'Page type  -> type and userId is given',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            anonymousId: '21e13f4bc7ceddad',
            channel: 'mobile',
            context: {
              os: { name: 'Android', version: '9' },
              timezone: 'Asia/Kolkata',
              traits: { customProp: 'customValue' },
              userAgent:
                'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
            },
            name: 'Home',
            properties: { title: 'Home | RudderStack', url: 'http://www.rudderstack.com' },
            receivedAt: '2020-09-29T14:50:43.005+05:30',
            type: 'page',
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
                  anonymousId: '21e13f4bc7ceddad',
                  channel: 'mobile',
                  context: {
                    os: { name: 'Android', version: '9' },
                    timezone: 'Asia/Kolkata',
                    traits: { customProp: 'customValue' },
                    userAgent:
                      'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                  },
                  name: 'Home',
                  properties: { title: 'Home | RudderStack', url: 'http://www.rudderstack.com' },
                  receivedAt: '2020-09-29T14:50:43.005+05:30',
                  type: 'page',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pipedream',
    description: 'Alias type  -> type and userId is given',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [{ type: 'alias', previousId: 'name@surname.com', userId: '12345' }],
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
                { type: 'alias', previousId: 'name@surname.com', userId: '12345', context: {} },
              ],
            },
          },
        ],
      },
    },
  },
];
