import { Destination, RouterTransformationRequestData } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { routerRequestV2 } from './commonConfig';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { secret1, authHeader1 } from '../maskedSecrets';

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
    privateApiKey: secret1,
    apiVersion: 'v2',
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};
const userProfileCommonEndpoint = 'https://a.klaviyo.com/api/profile-import';

const headers = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2024-10-15',
};
const subscriptionRelations = {
  list: {
    data: {
      type: 'list',
      id: 'XUepkK',
    },
  },
};

const commonOutputSubscriptionProps = {
  profiles: {
    data: [
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
};

const alreadyTransformedEvent = {
  message: {
    output: transformResultBuilder({
      JSON: {
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: commonOutputSubscriptionProps,
          relationships: subscriptionRelations,
        },
      },
      endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
      headers: headers,
      method: 'POST',
      userId: '',
    }),
    statusCode: 200,
  },
  metadata: generateMetadata(10),
  destination,
} as unknown as RouterTransformationRequestData;

export const dataV2: RouterTestData[] = [
  {
    id: 'klaviyo-router-150624-test-1',
    name: 'klaviyo',
    description: '150624 -> Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria:
      'All the subscription events from same type of call should be batched. This case does not contain any events which can be batched',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequestV2,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              // identify 2 with subscriptipon request
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
              metadata: [generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              // identify 1
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
              ],
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              // group call subscription request
              batchedRequest: [
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
              metadata: [generateMetadata(3)],
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
    description: '150624 -> Router Test to test batching based upon same message type',
    scenario: 'Framework',
    successCriteria:
      'All the subscription events from same type of call should be batched. This case does not contain any events which can be batched',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              metadata: generateMetadata(1),
              message: {
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                userId: 'test',
                channel: 'web',
                context: {
                  os: { name: '', version: '' },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  traits: {
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                    email: 'test_1@rudderstack.com',
                    phone: '+12 345 578 900',
                    userId: 'Testc',
                    title: 'Developer',
                    organization: 'Rudder',
                    city: 'Tokyo',
                    region: 'Kanto',
                    country: 'JP',
                    zip: '100-0001',
                    Flagged: false,
                    Residence: 'Shibuya',
                    properties: { listId: 'XUepkK', subscribe: true, consent: ['email'] },
                  },
                  locale: 'en-US',
                  screen: { density: 2 },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                integrations: { All: true },
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
            {
              destination,
              metadata: generateMetadata(2),
              message: {
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                userId: 'test',
                channel: 'web',
                context: {
                  os: { name: '', version: '' },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  traits: {
                    firstName: 'Test',
                    lastName: 'Rudderlabs',
                    email: 'test@rudderstack.com',
                    phone: '+12 345 578 900',
                    userId: 'test',
                    title: 'Developer',
                    organization: 'Rudder',
                    city: 'Tokyo',
                    region: 'Kanto',
                    country: 'JP',
                    zip: '100-0001',
                    Flagged: false,
                    Residence: 'Shibuya',
                    properties: { listId: 'XUepkK', subscribe: true, consent: ['email', 'sms'] },
                  },
                  locale: 'en-US',
                  screen: { density: 2 },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                integrations: { All: true },
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
          ],
          destType: 'klaviyo',
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
              // profile for identify 1
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
                // profile for identify 2
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
                // subscriptiopn for both identify 1 and 2
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
                                  email: 'test_1@rudderstack.com',
                                  phone_number: '+12 345 578 900',
                                  subscriptions: {
                                    email: { marketing: { consent: 'SUBSCRIBED' } },
                                  },
                                },
                              },
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
              metadata: [generateMetadata(1), generateMetadata(2)],
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
    id: 'klaviyo-router-150624-test-3',
    name: 'klaviyo',
    description:
      '150624 -> Router tests to have some anonymous track event, some identify events with subscription and some identified track event',
    scenario: 'Framework',
    successCriteria:
      'All the subscription events under same message type should be batched and respective profile requests should also be placed in same batched request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            alreadyTransformedEvent,
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
                messageId: 'someTrackMessageId1',
                anonymousId: 'anonTestKlaviyo1',
                userId: 'testKlaviyo1',
                event: 'purchase',
                properties: {
                  price: '12',
                },
              },
              metadata: generateMetadata(1, 'testKlaviyo1'),
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
                messageId: 'someTrackMessageId2',
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
              metadata: generateMetadata(3, 'testKlaviyo2'),
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
                messageId: 'someTrackMessageId3',
                userId: 'testKlaviyo2',
                event: 'purchase',
                properties: {
                  price: '120',
                },
              },
              metadata: generateMetadata(4, 'testKlaviyo2'),
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
              metadata: generateMetadata(5, 'testKlaviyo3'),
              destination,
            },
          ],
          destType: 'klaviyo',
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
              batchedRequest: transformResultBuilder({
                JSON: {
                  data: {
                    type: 'profile-subscription-bulk-create-job',
                    attributes: commonOutputSubscriptionProps,
                    relationships: subscriptionRelations,
                  },
                },
                endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                headers: headers,
                method: 'POST',
                userId: '',
              }),
              metadata: [generateMetadata(10)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              // user 1 track call with userId and anonymousId
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://a.klaviyo.com/api/events',
                headers: {
                  Authorization: authHeader1,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-10-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        unique_id: 'someTrackMessageId1',
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
              metadata: [generateMetadata(1, 'testKlaviyo1')],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              // anonn event for user 2
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://a.klaviyo.com/api/events',
                headers: {
                  Authorization: authHeader1,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-10-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        unique_id: 'someTrackMessageId2',
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
              // identify call for user 2 and user 3 with subscription
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-import',
                  headers: {
                    Authorization: authHeader1,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-10-15',
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
                    Authorization: authHeader1,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-10-15',
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
                    Authorization: authHeader1,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2024-10-15',
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
              metadata: [generateMetadata(3, 'testKlaviyo2'), generateMetadata(5, 'testKlaviyo3')],
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
                  Authorization: authHeader1,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-10-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        unique_id: 'someTrackMessageId3',
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
              metadata: [generateMetadata(4, 'testKlaviyo2')],
              batched: false,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'klaviyo-router-150624-test-4',
    name: 'klaviyo',
    description: '150624 -> Retl Router tests to have retl ',
    scenario: 'Framework',
    successCriteria:
      'All the subscription events with same message type should be batched and respective profile requests should also be placed in same batched request',
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
                  mappedToDestination: 'true',
                  externalId: [
                    {
                      id: 'testklaviyo1@email.com',
                      identifierType: 'email',
                      type: 'KLAVIYO-profile_v2',
                    },
                  ],
                  traits: {
                    properties: {
                      subscribe: false,
                    },
                    email: 'testklaviyo1@email.com',
                    firstname: 'Test Klaviyo 1',
                  },
                },
                type: 'identify',
                anonymousId: 'anonTestKlaviyo1',
                userId: 'testKlaviyo1',
              },
              metadata: generateMetadata(1),
              destination,
            },
            {
              message: {
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
                context: {
                  mappedToDestination: 'true',
                  externalId: [
                    {
                      id: 'testklaviyo2@rs.com',
                      identifierType: 'email',
                      type: 'KLAVIYO-profile_v2',
                    },
                  ],
                },
                anonymousId: 'anonTestKlaviyo2',
                type: 'identify',
                userId: 'testKlaviyo2',
                integrations: {
                  All: true,
                },
              },
              metadata: generateMetadata(2),
              destination,
            },
          ],
          destType: 'klaviyo',
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
                  endpoint: 'https://a.klaviyo.com/api/profile-import',
                  headers: {
                    Authorization: authHeader1,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-10-15',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'testklaviyo2@rs.com',
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
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                  headers: {
                    Authorization: authHeader1,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2024-10-15',
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
              metadata: [generateMetadata(2)],
              batched: true,
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
                    Authorization: authHeader1,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-10-15',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'testklaviyo1@email.com',
                          anonymous_id: 'anonTestKlaviyo1',
                          email: 'testklaviyo1@email.com',
                          first_name: 'Test Klaviyo 1',
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
              ],
              metadata: [generateMetadata(1)],
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
    id: 'klaviyo-router-150624-test-5',
    name: 'klaviyo',
    description: '150624 -> Only Identify calls with some subcribe and some unsubscribe operation',
    scenario: 'Framework',
    successCriteria:
      'All the subscription events with same listId should be batched and same for unsubscribe as well.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                // user 1 idenitfy call with anonymousId and subscription as true
                channel: 'web',
                traits: {
                  email: 'testklaviyo1@rs.com',
                  firstname: 'Test Klaviyo 1',
                  properties: {
                    subscribe: true,
                    listId: 'configListId',
                    consent: ['email'],
                  },
                },
                context: {},
                anonymousId: 'anonTestKlaviyo1',
                type: 'identify',
                userId: 'testKlaviyo1',
                integrations: {
                  All: true,
                },
              },
              metadata: generateMetadata(1, 'testKlaviyo1'),
              destination,
            },
            {
              message: {
                // user 2 idenitfy call with no anonymousId and subscription as true
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
                type: 'identify',
                userId: 'testKlaviyo2',
                integrations: {
                  All: true,
                },
              },
              metadata: generateMetadata(2, 'testKlaviyo2'),
              destination,
            },
            {
              message: {
                // user 3 idenitfy call with no anonymousId and subscription as false
                channel: 'web',
                traits: {
                  email: 'testklaviyo3@rs.com',
                  firstname: 'Test Klaviyo 3',
                  properties: {
                    subscribe: false,
                    listId: 'configListId',
                    consent: ['email'],
                  },
                },
                context: {},
                type: 'identify',
                userId: 'testKlaviyo3',
                integrations: {
                  All: true,
                },
              },
              metadata: generateMetadata(3, 'testKlaviyo3'),
              destination,
            },
            {
              message: {
                // user 4 idenitfy call with anonymousId and subscription as false
                channel: 'web',
                traits: {
                  email: 'testklaviyo4@rs.com',
                  firstname: 'Test Klaviyo 4',
                  properties: {
                    subscribe: false,
                    listId: 'configListId',
                    consent: ['email'],
                  },
                },
                context: {},
                type: 'identify',
                anonymousId: 'anon id 4',
                userId: 'testKlaviyo4',
                integrations: {
                  All: true,
                },
              },
              metadata: generateMetadata(4, 'testKlaviyo4'),
              destination,
            },
          ],
          destType: 'klaviyo',
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
              // 2 identify calls and one batched subscription request for user 1 and user 2
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
                          external_id: 'testKlaviyo1',
                          email: 'testklaviyo1@rs.com',
                          first_name: 'Test Klaviyo 1',
                          anonymous_id: 'anonTestKlaviyo1',
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
                  endpoint: userProfileCommonEndpoint,
                  headers,
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'testKlaviyo2',
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
                                  email: 'testklaviyo1@rs.com',
                                  subscriptions: {
                                    email: { marketing: { consent: 'SUBSCRIBED' } },
                                  },
                                },
                              },
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'testklaviyo2@rs.com',
                                  subscriptions: {
                                    email: { marketing: { consent: 'SUBSCRIBED' } },
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
              metadata: [generateMetadata(1, 'testKlaviyo1'), generateMetadata(2, 'testKlaviyo2')],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              // 2 identify calls and one batched unsubscription request for user 3 and user 4
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
                  endpoint: userProfileCommonEndpoint,
                  headers,
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'testKlaviyo4',
                          email: 'testklaviyo4@rs.com',
                          first_name: 'Test Klaviyo 4',
                          anonymous_id: 'anon id 4',
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
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-delete-jobs',
                  headers,
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-delete-job',
                        attributes: {
                          profiles: {
                            data: [
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'testklaviyo3@rs.com',
                                },
                              },
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'testklaviyo4@rs.com',
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
              metadata: [generateMetadata(3, 'testKlaviyo3'), generateMetadata(4, 'testKlaviyo4')],
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
    id: 'klaviyo-router-150624-test-6',
    name: 'klaviyo',
    description:
      '150624 -> Router tests to have some anonymous track event, some identify events with unsubscription and some identified track event',
    scenario: 'Framework',
    successCriteria:
      'All the unsubscription events under same message type should be batched and respective profile requests should also be placed in same batched request',
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
                messageId: 'someTrackMessageId1',
                anonymousId: 'anonTestKlaviyo1',
                userId: 'testKlaviyo1',
                event: 'purchase',
                properties: {
                  price: '12',
                },
              },
              metadata: generateMetadata(1, 'testKlaviyo1'),
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
                messageId: 'someTrackMessageId2',
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
                    subscribe: false,
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
              metadata: generateMetadata(3, 'testKlaviyo2'),
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
                messageId: 'someTrackMessageId3',
                userId: 'testKlaviyo2',
                event: 'purchase',
                properties: {
                  price: '120',
                },
              },
              metadata: generateMetadata(4, 'testKlaviyo2'),
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
                    subscribe: false,
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
              metadata: generateMetadata(5, 'testKlaviyo3'),
              destination,
            },
          ],
          destType: 'klaviyo',
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
              // user 1 track call with userId and anonymousId
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://a.klaviyo.com/api/events',
                headers: {
                  Authorization: authHeader1,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-10-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        unique_id: 'someTrackMessageId1',
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
              metadata: [generateMetadata(1, 'testKlaviyo1')],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              // anonn event for user 2
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://a.klaviyo.com/api/events',
                headers: {
                  Authorization: authHeader1,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-10-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        unique_id: 'someTrackMessageId2',
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
              // identify call for user 2 and user 3 with subscription
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-import',
                  headers: {
                    Authorization: authHeader1,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-10-15',
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
                    Authorization: authHeader1,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    revision: '2024-10-15',
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
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-delete-jobs',
                  headers: {
                    Authorization: authHeader1,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2024-10-15',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-delete-job',
                        attributes: {
                          profiles: {
                            data: [
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'testklaviyo2@rs.com',
                                },
                              },
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'testklaviyo3@rs.com',
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
              metadata: [generateMetadata(3, 'testKlaviyo2'), generateMetadata(5, 'testKlaviyo3')],
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
                  Authorization: authHeader1,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  revision: '2024-10-15',
                },
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'event',
                      attributes: {
                        unique_id: 'someTrackMessageId3',
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
              metadata: [generateMetadata(4, 'testKlaviyo2')],
              batched: false,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'klaviyo-router-150624-test-7',
    name: 'klaviyo',
    description:
      '150624 -> Router tests to check for invalid phone number format in identify and track calls and should throw error',
    scenario: 'Framework',
    successCriteria: 'Should throw invalid phone number error for identify and track calls',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                userId: 'user123',
                type: 'identify',
                traits: { subscribe: true },
                context: {
                  traits: {
                    email: 'test@rudderstack.com',
                    phone: '123321000',
                    consent: 'email',
                  },
                  ip: '14.5.67.21',
                  library: { name: 'http' },
                },
                timestamp: '2020-01-21T00:21:34.208Z',
              },
              destination,
              metadata: generateMetadata(1),
            },
            {
              message: {
                type: 'track',
                event: 'TestEven001',
                sentAt: '2025-01-01T11:11:11.111Z',
                userId: 'invalidPhoneUser',
                context: {
                  traits: {
                    name: 'Test',
                    email: 'test@rudderstack.com',
                    phone: '9112340375',
                  },
                },
                properties: {
                  price: 120,
                },
                messageId: 'someTrackMessageId1',
                originalTimestamp: '2025-01-01T11:11:11.111Z',
              },
              metadata: generateMetadata(2),
              destination,
            },
          ],
          destType: 'klaviyo',
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
              error: 'Phone number is not in E.164 format.',
              statTags: {
                destType: 'KLAVIYO',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              destination,
            },
            {
              error: 'Phone number is not in E.164 format.',
              statTags: {
                destType: 'KLAVIYO',
                destinationId: 'default-destinationId',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'default-workspaceId',
              },
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              destination,
            },
          ],
        },
      },
    },
  },
];
