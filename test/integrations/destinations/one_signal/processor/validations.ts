import { destination } from './commonConfig';
export const validations = [
  {
    name: 'one_signal',
    id: 'One Signal V2-test-validation-failure-1',
    description: 'V2-> No Message type passed',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code and failure happened due no message type present',
    feature: 'processor',
    scenario: 'Framework',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              userId: 'user@27',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type is required',
            statTags: {
              destType: 'ONE_SIGNAL',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-validation-failure-2',
    description: 'V2-> invalid Message type passed',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code and failure happened due invalid message type present',
    feature: 'processor',
    scenario: 'Framework',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'invalid',
              userId: 'user@27',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message type invalid is not supported',
            statTags: {
              destType: 'ONE_SIGNAL',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-validation-failure-3',
    description: 'V2-> No App Id Present in destination Config',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code and failure happened due no Configuration Error',
    feature: 'processor',
    scenario: 'Framework',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { Config: {} },
            message: {
              type: 'invalid',
              userId: 'user@27',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'appId is a required field',
            statTags: {
              destType: 'ONE_SIGNAL',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
