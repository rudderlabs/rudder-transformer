export const data = [
  {
    name: 'zendesk',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiToken: 'myDummyApiToken4',
                  createUsersAsVerified: true,
                  domain: 'rudderlabshelp',
                  email: 'myDummyUserName1',
                  password: 'myDummyPwd1',
                  removeUsersFromOrganization: true,
                  sendGroupCallsWithoutUserId: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Zendesk',
                  ID: '1YknZ1ENqB8UurJQJE2VrEA61tr',
                  Name: 'ZENDESK',
                },
                Enabled: true,
                ID: 'xxxxxxxxxxxxxxxxxxxxxxxO51P',
                Name: 'zendesk',
                Transformations: [],
              },
              metadata: {
                jobId: 2,
              },
              message: {
                anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.0-beta.2',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.0-beta.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    email: 'example124@email.com',
                    name: 'abcd124',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                messageId: '0bab70e8-bf2f-449a-a19b-ca6e3bfed9b7',
                originalTimestamp: '2020-03-23T18:27:28.98Z',
                receivedAt: '2020-03-23T23:57:29.022+05:30',
                request_ip: '[::1]:51573',
                sentAt: '2020-03-23T18:27:28.981Z',
                timestamp: '2020-03-23T23:57:29.021+05:30',
                type: 'identify',
                userId: 'abcd-124',
              },
            },
          ],
          destType: 'zendesk',
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
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://rudderlabshelp.zendesk.com/api/v2/users/create_or_update.json',
                  headers: {
                    Authorization: 'Basic bXlEdW1teVVzZXJOYW1lMS90b2tlbjpteUR1bW15QXBpVG9rZW40',
                    'Content-Type': 'application/json',
                    'X-Zendesk-Marketplace-Name': 'RudderStack',
                    'X-Zendesk-Marketplace-Organization-Id': '3339',
                    'X-Zendesk-Marketplace-App-Id': '263241',
                  },
                  params: {},
                  body: {
                    JSON: {
                      user: {
                        email: 'example124@email.com',
                        name: 'abcd124',
                        external_id: 'abcd-124',
                        user_fields: {
                          id: 'abcd-124',
                        },
                        verified: true,
                      },
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                  userId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
                },
              ],
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiToken: 'myDummyApiToken4',
                  createUsersAsVerified: true,
                  domain: 'rudderlabshelp',
                  email: 'myDummyUserName1',
                  password: 'myDummyPwd1',
                  removeUsersFromOrganization: true,
                  sendGroupCallsWithoutUserId: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Zendesk',
                  ID: '1YknZ1ENqB8UurJQJE2VrEA61tr',
                  Name: 'ZENDESK',
                },
                Enabled: true,
                ID: 'xxxxxxxxxxxxxxxxxxxxxxxO51P',
                Name: 'zendesk',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'zendesk',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiToken: 'myDummyApiToken4',
                  createUsersAsVerified: true,
                  domain: 'rudderlabshelp',
                  email: 'myDummyUserName1',
                  password: 'myDummyPwd1',
                  removeUsersFromOrganization: true,
                  sendGroupCallsWithoutUserId: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Zendesk',
                  ID: '1YknZ1ENqB8UurJQJE2VrEA61tr',
                  Name: 'ZENDESK',
                },
                Enabled: true,
                ID: 'xxxxxxxxxxxxxxxxxxxxxxxO51P',
                Name: 'zendesk',
                Transformations: [],
              },
              metadata: {
                jobId: 2,
              },
              message: {
                anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.0-beta.2',
                  },
                  ip: '0.0.0.0',
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.0-beta.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    email: 'example124@email.com',
                    name: 'abcd124',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                },
                groupId: 'group-124',
                integrations: {
                  All: true,
                },
                messageId: '2d54ba80-ce5f-4bcb-b1d7-7587e7a865fc',
                originalTimestamp: '2020-03-23T18:27:28.983Z',
                receivedAt: '2020-03-23T23:57:29.022+05:30',
                request_ip: '[::1]:51574',
                sentAt: '2020-03-23T18:27:28.983Z',
                timestamp: '2020-03-23T23:57:29.022+05:30',
                traits: {
                  domainNames: 'cw124.com',
                  email: 'group_email_124@xyz.com',
                  name: 'test-org124',
                },
                type: 'group',
                userId: 'abcd-124',
              },
            },
          ],
          destType: 'zendesk',
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
                method: 'POST',
                endpoint: 'https://rudderlabshelp.zendesk.com/api/v2/organization_memberships.json',
                headers: {
                  Authorization: 'Basic bXlEdW1teVVzZXJOYW1lMS90b2tlbjpteUR1bW15QXBpVG9rZW40',
                  'Content-Type': 'application/json',
                  'X-Zendesk-Marketplace-Name': 'RudderStack',
                  'X-Zendesk-Marketplace-Organization-Id': '3339',
                  'X-Zendesk-Marketplace-App-Id': '263241',
                },
                params: {},
                body: {
                  JSON: {
                    organization_membership: {
                      user_id: 900113780483,
                      organization_id: 900001329943,
                    },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
                userId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
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
                  apiToken: 'myDummyApiToken4',
                  createUsersAsVerified: true,
                  domain: 'rudderlabshelp',
                  email: 'myDummyUserName1',
                  password: 'myDummyPwd1',
                  removeUsersFromOrganization: true,
                  sendGroupCallsWithoutUserId: true,
                },
                DestinationDefinition: {
                  DisplayName: 'Zendesk',
                  ID: '1YknZ1ENqB8UurJQJE2VrEA61tr',
                  Name: 'ZENDESK',
                },
                Enabled: true,
                ID: 'xxxxxxxxxxxxxxxxxxxxxxxO51P',
                Name: 'zendesk',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'zendesk',
    description: 'Test 2',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiToken: 'dummyApiToken',
                  createUsersAsVerified: true,
                  domain: 'rudderlabtest2',
                  email: 'rudderlabtest2@email.com',
                  removeUsersFromOrganization: false,
                  sendGroupCallsWithoutUserId: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Zendesk',
                  ID: '1YknZ1ENqB8UurJQJE2VrEA61tr',
                  Name: 'ZENDESK',
                },
                Enabled: true,
                ID: 'xxxxxxxxxxxxxxxxxxxxxxxO51P',
                Name: 'zendesk',
                Transformations: [],
              },
              metadata: {
                jobId: 3,
              },
              message: {
                anonymousId: '223b5f40-9543-4456-a7aa-945c43048185',
                channel: 'web',
                context: {
                  traits: {
                    country: 'UK',
                    name: 'John Wick',
                    userId: 'exId-123',
                    email: 'testemail2@email',
                  },
                  userAgent:
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                },
                event: 'Order completed',
                messageId: '017f5227-ead3-4b7d-9794-1465022327be',
                originalTimestamp: '2021-03-25T14:36:47.695Z',
                properties: {
                  category: 'category',
                  label: 'label',
                  userId: 'exId-123',
                  value: 'value',
                },
                rudderId: 'd1b1b23f-c855-4b86-bad7-091f7bbe99fe',
                type: 'track',
                userId: '0000000000',
              },
            },
          ],
          destType: 'zendesk',
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
              error:
                '{"message":"Failed to fetch user with email: testemail2@email due to Couldn\'t find user: John Wick","destinationResponse":{"status":400,"statTags":{"errorCategory":"network","errorType":"aborted","meta":"instrumentation"},"destinationResponse":"","authErrorCategory":""}}',
              statTags: {
                destType: 'ZENDESK',
                errorCategory: 'network',
                errorType: 'aborted',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              metadata: [
                {
                  jobId: 3,
                },
              ],
              batched: false,
              destination: {
                Config: {
                  apiToken: 'dummyApiToken',
                  createUsersAsVerified: true,
                  domain: 'rudderlabtest2',
                  email: 'rudderlabtest2@email.com',
                  removeUsersFromOrganization: false,
                  sendGroupCallsWithoutUserId: false,
                },
                DestinationDefinition: {
                  DisplayName: 'Zendesk',
                  ID: '1YknZ1ENqB8UurJQJE2VrEA61tr',
                  Name: 'ZENDESK',
                },
                Enabled: true,
                ID: 'xxxxxxxxxxxxxxxxxxxxxxxO51P',
                Name: 'zendesk',
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
];
