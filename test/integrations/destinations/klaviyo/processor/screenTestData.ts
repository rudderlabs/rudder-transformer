import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedPageOrScreenPayload,
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

export const screenTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-screen-test-1',
    name: 'klaviyo',
    description: 'Screen event call with properties and contextual traits',
    scenario: 'Business',
    successCriteria:
      'Response should contain only event payload and status code should be 200, for the event payload should contain properties and contextual traits in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedPageOrScreenPayload(
              {
                event: 'TestEven001',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                context: {
                  traits: {
                    id: 'user@1',
                    age: '22',
                    email: 'test@rudderstack.com',
                    phone: '9112340375',
                    anonymousId: '9c6bd77ea9da3e68',
                  },
                },
                properties: {
                  PreviouslyVicePresident: true,
                  YearElected: 1801,
                  VicePresidents: ['Aaron Burr', 'George Clinton'],
                },
                anonymousId: '9c6bd77ea9da3e68',
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              'screen',
            ),
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
              endpoint: 'https://a.klaviyo.com/api/events',
              headers: {
                Accept: 'application/json',
                Authorization: authHeader1,
                'Content-Type': 'application/json',
                revision: '2023-02-22',
              },
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    metric: {
                      name: 'TestEven001',
                    },
                    properties: {
                      PreviouslyVicePresident: true,
                      YearElected: 1801,
                      VicePresidents: ['Aaron Burr', 'George Clinton'],
                    },
                    profile: {
                      $email: 'test@rudderstack.com',
                      $phone_number: '9112340375',
                      $id: 'sajal12',
                      age: '22',
                    },
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
