import crypto from 'crypto';
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
    {
      from: 'Product Added',
      to: 'addToCart',
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

export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2019-10-14'));
  jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomBytes: jest.fn().mockReturnValue(Buffer.from('5398e214ae99c2e50afb709a3bc423f9', 'hex')),
  }));
};

export const data = [
  {
    id: 'emarsys-track-test-1',
    name: 'emarsys',
    description: 'combined batch',
    scenario: 'Business',
    successCriteria:
      'Identify, group events should be batched based on audience list and key_id criteria and track should not be batched ',
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
              },
              destination: commonDestination,
            },
            {
              message: {
                anonymousId: 'anonId06',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                  traits: {
                    email: 'abc@gmail.com',
                    lastName: 'Doe',
                    firstName: 'John',
                  },
                },
                integrations: {
                  All: true,
                },
                traits: {
                  company: 'testComp',
                },
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'group',
                userId: 'userId06',
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 5,
              },
              destination: commonDestination,
            },
            {
              message: {
                anonymousId: 'anonId06',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                  traits: {
                    email: 'abc2@gmail.com',
                    lastName: 'Doe2',
                    firstName: 'John2',
                  },
                },
                integrations: {
                  All: true,
                },
                traits: {
                  company: 'testComp',
                },
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'group',
                userId: 'userId06',
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 6,
              },
              destination: commonDestination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
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
                jobId: 7,
              },
              destination: commonDestination,
            },
            {
              message: {
                event: 'Order Completed',
                anonymousId: 'anonId06',
                channel: 'web',
                context: {
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                  traits: {
                    email: 'abc@gmail.com',
                    lastName: 'Doe',
                    firstName: 'John',
                  },
                },
                integrations: {
                  All: true,
                },
                properties: {
                  company: 'testComp',
                  data: {
                    section_group1: [
                      {
                        section_variable1: 'some_value',
                        section_variable2: 'another_value',
                      },
                      {
                        section_variable1: 'yet_another_value',
                        section_variable2: 'one_more_value',
                      },
                    ],
                    global: {
                      global_variable1: 'global_value',
                      global_variable2: 'another_global_value',
                    },
                  },
                  attachment: [
                    {
                      filename: 'example.pdf',
                      data: 'ZXhhbXBsZQo=',
                    },
                  ],
                },
                messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
                originalTimestamp: '2020-01-24T06:29:02.362Z',
                receivedAt: '2020-01-24T11:59:02.403+05:30',
                request_ip: '[::1]:53709',
                sentAt: '2020-01-24T06:29:02.363Z',
                timestamp: '2023-07-06T11:59:02.402+05:30',
                type: 'track',
                userId: 'userId06',
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 8,
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
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 7,
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'Either configured custom contact identifier value or default identifier email value is missing',
              statTags: {
                destType: 'EMARSYS',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
              },
              destination: commonDestination,
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '3',
                    contacts: [
                      {
                        '1': 'test',
                        '2': 'one',
                        '3': 'testone@gmail.com',
                      },
                      {
                        '1': 'test',
                        '2': 'one',
                        '3': 'testtwo@gmail.com',
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
                    'UsernameToken Username="dummy", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 1,
                },
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '1',
                    contacts: [
                      {
                        '1': 'test',
                        '2': 'one',
                        '3': 'testtwo@gmail.com',
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
                    'UsernameToken Username="dummy", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 3,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '2',
                    contacts: [
                      {
                        '1': 'test',
                        '2': 'one',
                        '3': 'testtwo@gmail.com',
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
                    'UsernameToken Username="dummy", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 4,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '3',
                    external_ids: ['abc@gmail.com', 'abc2@gmail.com'],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.emarsys.net/api/v2/contactlist/dummy/add',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-WSSE':
                    'UsernameToken Username="dummy", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 5,
                },
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 6,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    key_id: '3',
                    external_id: 'abc@gmail.com',
                    data: {
                      section_group1: [
                        {
                          section_variable1: 'some_value',
                          section_variable2: 'another_value',
                        },
                        {
                          section_variable1: 'yet_another_value',
                          section_variable2: 'one_more_value',
                        },
                      ],
                      global: {
                        global_variable1: 'global_value',
                        global_variable2: 'another_global_value',
                      },
                    },
                    attachment: [
                      {
                        filename: 'example.pdf',
                        data: 'ZXhhbXBsZQo=',
                      },
                    ],
                    event_time: '2023-07-06T11:59:02.402+05:30',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.emarsys.net/api/v2/event/purchase/trigger',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'X-WSSE':
                    'UsernameToken Username="dummy", PasswordDigest="NDc5MjNlODIyMGE4ODhiMTQyNTA0OGMzZTFjZTM1MmMzMmU0NmNiNw==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2019-10-14T00:00:00.000Z"',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 8,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: commonDestination,
            },
          ],
        },
      },
    },
  },
].map((d) => ({ ...d, mockFns }));
