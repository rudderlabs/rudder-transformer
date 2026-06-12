import { Destination, RouterTransformationRequest, RudderMessage } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedGroupPayload,
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
    privateApiKey: secret1,
    apiVersion: 'v3',
    consent: ['email'],
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

const subscribeEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';
const unsubscribeEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-delete-jobs';

const subscriptionRelations = {
  list: {
    data: {
      type: 'list',
      id: 'group_list_id',
    },
  },
};

const getRouterRequest = (
  message: RudderMessage,
  destinationOverride?: Destination,
): RouterTransformationRequest => ({
  input: [
    {
      destination: destinationOverride || destination,
      metadata: generateMetadata(1),
      message,
    },
  ],
  destType: 'klaviyo',
});

export const dataV3: RouterTestData[] = [
  {
    id: 'klaviyo-router-v3-test-1',
    name: 'klaviyo',
    description:
      'v3 router group subscribe should include subscribed email channel from config consent',
    scenario: 'Framework',
    successCriteria:
      'Output should keep v3 revision and include email SUBSCRIBED in the bulk subscribe payload',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: getRouterRequest(
          generateSimplifiedGroupPayload({
            userId: 'user123',
            groupId: 'group_list_id',
            traits: {
              subscribe: true,
            },
            context: {
              traits: {
                email: 'test@rudderstack.com',
              },
            },
            timestamp: '2020-01-21T00:21:34.208Z',
          }),
        ),
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
                transformResultBuilder({
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
                  endpoint: subscribeEndpoint,
                  endpointPath: '/api/profile-subscription-bulk-create-jobs',
                  headers,
                  method: 'POST',
                }),
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
    id: 'klaviyo-router-v3-test-2',
    name: 'klaviyo',
    description:
      'v3 router group unsubscribe should carry UNSUBSCRIBED consent for configured channels',
    scenario: 'Framework',
    successCriteria:
      'Output should keep v3 revision and include UNSUBSCRIBED consent in the unsubscribe payload',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: getRouterRequest(
          generateSimplifiedGroupPayload({
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
          {
            ...destination,
            Config: {
              ...destination.Config,
              consent: ['email'],
            },
          },
        ),
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
                transformResultBuilder({
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
                                  email: { marketing: { consent: 'UNSUBSCRIBED' } },
                                },
                              },
                            },
                          ],
                        },
                      },
                      relationships: subscriptionRelations,
                    },
                  },
                  endpoint: unsubscribeEndpoint,
                  endpointPath: '/api/profile-subscription-bulk-delete-jobs',
                  headers,
                  method: 'POST',
                }),
              ],
              metadata: [generateMetadata(1)],
              batched: true,
              statusCode: 200,
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  consent: ['email'],
                },
              },
            },
          ],
        },
      },
    },
  },
];
