import { Destination } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { routerRequestV2 } from './commonConfig';
import { generateMetadata } from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'klaviyo',
  DestinationDefinition: {
    ID: '123',
    Name: 'klaviyo',
    DisplayName: 'klaviyo',
    Config: {},
  },
  Config: {
    privateApiKey: 'dummyPrivateApiKey',
    apiVersion: 'v2',
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};
const userProfileCommonEndpoint = 'https://a.klaviyo.com/api/profile-import';

const headers = {
  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2024-06-15',
};
const subscriptionRelations = {
  list: {
    data: {
      type: 'list',
      id: 'XUepkK',
    },
  },
};

export const dataV2: RouterTestData[] = [
  {
    id: 'klaviyo-router-150624-test-1',
    name: 'klaviyo',
    description: '150624 -> Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria: 'All the subscription events should be batched',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequestV2,
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
                endpoint: userProfileCommonEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'profile',
                      attributes: {
                        external_id: 'test',
                        email: 'test_1@rudderstack.com',
                        first_name: 'Test',
                        last_name: 'Rudderlabs',
                        phone_number: '+12 345 578 900',
                        anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                        title: 'Developer',
                        organization: 'Rudder',
                        location: {
                          city: 'Tokyo',
                          region: 'Kanto',
                          country: 'JP',
                          zip: '100-0001',
                        },
                        properties: { Flagged: false, Residence: 'Shibuya' },
                      },
                      meta: {
                        patch_properties: {},
                      },
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: userProfileCommonEndpoint,
                  headers,
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'test',
                          email: 'test@rudderstack.com',
                          first_name: 'Test',
                          last_name: 'Rudderlabs',
                          phone_number: '+12 345 578 900',
                          anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                          title: 'Developer',
                          organization: 'Rudder',
                          location: {
                            city: 'Tokyo',
                            region: 'Kanto',
                            country: 'JP',
                            zip: '100-0001',
                          },
                          properties: { Flagged: false, Residence: 'Shibuya' },
                        },
                        meta: {
                          patch_properties: {},
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                  headers,
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-create-job',
                        attributes: {
                          profiles: {
                            data: [
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'test@rudderstack.com',
                                  phone_number: '+12 345 578 900',
                                  subscriptions: {
                                    email: { marketing: { consent: 'SUBSCRIBED' } },
                                    sms: { marketing: { consent: 'SUBSCRIBED' } },
                                  },
                                },
                              },
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'test@rudderstack.com',
                                  phone_number: '+12 345 678 900',
                                  subscriptions: {
                                    email: { marketing: { consent: 'SUBSCRIBED' } },
                                  },
                                },
                              },
                            ],
                          },
                        },
                        relationships: subscriptionRelations,
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(2), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(4)],
              batched: false,
              statusCode: 400,
              error: 'Event type random is not supported',
              statTags: {
                destType: 'KLAVIYO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
              },
              destination,
            },
            {
              metadata: [generateMetadata(5)],
              batched: false,
              statusCode: 400,
              error: 'groupId is a required field for group events',
              statTags: {
                destType: 'KLAVIYO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
              },
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'klaviyo-router-150624-test-2',
    name: 'klaviyo',
    description:
      '150624 -> Router tests to have some anonymous track event, some identify events with subscription and some identified track event',
    scenario: 'Framework',
    successCriteria:
      'All the subscription events should be batched and respective profile requests should also be placed in same batched request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                // user 1 track call with userId and anonymousId
                channel: 'web',
                context: {
                  traits: {
                    email: 'testklaviyo1@email.com',
                    firstname: 'Test Klaviyo 1',
                  },
                },
                type: 'track',
                anonymousId: 'anonTestKlaviyo1',
                userId: 'testKlaviyo1',
                event: 'purchase',
                properties: {
                  price: '12',
                },
              },
              metadata: generateMetadata(1),
              destination,
            },
            {
              message: {
                // Anonymous Tracking -> user 2 track call with anonymousId only
                channel: 'web',
                context: {
                  traits: {},
                },
                type: 'track',
                anonymousId: 'anonTestKlaviyo2',
                event: 'viewed product',
                properties: {
                  price: '120',
                },
              },
              metadata: generateMetadata(2),
              destination,
            },
            {
              message: {
                // user 2 idenitfy call with anonymousId and subscription
                channel: 'web',
                traits: {
                  email: 'testklaviyo2@rs.com',
                  firstname: 'Test Klaviyo 2',
                  properties: {
                    subscribe: true,
                    listId: 'configListId',
                    consent: ['email'],
                  },
                },
                context: {},
                anonymousId: 'anonTestKlaviyo2',
                type: 'identify',
                userId: 'testKlaviyo2',
                integrations: {
                  All: true,
                },
              },
              metadata: generateMetadata(3),
              destination,
            },
            {
              message: {
                // user 2 track call with email only
                channel: 'web',
                context: {
                  traits: {
                    email: 'testklaviyo2@email.com',
                    firstname: 'Test Klaviyo 2',
                  },
                },
                type: 'track',
                userId: 'testKlaviyo2',
                event: 'purchase',
                properties: {
                  price: '120',
                },
              },
              metadata: generateMetadata(4),
              destination,
            },
            {
              message: {
                // for user 3 identify call without anonymousId and subscriptiontraits:
                channel: 'web',
                traits: {
                  email: 'testklaviyo3@rs.com',
                  firstname: 'Test Klaviyo 3',
                  properties: {
                    subscribe: true,
                    listId: 'configListId',
                    consent: ['email', 'sms'],
                  },
                },
                context: {},
                type: 'identify',
                userId: 'testKlaviyo3',
                integrations: {
                  All: true,
                },
              },
              metadata: generateMetadata(5),
              destination,
            },
            {
              message: {
                channel: 'web',
                context: {
                  traits: {
                    email: 'testklaviyo3@email.com',
                    firstname: 'Test klaviyo3',
                    anonymousId: '1111',
                  },
                },
                type: 'identify',
                anonymousId: '',
                userId: 'testKlaviyo3',
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: generateMetadata(6),
              destination,
            },
          ],
          destType: 'klaviyo',
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
                endpoint: 'https://a.klaviyo.com/api/events',
                headers: {
                  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-06-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        properties: {
                          price: '120',
                        },
                        profile: {
                          data: {
                            type: 'profile',
                            attributes: {
                              anonymous_id: 'anonTestKlaviyo2',
                              properties: {},
                              meta: {
                                patch_properties: {},
                              },
                            },
                          },
                        },
                        metric: {
                          data: {
                            type: 'metric',
                            attributes: {
                              name: 'viewed product',
                            },
                          },
                        },
                      },
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://a.klaviyo.com/api/profile-import',
                headers: {
                  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-06-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'profile',
                      attributes: {
                        external_id: 'testKlaviyo3',
                        email: 'testklaviyo3@email.com',
                        first_name: 'Test klaviyo3',
                        properties: {},
                      },
                      meta: {
                        patch_properties: {},
                      },
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(6)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-import',
                  headers: {
                    Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-06-15',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'testKlaviyo2',
                          anonymous_id: 'anonTestKlaviyo2',
                          email: 'testklaviyo2@rs.com',
                          first_name: 'Test Klaviyo 2',
                          properties: {},
                        },
                        meta: {
                          patch_properties: {},
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-import',
                  headers: {
                    Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-06-15',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'testKlaviyo3',
                          email: 'testklaviyo3@rs.com',
                          first_name: 'Test Klaviyo 3',
                          properties: {},
                        },
                        meta: {
                          patch_properties: {},
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                  headers: {
                    Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2024-06-15',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-create-job',
                        attributes: {
                          profiles: {
                            data: [
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'testklaviyo2@rs.com',
                                  subscriptions: {
                                    email: {
                                      marketing: {
                                        consent: 'SUBSCRIBED',
                                      },
                                    },
                                  },
                                },
                              },
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'testklaviyo3@rs.com',
                                  subscriptions: {
                                    email: {
                                      marketing: {
                                        consent: 'SUBSCRIBED',
                                      },
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        },
                        relationships: {
                          list: {
                            data: {
                              type: 'list',
                              id: 'configListId',
                            },
                          },
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(3), generateMetadata(5)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://a.klaviyo.com/api/events',
                headers: {
                  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-06-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        properties: {
                          price: '12',
                        },
                        profile: {
                          data: {
                            type: 'profile',
                            attributes: {
                              external_id: 'testKlaviyo1',
                              anonymous_id: 'anonTestKlaviyo1',
                              email: 'testklaviyo1@email.com',
                              first_name: 'Test Klaviyo 1',
                              properties: {},
                              meta: {
                                patch_properties: {},
                              },
                            },
                          },
                        },
                        metric: {
                          data: {
                            type: 'metric',
                            attributes: {
                              name: 'purchase',
                            },
                          },
                        },
                      },
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://a.klaviyo.com/api/events',
                headers: {
                  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-06-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        properties: {
                          price: '120',
                        },
                        profile: {
                          data: {
                            type: 'profile',
                            attributes: {
                              external_id: 'testKlaviyo2',
                              email: 'testklaviyo2@email.com',
                              first_name: 'Test Klaviyo 2',
                              properties: {},
                              meta: {
                                patch_properties: {},
                              },
                            },
                          },
                        },
                        metric: {
                          data: {
                            type: 'metric',
                            attributes: {
                              name: 'purchase',
                            },
                          },
                        },
                      },
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(4)],
              batched: false,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
];
