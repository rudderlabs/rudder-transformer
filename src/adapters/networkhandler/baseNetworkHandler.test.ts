import { NetworkError } from '@rudderstack/integrations-lib';
import { BaseNetworkHandler } from './baseNetworkHandler';
import { ResponseParams } from '../../types';

describe('BaseNetworkHandler', () => {
  let baseNetworkHandler: BaseNetworkHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    baseNetworkHandler = new BaseNetworkHandler();
  });

  describe('responseHandler', () => {
    it('should handle successful responses correctly', () => {
      // Create test data
      const destType = 'test_destination';
      const status = 200;
      const metadata = {
        jobId: 1,
        attemptNum: 1,
        userId: 'test-user',
        sourceId: 'test-source',
        destinationId: 'test-destination',
        workspaceId: 'test-workspace',
        secret: { accessToken: 'test-token' },
        dontBatch: false,
      };

      const responseParams: ResponseParams = {
        destinationResponse: {
          status,
          response: { message: 'Success' },
        },
        destType,
        rudderJobMetadata: metadata,
      };

      // Call the method
      const result = baseNetworkHandler.responseHandler(responseParams);

      // Verify the result
      expect(result).toEqual({
        status,
        message: `[Base Response Handler] Request for destination: ${destType} Processed Successfully`,
        destinationResponse: responseParams.destinationResponse,
        response: [
          {
            statusCode: status,
            metadata,
            error: 'success',
          },
        ],
      });
    });

    it('should handle successful responses with multiple metadata correctly', () => {
      // Create test data
      const destType = 'test_destination';
      const status = 200;
      const metadata1 = {
        jobId: 1,
        attemptNum: 1,
        userId: 'test-user-1',
        sourceId: 'test-source',
        destinationId: 'test-destination',
        workspaceId: 'test-workspace',
        secret: { accessToken: 'test-token' },
        dontBatch: false,
      };

      const metadata2 = {
        jobId: 2,
        attemptNum: 1,
        userId: 'test-user-2',
        sourceId: 'test-source',
        destinationId: 'test-destination',
        workspaceId: 'test-workspace',
        secret: { accessToken: 'test-token' },
        dontBatch: false,
      };

      const responseParams: ResponseParams = {
        destinationResponse: {
          status,
          response: { message: 'Success' },
        },
        destType,
        rudderJobMetadata: [metadata1, metadata2],
      };

      // Call the method
      const result = baseNetworkHandler.responseHandler(responseParams);

      // Verify the result
      expect(result).toEqual({
        status,
        message: `[Base Response Handler] Request for destination: ${destType} Processed Successfully`,
        destinationResponse: responseParams.destinationResponse,
        response: [
          {
            statusCode: status,
            metadata: metadata1,
            error: 'success',
          },
          {
            statusCode: status,
            metadata: metadata2,
            error: 'success',
          },
        ],
      });
    });

    it('should throw NetworkError for unsuccessful responses', () => {
      // Create test data
      const destType = 'test_destination';
      const status = 400;
      const metadata = {
        jobId: 1,
        attemptNum: 1,
        userId: 'test-user',
        sourceId: 'test-source',
        destinationId: 'test-destination',
        workspaceId: 'test-workspace',
        secret: { accessToken: 'test-token' },
        dontBatch: false,
      };

      const responseParams: ResponseParams = {
        destinationResponse: {
          status,
          response: { message: 'Bad Request' },
        },
        destType,
        rudderJobMetadata: metadata,
      };

      // Call the method and expect it to throw
      expect(() => baseNetworkHandler.responseHandler(responseParams)).toThrow(NetworkError);
    });

    it('should handle edge cases with undefined or null values', () => {
      // Create test data with minimal required fields
      const responseParams: ResponseParams = {
        destinationResponse: {
          status: 200,
        },
        rudderJobMetadata: {
          jobId: 1,
          attemptNum: 1,
          userId: 'test-user',
          sourceId: 'test-source',
          destinationId: 'test-destination',
          workspaceId: 'test-workspace',
          secret: {},
          dontBatch: false,
        },
      };

      // Call the method
      const result = baseNetworkHandler.responseHandler(responseParams);

      // Verify the result
      expect(result).toEqual({
        status: 200,
        message:
          '[Base Response Handler] Request for destination: undefined Processed Successfully',
        destinationResponse: responseParams.destinationResponse,
        response: [
          {
            statusCode: 200,
            metadata: responseParams.rudderJobMetadata,
            error: 'success',
          },
        ],
      });
    });
  });
});
