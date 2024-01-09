export const data = [
  {
    name: 'hs',
    description: 'router associated retl test',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: '123',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'pat-123',
                  apiVersion: 'newApi',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2022-08-23T05:59:38.214Z',
                traits: {
                  to: {
                    id: 1,
                  },
                  from: {
                    id: 9405415215,
                  },
                },
                userId: '1',
                channel: 'sources',
                context: {
                  sources: {
                    job_id: '2DkDam0hJ8CXZA43zksWMdPAPRe/Syncher',
                    task_id: 'HUBSPOT_ASSOC_COMPANY_CONTACT',
                    version: 'v1.8.15',
                    batch_id: '8d566f29-5f9b-4fa7-ad0c-d8087ca52d6a',
                    job_run_id: 'cc26p35qhlpr6fd4jrmg',
                    task_run_id: 'cc26p35qhlpr6fd4jrn0',
                  },
                  externalId: [
                    {
                      id: 1,
                      type: 'HS-association',
                      toObjectType: 'contacts',
                      fromObjectType: 'companies',
                      identifierType: 'id',
                      associationTypeId: 'engineer',
                    },
                  ],
                  mappedToDestination: 'true',
                },
                recordId: '1',
                rudderId: '3afcdbfe-b6ec-4bdd-8ba6-28696e3cc163',
                messageId: 'e0c554aa-0a9a-4e24-9a9a-c951a71a0875',
                timestamp: '2022-08-23T05:59:33.758Z',
                receivedAt: '2022-08-23T05:59:33.759Z',
                request_ip: '10.1.90.32',
                originalTimestamp: '2022-08-23T05:59:38.214Z',
              },
              metadata: {
                jobId: 2,
              },
            },
          ],
          destType: 'hs',
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
                endpoint:
                  'https://api.hubapi.com/crm/v3/associations/companies/contacts/batch/create',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer pat-123',
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        to: {
                          id: 1,
                        },
                        from: {
                          id: 9405415215,
                        },
                        type: 'engineer',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '123',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'pat-123',
                  apiVersion: 'newApi',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'legacy router tests',
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
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testhubspot1@email.com',
                    firstname: 'Test Hubspot1',
                    anonymousId: '1111',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testhubspot2@email.com',
                    firstname: 'Test Hubspot2',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                type: 'track',
                messageId: '08829772-d991-427c-b976-b4c4f4430b4e',
                originalTimestamp: '2019-10-15T09:35:31.291Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                event: 'test track event HS',
                properties: {
                  user_actual_role: 'system_admin, system_user',
                  user_actual_id: 12345,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              message: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/testhubspot2@email.com',
                headers: {
                  'Content-Type': 'application/json',
                },
                userId: '00000000000000000000000000',
                params: {
                  hapikey: 'dummy-apikey',
                },
                body: {
                  JSON: {
                    properties: [
                      {
                        property: 'email',
                        value: 'testhubspot3@email.com',
                      },
                      {
                        property: 'firstname',
                        value: 'Test Hubspot3',
                      },
                    ],
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testhubspot4@email.com',
                    firstname: 'Test Hubspot4',
                    anonymousId: '4444',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
              },
              destination: {
                Config: {
                  apiKey: 'rate-limit-id',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
          destType: 'hs',
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
                endpoint: 'https://api.hubapi.com/contacts/v1/contact/batch/',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {
                  hapikey: 'dummy-apikey',
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch:
                      '[{"email":"testhubspot3@email.com","properties":[{"property":"firstname","value":"Test Hubspot3"}]},{"email":"testhubspot1@email.com","properties":[{"property":"firstname","value":"Test Hubspot1"}]},{"email":"testhubspot4@email.com","properties":[{"property":"firstname","value":"Test Hubspot4"}]}]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 3,
                },
                {
                  jobId: 1,
                },
                {
                  jobId: 4,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'GET',
                endpoint: 'https://track.hubspot.com/v1/event',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {
                  _a: 'dummy-hubId',
                  _n: 'test track event HS',
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot2',
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
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
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'legacy router retl tests',
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
                  mappedToDestination: true,
                  externalId: [
                    {
                      identifierType: 'email',
                      id: 'testhubspot2@email.com',
                      type: 'HS-lead',
                    },
                  ],
                  sources: {
                    job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
                    task_id: 'vw_rs_mailchimp_mocked_hg_data',
                    version: 'v1.8.1',
                    batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
                    job_run_id: 'c8el40l6e87v0c4hkbl0',
                    task_run_id: 'c8el40l6e87v0c4hkblg',
                  },
                },
                type: 'identify',
                traits: {
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                  country: 'India',
                },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
              metadata: {
                jobId: 2,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  mappedToDestination: true,
                  externalId: [
                    {
                      identifierType: 'email',
                      id: 'testhubspot@email.com',
                      type: 'HS-lead',
                    },
                  ],
                  sources: {
                    job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
                    task_id: 'vw_rs_mailchimp_mocked_hg_data',
                    version: 'v1.8.1',
                    batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
                    job_run_id: 'c8el40l6e87v0c4hkbl0',
                    task_run_id: 'c8el40l6e87v0c4hkblg',
                  },
                },
                type: 'identify',
                traits: {
                  firstname: 'Test Hubspot 1',
                  anonymousId: '123451',
                  country: 'India 1',
                },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
              metadata: {
                jobId: 3,
              },
            },
          ],
          destType: 'hs',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/create',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {
                  hapikey: 'dummy-apikey',
                },
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          firstname: 'Test Hubspot 1',
                          anonymousId: '123451',
                          country: 'India 1',
                          email: 'testhubspot@email.com',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/update',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {
                  hapikey: 'dummy-apikey',
                },
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          firstname: 'Test Hubspot',
                          anonymousId: '12345',
                          country: 'India',
                          email: 'testhubspot2@email.com',
                        },
                        id: '103605',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummy-apikey',
                  hubID: 'dummy-hubId',
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'router retl tests',
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
                  mappedToDestination: true,
                  externalId: [
                    {
                      identifierType: 'email',
                      id: 'testhubspot2@email.com',
                      type: 'HS-lead',
                    },
                  ],
                  sources: {
                    job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
                    task_id: 'vw_rs_mailchimp_mocked_hg_data',
                    version: 'v1.8.1',
                    batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
                    job_run_id: 'c8el40l6e87v0c4hkbl0',
                    task_run_id: 'c8el40l6e87v0c4hkblg',
                  },
                },
                type: 'identify',
                traits: {
                  firstname: 'Test Hubspot',
                  anonymousId: '12345',
                  country: 'India',
                },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
              metadata: {
                jobId: 2,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  mappedToDestination: true,
                  externalId: [
                    {
                      identifierType: 'email',
                      id: 'testhubspot@email.com',
                      type: 'HS-lead',
                    },
                  ],
                  sources: {
                    job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
                    task_id: 'vw_rs_mailchimp_mocked_hg_data',
                    version: 'v1.8.1',
                    batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
                    job_run_id: 'c8el40l6e87v0c4hkbl0',
                    task_run_id: 'c8el40l6e87v0c4hkblg',
                  },
                },
                type: 'identify',
                traits: {
                  firstname: 'Test Hubspot 1',
                  anonymousId: '123451',
                  country: 'India 1',
                },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
              metadata: {
                jobId: 3,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  mappedToDestination: true,
                  externalId: [
                    {
                      identifierType: 'email',
                      id: 'testhubspotdatetime@email.com',
                      type: 'HS-lead',
                    },
                  ],
                  sources: {
                    job_id: '24c5HJxHomh6YCngEOCgjS5r1KX/Syncher',
                    task_id: 'vw_rs_mailchimp_mocked_hg_data',
                    version: 'v1.8.1',
                    batch_id: 'f252c69d-c40d-450e-bcd2-2cf26cb62762',
                    job_run_id: 'c8el40l6e87v0c4hkbl0',
                    task_run_id: 'c8el40l6e87v0c4hkblg',
                  },
                },
                type: 'identify',
                traits: {
                  firstname: 'Test Hubspot',
                  anonymousId: '123451',
                  country: 'India',
                  date_submitted: '2023-09-25T17:31:04.128251Z',
                  date_created: '2023-03-30T01:02:03.05Z',
                  date_closed: '2023-10-18T04:38:59.229347Z',
                },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
              metadata: {
                jobId: 4,
              },
            },
          ],
          destType: 'hs',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/create',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummy-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          firstname: 'Test Hubspot 1',
                          anonymousId: '123451',
                          country: 'India 1',
                          email: 'testhubspot@email.com',
                        },
                      },
                      {
                        properties: {
                          firstname: 'Test Hubspot',
                          anonymousId: '123451',
                          country: 'India',
                          email: 'testhubspotdatetime@email.com',
                          date_closed: 1697587200000,
                          date_created: 1680134400000,
                          date_submitted: 1695600000000,
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 3,
                },
                {
                  jobId: 4,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/update',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummy-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          firstname: 'Test Hubspot',
                          anonymousId: '12345',
                          country: 'India',
                          email: 'testhubspot2@email.com',
                        },
                        id: '103605',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'router tests',
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
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'noname@email.com',
                    firstname: 'Test Hubspot22',
                    anonymousId: '4444',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'noname@email.com',
                    firstname: 'Test Hubspot44',
                    anonymousId: '4444',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              message: {
                type: 'track',
                traits: {},
                context: {
                  externalId: [
                    {
                      id: 'osvaldocostaferreira98@gmail.com',
                      type: 'HS-contacts',
                      identifierType: 'email',
                    },
                  ],
                },
                event: 'Purchase',
                properties: {
                  Revenue: 'name1',
                },
              },
              metadata: {
                jobId: 3,
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testhubspot@email.com',
                    firstname: 'Test Hubspot22',
                    anonymousId: '4444',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'testhubspot@email.com',
                    firstname: 'Test Hubspot44',
                    anonymousId: '4444',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                  page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 5,
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
          destType: 'hs',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummy-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          email: 'noname@email.com',
                          firstname: 'Test Hubspot44',
                        },
                      },
                      {
                        properties: {
                          email: 'testhubspot@email.com',
                          firstname: 'Test Hubspot44',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
                {
                  jobId: 2,
                },
                {
                  jobId: 4,
                },
                {
                  jobId: 5,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/events/v3/send',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer dummy-access-token',
                },
                params: {},
                body: {
                  JSON: {
                    email: 'osvaldocostaferreira98@gmail.com',
                    eventName: 'pedummy-hubId_rs_hub_test',
                    properties: {
                      value: 'name1',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
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
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'dummy-access-token',
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        {
                          from: 'Revenue',
                          to: 'value',
                        },
                        {
                          from: 'Price',
                          to: 'cost',
                        },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        {
                          from: 'firstName',
                          to: 'first_name',
                        },
                        {
                          from: 'lastName',
                          to: 'last_name',
                        },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                secretConfig: {},
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                name: 'Hubspot',
                enabled: true,
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                deleted: false,
                createdAt: '2020-12-30T08:39:32.005Z',
                updatedAt: '2021-02-03T16:22:31.374Z',
                destinationDefinition: {
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  displayName: 'Hubspot',
                  createdAt: '2020-04-09T09:24:31.794Z',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                transformations: [],
                isConnectionEnabled: true,
                isProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
];
