import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data = [
  {
    name: 'customerio',
    description: 'test-0',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  email_address: 'test@example.com',
                },
                event_id: '01E4C4CT6YDC7Y5M7FE1GWWPQJ',
                object_type: 'customer',
                metric: 'subscribed',
                timestamp: 'abc',
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Customer Subscribed',
                  properties: { eventId: '01E4C4CT6YDC7Y5M7FE1GWWPQJ' },
                  userId: '0200102',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-1',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  email_address: 'test@example.com',
                },
                event_id: '01E4C4CT6YDC7Y5M7FE1GWWPQJ',
                object_type: 'customer',
                metric: 'subscribed',
                timestamp: '1585250199',
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Customer Subscribed',
                  properties: { eventId: '01E4C4CT6YDC7Y5M7FE1GWWPQJ' },
                  userId: '0200102',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-2',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  email_address: 'test@example.com',
                },
                event_id: '01E4C4CT6YDC7Y5M7FE1GWWPQJ',
                object_type: 'customer',
                metric: 'subscribed',
                timestamp: 1585250199,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Customer Subscribed',
                  properties: { eventId: '01E4C4CT6YDC7Y5M7FE1GWWPQJ' },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:16:39.000Z',
                  sentAt: '2020-03-26T19:16:39.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-3',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  email_address: 'test@example.com',
                },
                event_id: '01E4C4C6P79C12J5A6KPE6XNFD',
                object_type: 'customer',
                metric: 'unsubscribed',
                timestamp: 1585250179,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Customer Unsubscribed',
                  properties: { eventId: '01E4C4C6P79C12J5A6KPE6XNFD' },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:16:19.000Z',
                  sentAt: '2020-03-26T19:16:19.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-4',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 36,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgABcRhIBqSp7kiPekGBIeVh',
                },
                event_id: '01E4C4G1S0AMNG0XVF2M7RPH5S',
                object_type: 'email',
                metric: 'drafted',
                timestamp: 1585250305,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Email Drafted',
                  properties: {
                    eventId: '01E4C4G1S0AMNG0XVF2M7RPH5S',
                    deliveryId: 'RPILAgABcRhIBqSp7kiPekGBIeVh',
                    actionId: 36,
                    broadcastId: 9,
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:18:25.000Z',
                  sentAt: '2020-03-26T19:18:25.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-5',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  content_id: 1146,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RMehBAAAAXE7r_ONUGXly9DBGkpq1JS31=',
                  failure_message: '550 5.5.0 Requested action not taken: mailbox unavailable',
                  newsletter_id: 736,
                  recipient: 'test@example.com',
                  subject: 'Thanks for joining!',
                },
                event_id: '12ASDG7S9P6MAZPTJ78DAND9GDC',
                object_type: 'email',
                metric: 'bounced',
                timestamp: 1234567890,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Email Bounced',
                  properties: {
                    eventId: '12ASDG7S9P6MAZPTJ78DAND9GDC',
                    deliveryId: 'RMehBAAAAXE7r_ONUGXly9DBGkpq1JS31=',
                    contentId: 1146,
                    emailSubject: 'Thanks for joining!',
                    reason: '550 5.5.0 Requested action not taken: mailbox unavailable',
                    newsletterId: 736,
                  },
                  userId: '0200102',
                  originalTimestamp: '2009-02-13T23:31:30.000Z',
                  sentAt: '2009-02-13T23:31:30.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-6',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 36,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgABcRhIBqSp7kiPekGBIeVh',
                  href: 'http://google.com',
                  link_id: 1,
                  recipient: 'test@example.com',
                  subject: 'hello',
                },
                event_id: '01E4C8BES5XT87ZWRJFTB35YJ3',
                object_type: 'email',
                metric: 'clicked',
                timestamp: 1585254348,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Email Link Clicked',
                  properties: {
                    eventId: '01E4C8BES5XT87ZWRJFTB35YJ3',
                    deliveryId: 'RPILAgABcRhIBqSp7kiPekGBIeVh',
                    actionId: 36,
                    broadcastId: 9,
                    emailSubject: 'hello',
                    link: { url: 'http://google.com', id: 1 },
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T20:25:48.000Z',
                  sentAt: '2020-03-26T20:25:48.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-7',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 42,
                  campaign_id: 23,
                  content: 'Welcome to the club, we are with you.',
                  customer_id: 'user-123',
                  delivery_id: 'RAECAAFwnUSneIa0ZXkmq8EdkAM==',
                  headers: { 'Custom-Header': ['custom-value'] },
                  identifiers: { id: 'user-123' },
                  recipient: 'test@example.com',
                  subject: 'Thanks for signing up',
                },
                event_id: '01E2EMRMM6TZ12TF9WGZN0WJQT',
                metric: 'sent',
                object_type: 'email',
                timestamp: 1644227937,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Email Sent',
                  properties: {
                    eventId: '01E2EMRMM6TZ12TF9WGZN0WJQT',
                    deliveryId: 'RAECAAFwnUSneIa0ZXkmq8EdkAM==',
                    actionId: 42,
                    content: 'Welcome to the club, we are with you.',
                    emailSubject: 'Thanks for signing up',
                    campaignId: 23,
                  },
                  userId: 'user-123',
                  originalTimestamp: '2022-02-07T09:58:57.000Z',
                  sentAt: '2022-02-07T09:58:57.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-8',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  customer_id: 'user-123',
                  delivery_id: 'REAC4wUAAYYJgQgkyRqwwEPeOA6Nfv==',
                  identifiers: { cio_id: '7ef807109981', id: 'user-123' },
                  recipient: 'test@example.com',
                  subject: 'Thanks for signing up',
                  transactional_message_id: 2,
                },
                event_id: '01ER4R5WB62QWCNREKFB4DYXGR',
                metric: 'delivered',
                object_type: 'email',
                timestamp: 1675196819,
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
                    integration: { name: 'Customer.io' },
                    traits: {
                      cioId: '7ef807109981',
                      email: 'test@example.com',
                    },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Email Delivered',
                  properties: {
                    eventId: '01ER4R5WB62QWCNREKFB4DYXGR',
                    deliveryId: 'REAC4wUAAYYJgQgkyRqwwEPeOA6Nfv==',
                    emailSubject: 'Thanks for signing up',
                    transactionalMessageId: 2,
                  },
                  userId: 'user-123',
                  originalTimestamp: '2023-01-31T20:26:59.000Z',
                  sentAt: '2023-01-31T20:26:59.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-9',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 38,
                  campaign_id: 6,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RAEABQFxN56fWzydfV4_EGvfobI=',
                  failure_message: 'NoDevicesSynced',
                },
                event_id: '01E4VSX8SZ0T9AQMH4Q16NRB89',
                object_type: 'push',
                metric: 'attempted',
                timestamp: 1585776075,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Push Attempted',
                  properties: {
                    eventId: '01E4VSX8SZ0T9AQMH4Q16NRB89',
                    deliveryId: 'RAEABQFxN56fWzydfV4_EGvfobI=',
                    actionId: 38,
                    reason: 'NoDevicesSynced',
                    campaignId: 6,
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-04-01T21:21:15.000Z',
                  sentAt: '2020-04-01T21:21:15.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-10',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 37,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgUBcRhIBqSfeiIwdIYJKxTY',
                  recipients: [
                    {
                      device_id:
                        'eeC2XC_NVPo:APA91bEYRSgmu-dAZcOWi7RzKBbT9gdY3WJACOpLQEMAmAOsChJMAZWirvSlSF3EuHxb7qdwlYeOyCWtbsnR14Vyx5nwBmg5J3SyPxfNn-ey1tNgXIj5UOq8IBk2VwzMApk-xzD4JJof',
                      device_platform: 'android',
                    },
                  ],
                },
                event_id: '01E4C4HDQ7P1X9KTKF0ZX7PWHE',
                object_type: 'push',
                metric: 'sent',
                timestamp: 1585250350,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Push Sent',
                  properties: {
                    eventId: '01E4C4HDQ7P1X9KTKF0ZX7PWHE',
                    deliveryId: 'RPILAgUBcRhIBqSfeiIwdIYJKxTY',
                    actionId: 37,
                    broadcastId: 9,
                    recipients: [
                      {
                        device_id:
                          'eeC2XC_NVPo:APA91bEYRSgmu-dAZcOWi7RzKBbT9gdY3WJACOpLQEMAmAOsChJMAZWirvSlSF3EuHxb7qdwlYeOyCWtbsnR14Vyx5nwBmg5J3SyPxfNn-ey1tNgXIj5UOq8IBk2VwzMApk-xzD4JJof',
                        device_platform: 'android',
                      },
                    ],
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:19:10.000Z',
                  sentAt: '2020-03-26T19:19:10.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-11',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 37,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgUBcRhIBqSfeiIwdIYJKxTY',
                  href: 'ciosas://product/2',
                  link_id: 1,
                  recipients: [
                    {
                      device_id:
                        'eeC2XC_NVPo:APA91bEYRSgmu-dAZcOWi7RzKBbT9gdY3WJACOpLQEMAmAOsChJMAZWirvSlSF3EuHxb7qdwlYeOyCWtbsnR14Vyx5nwBmg5J3SyPxfNn-ey1tNgXIj5UOq8IBk2VwzMApk-xzD4JJof',
                    },
                  ],
                },
                event_id: '01E4V2SBHYK4TNTG8WKMP39G9R',
                object_type: 'push',
                metric: 'clicked',
                timestamp: 1585751829,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Push Link Clicked',
                  properties: {
                    eventId: '01E4V2SBHYK4TNTG8WKMP39G9R',
                    deliveryId: 'RPILAgUBcRhIBqSfeiIwdIYJKxTY',
                    actionId: 37,
                    broadcastId: 9,
                    link: { url: 'ciosas://product/2', id: 1 },
                    recipients: [
                      {
                        device_id:
                          'eeC2XC_NVPo:APA91bEYRSgmu-dAZcOWi7RzKBbT9gdY3WJACOpLQEMAmAOsChJMAZWirvSlSF3EuHxb7qdwlYeOyCWtbsnR14Vyx5nwBmg5J3SyPxfNn-ey1tNgXIj5UOq8IBk2VwzMApk-xzD4JJof',
                      },
                    ],
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-04-01T14:37:09.000Z',
                  sentAt: '2020-04-01T14:37:09.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-12',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 41,
                  campaign_id: 7,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'ROk1AAIBcR4iT6mueuxiDtzO8HXv',
                  failure_message:
                    "Twilio Error 21408: Permission to send an SMS has not been enabled for the region indicated by the 'To' number: +18008675309.",
                },
                event_id: '01E4F3DCS83P8HT7R3E6DWQN1X',
                object_type: 'sms',
                metric: 'attempted',
                timestamp: 1234567890,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'SMS Attempted',
                  properties: {
                    eventId: '01E4F3DCS83P8HT7R3E6DWQN1X',
                    deliveryId: 'ROk1AAIBcR4iT6mueuxiDtzO8HXv',
                    actionId: 41,
                    reason:
                      "Twilio Error 21408: Permission to send an SMS has not been enabled for the region indicated by the 'To' number: +18008675309.",
                    campaignId: 7,
                  },
                  userId: '0200102',
                  originalTimestamp: '2009-02-13T23:31:30.000Z',
                  sentAt: '2009-02-13T23:31:30.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-13',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 38,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgIBcRh6qzHz-8gKvscP2UZa',
                  href: 'https://app.com/verify',
                  link_id: 1,
                  recipient: '+18008675309',
                },
                event_id: '01E4XXPN42JDF4B1ATQKTZ8WHV',
                object_type: 'sms',
                metric: 'clicked',
                timestamp: 1585847161,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: '+18008675309' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'SMS Link Clicked',
                  properties: {
                    eventId: '01E4XXPN42JDF4B1ATQKTZ8WHV',
                    deliveryId: 'RPILAgIBcRh6qzHz-8gKvscP2UZa',
                    actionId: 38,
                    broadcastId: 9,
                    link: { url: 'https://app.com/verify', id: 1 },
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-04-02T17:06:01.000Z',
                  sentAt: '2020-04-02T17:06:01.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-14',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 39,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgQBcRhNAufb0s30bmz5HD7Y',
                  recipient: '#signups',
                },
                event_id: '01E4C4TQKD6KJ274870J5DE2HB',
                object_type: 'slack',
                metric: 'sent',
                timestamp: 1585250655,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: '#signups' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Slack Message Sent',
                  properties: {
                    eventId: '01E4C4TQKD6KJ274870J5DE2HB',
                    deliveryId: 'RPILAgQBcRhNAufb0s30bmz5HD7Y',
                    actionId: 39,
                    broadcastId: 9,
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:24:15.000Z',
                  sentAt: '2020-03-26T19:24:15.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-15',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 39,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgQBcRhocpCJE3mFfwvRzNe6',
                  href: 'http://bing.com',
                  link_id: 1,
                  recipient: '#signups',
                },
                event_id: '01E4C6HJTBNDX18XC4B88M3Y2G',
                object_type: 'slack',
                metric: 'clicked',
                timestamp: 1585252451,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: '#signups' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Slack Message Link Clicked',
                  properties: {
                    eventId: '01E4C6HJTBNDX18XC4B88M3Y2G',
                    deliveryId: 'RPILAgQBcRhocpCJE3mFfwvRzNe6',
                    actionId: 39,
                    broadcastId: 9,
                    link: { url: 'http://bing.com', id: 1 },
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:54:11.000Z',
                  sentAt: '2020-03-26T19:54:11.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-16',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 39,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgQBcRhIBqRiZAc0fyQiLvkC',
                  failure_message: 'value passed for channel was invalid',
                },
                event_id: '01E4C4HDQ77BCN0X23Z3WBE764',
                object_type: 'slack',
                metric: 'failed',
                timestamp: 1585250350,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Slack Message Failed',
                  properties: {
                    eventId: '01E4C4HDQ77BCN0X23Z3WBE764',
                    deliveryId: 'RPILAgQBcRhIBqRiZAc0fyQiLvkC',
                    actionId: 39,
                    broadcastId: 9,
                    reason: 'value passed for channel was invalid',
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:19:10.000Z',
                  sentAt: '2020-03-26T19:19:10.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-17',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 40,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgEBcRhIBqSrYcXDr2ks6Pj9',
                },
                event_id: '01E4C4G1S04QCV1NASF4NWMQNR',
                object_type: 'webhook',
                metric: 'drafted',
                timestamp: 1585250305,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Webhook Message Drafted',
                  properties: {
                    eventId: '01E4C4G1S04QCV1NASF4NWMQNR',
                    deliveryId: 'RPILAgEBcRhIBqSrYcXDr2ks6Pj9',
                    actionId: 40,
                    broadcastId: 9,
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:18:25.000Z',
                  sentAt: '2020-03-26T19:18:25.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-18',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 38,
                  broadcast_id: 6,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RAECAQFxNeUBx6LqgjqrN1j-BJc=',
                  failure_message: "Variable 'customer.test' is missing",
                },
                event_id: '01E4TYA2KA9T0XGHCRJ784B774',
                object_type: 'webhook',
                metric: 'attempted',
                timestamp: 1585747134,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Webhook Message Attempted',
                  properties: {
                    eventId: '01E4TYA2KA9T0XGHCRJ784B774',
                    deliveryId: 'RAECAQFxNeUBx6LqgjqrN1j-BJc=',
                    actionId: 38,
                    broadcastId: 6,
                    reason: "Variable 'customer.test' is missing",
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-04-01T13:18:54.000Z',
                  sentAt: '2020-04-01T13:18:54.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-19',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 40,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgEBcRhNAufr2aU82jtDZEh6',
                  recipient: 'https://test.example.com/process',
                },
                event_id: '01E4C6EP0HCKRHKFARMZ5XEH7A',
                object_type: 'webhook',
                metric: 'sent',
                timestamp: 1585252357,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'https://test.example.com/process' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Webhook Message Sent',
                  properties: {
                    eventId: '01E4C6EP0HCKRHKFARMZ5XEH7A',
                    deliveryId: 'RPILAgEBcRhNAufr2aU82jtDZEh6',
                    actionId: 40,
                    broadcastId: 9,
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:52:37.000Z',
                  sentAt: '2020-03-26T19:52:37.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-20',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 40,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgEBcRhNAufr2aU82jtDZEh6',
                  href: 'http://bing.com',
                  link_id: 1,
                  recipient: 'https://test.example.com/process',
                },
                event_id: '01E4C6F5N1Y54TVGJTN64Y1ZS9',
                object_type: 'webhook',
                metric: 'clicked',
                timestamp: 1585252373,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'https://test.example.com/process' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Webhook Message Link Clicked',
                  properties: {
                    eventId: '01E4C6F5N1Y54TVGJTN64Y1ZS9',
                    deliveryId: 'RPILAgEBcRhNAufr2aU82jtDZEh6',
                    actionId: 40,
                    broadcastId: 9,
                    link: { url: 'http://bing.com', id: 1 },
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:52:53.000Z',
                  sentAt: '2020-03-26T19:52:53.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-21',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 38,
                  broadcast_id: 6,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RAECAQFxNeK3bC4SYqhQqFGBQrQ=',
                  failure_message: 'HTTP 404 Not Found []',
                },
                event_id: '01E4TY5FVB0ZQ4KVDKRME0XSYZ',
                object_type: 'webhook',
                metric: 'failed',
                timestamp: 1585746984,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Webhook Message Failed',
                  properties: {
                    eventId: '01E4TY5FVB0ZQ4KVDKRME0XSYZ',
                    deliveryId: 'RAECAQFxNeK3bC4SYqhQqFGBQrQ=',
                    actionId: 38,
                    broadcastId: 6,
                    reason: 'HTTP 404 Not Found []',
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-04-01T13:16:24.000Z',
                  sentAt: '2020-04-01T13:16:24.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-22',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  action_id: 37,
                  broadcast_id: 9,
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  delivery_id: 'RPILAgUBcRhIBqSfeiIwdIYJKxTY',
                  href: 'ciosas://product/2',
                  link_id: 1,
                  recipients: [
                    {
                      device_id:
                        'eeC2XC_NVPo:APA91bEYRSgmu-dAZcOWi7RzKBbT9gdY3WJACOpLQEMAmAOsChJMAZWirvSlSF3EuHxb7qdwlYeOyCWtbsnR14Vyx5nwBmg5J3SyPxfNn-ey1tNgXIj5UOq8IBk2VwzMApk-xzD4JJof',
                    },
                  ],
                },
                event_id: '01E4V2SBHYK4TNTG8WKMP39G9S',
                object_type: 'push',
                metric: 'delivered',
                timestamp: 1585751830,
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
                    integration: { name: 'Customer.io' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Push Delivered',
                  properties: {
                    eventId: '01E4V2SBHYK4TNTG8WKMP39G9S',
                    deliveryId: 'RPILAgUBcRhIBqSfeiIwdIYJKxTY',
                    actionId: 37,
                    broadcastId: 9,
                    link: { url: 'ciosas://product/2', id: 1 },
                    recipients: [
                      {
                        device_id:
                          'eeC2XC_NVPo:APA91bEYRSgmu-dAZcOWi7RzKBbT9gdY3WJACOpLQEMAmAOsChJMAZWirvSlSF3EuHxb7qdwlYeOyCWtbsnR14Vyx5nwBmg5J3SyPxfNn-ey1tNgXIj5UOq8IBk2VwzMApk-xzD4JJof',
                      },
                    ],
                  },
                  userId: '0200102',
                  originalTimestamp: '2020-04-01T14:37:10.000Z',
                  sentAt: '2020-04-01T14:37:10.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    description: 'test-23: email subscribed',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                data: {
                  customer_id: '0200102',
                  identifiers: { id: '0200102' },
                  email_address: 'test@example.com',
                },
                event_id: '01E4C4C6P79C12J5A6KPE6XNFD',
                object_type: 'email',
                metric: 'subscribed',
                timestamp: 1585250179,
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
                    integration: { name: 'Customer.io' },
                    traits: { email: 'test@example.com' },
                  },
                  integrations: { 'Customer.io': false },
                  type: 'track',
                  event: 'Email Subscribed',
                  properties: { eventId: '01E4C4C6P79C12J5A6KPE6XNFD' },
                  userId: '0200102',
                  originalTimestamp: '2020-03-26T19:16:19.000Z',
                  sentAt: '2020-03-26T19:16:19.000Z',
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
