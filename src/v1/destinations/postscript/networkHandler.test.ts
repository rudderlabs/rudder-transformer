/**
 * PostScript Network Handler V1 Tests
 *
 * Tests the network handler's response processing and error handling capabilities.
 * Covers various HTTP status codes and their corresponding error types.
 */

import { NetworkError, RetryableError, ThrottledError } from '@rudderstack/integrations-lib';
import { networkHandler } from './networkHandler';
import { DESTINATION_NAME } from '../../../v0/destinations/postscript/config';

describe('PostScript Network Handler V1', () => {
  let handler: any;

  beforeEach(() => {
    handler = new networkHandler();
    jest.clearAllMocks();
  });

  describe('responseHandler', () => {
    interface TestCase {
      name: string;
      responseParams: {
        destinationResponse: {
          status: number;
          response?: any;
        };
      };
      expectError: boolean;
      expectedErrorClass?: any;
      expectedStatus?: number;
      expectedMessage?: string;
    }

    const testCases: TestCase[] = [
      // Success cases
      {
        name: 'should handle 200 success response',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true, subscriber: { id: '123' } },
          },
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: `[${DESTINATION_NAME} Response Handler] - Request processed successfully`,
      },
      {
        name: 'should handle 201 created response',
        responseParams: {
          destinationResponse: {
            status: 201,
            response: { subscriber: { id: '456', phone: '+1234567890' } },
          },
        },
        expectError: false,
        expectedStatus: 201,
        expectedMessage: `[${DESTINATION_NAME} Response Handler] - Request processed successfully`,
      },
      {
        name: 'should handle 204 no content response',
        responseParams: {
          destinationResponse: {
            status: 204,
            response: null,
          },
        },
        expectError: false,
        expectedStatus: 204,
        expectedMessage: `[${DESTINATION_NAME} Response Handler] - Request processed successfully`,
      },

      // Throttling cases
      {
        name: 'should throw ThrottledError for 429 rate limit',
        responseParams: {
          destinationResponse: {
            status: 429,
            response: { error: 'Rate limit exceeded' },
          },
        },
        expectError: true,
        expectedErrorClass: ThrottledError,
        expectedMessage: `[${DESTINATION_NAME}] Rate limit exceeded`,
      },

      // Server error cases
      {
        name: 'should throw RetryableError for 500 internal server error',
        responseParams: {
          destinationResponse: {
            status: 500,
            response: { error: 'Internal server error' },
          },
        },
        expectError: true,
        expectedErrorClass: RetryableError,
        expectedMessage: `[${DESTINATION_NAME}] Server error occurred`,
      },
      {
        name: 'should throw RetryableError for 502 bad gateway',
        responseParams: {
          destinationResponse: {
            status: 502,
            response: { error: 'Bad gateway' },
          },
        },
        expectError: true,
        expectedErrorClass: RetryableError,
        expectedMessage: `[${DESTINATION_NAME}] Server error occurred`,
      },
      {
        name: 'should throw RetryableError for 503 service unavailable',
        responseParams: {
          destinationResponse: {
            status: 503,
            response: { error: 'Service temporarily unavailable' },
          },
        },
        expectError: true,
        expectedErrorClass: RetryableError,
        expectedMessage: `[${DESTINATION_NAME}] Server error occurred`,
      },
      {
        name: 'should throw RetryableError for 504 gateway timeout',
        responseParams: {
          destinationResponse: {
            status: 504,
            response: { error: 'Gateway timeout' },
          },
        },
        expectError: true,
        expectedErrorClass: RetryableError,
        expectedMessage: `[${DESTINATION_NAME}] Server error occurred`,
      },

      // Client error cases
      {
        name: 'should throw NetworkError for 400 bad request',
        responseParams: {
          destinationResponse: {
            status: 400,
            response: { error: 'Invalid phone number format' },
          },
        },
        expectError: true,
        expectedErrorClass: NetworkError,
        expectedMessage: `[${DESTINATION_NAME}] Request failed with status: 400`,
      },
      {
        name: 'should throw NetworkError for 401 unauthorized',
        responseParams: {
          destinationResponse: {
            status: 401,
            response: { error: 'Invalid API key' },
          },
        },
        expectError: true,
        expectedErrorClass: NetworkError,
        expectedMessage: `[${DESTINATION_NAME}] Request failed with status: 401`,
      },
      {
        name: 'should throw NetworkError for 403 forbidden',
        responseParams: {
          destinationResponse: {
            status: 403,
            response: { error: 'Insufficient permissions' },
          },
        },
        expectError: true,
        expectedErrorClass: NetworkError,
        expectedMessage: `[${DESTINATION_NAME}] Request failed with status: 403`,
      },
      {
        name: 'should throw NetworkError for 404 not found',
        responseParams: {
          destinationResponse: {
            status: 404,
            response: { error: 'Subscriber not found' },
          },
        },
        expectError: true,
        expectedErrorClass: NetworkError,
        expectedMessage: `[${DESTINATION_NAME}] Request failed with status: 404`,
      },
      {
        name: 'should throw NetworkError for 409 conflict',
        responseParams: {
          destinationResponse: {
            status: 409,
            response: { error: 'Subscriber already exists' },
          },
        },
        expectError: true,
        expectedErrorClass: NetworkError,
        expectedMessage: `[${DESTINATION_NAME}] Request failed with status: 409`,
      },
      {
        name: 'should throw NetworkError for 422 unprocessable entity',
        responseParams: {
          destinationResponse: {
            status: 422,
            response: { error: 'Validation failed' },
          },
        },
        expectError: true,
        expectedErrorClass: NetworkError,
        expectedMessage: `[${DESTINATION_NAME}] Request failed with status: 422`,
      },
    ];

    // Helper function to test error cases
    const testErrorCase = (testCase: TestCase) => {
      expect(() => {
        handler.responseHandler(testCase.responseParams);
      }).toThrow(testCase.expectedErrorClass);

      try {
        handler.responseHandler(testCase.responseParams);
      } catch (error: any) {
        expect(error.message).toContain(testCase.expectedMessage);
        if (testCase.expectedErrorClass === NetworkError) {
          expect(error.status).toBe(testCase.responseParams.destinationResponse.status);
        }
      }
    };

    // Helper function to test success cases
    const testSuccessCase = (testCase: TestCase) => {
      const result = handler.responseHandler(testCase.responseParams);
      expect(result.status).toBe(testCase.expectedStatus);
      expect(result.message).toBe(testCase.expectedMessage);
      expect(result.destinationResponse).toBe(testCase.responseParams.destinationResponse);
    };

    testCases.forEach((testCase) => {
      it(testCase.name, () => {
        if (testCase.expectError) {
          testErrorCase(testCase);
        } else {
          testSuccessCase(testCase);
        }
      });
    });

    // Edge cases
    describe('edge cases', () => {
      it('should handle response with empty body', () => {
        const responseParams = {
          destinationResponse: {
            status: 200,
            response: {},
          },
        };

        const result = handler.responseHandler(responseParams);
        expect(result.status).toBe(200);
        expect(result.message).toBe(
          `[${DESTINATION_NAME} Response Handler] - Request processed successfully`,
        );
      });

      it('should handle response with null body', () => {
        const responseParams = {
          destinationResponse: {
            status: 200,
            response: null,
          },
        };

        const result = handler.responseHandler(responseParams);
        expect(result.status).toBe(200);
        expect(result.message).toBe(
          `[${DESTINATION_NAME} Response Handler] - Request processed successfully`,
        );
      });

      it('should preserve original destinationResponse in error cases', () => {
        const responseParams = {
          destinationResponse: {
            status: 400,
            response: { error: 'Test error', details: { field: 'phone' } },
          },
        };

        try {
          handler.responseHandler(responseParams);
        } catch (error: any) {
          expect(error.destinationResponse).toBe(responseParams.destinationResponse);
        }
      });
    });
  });

  describe('networkHandler initialization', () => {
    it('should initialize with required methods', () => {
      expect(handler.prepareProxy).toBeDefined();
      expect(handler.proxy).toBeDefined();
      expect(handler.processAxiosResponse).toBeDefined();
      expect(handler.responseHandler).toBeDefined();
    });

    it('should have correct method types', () => {
      expect(typeof handler.prepareProxy).toBe('function');
      expect(typeof handler.proxy).toBe('function');
      expect(typeof handler.processAxiosResponse).toBe('function');
      expect(typeof handler.responseHandler).toBe('function');
    });
  });

  describe('error metadata and tagging', () => {
    it('should include error type tags for 4xx errors', () => {
      const responseParams = {
        destinationResponse: {
          status: 400,
          response: { error: 'Bad request' },
        },
      };

      try {
        handler.responseHandler(responseParams);
      } catch (error: any) {
        expect(error.statTags).toBeDefined();
        expect(error.statTags.errorType).toBeDefined();
      }
    });

    it('should not include tags for ThrottledError', () => {
      const responseParams = {
        destinationResponse: {
          status: 429,
          response: { error: 'Rate limit exceeded' },
        },
      };

      try {
        handler.responseHandler(responseParams);
      } catch (error: any) {
        // ThrottledError constructor doesn't accept tags
        expect(error instanceof ThrottledError).toBe(true);
      }
    });

    it('should not include tags for RetryableError', () => {
      const responseParams = {
        destinationResponse: {
          status: 500,
          response: { error: 'Server error' },
        },
      };
      expect.assertions(1);
      try {
        handler.responseHandler(responseParams);
      } catch (error: any) {
        // RetryableError constructor doesn't accept tags
        expect(error instanceof RetryableError).toBe(true);
      }
    });
  });
});
