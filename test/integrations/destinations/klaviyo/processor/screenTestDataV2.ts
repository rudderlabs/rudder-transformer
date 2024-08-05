import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedPageOrScreenPayload,
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
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const screenTestData: ProcessorTestData[] = [
  {
    id: 'klaviyo-screen-150624-test-1',
    name: 'klaviyo',
    description: '150624 -> Screen event call with properties and contextual traits',
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
                name: 'Viewed Screen',
                sentAt: '2021-01-25T16:12:02.048Z',
                userId: 'sajal12',
                integrations: {
                  klaviyo: {
                    fieldsToAppend: ['append1'],
                  },
                },
                context: {
                  traits: {
                    id: 'user@1',
                    age: '22',
                    email: 'test@rudderstack.com',
                    phone: '9112340375',
                    anonymousId: '9c6bd77ea9da3e68',
                    append1: 'value1',
                  },
                },
                properties: {
                  value: 9.99,
                  currency: 'USD',
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
                Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
                'Content-Type': 'application/json',
                revision: '2024-06-15',
              },
              JSON: {
                data: {
                  type: 'event',
                  attributes: {
                    time: '2021-01-25T15:32:56.409Z',
                    value: 9.99,
                    value_currency: 'USD',
                    metric: {
                      data: {
                        type: 'metric',
                        attributes: {
                          name: 'Viewed Screen',
                        },
                      },
                    },
                    properties: {
                      PreviouslyVicePresident: true,
                      YearElected: 1801,
                      VicePresidents: ['Aaron Burr', 'George Clinton'],
                    },
                    profile: {
                      data: {
                        attributes: {
                          anonymous_id: '9c6bd77ea9da3e68',
                          external_id: 'sajal12',
                          email: 'test@rudderstack.com',
                          meta: {
                            patch_properties: {
                              append: {
                                append1: 'value1',
                              },
                            },
                          },
                          phone_number: '9112340375',
                          properties: {
                            id: 'user@1',
                            age: '22',
                          },
                        },
                        type: 'profile',
                      },
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
