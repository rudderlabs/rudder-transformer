import { FEATURES } from '../../../../../src/v0/util/tags';

export const data = [
  {
    name: 'sendgrid',
    description: 'Router Test Case',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: 'apikey',
                  eventNamesSettings: [{ event: 'testing' }, { event: 'clicked' }],
                  subject: 'A sample subject',
                  replyToEmail: 'ankit@rudderstack.com',
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  footer: false,
                  bypassListManagement: false,
                  sandboxMode: false,
                  clickTracking: false,
                  openTracking: false,
                  ganalytics: false,
                  subscriptionTracking: false,
                  clickTrackingEnableText: false,
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                type: 'track',
                event: 'testing',
                properties: {
                  personalizations: [
                    {
                      to: [
                        {
                          email: 'a@g.com',
                        },
                        {
                          name: 'hello',
                        },
                      ],
                      subject: 'hey there',
                    },
                  ],
                  from: {
                    email: 'ankit@rudderstack.com',
                  },
                },
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
          ],
          destType: 'sendgrid',
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
                body: {
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                  JSON: {
                    personalizations: [
                      {
                        to: [
                          {
                            email: 'a@g.com',
                          },
                        ],
                        subject: 'hey there',
                      },
                    ],
                    from: {
                      email: 'ankit@rudderstack.com',
                    },
                    reply_to: { email: 'ankit@rudderstack.com' },
                    subject: 'A sample subject',
                    content: [
                      {
                        type: 'text/html',
                        value:
                          '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                      },
                    ],
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  Authorization: 'Bearer apikey',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api.sendgrid.com/v3/mail/send',
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'apikey',
                  eventNamesSettings: [{ event: 'testing' }, { event: 'clicked' }],
                  subject: 'A sample subject',
                  replyToEmail: 'ankit@rudderstack.com',
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  footer: false,
                  bypassListManagement: false,
                  sandboxMode: false,
                  clickTracking: false,
                  openTracking: false,
                  ganalytics: false,
                  subscriptionTracking: false,
                  clickTrackingEnableText: false,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'sendgrid',
    description: 'Identify call batching with multiple listIds',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
              message: {
                userId: 'user@3',
                type: 'identify',
                context: {
                  traits: {
                    age: '30',
                    email: 'user3@rudderlabs.com',
                    phone: '+91 9876543210',
                    city: 'Ahmedabad',
                    state: 'Gujarat',
                    lastName: 'gupta',
                    firstName: 'aman',
                    name: 'aman gupta',
                  },
                  externalId: [
                    {
                      type: 'listIds',
                      id: ['476b736e-24a4-4089-8392-66a6bf6aa14d'],
                    },
                  ],
                },
              },
              metadata: {
                jobId: 1,
              },
            },
            {
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
              message: {
                userId: 'user@4',
                type: 'identify',
                context: {
                  traits: {
                    email: 'user4@rudderlabs.com',
                    phone: '+91 9876543210',
                    userId: 'sajal',
                    city: 'Bombey',
                    state: 'Maharastra',
                    lastName: 'gupta',
                    username: 'suresh gupta',
                    firstName: 'suresh',
                  },
                  externalId: [
                    {
                      type: 'listIds',
                      id: '737ae8d4-25b4-496e-adff-2fded15fd0c6',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 2,
              },
            },
            {
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
              message: {
                userId: 'user@5',
                type: 'identify',
                context: {
                  traits: {
                    email: 'user5@rudderlabs.com',
                    phone: '+91 9876543210',
                    city: 'Banglore',
                    lastName: 'bhatt',
                    username: 'kiran bhatt',
                    firstName: 'kiran',
                  },
                  externalId: [
                    {
                      type: 'listIds',
                      id: [
                        '737ae8d4-25b4-496e-adff-2fded15fd0c6',
                        'a4ac8a69-d8cb-4cf1-9d85-3d60e4007ab1',
                      ],
                    },
                  ],
                },
              },
              metadata: {
                jobId: 3,
              },
            },
            {
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
              message: {
                userId: 'user@6',
                type: 'identify',
                context: {
                  traits: {
                    email: 'user6@rudderlabs.com',
                    phone: '+91 9876543210',
                    city: 'Los Angeles',
                    lastName: 'doe',
                    name: 'john doe',
                    state: 'California',
                    firstName: 'john',
                  },
                  externalId: [
                    {
                      type: 'listIds',
                      id: [
                        'bc9b7ff4-f1d4-4c7c-b9a8-3051107c8d1e',
                        'cb7f13a1-b77b-4fb3-8440-56f6524716d3',
                      ],
                    },
                  ],
                },
              },
              metadata: {
                jobId: 4,
              },
            },
            {
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
              message: {
                userId: 'user@7',
                type: 'identify',
                context: {
                  traits: {
                    email: 'user7@rudderlabs.com',
                    phone: '+91 9876543210',
                    city: 'Chicago',
                    lastName: 'patel',
                    name: 'reshma patel',
                    state: 'Illinois',
                    firstName: 'reshma',
                  },
                },
              },
              metadata: {
                jobId: 5,
              },
            },
            {
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
              message: {
                userId: 'user@8',
                type: 'identify',
                context: {
                  traits: {
                    email: 'user8@rudderlabs.com',
                    phone: '+91 9876543210',
                    city: 'Chicago',
                    lastName: 'patel',
                    name: 'karishma patel',
                    state: 'Illinois',
                    firstName: 'karishma',
                  },
                  externalId: [
                    {
                      type: 'listIds',
                      id: [
                        '737ae8d4-25b4-496e-adff-2fded15fd0c6',
                        'a4ac8a69-d8cb-4cf1-9d85-3d60e4007ab1',
                        'bc9b7ff4-f1d4-4c7c-b9a8-3051107c8d1e',
                        'cb7f13a1-b77b-4fb3-8440-56f6524716d3',
                      ],
                    },
                  ],
                },
              },
              metadata: {
                jobId: 6,
              },
            },
          ],
          destType: 'sendgrid',
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
                method: 'PUT',
                endpoint: 'https://api.sendgrid.com/v3/marketing/contacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer apikey',
                },
                params: {},
                body: {
                  JSON: {
                    list_ids: ['476b736e-24a4-4089-8392-66a6bf6aa14d'],
                    contacts: [
                      {
                        email: 'user3@rudderlabs.com',
                        phone_number: '+91 9876543210',
                        first_name: 'aman',
                        last_name: 'gupta',
                        unique_name: 'aman gupta',
                        custom_fields: { w1_T: 'aman gupta' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 1 }],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.sendgrid.com/v3/marketing/contacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer apikey',
                },
                params: {},
                body: {
                  JSON: {
                    list_ids: ['737ae8d4-25b4-496e-adff-2fded15fd0c6'],
                    contacts: [
                      {
                        email: 'user4@rudderlabs.com',
                        phone_number: '+91 9876543210',
                        first_name: 'suresh',
                        last_name: 'gupta',
                        custom_fields: {},
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 2 }],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.sendgrid.com/v3/marketing/contacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer apikey',
                },
                params: {},
                body: {
                  JSON: {
                    list_ids: [
                      '737ae8d4-25b4-496e-adff-2fded15fd0c6',
                      'a4ac8a69-d8cb-4cf1-9d85-3d60e4007ab1',
                    ],
                    contacts: [
                      {
                        email: 'user5@rudderlabs.com',
                        phone_number: '+91 9876543210',
                        first_name: 'kiran',
                        last_name: 'bhatt',
                        custom_fields: {},
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 3 }],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.sendgrid.com/v3/marketing/contacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer apikey',
                },
                params: {},
                body: {
                  JSON: {
                    list_ids: [
                      'bc9b7ff4-f1d4-4c7c-b9a8-3051107c8d1e',
                      'cb7f13a1-b77b-4fb3-8440-56f6524716d3',
                    ],
                    contacts: [
                      {
                        email: 'user6@rudderlabs.com',
                        phone_number: '+91 9876543210',
                        first_name: 'john',
                        last_name: 'doe',
                        unique_name: 'john doe',
                        custom_fields: { w1_T: 'john doe' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 4 }],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.sendgrid.com/v3/marketing/contacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer apikey',
                },
                params: {},
                body: {
                  JSON: {
                    contacts: [
                      {
                        email: 'user7@rudderlabs.com',
                        phone_number: '+91 9876543210',
                        first_name: 'reshma',
                        last_name: 'patel',
                        unique_name: 'reshma patel',
                        custom_fields: { w1_T: 'reshma patel' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 5 }],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.sendgrid.com/v3/marketing/contacts',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer apikey',
                },
                params: {},
                body: {
                  JSON: {
                    list_ids: [
                      '737ae8d4-25b4-496e-adff-2fded15fd0c6',
                      'a4ac8a69-d8cb-4cf1-9d85-3d60e4007ab1',
                      'bc9b7ff4-f1d4-4c7c-b9a8-3051107c8d1e',
                      'cb7f13a1-b77b-4fb3-8440-56f6524716d3',
                    ],
                    contacts: [
                      {
                        email: 'user8@rudderlabs.com',
                        phone_number: '+91 9876543210',
                        first_name: 'karishma',
                        last_name: 'patel',
                        unique_name: 'karishma patel',
                        custom_fields: { w1_T: 'karishma patel' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 6 }],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '2HOQOO6wWKaKjeQrEABXgiH6cmU',
                Config: {
                  IPPoolName: '',
                  apiKey: 'apikey',
                  attachments: [
                    {
                      content: '',
                      contentId: '',
                      disposition: '',
                      filename: '',
                      type: '',
                    },
                  ],
                  clickTracking: true,
                  clickTrackingEnableText: true,
                  contents: [
                    {
                      type: 'text/html',
                      value:
                        '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
                    },
                  ],
                  customFieldsMapping: [{ from: 'name', to: 'user_name' }],
                  eventDelivery: false,
                  eventDeliveryTS: 1668424218224,
                  eventNamesSettings: [{ event: 'open' }],
                  footer: false,
                  fromEmail: 'a@g.com',
                  fromName: '',
                  ganalytics: false,
                  group: '',
                  groupsToDisplay: [{ groupId: '' }],
                  html: '',
                  mailFromTraits: false,
                  openTracking: false,
                  openTrackingSubstitutionTag: '',
                  replyToEmail: '',
                  replyToName: '',
                  sandboxMode: false,
                  subject: 'hello there from webflow',
                  subscriptionTracking: false,
                  substitutionTag: '',
                  templateId: '',
                  text: '',
                },
              },
            },
          ],
        },
      },
    },
  },
];
