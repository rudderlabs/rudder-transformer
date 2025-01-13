import { commonProperties, destination, endpoint, headers } from './commonConfig';

const commonTrackTags = {
  brand: 'John Players',
  price: '15000',
  firstName: 'Test',
};

const purchases = [
  {
    sku: 3,
    iso: 'iso',
    count: 2,
    amount: 100,
  },
];

export const trackTests = [
  {
    name: 'one_signal',
    id: 'One Signal V2-test-track-success-1',
    description:
      'V2-> Track call for updating user tags with userId available and products details available',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code with userId mapped to external_id and properties mapped to tags',
    feature: 'processor',
    scenario: 'Framework+Buisness',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'Order Completed',
              userId: 'user@27',
              channel: 'server',
              properties: commonProperties,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint,
              headers,
              params: {},
              body: {
                FORM: {},
                JSON: {
                  properties: { purchases, tags: { ...commonTrackTags, 'Order Completed': true } },

                  identity: {
                    external_id: 'user@27',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-track-success-2',
    description: 'V2-> Track call for products details available in properties directly',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code with userId mapped to external_id and purchases mapped from proeprties mapped to tags',
    feature: 'processor',
    scenario: 'Framework+Buisness',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'Order Completed',
              userId: 'user@27',
              channel: 'server',
              properties: {},
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint,
              headers,
              params: {},
              body: {
                FORM: {},
                JSON: {
                  properties: { purchases: [], tags: { 'Order Completed': true } },
                  identity: {
                    external_id: 'user@27',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-track-failure-1',
    description: 'V2-> Track call without event name',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code and failure happened due instrumentation error',
    feature: 'processor',
    scenario: 'Framework+Buisness',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              userId: 'user@27',
              channel: 'server',
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
            error: 'Event is not present in the input payloads',
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
    id: 'One Signal V2-test-track-failure-2',
    description: 'V2-> Track call without any aliases',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code and failure happened due no aliases present',
    feature: 'processor',
    scenario: 'Framework',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'dummy event',
              channel: 'server',
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
            error: 'userId or any other alias is required for track and group',
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
];
