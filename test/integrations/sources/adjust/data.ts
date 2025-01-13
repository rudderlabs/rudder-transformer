import { skip } from 'node:test';
import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValueOnce('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data = [
  {
    name: 'adjust',
    description: 'Simple track call',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            id: 'adjust',
            query_parameters: {
              gps_adid: ['38400000-8cf0-11bd-b23e-10b96e40000d'],
              adid: ['18546f6171f67e29d1cb983322ad1329'],
              tracker_token: ['abc'],
              custom: ['custom'],
              tracker_name: ['dummy'],
              created_at: ['1404214665'],
              event_name: ['Click'],
            },
            updated_at: '2023-02-10T12:16:07.251Z',
            created_at: '2023-02-10T12:05:04.402Z',
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    integration: {
                      name: 'Adjust',
                    },
                    device: {
                      'id ': '18546f6171f67e29d1cb983322ad1329',
                    },
                  },
                  integrations: {
                    Adjust: false,
                  },
                  type: 'track',
                  event: 'Click',
                  originalTimestamp: '2014-07-01T11:37:45.000Z',
                  timestamp: '2014-07-01T11:37:45.000Z',
                  properties: {
                    gps_adid: '38400000-8cf0-11bd-b23e-10b96e40000d',
                    tracker_token: 'abc',
                    custom: 'custom',
                    tracker_name: 'dummy',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'adjust',
    description: 'Simple track call with no query parameters',
    module: 'source',
    version: 'v0',
    skipGo: 'FIXME',
    input: {
      request: {
        body: [
          {
            id: 'adjust',
            updated_at: '2023-02-10T12:16:07.251Z',
            created_at: '2023-02-10T12:05:04.402Z',
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Query_parameters is missing',
            statTags: {
              destinationId: 'Non determinable',
              errorCategory: 'transformation',
              implementation: 'native',
              module: 'source',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'adjust',
    description: 'Simple track call with wrong created at',
    module: 'source',
    version: 'v0',
    skipGo: 'FIXME',
    input: {
      request: {
        body: [
          {
            id: 'adjust',
            query_parameters: {
              gps_adid: ['38400000-8cf0-11bd-b23e-10b96e40000d'],
              adid: ['18546f6171f67e29d1cb983322ad1329'],
              tracker_token: ['abc'],
              custom: ['custom'],
              tracker_name: ['dummy'],
              created_at: ['test'],
              event_name: ['Click'],
            },
            updated_at: '2023-02-10T12:16:07.251Z',
            created_at: 'test',
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Failed to parse timestamp: "test"',
            statTags: {
              destinationId: 'Non determinable',
              errorCategory: 'transformation',
              implementation: 'native',
              module: 'source',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
];
