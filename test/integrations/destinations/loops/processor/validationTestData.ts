import { ProcessorTestData } from '../../../testTypes';
import { destination, metadata } from '../commonConfig';
import {
  generateSimplifiedGroupPayload,
  generateSimplifiedIdentifyPayload,
  generateSimplifiedTrackPayload,
} from '../../../testUtils';

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'loops-validation-test-1',
    name: 'loops',
    description: 'Identify event with missing email or userId',
    scenario: 'Identify event with missing email or userId',
    successCriteria: 'Test should fail.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedIdentifyPayload({
              channel: 'web',
              context: {
                traits: {
                  firstName: 'Bob',
                  lastName: 'Brown',
                  phone: '099-999-9999',
                },
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
            }),
            destination,
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error:
              'email is required for identify call.: Workflow: procWorkflow, Step: validateIdentifyEvent, ChildStep: undefined, OriginalError: email is required for identify call.',
            statTags: {
              destType: 'LOOPS',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'loops-validation-test-2',
    name: 'loops',
    description: 'Track event with missing email and userId',
    scenario: 'Send track event to Loops (no email or userId)',
    successCriteria: 'Test should fail.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              type: 'track',
              context: {},
              timestamp: '2020-01-27T17:50:57.109+05:30',
            },
            destination,
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error:
              'Either email or userId is required for track call.: Workflow: procWorkflow, Step: validateTrackEvent, ChildStep: undefined, OriginalError: Either email or userId is required for track call.',
            statTags: {
              destType: 'LOOPS',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'loops-validation-test-3',
    name: 'loops',
    description: 'event without event type',
    scenario: 'Send event to Loops without event type',
    successCriteria: 'Test should fail.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              context: {},
            },
            destination,
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error:
              'message Type is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting message.',
            statTags: {
              destType: 'LOOPS',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'loops-validation-test-4',
    name: 'loops',
    description: 'Send group call to Loops',
    scenario: 'group call to Loops should fail',
    successCriteria: 'Test should fail.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedGroupPayload({
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              context: {},
            }),
            destination,
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error:
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            statTags: {
              destType: 'LOOPS',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
  {
    id: 'loops-validation-test-5',
    name: 'loops',
    description: 'Track event without api key',
    scenario: 'Send event to Loops without api key',
    successCriteria: 'Test should fail.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedTrackPayload({
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              context: {},
            }),
            destination: {
              ...destination,
              Config: {},
            },
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            statusCode: 400,
            error:
              'apiKey must be supplied in destination config.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: apiKey must be supplied in destination config.',
            statTags: {
              destType: 'LOOPS',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
          },
        ],
      },
    },
  },
];
