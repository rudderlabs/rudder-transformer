import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import {
  destType,
  destination,
  processorInstrumentationErrorStatTags,
  traits,
  headers,
  endpoint,
} from '../common';

export const validation: ProcessorTestData[] = [
  {
    id: 'bloomreach-validation-test-1',
    name: destType,
    description: 'Missing userId and anonymousId',
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
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Either one of userId or anonymousId is required. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Either one of userId or anonymousId is required. Aborting',
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'bloomreach-validation-test-2',
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
  {
    id: 'bloomreach-validation-test-3',
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
    id: 'bloomreach-validation-test-4',
    name: destType,
    description: 'Empty userId and non empty anonymousId',
    scenario: 'Framework',
    successCriteria: 'Response should contain all the mapping and status code should be 200',
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
              userId: '',
              anonymousId: 'anonId123',
              traits,
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
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint,
              headers,
              JSON: {
                data: {
                  customer_ids: { registered: '', cookie: 'anonId123' },
                  properties: {
                    email: 'test@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                    phone: '1234567890',
                    city: 'New York',
                    country: 'USA',
                    address: {
                      city: 'New York',
                      country: 'USA',
                      pinCode: '123456',
                    },
                  },
                  update_timestamp: 1709566376,
                },
                name: 'customers',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
