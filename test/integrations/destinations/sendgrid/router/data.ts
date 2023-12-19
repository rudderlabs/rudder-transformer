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
];
