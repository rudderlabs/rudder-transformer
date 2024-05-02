const config = {
  discardEmptyProperties: true,
  emersysUsername: 'dummy',
  emersysUserSecret: 'dummy',
  emersysCustomIdentifier: '3',
  defaultContactList: 'dummy',
  eventsMapping: [
    {
      from: 'Order Completed',
      to: 'purchase',
    },
  ],
  fieldMapping: [
    {
      rudderProperty: 'email',
      emersysProperty: '3',
    },
    {
      rudderProperty: 'firstName',
      emersysProperty: '1',
    },
    {
      rudderProperty: 'lastName',
      emersysProperty: '2',
    },
  ],
  oneTrustCookieCategories: [
    {
      oneTrustCookieCategory: 'Marketing',
    },
  ],
};

const commonDestination = {
  ID: '12335',
  Name: 'sample-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'emarsys',
    DisplayName: 'Emarsys',
    Config: {
      cdkV2Enabled: true,
    },
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: config,
  Enabled: true,
};

export const data = [
  {
    id: 'emarsys-track-test-1',
    name: 'emarsys',
    description: 'Track call : custom event calls with simple user properties and traits',
    scenario: 'Business',
    successCriteria:
      'event not respecting the internal mapping and as well as UI mapping should be considered as a custom event and should be sent as it is',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testone@gmail.com',
                    firstName: 'test',
                    lastName: 'one',
                  },
                },
                type: 'identify',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'product list viewed',
                userId: 'testuserId1',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 1,
                secret: {
                  accessToken: 'dummyToken',
                },
              },
              destination: commonDestination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testtwo@gmail.com',
                    firstName: 'test',
                    lastName: 'one',
                  },
                },
                type: 'identify',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'product list viewed',
                userId: 'testuserId1',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 2,
                secret: {
                  accessToken: 'dummyToken',
                },
              },
              destination: commonDestination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testtwo@gmail.com',
                    firstName: 'test',
                    lastName: 'one',
                  },
                },
                type: 'identify',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'product list viewed',
                userId: 'testuserId1',
                integrations: {
                  All: true,
                  EMARSYS: {
                    contactListId: 'dummy2',
                    customIdentifierId: '1',
                  },
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 3,
                secret: {
                  accessToken: 'dummyToken',
                },
              },
              destination: commonDestination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testtwo@gmail.com',
                    firstName: 'test',
                    lastName: 'one',
                  },
                },
                type: 'identify',
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: '123456',
                event: 'product list viewed',
                userId: 'testuserId1',
                integrations: {
                  All: true,
                  EMARSYS: {
                    contactListId: 'dummy2',
                    customIdentifierId: '2',
                  },
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 4,
                secret: {
                  accessToken: 'dummyToken',
                },
              },
              destination: commonDestination,
            },
          ],
          destType: 'emarsys',
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
              metadata: [
                {
                  destinationType: '',
                  jobId: 1,
                  namespace: '',
                  secret: {
                    accessToken: 'dummyToken',
                  },
                  sourceType: '',
                },
                {
                  destinationType: '',
                  jobId: 2,
                  namespace: '',
                  secret: {
                    accessToken: 'dummyToken',
                  },
                  sourceType: '',
                },
              ],
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '3',
                    contacts: [
                      {
                        '3': 'testone@gmail.com',
                        '1': 'test',
                        '2': 'one',
                      },
                      {
                        '3': 'testtwo@gmail.com',
                        '1': 'test',
                        '2': 'one',
                      },
                    ],
                    contact_list_id: 'dummy',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-WSSE':
                    'UsernameToken Username="dummy", PasswordDigest="OWM2ODlmYjZiMDA0YTQwZjc1NjkyOWFiZTA1MTQ0ZmUwOGYyYWQ2NA==", Nonce="8c02af01eb527f450340bb82ebd40dde", Created="2024-05-02T15:41:20.529Z"',
                },
                params: {},
                files: {},
              },
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
            {
              metadata: [
                {
                  destinationType: '',
                  jobId: 3,
                  namespace: '',
                  secret: {
                    accessToken: 'dummyToken',
                  },
                  sourceType: '',
                },
              ],
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '1',
                    contacts: [
                      {
                        '3': 'testtwo@gmail.com',
                        '1': 'test',
                        '2': 'one',
                      },
                    ],
                    contact_list_id: 'dummy2',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-WSSE':
                    'UsernameToken Username="dummy", PasswordDigest="OWM2ODlmYjZiMDA0YTQwZjc1NjkyOWFiZTA1MTQ0ZmUwOGYyYWQ2NA==", Nonce="8c02af01eb527f450340bb82ebd40dde", Created="2024-05-02T15:41:20.529Z"',
                },
                params: {},
                files: {},
              },
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
            {
              metadata: [
                {
                  destinationType: '',
                  jobId: 4,
                  namespace: '',
                  secret: {
                    accessToken: 'dummyToken',
                  },
                  sourceType: '',
                },
              ],
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '2',
                    contacts: [
                      {
                        '3': 'testtwo@gmail.com',
                        '1': 'test',
                        '2': 'one',
                      },
                    ],
                    contact_list_id: 'dummy2',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-WSSE':
                    'UsernameToken Username="dummy", PasswordDigest="OWM2ODlmYjZiMDA0YTQwZjc1NjkyOWFiZTA1MTQ0ZmUwOGYyYWQ2NA==", Nonce="8c02af01eb527f450340bb82ebd40dde", Created="2024-05-02T15:41:20.529Z"',
                },
                params: {},
                files: {},
              },
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
          ],
        },
      },
    },
  },
];
