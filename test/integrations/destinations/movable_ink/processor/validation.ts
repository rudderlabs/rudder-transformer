import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { destType, destination, processorInstrumentationErrorStatTags } from '../common';

export const validation: ProcessorTestData[] = [
  {
    id: 'MovableInk-validation-test-1',
    name: destType,
    description: 'All of the required fields — userId, email, and anonymousId — are missing.',
    scenario: 'Framework',
    successCriteria: 'Instrumentation Error',
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
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
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
              'Either one of userId or email or anonymousId is required. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Either one of userId or email or anonymousId is required. Aborting',
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'MovableInk-validation-test-2',
    name: destType,
    description: 'Unsupported message type -> group',
    scenario: 'Framework',
    successCriteria: 'Instrumentation Error for Unsupported message type',
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
              userId: 'userId123',
              channel: 'mobile',
              anonymousId: 'anon_123',
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
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
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'MovableInk-validation-test-3',
    name: destType,
    description: 'Missing required field -> timestamp',
    scenario: 'Framework',
    successCriteria: 'Instrumentation Error',
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
              integrations: {
                All: true,
              },
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
              'Timestamp is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Timestamp is not present. Aborting',
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'MovableInk-validation-test-4',
    name: destType,
    description: "Products Searched event - Missing 'query' property",
    scenario: 'Framework',
    successCriteria: 'Instrumentation Error',
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
              userId: 'user123',
              integrations: {
                All: true,
              },
              event: 'Products Searched',
              originalTimestamp: '2024-03-04T15:32:56.409Z',
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
              "Missing 'query' property in properties. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Missing 'query' property in properties. Aborting",
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'MovableInk-validation-test-5',
    name: destType,
    description: "Products Added event - Missing 'product_id' property",
    scenario: 'Framework',
    successCriteria: 'Instrumentation Error',
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
              userId: 'user123',
              integrations: {
                All: true,
              },
              event: 'Product Added',
              originalTimestamp: '2024-03-04T15:32:56.409Z',
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
              "Missing 'product_id' property in properties. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Missing 'product_id' property in properties. Aborting",
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'MovableInk-validation-test-6',
    name: destType,
    description: 'Missing event name',
    scenario: 'Framework',
    successCriteria: 'Instrumentation Error',
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
              anonymousId: 'anonId123',
              userId: 'userId123',
              properties: {},
              integrations: {
                All: true,
              },
              originalTimestamp: '2024-03-04T15:32:56.409Z',
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
              'Event name is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event name is not present. Aborting',
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
];
