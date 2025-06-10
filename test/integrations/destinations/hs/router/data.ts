import { authHeader1, secret1, authHeader2, authHeader3, secret3, secret2 } from '../maskedSecrets';
import { destination } from './config';
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
                  accessToken: secret1,
                  apiVersion: 'newApi',
                },
              },
              message: {
                type: 'identify',
                sentAt: '2022-08-23T05:59:38.214Z',
                traits: { to: { id: 1 }, from: { id: 9405415215 } },
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
              metadata: { jobId: 2, userId: 'u1' },
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
                headers: { 'Content-Type': 'application/json', Authorization: authHeader1 },
                params: {},
                body: {
                  JSON: { inputs: [{ to: { id: 1 }, from: { id: 9405415215 }, type: 'engineer' }] },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                ID: '123',
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
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
                    { identifierType: 'email', id: 'testhubspot2@email.com', type: 'HS-lead' },
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
                traits: { firstname: 'Test Hubspot', anonymousId: '12345', country: 'India' },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
              metadata: { jobId: 2, userId: 'u1' },
            },
            {
              message: {
                channel: 'web',
                context: {
                  mappedToDestination: true,
                  externalId: [
                    { identifierType: 'email', id: 'testhubspot@email.com', type: 'HS-lead' },
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
                traits: { firstname: 'Test Hubspot 1', anonymousId: '123451', country: 'India 1' },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
              metadata: { jobId: 3, userId: 'u1' },
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/update',
                headers: { 'Content-Type': 'application/json' },
                params: { hapikey: 'dummy-apikey' },
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
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/create',
                headers: { 'Content-Type': 'application/json' },
                params: { hapikey: 'dummy-apikey' },
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
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: { path: '', referrer: '', search: '', title: '', url: '' },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                  traits: { email: 'testhubspot2@email.com', firstname: 'Test Hubspot2' },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
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
              metadata: { jobId: 2, userId: 'u1' },
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                headers: { 'Content-Type': 'application/json' },
                userId: '00000000000000000000000000',
                params: { hapikey: 'dummy-apikey' },
                body: {
                  JSON: {
                    properties: [
                      { property: 'email', value: 'testhubspot3@email.com' },
                      { property: 'firstname', value: 'Test Hubspot3' },
                    ],
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
                statusCode: 200,
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: { path: '', referrer: '', search: '', title: '', url: '' },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 4, userId: 'u1' },
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                headers: { 'Content-Type': 'application/json' },
                params: { hapikey: 'dummy-apikey' },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: JSON.stringify([
                      {
                        email: 'testhubspot1@email.com',
                        properties: [{ property: 'firstname', value: 'Test Hubspot1' }],
                      },
                    ]),
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                headers: { 'Content-Type': 'application/json' },
                params: {
                  _a: 'dummy-hubId',
                  _n: 'test track event HS',
                  email: 'testhubspot2@email.com',
                  firstname: 'Test Hubspot2',
                },
                body: { JSON: {}, JSON_ARRAY: {}, XML: {}, FORM: {} },
                files: {},
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                endpoint: 'https://api.hubapi.com/contacts/v1/contact/batch/',
                headers: { 'Content-Type': 'application/json' },
                params: { hapikey: 'dummy-apikey' },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: JSON.stringify([
                      {
                        email: 'testhubspot3@email.com',
                        properties: [{ property: 'firstname', value: 'Test Hubspot3' }],
                      },
                    ]),
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                endpoint: 'https://api.hubapi.com/contacts/v1/contact/batch/',
                headers: { 'Content-Type': 'application/json' },
                params: { hapikey: 'dummy-apikey' },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: JSON.stringify([
                      {
                        email: 'testhubspot4@email.com',
                        properties: [{ property: 'firstname', value: 'Test Hubspot4' }],
                      },
                    ]),
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 4, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: { apiKey: 'dummy-apikey', hubID: 'dummy-hubId' },
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
                    { identifierType: 'email', id: 'testhubspot2@email.com', type: 'HS-lead' },
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
                traits: { firstname: 'Test Hubspot', anonymousId: '12345', country: 'India' },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
              metadata: { jobId: 2, userId: 'u1' },
            },
            {
              message: {
                channel: 'web',
                context: {
                  mappedToDestination: true,
                  externalId: [
                    { identifierType: 'email', id: 'testhubspot@email.com', type: 'HS-lead' },
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
                traits: { firstname: 'Test Hubspot 1', anonymousId: '123451', country: 'India 1' },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
              metadata: { jobId: 3, userId: 'u1' },
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
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
              metadata: { jobId: 4, userId: 'u1' },
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/update',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
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
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/lead/batch/create',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
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
                { jobId: 3, userId: 'u1' },
                { jobId: 4, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: { path: '', referrer: '', search: '', title: '', url: '' },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: { path: '', referrer: '', search: '', title: '', url: '' },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
                properties: { Revenue: 'name1' },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: { path: '', referrer: '', search: '', title: '', url: '' },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 4, userId: 'u1' },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  os: { name: '', version: '' },
                  screen: { density: 2 },
                  page: { path: '', referrer: '', search: '', title: '', url: '' },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: { jobId: 5, userId: 'u1' },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret1,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [
                    {
                      rsEventName: 'Purchase',
                      hubspotEventName: 'pedummy-hubId_rs_hub_test',
                      eventProperties: [
                        { from: 'Revenue', to: 'value' },
                        { from: 'Price', to: 'cost' },
                      ],
                    },
                    {
                      rsEventName: 'Order Complete',
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      eventProperties: [
                        { from: 'firstName', to: 'first_name' },
                        { from: 'lastName', to: 'last_name' },
                      ],
                    },
                  ],
                  eventFilteringOption: 'disable',
                  blacklistedEvents: [{ eventName: '' }],
                  whitelistedEvents: [{ eventName: '' }],
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
                  Authorization: 'Bearer hs1',
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
                  userId: 'u1',
                },
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'hs1',
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
                  Authorization: 'Bearer hs1',
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
                  userId: 'u1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'hs1',
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer hs1',
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
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
                  jobId: 4,
                  userId: 'u1',
                },
                {
                  jobId: 5,
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: 'hs1',
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
  {
    name: 'hs',
    description: 'getting duplicate records for secondary property',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    scenario: 'buisness',
    successCriteria:
      'should return 200 status code with contact needs to be updated and no email property',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                sentAt: '2024-03-19T18:46:36.348Z',
                traits: {
                  lastname: 'Peñarete',
                  firstname: 'Karen',
                },
                userId: 'secondary@email.com',
                channel: 'sources',
                context: {
                  externalId: [
                    {
                      id: 'secondary@email.com',
                      type: 'HS-contacts',
                      identifierType: 'email',
                    },
                  ],
                  mappedToDestination: 'true',
                },
                originalTimestamp: '2024-03-19T18:46:36.348Z',
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret3,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [],
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
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader3,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: { lastname: 'Peñarete', firstname: 'Karen' },
                        id: '103689',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  accessToken: secret3,
                  hubID: 'dummy-hubId',
                  apiKey: 'dummy-apikey',
                  apiVersion: 'newApi',
                  lookupField: 'email',
                  hubspotEvents: [],
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
    description: 'if dontBatch is true we are not going to create a batch out of those events',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    scenario: 'buisness',
    id: 'dontbatchtrue',
    successCriteria:
      'should not create a batch with the events if that events contains dontBatch true',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                sentAt: '2024-05-23T16:49:57.461+05:30',
                userId: 'sample_user_id425',
                channel: 'mobile',
                context: {
                  traits: {
                    age: '30',
                    name: 'John Sparrow',
                    email: 'identify425@test.com',
                    phone: '9112340425',
                    lastname: 'Sparrow',
                    firstname: 'John',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                timestamp: '2024-05-23T16:49:57.070+05:30',
                receivedAt: '2024-05-23T16:49:57.071+05:30',
                anonymousId: '8d872292709c6fbe',
              },
              metadata: {
                jobId: 1,
                sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                transformAt: 'router',
                workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                dontBatch: true,
              },
              destination: {
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                Name: 'hs-1',
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
              },
              request: {
                query: {},
              },
            },
            {
              message: {
                type: 'identify',
                sentAt: '2024-05-23T16:49:57.461+05:30',
                userId: 'sample_user_id738',
                channel: 'mobile',
                context: {
                  traits: {
                    age: '30',
                    name: 'John Sparrow738',
                    email: 'identify425@test.con',
                    phone: '9112340738',
                    lastname: 'Sparrow738',
                    firstname: 'John',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                timestamp: '2024-05-23T16:49:57.071+05:30',
                anonymousId: '8d872292709c6fbe738',
              },
              metadata: {
                userId: '<<>>8d872292709c6fbe738<<>>sample_user_id738',
                jobId: 2,
                sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                transformAt: 'router',
                workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                workerAssignedTime: '2024-05-23T16:49:58.569269+05:30',
                dontBatch: true,
              },
              destination: {
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                Name: 'hs-1',
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
              },
              request: {
                query: {},
              },
            },
            {
              message: {
                type: 'identify',
                sentAt: '2024-05-23T16:49:57.462+05:30',
                userId: 'sample_user_id803',
                channel: 'mobile',
                context: {
                  traits: {
                    age: '30',
                    name: 'John Sparrow803',
                    email: 'identify803@test.com',
                    phone: '9112340803',
                    lastname: 'Sparrow803',
                    firstname: 'John',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                anonymousId: '8d872292709c6fbe803',
                originalTimestamp: '2024-05-23T16:49:57.462+05:30',
              },
              metadata: {
                userId: '<<>>8d872292709c6fbe803<<>>sample_user_id803',
                jobId: 3,
                sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                transformAt: 'router',
                workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
              },
              destination: {
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                Name: 'hs-1',
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
              },
              request: {
                query: {},
              },
            },
            {
              message: {
                type: 'identify',
                sentAt: '2024-05-23T16:49:57.462+05:30',
                userId: 'sample_user_id804',
                channel: 'mobile',
                context: {
                  traits: {
                    age: '30',
                    name: 'John Sparrow804',
                    email: 'identify804@test.con',
                    phone: '9112340804',
                    lastname: 'Sparrow804',
                    firstname: 'John',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                anonymousId: '8d872292709c6fbe804',
                originalTimestamp: '2024-05-23T16:49:57.462+05:30',
              },
              metadata: {
                userId: '<<>>8d872292709c6fbe804<<>>sample_user_id804',
                jobId: 4,
                sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                transformAt: 'router',
                workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                dontBatch: false,
              },
              destination: {
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                Name: 'hs-1',
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
              },
              request: {
                query: {},
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
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          email: 'identify803@test.com',
                          firstname: 'John',
                          lastname: 'Sparrow803',
                          phone: '9112340803',
                        },
                      },
                      {
                        properties: {
                          email: 'identify804@test.con',
                          firstname: 'John',
                          lastname: 'Sparrow804',
                          phone: '9112340804',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
                files: {},
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                IsProcessorEnabled: true,
                Name: 'hs-1',
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
                Transformations: [],
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
              },
              metadata: [
                {
                  destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                  jobId: 3,
                  sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                  transformAt: 'router',
                  userId: '<<>>8d872292709c6fbe803<<>>sample_user_id803',
                  workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                },
                {
                  destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                  dontBatch: false,
                  jobId: 4,
                  sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                  transformAt: 'router',
                  userId: '<<>>8d872292709c6fbe804<<>>sample_user_id804',
                  workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    properties: {
                      email: 'identify425@test.com',
                      firstname: 'John',
                      lastname: 'Sparrow',
                      phone: '9112340425',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
                files: {},
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                IsProcessorEnabled: true,
                Name: 'hs-1',
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
                Transformations: [],
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
              },
              metadata: [
                {
                  destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                  dontBatch: true,
                  jobId: 1,
                  sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                  transformAt: 'router',
                  workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    properties: {
                      email: 'identify425@test.con',
                      firstname: 'John',
                      lastname: 'Sparrow738',
                      phone: '9112340738',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
                files: {},
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                IsProcessorEnabled: true,
                Name: 'hs-1',
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
                Transformations: [],
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
              },
              metadata: [
                {
                  destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                  dontBatch: true,
                  jobId: 2,
                  sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                  transformAt: 'router',
                  userId: '<<>>8d872292709c6fbe738<<>>sample_user_id738',
                  workerAssignedTime: '2024-05-23T16:49:58.569269+05:30',
                  workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'if dontBatch is not available we are considering those as dontbatch false',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    scenario: 'buisness',
    id: 'dontbatchundefined',
    successCriteria: 'all events should be batched',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                sentAt: '2024-05-23T16:49:57.461+05:30',
                userId: 'sample_user_id425',
                channel: 'mobile',
                context: {
                  traits: {
                    age: '30',
                    name: 'John Sparrow',
                    email: 'identify425@test.com',
                    phone: '9112340425',
                    lastname: 'Sparrow',
                    firstname: 'John',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                timestamp: '2024-05-23T16:49:57.070+05:30',
                receivedAt: '2024-05-23T16:49:57.071+05:30',
                anonymousId: '8d872292709c6fbe',
              },
              metadata: {
                jobId: 1,
                sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                transformAt: 'router',
                workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
              },
              destination: {
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                Name: 'hs-1',
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
              },
              request: {
                query: {},
              },
            },
            {
              message: {
                type: 'identify',
                sentAt: '2024-05-23T16:49:57.461+05:30',
                userId: 'sample_user_id738',
                channel: 'mobile',
                context: {
                  traits: {
                    age: '30',
                    name: 'John Sparrow738',
                    email: 'identify425@test.con',
                    phone: '9112340738',
                    lastname: 'Sparrow738',
                    firstname: 'John',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                timestamp: '2024-05-23T16:49:57.071+05:30',
                anonymousId: '8d872292709c6fbe738',
              },
              metadata: {
                userId: '<<>>8d872292709c6fbe738<<>>sample_user_id738',
                jobId: 2,
                sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                transformAt: 'router',
                workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                workerAssignedTime: '2024-05-23T16:49:58.569269+05:30',
              },
              destination: {
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                Name: 'hs-1',
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
              },
              request: {
                query: {},
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
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          email: 'identify425@test.com',
                          firstname: 'John',
                          lastname: 'Sparrow',
                          phone: '9112340425',
                        },
                      },
                      {
                        properties: {
                          email: 'identify425@test.con',
                          firstname: 'John',
                          lastname: 'Sparrow738',
                          phone: '9112340738',
                        },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
                files: {},
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                IsProcessorEnabled: true,
                Name: 'hs-1',
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
                Transformations: [],
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
              },
              metadata: [
                {
                  destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                  jobId: 1,
                  sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                  transformAt: 'router',
                  workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                },
                {
                  destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                  jobId: 2,
                  sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                  transformAt: 'router',
                  userId: '<<>>8d872292709c6fbe738<<>>sample_user_id738',
                  workerAssignedTime: '2024-05-23T16:49:58.569269+05:30',
                  workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'router job ordering ',
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
                    email: 'testhubspot1@email.com',
                    firstname: 'Test Hubspot1',
                  },
                },
                type: 'identify',
                userId: 'user1',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 1,
                userId: 'user1',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: { email: 'user1@a.com' },
                },
                type: 'track',
                anonymousId: '',
                userId: 'user1',
                event: 'purchase',
                properties: {
                  user_actual_role: 'system_admin, system_user',
                  user_actual_id: 12345,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 2,
                userId: 'user1',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: { traits: { email: 'user2@a.com' } },
                type: 'track',
                anonymousId: '',
                userId: 'user2',
                event: 'purchase2',
                properties: {
                  user_actual_role: 'system_admin_2, system_user',
                  user_actual_id: 12345,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 3,
                userId: 'user2',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testhubspot2@email.com',
                    firstname: 'Test Hubspot1',
                    anonymousId: '1111',
                  },
                },
                type: 'identify',
                anonymousId: '',
                userId: 'user2',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 4,
                userId: 'user2',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: { traits: { email: 'user3@a.com' } },
                type: 'track',
                anonymousId: '',
                userId: 'user3',
                event: 'purchase',
                properties: {
                  user_actual_role: 'system_admin, system_user',
                  user_actual_id: 12345,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 5,
                userId: 'user3',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testhubspot3@email.com',
                    firstname: 'Test Hubspot1',
                    anonymousId: '1111',
                  },
                },
                type: 'identify',
                anonymousId: '',
                userId: 'user3',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 6,
                userId: 'user3',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: { traits: { email: 'user4@a.com' } },
                type: 'track',
                anonymousId: '',
                userId: 'user4',
                event: 'purchase',
                properties: {
                  user_actual_role: 'system_admin, system_user',
                  user_actual_id: 12345,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 7,
                userId: 'user4',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testhubspot4@email.com',
                    firstname: 'Test Hubspot4',
                    anonymousId: '1111',
                  },
                },
                type: 'identify',
                anonymousId: '',
                userId: 'user4',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 8,
                userId: 'user4',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testhubspot5@email.com',
                    firstname: 'Test Hubspot51',
                    anonymousId: '1111',
                  },
                },
                type: 'identify',
                anonymousId: '',
                userId: 'user5',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 9,
                userId: 'user5',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: { traits: { email: 'user5@a.com' } },
                type: 'track',
                anonymousId: '',
                userId: 'user5',
                event: 'purchase',
                properties: {
                  user_actual_role: 'system_admin, system_user',
                  user_actual_id: 12345,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              metadata: {
                jobId: 10,
                userId: 'user5',
              },
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testhubspot5@email.com',
                    firstname: 'Test Hubspot5',
                    anonymousId: '1111',
                  },
                },
                type: 'identify',
                anonymousId: '',
                userId: 'user5',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: {
                jobId: 11,
                userId: 'user5',
              },
              destination,
            },
          ],
          destType: 'hs',
        },
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
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          email: 'testhubspot1@email.com',
                          firstname: 'Test Hubspot1',
                        },
                      },
                      {
                        properties: {
                          email: 'testhubspot5@email.com',
                          firstname: 'Test Hubspot51',
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
                  userId: 'user1',
                },
                {
                  jobId: 9,
                  userId: 'user5',
                },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/events/v3/send',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    email: 'user1@a.com',
                    eventName: 'pedummy-hubId_rs_hub_test',
                    properties: {},
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
                  userId: 'user1',
                },
              ],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/events/v3/send',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    email: 'user2@a.com',
                    eventName: 'pedummy-hubId_rs_hub_test',
                    properties: {},
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
                  userId: 'user2',
                },
              ],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/events/v3/send',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    email: 'user3@a.com',
                    eventName: 'pedummy-hubId_rs_hub_test',
                    properties: {},
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 5,
                  userId: 'user3',
                },
              ],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/events/v3/send',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    email: 'user4@a.com',
                    eventName: 'pedummy-hubId_rs_hub_test',
                    properties: {},
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 7,
                  userId: 'user4',
                },
              ],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/events/v3/send',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    email: 'user5@a.com',
                    eventName: 'pedummy-hubId_rs_hub_test',
                    properties: {},
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 10,
                  userId: 'user5',
                },
              ],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: authHeader1,
                },
                params: {},
                body: {
                  JSON: {
                    inputs: [
                      {
                        properties: {
                          email: 'testhubspot2@email.com',
                          firstname: 'Test Hubspot1',
                        },
                      },
                      {
                        properties: {
                          email: 'testhubspot3@email.com',
                          firstname: 'Test Hubspot1',
                        },
                      },
                      {
                        properties: {
                          email: 'testhubspot4@email.com',
                          firstname: 'Test Hubspot4',
                        },
                      },
                      {
                        properties: {
                          email: 'testhubspot5@email.com',
                          firstname: 'Test Hubspot5',
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
                  jobId: 4,
                  userId: 'user2',
                },
                {
                  jobId: 6,
                  userId: 'user3',
                },
                {
                  jobId: 8,
                  userId: 'user4',
                },
                {
                  jobId: 11,
                  userId: 'user5',
                },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'test when get properties call failed',
    feature: 'router',
    module: 'destination',
    id: 'routerGetPropertiesCallFailed',
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
                    { identifierType: 'email', id: 'testhubspot2@email.com', type: 'HS-lead' },
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
                traits: { firstname: 'Test Hubspot', anonymousId: '12345', country: 'India' },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: { apiKey: 'invalid-api-key', hubID: 'dummy-hubId' },
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
              metadata: { jobId: 2, userId: 'u1' },
            },
            {
              message: {
                channel: 'web',
                context: {
                  mappedToDestination: true,
                  externalId: [
                    { identifierType: 'email', id: 'testhubspot@email.com', type: 'HS-lead' },
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
                traits: { firstname: 'Test Hubspot 1', anonymousId: '123451', country: 'India 1' },
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                integrations: { All: true },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              destination: {
                Config: { apiKey: 'invalid-api-key', hubID: 'dummy-hubId' },
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
              metadata: { jobId: 3, userId: 'u1' },
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
              batched: false,
              destination: {
                Config: {
                  apiKey: 'invalid-api-key',
                  hubID: 'dummy-hubId',
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                createdAt: '2020-12-30T08:39:32.005Z',
                deleted: false,
                destinationDefinition: {
                  createdAt: '2020-04-09T09:24:31.794Z',
                  displayName: 'Hubspot',
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                enabled: true,
                isConnectionEnabled: true,
                isProcessorEnabled: true,
                name: 'Hubspot',
                secretConfig: {},
                transformations: [],
                updatedAt: '2021-02-03T16:22:31.374Z',
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
              error: JSON.stringify({
                message:
                  'Failed to get hubspot properties: {"status":"error","message":"The API key provided is invalid. View or manage your API key here: https://app.hubspot.com/l/api-key/","correlationId":"correlation-id","category":"INVALID_AUTHENTICATION","links":{"api key":"https://app.hubspot.com/l/api-key/"}}',
                destinationResponse: {
                  response: {
                    status: 'error',
                    message:
                      'The API key provided is invalid. View or manage your API key here: https://app.hubspot.com/l/api-key/',
                    correlationId: 'correlation-id',
                    category: 'INVALID_AUTHENTICATION',
                    links: {
                      'api key': 'https://app.hubspot.com/l/api-key/',
                    },
                  },
                  status: 401,
                },
              }),
              metadata: [
                {
                  jobId: 2,
                  userId: 'u1',
                },
              ],
              statTags: {
                destType: 'HS',
                errorCategory: 'network',
                errorType: 'aborted',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 401,
            },
            {
              batched: false,
              destination: {
                Config: {
                  apiKey: 'invalid-api-key',
                  hubID: 'dummy-hubId',
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                createdAt: '2020-12-30T08:39:32.005Z',
                deleted: false,
                destinationDefinition: {
                  createdAt: '2020-04-09T09:24:31.794Z',
                  displayName: 'Hubspot',
                  id: '1aIXqM806xAVm92nx07YwKbRrO9',
                  name: 'HS',
                  updatedAt: '2021-01-11T11:03:28.103Z',
                },
                enabled: true,
                isConnectionEnabled: true,
                isProcessorEnabled: true,
                name: 'Hubspot',
                secretConfig: {},
                transformations: [],
                updatedAt: '2021-02-03T16:22:31.374Z',
                workspaceId: '1TSN08muJTZwH8iCDmnnRt1pmLd',
              },
              error: JSON.stringify({
                message:
                  'Failed to get hubspot properties: {"status":"error","message":"The API key provided is invalid. View or manage your API key here: https://app.hubspot.com/l/api-key/","correlationId":"correlation-id","category":"INVALID_AUTHENTICATION","links":{"api key":"https://app.hubspot.com/l/api-key/"}}',
                destinationResponse: {
                  response: {
                    status: 'error',
                    message:
                      'The API key provided is invalid. View or manage your API key here: https://app.hubspot.com/l/api-key/',
                    correlationId: 'correlation-id',
                    category: 'INVALID_AUTHENTICATION',
                    links: {
                      'api key': 'https://app.hubspot.com/l/api-key/',
                    },
                  },
                  status: 401,
                },
              }),
              metadata: [
                {
                  jobId: 3,
                  userId: 'u1',
                },
              ],
              statTags: {
                destType: 'HS',
                errorCategory: 'network',
                errorType: 'aborted',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 401,
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'test when email is of wrong format',
    feature: 'router',
    module: 'destination',
    id: 'emailfailsValidation',
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
                    email: 'incorrect-email',
                    firstname: 'Test Hubspot',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                },
                type: 'identify',
                messageId: 'e8585d9a-7137-4223-b295-68ab1b17dad7',
                originalTimestamp: '2025-01-01T09:35:31.289Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: '',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
              destination: {
                Config: {
                  authorizationType: 'newPrivateAppApi',
                  hubID: '',
                  apiKey: '',
                  accessToken: secret1,
                  apiVersion: 'newApi',
                  lookupField: 'lookupField',
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
                Enabled: true,
              },
              metadata: { jobId: 3, userId: 'u1' },
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
              batched: false,
              destination: {
                Config: {
                  accessToken: secret1,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  eventFilteringOption: 'disable',
                  hubID: '',
                  lookupField: 'lookupField',
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                },
                Enabled: true,
              },
              error: 'Email "incorrect-email" is invalid',
              metadata: [
                {
                  jobId: 3,
                  userId: 'u1',
                },
              ],
              statTags: {
                destType: 'HS',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
  {
    name: 'hs',
    description: 'if dontBatch is true we should use patch request method for update for retl flow',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    scenario: 'buisness',
    id: 'dontbatchtrueid',
    successCriteria:
      'should not create a batch with the events if that events contains dontBatch true',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                sentAt: '2024-05-23T16:49:57.461+05:30',
                userId: 'identify425@test.com',
                channel: 'mobile',
                context: {
                  traits: {
                    age: '30',
                    name: 'John Sparrow',
                    email: 'identify425@test.com',
                    phone: '9112340425',
                    lastname: 'Sparrow',
                    firstname: 'John',
                  },
                  context: {
                    sources: {
                      job_id: '2qY238MjR41Cn1pnO5kSK0Metno',
                      version: 'v1.60.8',
                      job_run_id: 'cus0gkdes5sukm8iqqh0',
                      task_run_id: 'cus0gkdes5sukm8iqqig',
                    },
                    externalId: [
                      {
                        id: 'identify425@test.com',
                        type: 'HS-contacts',
                        identifierType: 'email',
                      },
                    ],
                    mappedToDestination: 'true',
                  },
                  userAgent:
                    'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
                },
                timestamp: '2024-05-23T16:49:57.070+05:30',
                receivedAt: '2024-05-23T16:49:57.071+05:30',
                anonymousId: '8d872292709c6fbe',
              },
              metadata: {
                jobId: 1,
                sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                transformAt: 'router',
                workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                dontBatch: true,
              },
              destination: {
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                Name: 'hs-1',
                Config: {
                  accessToken: secret2,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
              },
              request: {
                query: {},
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
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    properties: {
                      email: 'identify425@test.com',
                      firstname: 'John',
                      lastname: 'Sparrow',
                      phone: '9112340425',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/103604',
                files: {},
                headers: {
                  Authorization: authHeader2,
                  'Content-Type': 'application/json',
                },
                method: 'PATCH',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
                Config: {
                  accessToken: secret2,
                  apiKey: '',
                  apiVersion: 'newApi',
                  authorizationType: 'newPrivateAppApi',
                  blacklistedEvents: [],
                  connectionMode: 'cloud',
                  doAssociation: false,
                  eventDelivery: false,
                  eventDeliveryTS: 1687884567403,
                  eventFilteringOption: 'disable',
                  hubID: '25092171',
                  hubspotEvents: [
                    {
                      eventProperties: [
                        {
                          from: 'first_name',
                          to: 'first_name',
                        },
                        {
                          from: 'last_name',
                          to: 'last_name',
                        },
                      ],
                      hubspotEventName: 'pedummy-hubId_rs_hub_chair',
                      rsEventName: 'Order Complete',
                    },
                  ],
                  lookupField: 'email',
                  useNativeSDK: false,
                  whitelistedEvents: [],
                },
                Enabled: true,
                ID: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                IsProcessorEnabled: true,
                Name: 'hs-1',
                RevisionID: '2gqf7Mc7WEwqQtQy3G105O22s3D',
                Transformations: [],
                WorkspaceID: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
              },
              metadata: [
                {
                  destinationId: '2RnSBhn4zPTOF8NdqAIrnVPPnfr',
                  dontBatch: true,
                  jobId: 1,
                  sourceId: '2RnN36pc7p5lzoApxZnDfRnYFx0',
                  transformAt: 'router',
                  workspaceId: '2QapBTEvZYwuf6O9KB5AEvvBt8j',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
