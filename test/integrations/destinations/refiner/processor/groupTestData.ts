import { authHeader1, secret1 } from '../maskedSecrets';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  transformResultBuilder,
  generateSimplifiedGroupPayload,
} from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'refiner',
  DestinationDefinition: {
    ID: '123',
    Name: 'refiner',
    DisplayName: 'Refiner',
    Config: {},
  },
  Config: {
    apiKey: secret1,
    blacklistedEvents: [{ eventName: '' }],
    eventDelivery: true,
    eventDeliveryTS: 1665474171943,
    eventFilteringOption: 'disable',
    whitelistedEvents: [{ eventName: '' }],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const headers = {
  Authorization: authHeader1,
  'Content-Type': 'application/x-www-form-urlencoded',
};

const endpoint = 'https://api.refiner.io/v1/identify-user';

export const groupTestData: ProcessorTestData[] = [
  {
    id: 'refiner-group-test-1',
    name: 'refiner',
    description: 'Successful group call to create account and add user to account',
    scenario: 'Framework',
    successCriteria: 'Response status code should be 200 and it should contain all account traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedGroupPayload({
              userId: 'test@12',
              groupId: 'group@123',
              traits: { name: 'rudder ventures', email: 'business@rudderstack.com' },
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
              },
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
              method: 'POST',
              userId: '',
              endpoint,
              headers,
              FORM: {
                id: 'test@12',
                'account[email]': 'business@rudderstack.com',
                'account[id]': 'group@123',
                'account[name]': 'rudder ventures',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
