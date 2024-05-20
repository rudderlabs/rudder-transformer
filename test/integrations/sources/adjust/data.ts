import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
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
                  properties: {
                    gps_adid: '38400000-8cf0-11bd-b23e-10b96e40000d',
                    tracker_token: 'abc',
                    custom: 'custom',
                    tracker_name: 'dummy',
                  },
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
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
];
