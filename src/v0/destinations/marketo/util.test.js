const { getAuthToken, getResponseHandlerData } = require('./util');
const { httpGET } = require('../../../adapters/network');
const stats = require('../../../util/stats');
const {
  RetryableError,
  filter,
  UnhandledStatusCodeError,
  ThrottledError,
  NetworkError,
  AbortedError,
  InstrumentationError,
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

      describe('getResponseHandlerData', () => {
        const mockAuthCache = {
          del: jest.fn(),
        };

        const mockFormattedDestination = {
          ID: 'test-dest-id',
        };

        const mockLookupMessage = '[Marketo Transformer]: During test operation';

        beforeEach(() => {
          jest.clearAllMocks();
        });

        const testCases = [
          {
            name: 'should handle successful response',
            mockResponse: {
              status: 200,
              response: {
                success: true,
                result: [{ id: '123', status: 'created' }],
              },
            },
            expectedResult: {
              success: true,
              result: [{ id: '123', status: 'created' }],
            },
          },
          {
            name: 'should handle authentication response',
            mockResponse: {
              status: 200,
              response: {
                access_token: 'test-token',
                expires_in: 3600,
              },
            },
            expectedResult: {
              access_token: 'test-token',
              expires_in: 3600,
            },
          },
          {
            name: 'should handle non-success HTTP status',
            mockResponse: {
              status: 404,
              response: {
                message: 'Not found',
              },
            },
            expectedError: new NetworkError('Request failed  with status: 404', 404),
          },
          {
            name: 'should handle abortable error code',
            mockResponse: {
              status: 200,
              response: {
                success: false,
                errors: [
                  {
                    code: '600',
                    message: 'Abortable error',
                  },
                ],
              },
            },
            expectedError: new AbortedError(
              'Request Failed for marketo, Abortable error (Aborted).[Marketo Transformer]: During test operation',
              400,
            ),
          },
          {
            name: 'should handle throttled error code',
            mockResponse: {
              status: 200,
              response: {
                success: false,
                errors: [
                  {
                    code: '606',
                    message: 'Throttled error',
                  },
                ],
              },
            },
            expectedError: new ThrottledError(
              'Request Failed for marketo, Throttled error (Throttled).[Marketo Transformer]: During test operation',
            ),
          },
          {
            name: 'should handle retryable error code',
            mockResponse: {
              status: 200,
              response: {
                success: false,
                errors: [
                  {
                    code: '601',
                    message: 'Retryable error',
                  },
                ],
              },
            },
            expectedError: new RetryableError(
              'Request Failed for marketo, Retryable error (Retryable).[Marketo Transformer]: During test operation',
              500,
            ),
          },
          {
            name: 'should handle unhandled error code',
            mockResponse: {
              status: 200,
              response: {
                success: false,
                errors: [
                  {
                    code: 'unknown',
                    message: 'Unknown error',
                  },
                ],
              },
            },
            expectedError: new UnhandledStatusCodeError(
              'Error occurred [Marketo Transformer]: During test operation -> Unknown error',
            ),
          },
          {
            name: 'should handle invalid status in nested response',
            mockResponse: {
              status: 200,
              response: {
                success: true,
                result: [
                  {
                    status: 'skipped',
                    reasons: [
                      {
                        code: '1001',
                        message: 'Invalid status',
                      },
                    ],
                  },
                ],
              },
            },
            expectedError: new InstrumentationError(
              'Request failed during: [Marketo Transformer]: During test operation, error: [{"code":"1001","message":"Invalid status"}]',
              400,
            ),
          },
          {
            name: 'should evict cache for invalid token errors',
            mockResponse: {
              status: 200,
              response: {
                success: false,
                errors: [
                  {
                    code: '601',
                    message: 'Access token invalid',
                  },
                ],
              },
            },
            expectedError: new RetryableError(
              'Request Failed for marketo, Access token invalid (Retryable).[Marketo Transformer]: During test operation',
              500,
            ),
            expectCacheEviction: true,
          },
        ];

        filter(testCases).forEach(
          ({ name, mockResponse, expectedResult, expectedError, expectCacheEviction }) => {
            it(name, () => {
              if (expectedError) {
                expect(() =>
                  getResponseHandlerData(
                    mockResponse,
                    mockLookupMessage,
                    mockFormattedDestination,
                    mockAuthCache,
                  ),
                ).toThrow(expectedError);

                if (expectCacheEviction) {
                  expect(mockAuthCache.del).toHaveBeenCalledWith(mockFormattedDestination.ID);
                }
              } else {
                const result = getResponseHandlerData(
                  mockResponse,
                  mockLookupMessage,
                  mockFormattedDestination,
                  mockAuthCache,
                );
                expect(result).toEqual(expectedResult);
              }
            });
          },
        );
      });
    },
  );
});
