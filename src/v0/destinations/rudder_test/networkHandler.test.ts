import { networkHandler, responseHandler, getTestBehaviorFromRequest } from './networkHandler';
import { NetworkError } from '@rudderstack/integrations-lib';

describe('rudder_test networkHandler', () => {
  describe('responseHandler', () => {
    const mockDestinationResponse = {
      response: { success: true },
      status: 200,
    };

    const mockDestinationRequest = {
      body: { JSON: {} },
      headers: {},
    };

    it('should return success response when status is 200 and no test behavior', () => {
      const responseParams = {
        destinationResponse: mockDestinationResponse,
        destinationRequest: mockDestinationRequest,
      };

      const result = responseHandler(responseParams);

      expect(result.status).toBe(200);
      expect(result.message).toBe('Request for RUDDER_TEST Processed Successfully');
      expect(result.destinationResponse).toEqual(mockDestinationResponse);
    });

    it('should throw NetworkError when destination response status is >= 400', () => {
      const failedResponse = {
        ...mockDestinationResponse,
        status: 500,
      };

      const responseParams = {
        destinationResponse: failedResponse,
        destinationRequest: mockDestinationRequest,
      };

      expect(() => {
        responseHandler(responseParams);
      }).toThrow(NetworkError);
    });

    it('should simulate error when testBehavior has statusCode in body', () => {
      const requestWithTestBehavior = {
        body: {
          JSON: {
            testBehavior: {
              statusCode: 400,
              errorMessage: 'Test error from body',
            },
          },
        },
        headers: {},
      };

      const responseParams = {
        destinationResponse: mockDestinationResponse,
        destinationRequest: requestWithTestBehavior,
      };

      expect(() => {
        responseHandler(responseParams);
      }).toThrow(NetworkError);
    });

    it('should use default error message when errorMessage is not provided', () => {
      const requestWithTestBehavior = {
        body: {
          JSON: {
            testBehavior: {
              statusCode: 422,
            },
          },
        },
        headers: {},
      };

      const responseParams = {
        destinationResponse: mockDestinationResponse,
        destinationRequest: requestWithTestBehavior,
      };

      expect(() => {
        responseHandler(responseParams);
      }).toThrow('Test error simulated for RUDDER_TEST');
    });

    it('should ignore testBehavior when statusCode is 200', () => {
      const requestWithTestBehavior = {
        body: {
          JSON: {
            testBehavior: {
              statusCode: 200,
              errorMessage: 'Should not throw',
            },
          },
        },
        headers: {},
      };

      const responseParams = {
        destinationResponse: mockDestinationResponse,
        destinationRequest: requestWithTestBehavior,
      };

      const result = responseHandler(responseParams);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Request for RUDDER_TEST Processed Successfully');
    });

    it('should handle missing destinationRequest gracefully', () => {
      const responseParams = {
        destinationResponse: mockDestinationResponse,
        destinationRequest: null,
      };

      const result = responseHandler(responseParams);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Request for RUDDER_TEST Processed Successfully');
    });

    it('should handle missing status in destinationResponse', () => {
      const responseParams = {
        destinationResponse: { response: { success: true } }, // no status
        destinationRequest: mockDestinationRequest,
      };

      const result = responseHandler(responseParams);
      expect(result.status).toBe(200); // should default to 200
    });
  });

  describe('networkHandler constructor', () => {
    it('should create networkHandler instance with all required methods', () => {
      const handler = new networkHandler();

      expect(handler.responseHandler).toBeDefined();
      expect(handler.proxy).toBeDefined();
      expect(handler.prepareProxy).toBeDefined();
      expect(handler.processAxiosResponse).toBeDefined();
      expect(typeof handler.responseHandler).toBe('function');
      expect(typeof handler.proxy).toBe('function');
      expect(typeof handler.prepareProxy).toBe('function');
      expect(typeof handler.processAxiosResponse).toBe('function');
    });
  });

  describe('mock proxy functions', () => {
    it('should mock proxy request with success response', async () => {
      const handler = new networkHandler();
      const mockRequest = {
        body: {
          JSON: {
            recordId: 'test123',
            action: 'insert',
          },
        },
      };

      const result = await handler.proxy(mockRequest);

      expect(result.success).toBe(true);
      expect(result.response.status).toBe(200);
      expect((result.response.data as any).recordId).toBe('test123');
    });

    it('should mock proxy request with error response based on testBehavior', async () => {
      const handler = new networkHandler();
      const mockRequest = {
        body: {
          JSON: {
            recordId: 'test123',
            action: 'insert',
            testBehavior: {
              statusCode: 400,
              errorMessage: 'Test error',
            },
          },
        },
      };

      const result = await handler.proxy(mockRequest);

      expect(result.success).toBe(false);
      expect(result.response.status).toBe(400);
      expect((result.response.data as any).error).toBe('Test error');
    });

    it('should mock prepareProxy by returning request as-is', () => {
      const handler = new networkHandler();
      const mockRequest = { body: { JSON: { test: 'data' } }, headers: {} };

      const result = handler.prepareProxy(mockRequest);

      expect(result).toEqual(mockRequest);
    });

    it('should mock processAxiosResponse correctly', () => {
      const handler = new networkHandler();
      const mockResponse = {
        success: true,
        response: {
          status: 200,
          statusText: 'OK',
          data: { message: 'success' },
        },
      };

      const result = handler.processAxiosResponse(mockResponse);

      if ('status' in result) {
        expect(result.status).toBe(200);
        expect(result.response).toEqual({ message: 'success' });
      }
    });

    it('should handle processAxiosResponse with no nested response', () => {
      const handler = new networkHandler();
      const mockResponse = {
        success: false,
        response: {
          status: 200,
          statusText: 'OK',
          data: 'direct',
        },
      };

      const result = handler.processAxiosResponse(mockResponse);

      // The function extracts response data and status
      expect(result).toEqual({
        response: 'direct',
        status: 200,
      });
    });
  });

  describe('getTestBehaviorFromRequest', () => {
    it('should extract testBehavior from JSON body', () => {
      const request = {
        body: {
          JSON: {
            testBehavior: { statusCode: 400 },
          },
        },
      };

      const result = getTestBehaviorFromRequest(request);
      expect(result).toEqual({ statusCode: 400 });
    });

    it('should return undefined when no testBehavior found', () => {
      const request = {
        body: { JSON: {} },
        headers: {},
      };

      const result = getTestBehaviorFromRequest(request);
      expect(result).toBeUndefined();
    });

    it('should return undefined when request structure is invalid', () => {
      const request = {
        body: {},
        headers: {},
      };

      const result = getTestBehaviorFromRequest(request);
      expect(result).toBeUndefined();
    });
  });
});
