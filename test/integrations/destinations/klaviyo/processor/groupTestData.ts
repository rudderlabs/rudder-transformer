import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
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
    publicApiKey: 'dummyPublicApiKey',
    privateApiKey: secret1,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const headers = {
  Accept: 'application/json',
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  revision: '2023-02-22',
};

const commonEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';

export const groupTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-group-test-1',
    name: 'klaviyo',
    description: 'Simple group call',
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
              groupId: 'XUepkK',
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
                  attributes: {
                    list_id: 'XUepkK',
                    subscriptions: [
                      { email: 'test@rudderstack.com', phone_number: '+12 345 678 900' },
                    ],
                  },
                  type: 'profile-subscription-bulk-create-job',
                },
              },
              endpoint: commonEndpoint,
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
    id: 'klaviyo-group-test-2',
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
        method: 'POST',
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
