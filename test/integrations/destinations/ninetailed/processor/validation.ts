import { processInstrumentationErrorStatTags, destination, context } from '../commonConfig';

export const validationFailures = [
  {
    id: 'Ninetailed-validation-test-1',
    name: 'ninetailed',
    description: 'Required field anonymousId not present',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for anonymousId not present',
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
              context,
              properties: {
                products: [{}],
              },
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
              'Missing required value from "anonymousId": Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: Missing required value from "anonymousId"',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: processInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'Ninetailed-test-4',
    name: 'ninetailed',
    description: 'Unsupported message type -> group',
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
              type: 'group',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'sajal12',
              channel: 'mobile',
              rudderId: 'b7b24f86-f7bf-46d8-b2b4-ccafc080239c',
              messageId: 'dummy_msg_id',
              traits: {
                orderId: 'ord 123',
                products: [],
              },
              anonymousId: 'anon_123',
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
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            statTags: processInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
];
