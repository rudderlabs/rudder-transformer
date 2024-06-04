import { destination } from './commonConfig';

export const transformationFailures = [
  {
    id: 'rakuten-test-2',
    name: 'rakuten',
    description: 'Required field orderId not present',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for orderId not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'product purchased',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                products: [{}],
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
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
              'Missing required value from ["properties.order_id","properties.orderId"]: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: undefined, OriginalError: Missing required value from ["properties.order_id","properties.orderId"]',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: {
              destType: 'RAKUTEN',
              destinationId: 'dummyDestId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'rakuten-test-3',
    name: 'rakuten',
    description: 'No products available in products array to send',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for no products present to send',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'product purchased',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                land: '20230406_2342',
                tr: 'txnId',
                orderId: 'ord 123',
                products: [],
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
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
              'Either properties.product is not an array or is empty: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: undefined, OriginalError: Either properties.product is not an array or is empty',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: {
              destType: 'RAKUTEN',
              destinationId: 'dummyDestId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'rakuten-test-4',
    name: 'rakuten',
    description: 'Unsupported message type -> Identify',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for Unsupported message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              traits: {
                orderId: 'ord 123',
                products: [],
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
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
              'message type identify is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type identify is not supported',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: {
              destType: 'RAKUTEN',
              errorCategory: 'dataValidation',
              destinationId: 'dummyDestId',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'rakuten-test-5',
    name: 'rakuten',
    description: 'No eligible property available for required field land present',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for required field land not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'product purchased',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                orderId: 'ord 123',
                products: [],
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
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
              'Missing required value from ["properties.land","properties.land_time","properties.landTime"]: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: undefined, OriginalError: Missing required value from ["properties.land","properties.land_time","properties.landTime"]',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: {
              destType: 'RAKUTEN',
              destinationId: 'dummyDestId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'rakuten-test-6',
    name: 'rakuten',
    description: 'No eligible property available for required field land present',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for required field land not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              event: 'product purchased',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              properties: {
                tr: 'txnId',
                orderId: 'ord 123',
                products: [],
              },
              anonymousId: '9c6bd77ea9da3e68',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
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
              'Missing required value from ["properties.land","properties.land_time","properties.landTime"]: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: undefined, OriginalError: Missing required value from ["properties.land","properties.land_time","properties.landTime"]',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: {
              destType: 'RAKUTEN',
              destinationId: 'dummyDestId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
