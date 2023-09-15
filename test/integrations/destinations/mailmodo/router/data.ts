export const data = [
  {
    name: 'mailmodo',
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
                type: 'identify',
                event: 'Email Opened',
                sentAt: '2020-08-28T16:26:16.473Z',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                _metadata: {
                  nodeVersion: '10.22.0',
                },
                messageId:
                  'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
                properties: {
                  email: 'test@abc.com',
                  subject: 'resume validate',
                  sendtime: '2020-01-01',
                  sendlocation: 'akashdeep@gmail.com',
                },
                anonymousId: 'abcdeeeeeeeexxxx102',
                originalTimestamp: '2020-08-28T16:26:06.468Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  listName: 'abc',
                },
                Enabled: true,
              },
            },
            {
              message: {
                type: 'track',
                event: 'Email Opened',
                sentAt: '2020-08-28T16:26:16.473Z',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                _metadata: {
                  nodeVersion: '10.22.0',
                },
                messageId:
                  'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
                properties: {
                  email: 'test@abc.com',
                  subject: 'resume validate',
                  sendtime: '2020-01-01',
                  sendlocation: 'akashdeep@gmail.com',
                },
                anonymousId: 'abcdeeeeeeeexxxx102',
                originalTimestamp: '2020-08-28T16:26:06.468Z',
              },
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  listName: 'abc',
                },
                Enabled: true,
              },
            },
            {
              message: {
                type: 'identify',
                userId: 'identified user id',
                anonymousId: 'anon-id-new',
                context: {
                  traits: {
                    trait1: 'new-val',
                  },
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                },
                traits: {
                  email: 'test@abc.com',
                  name: 'Rudder Test',
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  age: 21,
                  phone: '9876543210',
                },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
              metadata: {
                jobId: 4,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  listName: 'abc',
                },
                Enabled: true,
              },
            },
            {
              message: {
                type: 'identify',
                event: 'Email Opened',
                sentAt: '2020-08-28T16:26:16.473Z',
                context: {
                  library: {
                    name: 'analytics-node',
                    version: '0.0.3',
                  },
                },
                _metadata: {
                  nodeVersion: '10.22.0',
                },
                messageId:
                  'node-570110489d3e99b234b18af9a9eca9d4-6009779e-82d7-469d-aaeb-5ccf162b0453',
                properties: {
                  subject: 'resume validate',
                  sendtime: '2020-01-01',
                  sendlocation: 'akashdeep@gmail.com',
                },
                anonymousId: 'abcdeeeeeeeexxxx102',
                originalTimestamp: '2020-08-28T16:26:06.468Z',
              },
              metadata: {
                jobId: 5,
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  listName: '',
                },
                Enabled: true,
              },
            },
          ],
          destType: 'mailmodo',
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
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    listName: 'abc',
                    values: [
                      {
                        email: 'test@abc.com',
                      },
                      {
                        email: 'test@abc.com',
                        data: {
                          name: 'Rudder Test',
                          first_name: 'Test',
                          last_name: 'Rudderlabs',
                          age: 21,
                          phone: '9876543210',
                          trait1: 'new-val',
                        },
                      },
                    ],
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  mmApiKey: 'dummyApiKey',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api.mailmodo.com/api/v1/addToList/batch',
              },
              metadata: [
                {
                  jobId: 2,
                },
                {
                  jobId: 4,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  listName: 'abc',
                },
                Enabled: true,
              },
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                  JSON: {
                    email: 'test@abc.com',
                    event_name: 'Email Opened',
                    event_properties: {
                      email: 'test@abc.com',
                      sendlocation: 'akashdeep@gmail.com',
                      sendtime: '2020-01-01',
                      subject: 'resume validate',
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  mmApiKey: 'dummyApiKey',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://api.mailmodo.com/api/v1/addEvent',
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  listName: 'abc',
                },
                Enabled: true,
              },
            },
            {
              batched: false,
              error:
                'Missing required value from ["traits.email","context.traits.email","properties.email"]',
              metadata: [
                {
                  jobId: 5,
                },
              ],
              statTags: {
                destType: 'MAILMODO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  listName: '',
                },
                Enabled: true,
              },
            },
          ],
        },
      },
    },
  },
];
