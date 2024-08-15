import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { destType, destination, processorInstrumentationErrorStatTags } from '../common';

export const validation: ProcessorTestData[] = [
  {
    id: 'bloomreach-catalog-validation-test-1',
    name: destType,
    description: 'Missing message action for record event type',
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
              type: 'record',
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
              'message action undefined is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message action undefined is not supported',
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
];
