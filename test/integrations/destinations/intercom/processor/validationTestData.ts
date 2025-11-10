import { secret1, secret2, secret4 } from '../maskedSecrets';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';

const v1Config = {
  apiKey: secret4,
  apiVersion: 'v1',
  appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
  collectContext: false,
};

const v2Config = {
  apiKey: secret1,
  apiVersion: 'v2',
  apiServer: 'standard',
  sendAnonymousId: false,
};

const destination: Destination = {
  ID: '123',
  Name: 'intercom',
  DestinationDefinition: {
    ID: '123',
    Name: 'intercom',
    DisplayName: 'Intercom',
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    apiKey: secret1,
    apiVersion: 'v2',
    apiServer: 'standard',
    sendAnonymousId: false,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const v1Destination = { ...destination, Config: v1Config };
const v2Destination = { ...destination, Config: v2Config };

const userTraits = {
  age: 23,
  ownerId: '14',
  role: 'user',
  source: 'rudder-sdk',
  firstname: 'Test',
  lastName: 'RudderStack',
  phone: '+91 9299999999',
  birthday: '2022-05-13T12:51:01.470Z',
};

const properties = {
  revenue: {
    amount: 1232,
    currency: 'inr',
    test: 123,
  },
  price: {
    amount: 3000,
    currency: 'USD',
  },
};

const groupTraits = {
  name: 'RudderStack',
  size: 500,
  website: 'www.rudderstack.com',
  industry: 'CDP',
  plan: 'enterprise',
};

const expectedStatTags = {
  destType: 'INTERCOM',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'intercom-validation-test-1',
    name: 'intercom',
    description: '[Error - V2 version]: Check for no message type',
    scenario: 'Framework',
    successCriteria: 'Response status code should be 400 with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              event: 'Product Searched',
              context: {
                traits: userTraits,
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
            error:
              'message Type is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-2',
    name: 'intercom',
    description: '[Error - V2 version]: Check for unsupported message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by intercom destination and the error message should be Event type alias is not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              userId: 'user@45',
              type: 'page',
              context: {
                traits: userTraits,
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
            error:
              'message type page is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type page is not supported',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-3',
    name: 'intercom',
    description: '[Error - V2 version]: Missing required config',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw configuration error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              hasDynamicConfig: false,
              ...v2Destination,
              Config: { ...v2Destination.Config, apiKey: null },
            },
            message: {
              userId: 'user@1',
              type: 'identify',
              context: {
                traits: userTraits,
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
            error:
              'Access Token is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Access Token is not present. Aborting',
            statTags: { ...expectedStatTags, errorType: 'configuration' },
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-4',
    name: 'intercom',
    description: '[Error - V2 version]: Missing required parameters for an identify call',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              anonymousId: 'anon@2',
              type: 'identify',
              context: {
                traits: userTraits,
              },
              integrations: {
                INTERCOM: {
                  lookup: 'phone',
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
            error:
              'Either email or userId is required for Identify call: Workflow: procWorkflow, Step: identifyPayloadForLatestVersion, ChildStep: undefined, OriginalError: Either email or userId is required for Identify call',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-5',
    name: 'intercom',
    description: '[Error - V2 version]: Missing required parameters for an identify call',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              anonymousId: 'anon@2',
              type: 'identify',
              context: {
                traits: userTraits,
              },
              integrations: {
                INTERCOM: {
                  lookup: 'phone',
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
            error:
              'Either email or userId is required for Identify call: Workflow: procWorkflow, Step: identifyPayloadForLatestVersion, ChildStep: undefined, OriginalError: Either email or userId is required for Identify call',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-6',
    name: 'intercom',
    description:
      '[Error - V2 version]: Unauthorized error while searching contact for an identify call',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw network error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              hasDynamicConfig: false,
              ...v2Destination,
              Config: { ...v2Destination.Config, apiKey: secret2 },
            },
            message: {
              userId: 'user@3',
              type: 'identify',
              context: {
                traits: {
                  phone: '+91 9399999999',
                  email: 'test+3@rudderlabs.com',
                  firstName: 'Test',
                  lastName: 'Rudder',
                  ownerId: '15',
                  role: 'admin',
                  source: 'rudder-android-sdk',
                },
              },
              integrations: {
                INTERCOM: {
                  lookup: 'email',
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
            error: JSON.stringify({
              message: JSON.stringify({
                message:
                  'Unable to search contact due to : [{"code":"unauthorized","message":"Access Token Invalid"}]: Workflow: procWorkflow, Step: searchContact, ChildStep: undefined, OriginalError: Unable to search contact due to : [{"code":"unauthorized","message":"Access Token Invalid"}]',
                destinationResponse: {
                  response: {
                    type: 'error.list',
                    request_id: 'request_1',
                    errors: [
                      {
                        code: 'unauthorized',
                        message: 'Access Token Invalid',
                      },
                    ],
                  },
                  status: 401,
                },
              }),
              destinationResponse: {
                response: {
                  type: 'error.list',
                  request_id: 'request_1',
                  errors: [
                    {
                      code: 'unauthorized',
                      message: 'Access Token Invalid',
                    },
                  ],
                },
                status: 401,
              },
            }),
            statTags: { ...expectedStatTags, errorCategory: 'network', errorType: 'aborted' },
            statusCode: 401,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-7',
    name: 'intercom',
    description: '[Error - V2 version]: Track call without event name',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              userId: 'user@3',
              type: 'track',
              context: {
                traits: userTraits,
              },
              properties,
              timestamp: '2023-11-22T10:12:44.757+05:30',
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
            error:
              'Event name is required for track call: Workflow: procWorkflow, Step: trackPayload, ChildStep: undefined, OriginalError: Event name is required for track call',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-8',
    name: 'intercom',
    description: '[Error - V2 version]: Group call without groupId',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              userId: 'user@4',
              type: 'group',
              context: {
                traits: {
                  email: 'test+4@rudderlabs.com',
                  phone: '+91 9499999999',
                  firstName: 'John',
                  lastName: 'Doe',
                  ownerId: '16',
                },
              },
              traits: groupTraits,
              timestamp: '2023-11-22T10:12:44.757+05:30',
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
            error:
              'groupId is required for group call: Workflow: procWorkflow, Step: groupPayloadForLatestVersion, ChildStep: validateMessageAndPreparePayload, OriginalError: groupId is required for group call',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-9',
    name: 'intercom',
    description: '[Error - V1 version]: Identify call without email and userId',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              type: 'identify',
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: userTraits,
              },
              timestamp: '2023-11-22T10:12:44.757+05:30',
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
            error:
              'Either of `email` or `userId` is required for Identify call: Workflow: procWorkflow, Step: identifyPayloadForOlderVersion, ChildStep: undefined, OriginalError: Either of `email` or `userId` is required for Identify call',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-validation-test-10',
    name: 'intercom',
    description: '[Error - V1 version]: Track call without email or userId',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400 and it should throw instrumentation error with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              type: 'track',
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: userTraits,
              },
              event: 'Test Event 2',
              timestamp: '2023-11-22T10:12:44.757+05:30',
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
            error:
              'Either email or userId is required for Track call: Workflow: procWorkflow, Step: trackPayload, ChildStep: undefined, OriginalError: Either email or userId is required for Track call',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
