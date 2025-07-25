import { TrackIdentifyStrategy } from './track-identify';
import { IterableBulkProxyInput, GenericProxyHandlerInput } from '../types';
import { TransformerProxyError } from '../../../../v0/util/errorTypes';

// Helper function to create valid metadata objects
const createMetadata = (jobId: number, userId: string) => ({
  jobId,
  userId,
  attemptNum: 1,
  sourceId: 'source1',
  destinationId: 'dest1',
  workspaceId: 'workspace1',
  secret: {},
  dontBatch: false,
});

describe('TrackIdentifyStrategy', () => {
  let strategy: TrackIdentifyStrategy;

  beforeEach(() => {
    strategy = new TrackIdentifyStrategy();
  });

  describe('handleSuccess', () => {
    it('should handle successful response with events', async () => {
      const mockInput: IterableBulkProxyInput = {
        destinationResponse: {
          status: 200,
          response: {
            successCount: 3,
            failCount: 0,
          },
        },
        rudderJobMetadata: [
          createMetadata(1, 'user1'),
          createMetadata(2, 'user2'),
          createMetadata(3, 'user3'),
        ],
        destType: 'iterable',
        destinationRequest: {
          body: {
            JSON: {
              events: [
                { email: 'test1@example.com', eventName: 'test_event_1' },
                { email: 'test2@example.com', eventName: 'test_event_2' },
                { email: 'test3@example.com', eventName: 'test_event_3' },
              ],
            },
          },
        },
      };

      const result = await strategy.handleSuccess(mockInput);

      expect(result).toEqual({
        status: 200,
        message: '[ITERABLE Response Handler] - Request Processed Successfully',
        destinationResponse: mockInput.destinationResponse,
        response: [
          {
            statusCode: 200,
            metadata: createMetadata(1, 'user1'),
            error: 'success',
          },
          {
            statusCode: 200,
            metadata: createMetadata(2, 'user2'),
            error: 'success',
          },
          {
            statusCode: 200,
            metadata: createMetadata(3, 'user3'),
            error: 'success',
          },
        ],
      });
    });

    it('should handle successful response with users', async () => {
      const mockInput: IterableBulkProxyInput = {
        destinationResponse: {
          status: 200,
          response: {
            successCount: 2,
            failCount: 0,
          },
        },
        rudderJobMetadata: [createMetadata(1, 'user1'), createMetadata(2, 'user2')],
        destType: 'iterable',
        destinationRequest: {
          body: {
            JSON: {
              users: [
                { email: 'user1@example.com', userId: 'user1' },
                { email: 'user2@example.com', userId: 'user2' },
              ],
            },
          },
        },
      };

      const result = await strategy.handleSuccess(mockInput);

      expect(result).toEqual({
        status: 200,
        message: '[ITERABLE Response Handler] - Request Processed Successfully',
        destinationResponse: mockInput.destinationResponse,
        response: [
          {
            statusCode: 200,
            metadata: createMetadata(1, 'user1'),
            error: 'success',
          },
          {
            statusCode: 200,
            metadata: createMetadata(2, 'user2'),
            error: 'success',
          },
        ],
      });
    });

    it('should handle successful response with partial failures', async () => {
      const mockInput: IterableBulkProxyInput = {
        destinationResponse: {
          status: 200,
          response: {
            successCount: 2,
            failCount: 1,
            invalidEmails: ['invalid@example.com'],
            disallowedEventNames: ['blocked_event'],
          },
        },
        rudderJobMetadata: [
          createMetadata(1, 'user1'),
          createMetadata(2, 'user2'),
          createMetadata(3, 'user3'),
        ],
        destType: 'iterable',
        destinationRequest: {
          body: {
            JSON: {
              events: [
                { email: 'valid@example.com', eventName: 'valid_event' },
                { email: 'invalid@example.com', eventName: 'valid_event' },
                { email: 'valid2@example.com', eventName: 'blocked_event' },
              ],
            },
          },
        },
      };

      const result = await strategy.handleSuccess(mockInput);

      expect(result.status).toBe(200);
      expect(result.message).toBe('[ITERABLE Response Handler] - Request Processed Successfully');
      expect(result.destinationResponse).toBe(mockInput.destinationResponse);
      expect(result.response).toHaveLength(3);

      // First event should be successful
      expect(result.response[0]).toEqual({
        statusCode: 200,
        metadata: createMetadata(1, 'user1'),
        error: 'success',
      });

      // Second event should have email error
      expect(result.response[1]).toEqual({
        statusCode: 400,
        metadata: createMetadata(2, 'user2'),
        error: 'email error:"invalid@example.com" in "invalidEmails".',
      });

      // Third event should have eventName error
      expect(result.response[2]).toEqual({
        statusCode: 400,
        metadata: createMetadata(3, 'user3'),
        error: 'eventName error:"blocked_event" in "disallowedEventNames".',
      });
    });

    it('should handle successful response with no events or users', async () => {
      const mockInput: IterableBulkProxyInput = {
        destinationResponse: {
          status: 200,
          response: {
            successCount: 0,
            failCount: 0,
          },
        },
        rudderJobMetadata: [],
        destType: 'iterable',
        destinationRequest: {
          body: {
            JSON: {},
          },
        },
      };

      const result = await strategy.handleSuccess(mockInput);

      expect(result).toEqual({
        status: 200,
        message: '[ITERABLE Response Handler] - Request Processed Successfully',
        destinationResponse: mockInput.destinationResponse,
        response: [],
      });
    });

    it('should handle successful response with empty events array', async () => {
      const mockInput: IterableBulkProxyInput = {
        destinationResponse: {
          status: 200,
          response: {
            successCount: 0,
            failCount: 0,
          },
        },
        rudderJobMetadata: [],
        destType: 'iterable',
        destinationRequest: {
          body: {
            JSON: {
              events: [],
            },
          },
        },
      };

      const result = await strategy.handleSuccess(mockInput);

      expect(result).toEqual({
        status: 200,
        message: '[ITERABLE Response Handler] - Request Processed Successfully',
        destinationResponse: mockInput.destinationResponse,
        response: [],
      });
    });

    it('should handle successful response with complex error scenarios', async () => {
      const mockInput: IterableBulkProxyInput = {
        destinationResponse: {
          status: 200,
          response: {
            successCount: 1,
            failCount: 2,
            invalidEmails: ['bad@example.com'],
            invalidUserIds: ['bad_user'],
            disallowedEventNames: ['blocked_event'],
          },
        },
        rudderJobMetadata: [
          createMetadata(1, 'user1'),
          createMetadata(2, 'user2'),
          createMetadata(3, 'user3'),
        ],
        destType: 'iterable',
        destinationRequest: {
          body: {
            JSON: {
              events: [
                { email: 'good@example.com', eventName: 'good_event' },
                { email: 'bad@example.com', eventName: 'good_event' },
                { email: 'good2@example.com', eventName: 'blocked_event' },
              ],
            },
          },
        },
      };

      const result = await strategy.handleSuccess(mockInput);

      expect(result.status).toBe(200);
      expect(result.response).toHaveLength(3);

      // First event should be successful
      expect(result.response[0]).toEqual({
        statusCode: 200,
        metadata: createMetadata(1, 'user1'),
        error: 'success',
      });

      // Second event should have email error
      expect(result.response[1]).toEqual({
        statusCode: 400,
        metadata: createMetadata(2, 'user2'),
        error: 'email error:"bad@example.com" in "invalidEmails".',
      });

      // Third event should have eventName error
      expect(result.response[2]).toEqual({
        statusCode: 400,
        metadata: createMetadata(3, 'user3'),
        error: 'eventName error:"blocked_event" in "disallowedEventNames".',
      });
    });
  });

  describe('handleError', () => {
    it('should handle error response with params', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 400,
          response: {
            params: { error: 'Bad Request' },
          },
        },
        rudderJobMetadata: [createMetadata(1, 'user1'), createMetadata(2, 'user2')],
        destType: 'iterable',
        destinationRequest: {} as any,
      };

      expect(() => strategy.handleError(mockInput)).toThrow(TransformerProxyError);

      try {
        strategy.handleError(mockInput);
      } catch (error) {
        expect(error).toBeInstanceOf(TransformerProxyError);
        const transformerError = error as TransformerProxyError;
        expect(transformerError.message).toContain(
          'ITERABLE: Error transformer proxy during ITERABLE response transformation',
        );
        expect(transformerError.message).toContain('{"error":"Bad Request"}');
        expect(transformerError.status).toBe(400);
        expect(transformerError.response).toEqual([
          {
            statusCode: 400,
            metadata: createMetadata(1, 'user1'),
            error: '{"error":"Bad Request"}',
          },
          {
            statusCode: 400,
            metadata: createMetadata(2, 'user2'),
            error: '{"error":"Bad Request"}',
          },
        ]);
      }
    });

    it('should handle error response with msg', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 500,
          response: {
            msg: 'Internal Server Error',
          },
        },
        rudderJobMetadata: [createMetadata(1, 'user1')],
        destType: 'iterable',
        destinationRequest: {} as any,
      };

      expect(() => strategy.handleError(mockInput)).toThrow(TransformerProxyError);

      try {
        strategy.handleError(mockInput);
      } catch (error) {
        expect(error).toBeInstanceOf(TransformerProxyError);
        const transformerError = error as TransformerProxyError;
        expect(transformerError.message).toContain('Internal Server Error');
        expect(transformerError.status).toBe(500);
        expect(transformerError.response).toEqual([
          {
            statusCode: 500,
            metadata: createMetadata(1, 'user1'),
            error: '"Internal Server Error"',
          },
        ]);
      }
    });

    it('should handle error response with message', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 403,
          response: {
            message: 'Forbidden',
          },
        },
        rudderJobMetadata: [createMetadata(1, 'user1')],
        destType: 'iterable',
        destinationRequest: {} as any,
      };

      expect(() => strategy.handleError(mockInput)).toThrow(TransformerProxyError);

      try {
        strategy.handleError(mockInput);
      } catch (error) {
        expect(error).toBeInstanceOf(TransformerProxyError);
        const transformerError = error as TransformerProxyError;
        expect(transformerError.message).toContain('Forbidden');
        expect(transformerError.status).toBe(403);
        expect(transformerError.response).toEqual([
          {
            statusCode: 403,
            metadata: createMetadata(1, 'user1'),
            error: '"Forbidden"',
          },
        ]);
      }
    });

    it('should handle error response with unknown error format', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 404,
          response: {},
        },
        rudderJobMetadata: [createMetadata(1, 'user1')],
        destType: 'iterable',
        destinationRequest: {} as any,
      };

      expect(() => strategy.handleError(mockInput)).toThrow(TransformerProxyError);

      try {
        strategy.handleError(mockInput);
      } catch (error) {
        expect(error).toBeInstanceOf(TransformerProxyError);
        const transformerError = error as TransformerProxyError;
        expect(transformerError.message).toContain('unknown error format');
        expect(transformerError.status).toBe(404);
        expect(transformerError.response).toEqual([
          {
            statusCode: 404,
            metadata: createMetadata(1, 'user1'),
            error: 'unknown error format',
          },
        ]);
      }
    });

    it('should handle error response with complex error object', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 422,
          response: {
            params: {
              errors: ['Validation failed', 'Invalid email format'],
              code: 'VALIDATION_ERROR',
            },
          },
        },
        rudderJobMetadata: [
          createMetadata(1, 'user1'),
          createMetadata(2, 'user2'),
          createMetadata(3, 'user3'),
        ],
        destType: 'iterable',
        destinationRequest: {} as any,
      };

      expect(() => strategy.handleError(mockInput)).toThrow(TransformerProxyError);

      try {
        strategy.handleError(mockInput);
      } catch (error) {
        expect(error).toBeInstanceOf(TransformerProxyError);
        const transformerError = error as TransformerProxyError;
        expect(transformerError.message).toContain(
          '{"errors":["Validation failed","Invalid email format"],"code":"VALIDATION_ERROR"}',
        );
        expect(transformerError.status).toBe(422);
        expect(transformerError.response).toHaveLength(3);
        expect(transformerError.response[0].statusCode).toBe(422);
        expect(transformerError.response[0].error).toBe(
          '{"errors":["Validation failed","Invalid email format"],"code":"VALIDATION_ERROR"}',
        );
      }
    });
  });
});
