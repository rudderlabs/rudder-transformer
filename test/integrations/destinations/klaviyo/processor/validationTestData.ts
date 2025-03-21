import { Destination, MessageType } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { secret1 } from '../maskedSecrets';

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

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-validation-test-1',
    name: 'klaviyo',
    description: '[Error]: Check for unsupported message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by Klaviyo destination and the error message should be Event type random is not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              userId: 'user123',
              type: 'random' as MessageType,
              groupId: 'XUepkK',
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
            },
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
            error: 'Event type random is not supported',
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
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
