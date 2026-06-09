import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedGroupPayload,
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

export const dataV3: ProcessorTestData[] = [
  {
    id: 'klaviyo-group-v3-test-1',
    name: 'klaviyo',
    description: 'v3 group subscribe with empty consent override should send subscriptions object',
    scenario: 'Business',
    successCriteria:
      'Response should contain a v3 subscription payload with revision 2026-04-15 and an explicit empty subscriptions object',
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
                  consent: [],
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
                            subscriptions: {},
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
      'v3 group unsubscribe should use config consent channels even when channel identifier is missing',
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
];
