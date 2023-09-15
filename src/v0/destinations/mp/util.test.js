const { combineBatchRequestsWithSameJobIds } = require('./util');

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

describe('Mixpanel utils test', () => {
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
