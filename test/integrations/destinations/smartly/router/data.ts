import { destination, routerInstrumentationErrorStatTags } from '../commonConfig';
import { defaultMockFns } from '../mocks';

export const data = [
  {
    name: 'smartly',
    id: 'Test 0 - router',
    description: 'Track call with multiplexing and batching',
    scenario: 'Framework+Buisness',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'product list viewed',
                properties: {
                  platform: 'meta',
                  conversions: 1,
                  ad_unit_id: '221187',
                  ad_interaction_time: 1690867200,
                },
              },
              metadata: { jobId: 2, userId: 'u2' },
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'add to cart',
                properties: {
                  conversions: 3,
                  platform: 'snapchat',
                  ad_unit_id: '77187',
                  ad_interaction_time: 1690867200,
                },
              },
              metadata: { jobId: 3, userId: 'u3' },
              destination,
            },
          ],
          destType: 'smartly',
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
              batchedRequest: {
                body: {
                  JSON: {
                    events: [
                      {
                        conversions: 1,
                        ad_unit_id: '221187',
                        platform: 'meta',
                        ad_interaction_time: 1690867200,
                        event_name: 'event1',
                      },
                      {
                        conversions: 1,
                        ad_unit_id: '221187',
                        platform: 'meta',
                        ad_interaction_time: 1690867200,
                        event_name: 'event2',
                      },
                      {
                        conversions: 3,
                        ad_unit_id: '77187',
                        platform: 'snapchat',
                        ad_interaction_time: 1690867200,
                        event_name: 'add to cart',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://s2s.smartly.io/events/batch',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer testAuthToken`,
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  jobId: 2,
                  userId: 'u2',
                },
                {
                  jobId: 3,
                  userId: 'u3',
                },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
    mockFns: () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-02-01'));
    },
  },
  {
    name: 'smartly',
    id: 'Test 1 - router',
    description: 'Batch calls with 4 succesfull events including multiplexing and 2 failed events',
    scenario: 'Framework+Buisness',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'product list viewed',
                properties: {
                  platform: 'meta',
                  conversions: 1,
                  ad_unit_id: '221187',
                  ad_interaction_time: 1690867200,
                },
              },
              metadata: { jobId: 11, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'purchase',
                userId: 'testuserId1',
                integrations: { All: true },
                properties: {
                  conversions: 3,
                  platform: 'snapchat',
                  ad_unit_id: '77187',
                  ad_interaction_time: 1690867200,
                },
              },
              metadata: { jobId: 13, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'track',
                userId: 'testuserId1',
                integrations: { All: true },
                properties: {
                  conversions: 3,
                  platform: 'snapchat',
                  ad_unit_id: '12387',
                  ad_interaction_time: 1690867200,
                },
              },
              metadata: { jobId: 14, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'random event',
                userId: 'testuserId1',
                integrations: { All: true },
                properties: {
                  conversions: 3,
                  ad_unit_id: '77187',
                  ad_interaction_time: 1690867200,
                },
              },
              metadata: { jobId: 15, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'add to cart',
                userId: 'testuserId1',
                integrations: { All: true },
                properties: {
                  conversions: 3,
                  platform: 'tiktok',
                  ad_unit_id: '789187',
                  ad_interaction_time: 1690867200,
                },
              },
              metadata: { jobId: 16, userId: 'u1' },
              destination,
            },
          ],
          destType: 'smartly',
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
              destination,
              error: 'Event is not defined or is not String',
              metadata: [{ jobId: 14, userId: 'u1' }],
              statTags: routerInstrumentationErrorStatTags,
              statusCode: 400,
            },
            {
              batched: false,
              destination,
              error: 'Missing required value from ["properties.platform"]',
              metadata: [{ jobId: 15, userId: 'u1' }],
              statTags: routerInstrumentationErrorStatTags,
              statusCode: 400,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://s2s.smartly.io/events/batch',
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        platform: 'meta',
                        conversions: 1,
                        event_name: 'event1',
                        ad_unit_id: '221187',
                        ad_interaction_time: 1690867200,
                      },
                      {
                        platform: 'meta',
                        conversions: 1,
                        event_name: 'event2',
                        ad_unit_id: '221187',
                        ad_interaction_time: 1690867200,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer testAuthToken`,
                },
                files: {},
              },
              metadata: [{ jobId: 11, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://s2s.smartly.io/events/batch',
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        conversions: 3,
                        event_name: 'purchase',
                        platform: 'snapchat',
                        ad_unit_id: '77187',
                        ad_interaction_time: 1690867200,
                      },
                      {
                        conversions: 3,
                        event_name: 'add to cart',
                        platform: 'tiktok',
                        ad_unit_id: '789187',
                        ad_interaction_time: 1690867200,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer testAuthToken`,
                },
                files: {},
              },
              metadata: [
                { jobId: 13, userId: 'u1' },
                { jobId: 16, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
