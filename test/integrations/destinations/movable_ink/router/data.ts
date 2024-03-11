import { RouterTestData } from '../../../testTypes';
import { RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';
import {
  destType,
  channel,
  destination,
  traits,
  headers,
  trackTestProperties,
  RouterInstrumentationErrorStatTags,
} from '../common';

const routerRequest: RouterTransformationRequest = {
  input: [
    {
      message: {
        type: 'identify',
        anonymousId: 'anonId123',
        traits,
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(1),
      destination,
    },
    {
      message: {
        type: 'identify',
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(2),
      destination,
    },
    {
      message: {
        type: 'track',
        channel,
        anonymousId: 'anonId123',
        userId: 'userId123',
        properties: trackTestProperties['Product Added'],
        integrations: {
          All: true,
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(3),
      destination,
    },
    {
      message: {
        type: 'track',
        channel,
        anonymousId: 'anonId123',
        userId: 'userId123',
        properties: trackTestProperties['Custom Event'],
        integrations: {
          All: true,
        },
      },
      metadata: generateMetadata(4),
      destination,
    },
  ],
  destType,
};

export const data: RouterTestData[] = [
  {
    id: 'MovableInk-router-test-1',
    name: destType,
    description: 'Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria:
      'Some events should be transformed successfully and some should fail for missing fields and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest,
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: destination.Config.endpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    events: [
                      {
                        type: 'identify',
                        userId: traits.email,
                        anonymousId: 'anonId123',
                        traits,
                        integrations: {
                          All: true,
                        },
                        originalTimestamp: '2024-03-04T15:32:56.409Z',
                        timestamp: 1709566376409,
                      },
                      {
                        type: 'track',
                        channel,
                        userId: 'userId123',
                        anonymousId: 'anonId123',
                        properties: trackTestProperties['Product Added'],
                        integrations: {
                          All: true,
                        },
                        originalTimestamp: '2024-03-04T15:32:56.409Z',
                        timestamp: 1709566376409,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(2)],
              batched: false,
              statusCode: 400,
              error: 'Either one of userId or email or anonymousId is required. Aborting',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
            {
              metadata: [generateMetadata(4)],
              batched: false,
              statusCode: 400,
              error: 'Timestamp is not present. Aborting',
              statTags: RouterInstrumentationErrorStatTags,
              destination,
            },
          ],
        },
      },
    },
  },
];
