import { destination } from '../commonConfig';

export const data = [
  {
    name: 'smartly',
    id: 'Test 0 - router',
    description: 'Simple Batch call for track',
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
                  conversions: '1',
                  ad_unit_id: 221187,
                  ad_interaction_time: '1652826278',
                },
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'product list viewed',
                properties: {
                  platform: 'meta',
                  conversions: '1',
                  ad_unit_id: 221187,
                  ad_interaction_time: '1652826278',
                },
              },
              metadata: { jobId: 2, userId: 'u2' },
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
                  ad_unit_id: 77187,
                  ad_interaction_time: '2752826278',
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
                        conversions: '1',
                        event: 'event1',
                        ad_unit_id: 221187,
                        ad_interaction_time: '1652826278',
                      },
                      {
                        platform: 'meta',
                        conversions: '1',
                        event: 'event2',
                        ad_unit_id: 221187,
                        ad_interaction_time: '1652826278',
                      },
                      {
                        conversions: 3,
                        event: 'purchase',
                        platform: 'snapchat',
                        ad_unit_id: 77187,
                        ad_interaction_time: '2752826278',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                headers: {
                  'Content-Type': 'application/json',
                },
                files: {},
              },
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u2' },
                { jobId: 3, userId: 'u3' },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
];
