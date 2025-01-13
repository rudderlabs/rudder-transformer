import { processInstrumentationErrorStatTags, destination } from '../commonConfig';

export const validationFailures = [
  {
    id: 'Smartly-validation-test-1',
    name: 'smartly',
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
              userId: 'john123',
              properties: {
                products: [{}],
                ad_unit_id: '22123387',
                ad_interaction_time: '1690867200',
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
              'Missing required value from ["properties.platform"]: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: Missing required value from ["properties.platform"]',
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
    id: 'Smartly-test-2',
    name: 'smartly',
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
              event_name: 'purchase',
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'john67',
              channel: 'mobile',
              rudderId: 'b7b24f86-cccx-46d8-b2b4-ccaxxx80239c',
              messageId: 'dummy_msg_id',
              properties: {
                platform: 'snapchat',
                ad_unit_id: '2653387',
                ad_interaction_time: '1690867200',
              },
              anonymousId: 'anon_123',
              integrations: {
                All: true,
              },
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
  {
    id: 'Smartly-test-3',
    name: 'smartly',
    description: 'Event name not defined',
    scenario: 'Framework',
    successCriteria: 'Transformationn Error for Undefined Event',
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
              sentAt: '2021-01-25T16:12:02.048Z',
              userId: 'john67',
              channel: 'mobile',
              rudderId: 'b7b24f86-cccx-46d8-b2b4-ccaxxx80239c',
              messageId: 'dummy_msg_id',
              properties: {
                platform: 'snapchat',
                ad_unit_id: '2653387',
                ad_interaction_time: 1675094400,
              },
              anonymousId: 'anon_123',
              integrations: {
                All: true,
              },
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
              'Event is not defined or is not String: Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: Event is not defined or is not String',
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
