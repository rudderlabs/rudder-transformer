const metadata = {
  sourceType: '',
  destinationType: '',
  namespace: '',
  destinationId: '',
};

const outputStatTags = {
  destType: 'BLUECORE',
  destinationId: '',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
};

export const validationTestData = [
  {
    id: 'bluecore-validation-test-1',
    name: 'bluecore',
    description: '[Error]: Check for unsupported message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by bluecore destination and the error message should be Event type random is not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'BLUECORE',
              Config: {
                bluecoreNamespace: 'dummy_sandbox',
                eventsMapping: [
                  {
                    from: 'ABC Searched',
                    to: 'search',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata,
            message: {
              userId: 'user123',
              type: 'random',
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
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'message type random is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type random is not supported',
            metadata,
            statTags: outputStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-validation-test-1',
    name: 'bluecore',
    description: '[Error]: Check for not finding bluecoreNamespace',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as bluecoreNamespace is not found in the destination config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'BLUECORE',
              Config: {
                eventsMapping: [
                  {
                    from: 'ABC Searched',
                    to: 'search',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
              DestinationDefinition: { Config: { cdkV2Enabled: true } },
            },
            metadata: metadata,
            message: {
              userId: 'user123',
              type: 'random',
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
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'message type random is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type random is not supported',
            metadata,
            statTags: outputStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
];
