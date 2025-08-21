import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { destType, destination, channel, postPatchHeader } from '../common';

export const trackTestData: RouterTestData[] = [
  {
    id: 'postscript-router-track-events-test',
    name: destType,
    description: 'Track Call: Custom events with subscriber id, email, and phone in traits',
    scenario: 'Business',
    successCriteria: 'Should create custom events for each track call. Status 200 for all.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                type: 'track',
                channel,
                event: 'Custom Event 1',
                properties: {
                  customProp1: 'value1',
                  customProp2: 'value2',
                },
                context: {
                  externalId: [
                    {
                      type: 'subscriber_id',
                      id: 'sub_12345',
                    },
                  ],
                },
                originalTimestamp: '2025-06-20T00:00:00.000Z',
              },
              metadata: generateMetadata(1),
            },
            {
              destination,
              message: {
                type: 'track',
                channel,
                event: 'Custom Event 2',
                properties: {
                  customProp3: 'value3',
                  customProp4: 'value4',
                },
                context: {
                  traits: {
                    email: 'customer@example.com',
                  },
                },
                originalTimestamp: '2025-06-20T00:00:00.000Z',
              },
              metadata: generateMetadata(2),
            },
            {
              destination,
              message: {
                type: 'track',
                channel,
                event: 'Custom Event 3',
                properties: {
                  customProp5: 'value5',
                  customProp6: 'value6',
                },
                context: {
                  traits: {
                    phone: '+1111111111',
                  },
                },
                originalTimestamp: '2025-06-20T00:00:00.000Z',
              },
              metadata: generateMetadata(3),
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.postscript.io/api/v2/events',
                headers: postPatchHeader,
                params: {},
                body: {
                  JSON: {
                    type: 'Custom Event 1',
                    subscriber_id: 'sub_12345',
                    occurred_at: '2025-06-20 00:00:00.000',
                    properties: {
                      customProp1: 'value1',
                      customProp2: 'value2',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(1)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.postscript.io/api/v2/events',
                headers: postPatchHeader,
                params: {},
                body: {
                  JSON: {
                    type: 'Custom Event 2',
                    email: 'customer@example.com',
                    occurred_at: '2025-06-20 00:00:00.000',
                    properties: {
                      customProp3: 'value3',
                      customProp4: 'value4',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(2)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.postscript.io/api/v2/events',
                headers: postPatchHeader,
                params: {},
                body: {
                  JSON: {
                    type: 'Custom Event 3',
                    phone: '+1111111111',
                    occurred_at: '2025-06-20 00:00:00.000',
                    properties: {
                      customProp5: 'value5',
                      customProp6: 'value6',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(3)],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'postscript-router-track-external-id-test',
    name: destType,
    description: 'Track Call: Custom event with external id',
    scenario: 'Business',
    successCriteria: 'Should create custom events for the track call. Status 200.',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                type: 'track',
                channel,
                event: 'Custom Event 4',
                properties: {
                  customProp7: 'value7',
                  customProp8: 'value8',
                },
                context: {
                  externalId: [
                    {
                      type: 'external_id',
                      id: 'ext-123',
                    },
                  ],
                },
                originalTimestamp: '2025-06-20T00:05:00.000Z',
              },
              metadata: generateMetadata(1),
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.postscript.io/api/v2/events',
                headers: postPatchHeader,
                params: {},
                body: {
                  JSON: {
                    type: 'Custom Event 4',
                    external_id: 'ext-123',
                    occurred_at: '2025-06-20 00:05:00.000',
                    properties: {
                      customProp7: 'value7',
                      customProp8: 'value8',
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(1)],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
