import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { destType, destination, processorInstrumentationErrorStatTags } from '../common';

export const validation: ProcessorTestData[] = [
  {
    id: 'Wunderkind-validation-test-1',
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
];
