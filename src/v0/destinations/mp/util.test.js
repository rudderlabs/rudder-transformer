const {
  combineBatchRequestsWithSameJobIds,
  groupEventsByType,
  groupEventsByEndpoint,
  batchEvents,
} = require('./util');

const destinationMock = {
  Config: {
    token: 'test_api_token',
    prefixProperties: true,
    useNativeSDK: false,
    useOldMapping: true,
  },
  DestinationDefinition: {
    DisplayName: 'Mixpanel',
    ID: 'test_destination_definition_id',
    Name: 'MP',
  },
  Enabled: true,
  ID: 'test_id',
  Name: 'Mixpanel',
  Transformations: [],
};

const maxBatchSizeMock = 2;

describe('Mixpanel utils test', () => {
  describe('Unit test cases for groupEventsByEndpoint', () => {
    it('should return an object with empty arrays for all properties when the events array is empty', () => {
      const events = [];
      const result = groupEventsByEndpoint(events);
      expect(result).toEqual({
        engageEvents: [],
        groupsEvents: [],
        trackEvents: [],
        importEvents: [],
        batchErrorRespList: [],
      });
    });

    it('should return an object with all properties containing their respective events when the events array contains events of all types', () => {
      const events = [
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:1}]',
              },
            },
            userId: 'user1',
          },
        },
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:2}]',
              },
            },
            userId: 'user2',
          },
        },
        {
          message: {
            endpoint: '/groups',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:3}]',
              },
            },
            userId: 'user1',
          },
        },
        {
          message: {
            endpoint: '/track',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:4}]',
              },
            },
            userId: 'user1',
          },
        },
        {
          message: {
            endpoint: '/import',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:5}]',
              },
            },
            userId: 'user2',
          },
        },
        { error: 'Message type abc not supported' },
      ];
      const result = groupEventsByEndpoint(events);
      expect(result).toEqual({
        engageEvents: [
          {
            message: {
              endpoint: '/engage',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:1}]',
                },
              },
              userId: 'user1',
            },
          },
          {
            message: {
              endpoint: '/engage',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:2}]',
                },
              },
              userId: 'user2',
            },
          },
        ],
        groupsEvents: [
          {
            message: {
              endpoint: '/groups',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:3}]',
                },
              },
              userId: 'user1',
            },
          },
        ],
        trackEvents: [
          {
            message: {
              endpoint: '/track',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:4}]',
                },
              },
              userId: 'user1',
            },
          },
        ],
        importEvents: [
          {
            message: {
              endpoint: '/import',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:5}]',
                },
              },
              userId: 'user2',
            },
          },
        ],
        batchErrorRespList: [{ error: 'Message type abc not supported' }],
      });
    });
  });

  describe('Unit test cases for batchEvents', () => {
    it('should return an array of batched events with correct payload and metadata', () => {
      const successRespList = [
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{"prop":1}]',
              },
            },
            headers: {},
            params: {},
            userId: 'user1',
          },
          metadata: { jobId: 3 },
        },
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{"prop":2}]',
              },
            },
            headers: {},
            params: {},
            userId: 'user2',
          },
          metadata: { jobId: 4 },
        },
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{"prop":3}]',
              },
            },
            headers: {},
            params: {},
            userId: 'user2',
          },
          metadata: { jobId: 6 },
        },
      ];

      const result = batchEvents(successRespList, maxBatchSizeMock);

      expect(result).toEqual([
        {
          batched: true,
          batchedRequest: {
            body: { FORM: {}, JSON: {}, JSON_ARRAY: { batch: '[{"prop":1},{"prop":2}]' }, XML: {} },
            endpoint: '/engage',
            files: {},
            headers: {},
            method: 'POST',
            params: {},
            type: 'REST',
            version: '1',
          },
          destination: undefined,
          metadata: [{ jobId: 3 }, { jobId: 4 }],
          statusCode: 200,
        },
        {
          batched: true,
          batchedRequest: {
            body: { FORM: {}, JSON: {}, JSON_ARRAY: { batch: '[{"prop":3}]' }, XML: {} },
            endpoint: '/engage',
            files: {},
            headers: {},
            method: 'POST',
            params: {},
            type: 'REST',
            version: '1',
          },
          destination: undefined,
          metadata: [{ jobId: 6 }],
          statusCode: 200,
        },
      ]);
    });

    it('should return an empty array when successRespList is empty', () => {
      const successRespList = [];
      const result = batchEvents(successRespList, maxBatchSizeMock);
      expect(result).toEqual([]);
    });
  });

  describe('Unit test cases for combineBatchRequestsWithSameJobIds', () => {
    it('Combine batch request with same jobIds', async () => {
      const input = [
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/import/',
          },
          metadata: [
            {
              jobId: 3,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 3,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/import/',
          },
          metadata: [
            {
              jobId: 6,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];

      const expectedOutput = [
        {
          batchedRequest: [
            {
              endpoint: 'https://api.mixpanel.com/track/',
            },
            {
              endpoint: 'https://api.mixpanel.com/engage/',
            },
            {
              endpoint: 'https://api.mixpanel.com/import/',
            },
          ],
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
            {
              jobId: 3,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/import/',
          },
          metadata: [
            {
              jobId: 6,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];
      expect(combineBatchRequestsWithSameJobIds(input)).toEqual(expectedOutput);
    });

    it('Each batchRequest contains unique jobIds (no event multiplexing)', async () => {
      const input = [
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 2,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];

      const expectedOutput = [
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },

          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 2,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];
      expect(combineBatchRequestsWithSameJobIds(input)).toEqual(expectedOutput);
    });
  });
});
