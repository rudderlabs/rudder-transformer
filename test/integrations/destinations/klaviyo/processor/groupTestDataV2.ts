import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedGroupPayload,
  transformResultBuilder,
} from '../../../testUtils';

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
    apiVersion: 'v2',
    privateApiKey: 'dummyPrivateApiKey',
    consent: ['email'],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const headers = {
  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2024-06-15',
};

const subscriptionEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';

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
const commonOutputUnsubscriptionProps = {
  profiles: {
    data: [
      {
        type: 'profile',
        attributes: {
          email: 'test@rudderstack.com',
          phone_number: '+12 345 678 900',
        },
      },
    ],
  },
};

const subscriptionRelations = {
  list: {
    data: {
      type: 'list',
      id: 'group_list_id',
    },
  },
};
const unsubscriptionEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-delete-jobs';

export const groupTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-group-test-1',
    name: 'klaviyo',
    description: 'Simple group call for subscription',
    scenario: 'Business',
    successCriteria:
      'Response should contain only group payload and status code should be 200, for the group payload a subscription payload should be present in the final payload with email and phone',
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
                  consent: ['email'],
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            }),
            metadata: generateMetadata(1),
          },
        ],
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
                  attributes: commonOutputSubscriptionProps,
                  relationships: subscriptionRelations,
                },
              },
              endpoint: subscriptionEndpoint,
              headers: headers,
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
    id: 'klaviyo-group-test-1',
    name: 'klaviyo',
    description: 'Simple group call for subscription',
    scenario: 'Business',
    successCriteria:
      'Response should contain only group payload and status code should be 200, for the group payload a unsubscription payload should be present in the final payload with email and phone',
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
                subscribe: false,
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
            metadata: generateMetadata(1),
          },
        ],
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
                  attributes: commonOutputUnsubscriptionProps,
                  relationships: subscriptionRelations,
                },
              },
              endpoint: unsubscriptionEndpoint,
              headers: headers,
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
    id: 'klaviyo-group-test-3',
    name: 'klaviyo',
    description: 'Simple group call without groupId',
    scenario: 'Business',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are not sending groupId in the payload and groupId is a required field for group events',
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
              groupId: '',
              traits: {
                subscribe: true,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                  consent: 'email',
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            }),
            metadata: generateMetadata(2),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'groupId is a required field for group events',
            statTags: {
              destType: 'KLAVIYO',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
              destinationId: 'default-destinationId',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
];
