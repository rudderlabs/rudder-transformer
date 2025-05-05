import { ProcessorTestData } from '../../../testTypes';
import { generateSimplifiedTrackPayload, transformResultBuilder } from '../../../testUtils';
import { destination, headers, metadata } from '../commonConfig';

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'loops-track-test-1',
    name: 'loops',
    description: 'Track event with traits',
    scenario: 'send track event to Loops',
    successCriteria: 'Test should pass successfully.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedTrackPayload({
              userId: 'dummy-user001',
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
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
            output: transformResultBuilder({
              JSON: {
                email: 'dummyuser@domain.com',
                firstName: 'Bob',
                lastName: 'Brown',
                phone: '099-999-9999',
                userId: 'dummy-user001',
                eventName: 'signup',
                eventProperties: {
                  subscriptionStatus: 'trial',
                  plan: null,
                },
              },
              endpoint: 'https://app.loops.so/api/v1/events/send',
              method: 'POST',
              headers,
              userId: '',
            }),
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'loops-track-test-2',
    name: 'loops',
    description: 'Track event with no email in traits',
    scenario: 'Send track event to Loops (no email in traits)',
    successCriteria: 'Test should pass successfully.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: generateSimplifiedTrackPayload({
              userId: 'dummy-user001',
              channel: 'web',
              event: 'signup',
              properties: {
                subscriptionStatus: 'trial',
                plan: null,
              },
              context: {
                traits: {},
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
            output: transformResultBuilder({
              JSON: {
                userId: 'dummy-user001',
                eventName: 'signup',
                eventProperties: {
                  subscriptionStatus: 'trial',
                  plan: null,
                },
              },
              endpoint: 'https://app.loops.so/api/v1/events/send',
              method: 'POST',
              headers,
              userId: '',
            }),
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
