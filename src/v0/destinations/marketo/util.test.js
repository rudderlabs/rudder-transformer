const { getAuthToken } = require('./util');
const { httpGET } = require('../../../adapters/network');
const stats = require('../../../util/stats');
const {
  RetryableError,
  filter,
  UnhandledStatusCodeError,
  ThrottledError,
} = require('@rudderstack/integrations-lib');

jest.mock('../../../adapters/network');
jest.mock('../../../util/stats');

describe('getAuthToken', () => {
  const mockAuthCache = {
    get: jest.fn().mockImplementation(async (key, fn) => fn()),
  };

  const mockFormattedDestination = {
    ID: 'test-dest-id',
    accountId: 'test-account',
    clientId: 'test-client',
    clientSecret: 'test-secret',
  };

  const mockMetadata = {
    jobId: 'test-job',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: 'should successfully get auth token',
      mockResponse: {
        success: true,
        response: {
          data: {
            access_token: 'test-token',
            expires_in: 3600,
          },
          status: 200,
        },
      },
      expectedResult: {
        value: 'test-token',
        age: 3600,
      },
      expectedStats: {
        increment: {
          metric: 'marketo_fetch_token',
          tags: { status: 'success' },
        },
      },
    },
    {
      name: 'should handle expired token',
      mockResponse: {
        success: true,
        response: {
          data: {
            access_token: 'expired-token',
            expires_in: 0,
          },
          status: 200,
        },
      },
      expectedError: new RetryableError(
        'Request Failed for marketo, Access Token Expired (Retryable).During fetching auth token',
        500,
      ),
    },
    {
      name: 'should handle throttled status code',
      mockResponse: {
        response: {
          data: {
            errors: [
              {
                code: '606',
              },
            ],
          },
          status: 200,
        },
      },
      expectedError: new ThrottledError(
        'Request Failed for marketo, undefined (Throttled).During fetching auth token',
      ),
    },
    {
      name: 'should handle unknown status code',
      mockResponse: {
        response: {
          data: {
            errors: [
              {
                code: 'unknown-code',
              },
            ],
          },
          status: 200,
        },
      },
      expectedError: new UnhandledStatusCodeError('Error occurred During fetching auth token', {
        data: {
          errors: [{ code: 'unknown-code' }],
        },
      }),
    },
  ];

  filter(testCases).forEach(
    ({ name, mockResponse, expectedResult, expectedError, expectedStats }) => {
      it(name, async () => {
        httpGET.mockResolvedValueOnce(mockResponse);

        if (expectedError) {
          await expect(
            getAuthToken(mockAuthCache, mockFormattedDestination, mockMetadata),
          ).rejects.toThrow(expectedError);
        } else {
          const result = await getAuthToken(mockAuthCache, mockFormattedDestination, mockMetadata);
          expect(result).toEqual(expectedResult);
        }

        expect(httpGET).toHaveBeenCalledWith(
          'https://test-account.mktorest.com/identity/oauth/token',
          {
            params: {
              client_id: 'test-client',
              client_secret: 'test-secret',
              grant_type: 'client_credentials',
            },
          },
          {
            destType: 'marketo',
            feature: 'transformation',
            endpointPath: '/v1/leads',
            requestMethod: 'GET',
            module: 'router',
            metadata: mockMetadata,
          },
        );

        if (expectedStats) {
          expect(stats.increment).toHaveBeenCalledWith(
            expectedStats.increment.metric,
            expectedStats.increment.tags,
          );
        }
      });
    },
  );
});
