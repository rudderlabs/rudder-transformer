import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedGroupPayload,
  generateSimplifiedIdentifyPayload,
  overrideDestination,
  transformResultBuilder,
} from '../../../testUtils';
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
    apiVersion: 'v3',
    privateApiKey: secret1,
    consent: ['email', 'sms'],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const headers = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2026-04-15',
};

const subscriptionRelations = {
  list: {
    data: {
      type: 'list',
      id: 'group_list_id',
    },
  },
};

const subscriptionEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';
const unsubscriptionEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-delete-jobs';
const profileImportEndpoint = 'https://a.klaviyo.com/api/profile-import';

const identifyTraits = {
  firstName: 'Test',
  lastName: 'Rudderlabs',
  email: 'test@rudderstack.com',
  phone: '+12 345 578 900',
  userId: 'user@1',
  title: 'Developer',
  organization: 'Rudder',
  city: 'Tokyo',
  region: 'Kanto',
  country: 'JP',
  zip: '100-0001',
  Flagged: false,
  Residence: 'Shibuya',
  street: '63, Shibuya',
  properties: {
    listId: 'XUepkK',
    subscribe: true,
    consent: ['email', 'sms'],
  },
};

const identifyProfileAttributes = {
  external_id: 'user@1',
  anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
  email: 'test@rudderstack.com',
  first_name: 'Test',
  last_name: 'Rudderlabs',
  phone_number: '+12 345 578 900',
  title: 'Developer',
  organization: 'Rudder',
  location: {
    city: 'Tokyo',
    region: 'Kanto',
    country: 'JP',
    zip: '100-0001',
    address1: '63, Shibuya',
  },
  properties: {
    Flagged: false,
    Residence: 'Shibuya',
  },
};

const identifyListRelations = {
  list: {
    data: {
      type: 'list',
      id: 'XUepkK',
    },
  },
};

export const dataV3: ProcessorTestData[] = [
  {
    id: 'klaviyo-group-v3-test-1',
    name: 'klaviyo',
    description:
      'v3 group subscribe should include subscribed channels from config consent in subscription payload',
    scenario: 'Business',
    successCriteria:
      'Response should contain a v3 subscription payload with revision 2026-04-15 and both email/sms SUBSCRIBED',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedGroupPayload({
              userId: 'user123',
              groupId: 'group_list_id',
              traits: {
                subscribe: true,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            }),
            metadata: generateMetadata(1),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
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
              endpoint: subscriptionEndpoint,
              endpointPath: '/api/profile-subscription-bulk-create-jobs',
              headers,
              method: 'POST',
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-group-v3-test-2',
    name: 'klaviyo',
    description:
      'v3 group unsubscribe should include UNSUBSCRIBED consent for configured sms channel',
    scenario: 'Business',
    successCriteria:
      'Response should contain v3 unsubscription payload with UNSUBSCRIBED consent and revision 2026-04-15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { consent: ['sms'] }),
            message: generateSimplifiedGroupPayload({
              userId: 'user123',
              groupId: 'group_list_id',
              traits: {
                subscribe: false,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            }),
            metadata: generateMetadata(2),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-delete-job',
                  attributes: {
                    profiles: {
                      data: [
                        {
                          type: 'profile',
                          attributes: {
                            email: 'test@rudderstack.com',
                            phone_number: '+12 345 678 900',
                            subscriptions: {
                              sms: { marketing: { consent: 'UNSUBSCRIBED' } },
                            },
                          },
                        },
                      ],
                    },
                  },
                  relationships: subscriptionRelations,
                },
              },
              endpoint: unsubscriptionEndpoint,
              endpointPath: '/api/profile-subscription-bulk-delete-jobs',
              headers,
              method: 'POST',
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-v3-test-1',
    name: 'klaviyo',
    description:
      'v3 identify subscribe should use profile-import revision and include subscribed channels in subscription payload',
    scenario: 'Business',
    successCriteria:
      'Response should include profile-import plus subscription create payload with SUBSCRIBED channels',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedIdentifyPayload({
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@1',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
              context: {
                traits: identifyTraits,
              },
            }),
            metadata: generateMetadata(3),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: profileImportEndpoint,
              endpointPath: '/api/profile-import',
              headers,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: identifyProfileAttributes,
                  meta: {
                    patch_properties: {},
                  },
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(3),
          },
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: subscriptionEndpoint,
              endpointPath: '/api/profile-subscription-bulk-create-jobs',
              headers,
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
                  relationships: identifyListRelations,
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(3),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-v3-test-2',
    name: 'klaviyo',
    description:
      'v3 identify unsubscribe should include unsubscribed channels in subscription delete payload',
    scenario: 'Business',
    successCriteria:
      'Response should include profile-import plus subscription delete payload with UNSUBSCRIBED channels',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedIdentifyPayload({
              sentAt: '2021-01-03T17:02:53.195Z',
              userId: 'user@1',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
              context: {
                traits: {
                  ...identifyTraits,
                  properties: { ...identifyTraits.properties, subscribe: false },
                },
              },
            }),
            metadata: generateMetadata(4),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: profileImportEndpoint,
              endpointPath: '/api/profile-import',
              headers,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: identifyProfileAttributes,
                  meta: {
                    patch_properties: {},
                  },
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(4),
          },
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: unsubscriptionEndpoint,
              endpointPath: '/api/profile-subscription-bulk-delete-jobs',
              headers,
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-delete-job',
                  attributes: {
                    profiles: {
                      data: [
                        {
                          type: 'profile',
                          attributes: {
                            email: 'test@rudderstack.com',
                            phone_number: '+12 345 578 900',
                            subscriptions: {
                              email: { marketing: { consent: 'UNSUBSCRIBED' } },
                              sms: { marketing: { consent: 'UNSUBSCRIBED' } },
                            },
                          },
                        },
                      ],
                    },
                  },
                  relationships: identifyListRelations,
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-v1-routing-regression-test-1',
    name: 'klaviyo',
    description: 'v1 apiVersion should continue using legacy subscription payload shape',
    scenario: 'Business',
    successCriteria:
      'Response should route through legacy flow and send list_id/subscriptions payload with revision 2023-02-22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { apiVersion: 'v1', consent: undefined }),
            message: generateSimplifiedGroupPayload({
              userId: 'user123',
              groupId: 'group_list_id',
              traits: {
                subscribe: true,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                  consent: ['email'],
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            }),
            metadata: generateMetadata(5),
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-create-job',
                  attributes: {
                    list_id: 'group_list_id',
                    subscriptions: [
                      {
                        email: 'test@rudderstack.com',
                        phone_number: '+12 345 678 900',
                      },
                    ],
                  },
                },
              },
              endpoint: subscriptionEndpoint,
              endpointPath: '/api/profile-subscription-bulk-create-jobs',
              headers: {
                ...headers,
                revision: '2023-02-22',
              },
              method: 'POST',
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(5),
          },
        ],
      },
    },
  },
];
