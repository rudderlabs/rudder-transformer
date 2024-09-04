import { destination } from '../commonConfig';

export const trackTestData = [
  {
    name: 'smartly',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              event: 'Add to cart',
              properties: {
                platform: 'meta',
                ad_unit_id: '228287',
                ad_interaction_time: 1735680000,
                email: 'eventIdn01@sample.com',
              },
              type: 'track',
              userId: 'eventIdn01',
            },
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              destinationId: 'dummyDestId',
              jobId: '1',
            },
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://s2s.smartly.io/events',
              headers: {},
              params: {},
              body: {
                JSON: {
                  platform: 'meta',
                  ad_unit_id: '228287',
                  ad_interaction_time: 1735680000,
                  conversions: '1',
                  event_name: 'Add to cart',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
