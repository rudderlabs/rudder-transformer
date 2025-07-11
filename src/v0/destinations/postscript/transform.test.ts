/**
 * Unit tests for PostScript destination transform functions
 * Tests all exported functions from transform.ts to ensure 100% code coverage
 */

import { processRouterDest } from './transform';
import { PostscriptRouterRequest, PostscriptDestination, PostscriptBatchResponse } from './types';
import { RudderMessage } from '../../../types';
import { ConfigurationError } from '@rudderstack/integrations-lib';

// Mock external dependencies
jest.mock('../../util', () => ({
  handleRtTfSingleEventError: jest.fn(),
  getFieldValueFromMessage: jest.fn(),
  getDestinationExternalID: jest.fn(),
  getEventType: jest.fn(),
}));

jest.mock('./utils', () => ({
  performSubscriberLookup: jest.fn(),
  buildSubscriberPayload: jest.fn(),
  buildCustomEventPayload: jest.fn(),
  batchResponseBuilder: jest.fn(),
}));

// Mock implementations
const mockHandleRtTfSingleEventError = jest.fn();
const mockGetFieldValueFromMessage = jest.fn();
const mockGetDestinationExternalID = jest.fn();
const mockGetEventType = jest.fn();
const mockPerformSubscriberLookup = jest.fn();
const mockBuildSubscriberPayload = jest.fn();
const mockBuildCustomEventPayload = jest.fn();
const mockBatchResponseBuilder = jest.fn();

// Apply mocks
require('../../util').handleRtTfSingleEventError = mockHandleRtTfSingleEventError;
require('../../util').getFieldValueFromMessage = mockGetFieldValueFromMessage;
require('../../util').getDestinationExternalID = mockGetDestinationExternalID;
require('../../util').getEventType = mockGetEventType;
require('./utils').performSubscriberLookup = mockPerformSubscriberLookup;
require('./utils').buildSubscriberPayload = mockBuildSubscriberPayload;
require('./utils').buildCustomEventPayload = mockBuildCustomEventPayload;
require('./utils').batchResponseBuilder = mockBatchResponseBuilder;

describe('PostScript Transform', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock implementations
    mockBuildSubscriberPayload.mockReturnValue({
      phone_number: '+1234567890',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    });

    mockBuildCustomEventPayload.mockReturnValue({
      name: 'custom_event',
      subscriber_id: 'sub_123',
      occurred_at: '2023-01-01T00:00:00Z',
      properties: {},
    });

    mockBatchResponseBuilder.mockReturnValue([createMockBatchedResponse()]);
    mockGetDestinationExternalID.mockReturnValue(null);
    mockPerformSubscriberLookup.mockResolvedValue([
      { exists: false, identifierValue: '+1234567890', identifierType: 'phone' },
    ]);
  });

  // Helper function to create mock destination
  const createMockDestination = (): PostscriptDestination => ({
    ID: 'test_destination_id',
    Name: 'Test Destination',
    DestinationDefinition: {
      ID: 'test_destination_definition_id',
      Name: 'PostScript',
      DisplayName: 'PostScript',
      Config: {},
    },
    Config: {
      apiKey: 'test_api_key',
    },
    Enabled: true,
    Transformations: [],
    RevisionID: 'test_revision_id',
    WorkspaceID: 'test_workspace_id',
  });

  // Helper function to create mock router request
  const createMockRouterRequest = (
    message: Partial<RudderMessage>,
    destination?: PostscriptDestination,
  ): PostscriptRouterRequest => ({
    message: message as RudderMessage,
    metadata: {
      jobId: 1,
      sourceId: 'source_123',
      workspaceId: 'workspace_123',
      sourceType: 'http',
      sourceCategory: 'web',
      destinationId: 'dest_123',
      destinationType: 'postscript',
      messageId: 'msg_123',
    },
    destination: destination || createMockDestination(),
  });

  // Helper function to create mock batched response
  const createMockBatchedResponse = (): PostscriptBatchResponse => ({
    batchedRequest: {
      body: {
        JSON: {},
        JSON_ARRAY: {},
        XML: {},
        FORM: {},
      },
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: 'https://api.postscript.io/api/v2/subscribers',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer test_api_key',
      },
      params: {},
      files: {},
    },
    metadata: [{}],
    batched: false,
    statusCode: 200,
    destination: createMockDestination(),
  });

  // Helper function to create mock error response
  const createMockErrorResponse = (error: string) => ({
    destination: createMockDestination(),
    metadata: {
      jobId: 1,
      sourceId: 'source_123',
      workspaceId: 'workspace_123',
      sourceType: 'http',
      sourceCategory: 'web',
      destinationId: 'dest_123',
      destinationType: 'postscript',
      messageId: 'msg_123',
    },
    batched: false,
    statusCode: 400,
    error,
    statTags: {},
  });

  describe('processRouterDest', () => {
    it('should return empty array for empty input', async () => {
      const result = await processRouterDest([], {});
      expect(result).toEqual([]);
    });

    it('should return empty array for null/undefined input', async () => {
      const result = await processRouterDest(null as any, {});
      expect(result).toEqual([]);
    });

    it('should throw ConfigurationError when API key is not provided', async () => {
      const destination = {
        ...createMockDestination(),
        Config: {},
      } as PostscriptDestination;
      const inputs = [createMockRouterRequest({ type: 'identify' }, destination)];

      mockGetEventType.mockReturnValue('identify');

      await expect(processRouterDest(inputs, {})).rejects.toThrow(ConfigurationError);
    });

    describe('Identify Events', () => {
      beforeEach(() => {
        mockBuildSubscriberPayload.mockReturnValue({
          phone_number: '+1234567890',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
        });
      });

      it('should process identify event for subscriber creation', async () => {
        const message: Partial<RudderMessage> = {
          type: 'identify',
          userId: 'user_123',
          context: {
            traits: {
              phone: '+1234567890',
              email: 'test@example.com',
              firstName: 'John',
              lastName: 'Doe',
              keyword: 'WELCOME',
            },
          },
        };

        const inputs = [createMockRouterRequest(message)];

        mockGetEventType.mockReturnValue('identify');
        mockGetFieldValueFromMessage
          .mockReturnValueOnce((message.context as any)?.traits || {})
          .mockReturnValueOnce('+1234567890');
        mockGetDestinationExternalID.mockReturnValue(null);
        mockPerformSubscriberLookup.mockResolvedValue([
          { exists: false, identifierValue: '+1234567890', identifierType: 'phone' },
        ]);
        mockBatchResponseBuilder.mockReturnValue([createMockBatchedResponse()]);

        const result = await processRouterDest(inputs, {});

        expect(mockBuildSubscriberPayload).toHaveBeenCalledWith(message);
        expect(mockPerformSubscriberLookup).toHaveBeenCalled();
        expect(mockBatchResponseBuilder).toHaveBeenCalled();
        expect(result).toHaveLength(1);
      });

      it('should handle phone missing error', async () => {
        const message: Partial<RudderMessage> = {
          type: 'identify',
          userId: 'user_123',
          traits: {
            email: 'test@example.com',
            keyword: 'WELCOME',
          },
        };

        const inputs = [createMockRouterRequest(message)];

        mockGetEventType.mockReturnValue('identify');
        mockGetFieldValueFromMessage.mockReturnValue(null);
        mockHandleRtTfSingleEventError.mockReturnValue(
          createMockErrorResponse('Phone is required'),
        );

        const result = await processRouterDest(inputs, {});

        expect(mockHandleRtTfSingleEventError).toHaveBeenCalled();
        expect(result).toEqual([createMockErrorResponse('Phone is required')]);
      });

      it('should process identify event for subscriber update without phone number', async () => {
        const message: Partial<RudderMessage> = {
          type: 'identify',
          userId: 'user_123',
          context: {
            traits: {
              email: 'updated@example.com',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        };

        const inputs = [createMockRouterRequest(message)];

        // Mock subscriber ID to indicate this is an update operation
        mockGetEventType.mockReturnValue('identify');
        mockGetDestinationExternalID.mockReturnValue('sub_existing_123');

        // Create a mock response with PATCH method for update
        const mockPatchResponse = {
          ...createMockBatchedResponse(),
          batchedRequest: {
            ...createMockBatchedResponse().batchedRequest,
            method: 'PATCH',
          },
        };

        mockBatchResponseBuilder.mockReturnValue([mockPatchResponse]);

        const result = await processRouterDest(inputs, {});

        expect(mockGetDestinationExternalID).toHaveBeenCalled();
        expect(mockBatchResponseBuilder).toHaveBeenCalled();
        expect(result).toHaveLength(1);
        // Verify that it uses PATCH for an update and doesn't require phone lookup
        expect(result[0].batchedRequest.method).toBe('PATCH');
      });

      it('should handle missing keyword and keywordId for create operation', async () => {
        const message: Partial<RudderMessage> = {
          type: 'identify',
          userId: 'user_123',
          traits: {
            phone: '+1234567890',
            email: 'test@example.com',
            // Missing keyword and keywordId for create operation
          },
        };

        const inputs = [createMockRouterRequest(message)];

        mockGetEventType.mockReturnValue('identify');
        mockGetFieldValueFromMessage.mockReturnValue('+1234567890');
        mockGetDestinationExternalID.mockReturnValue(null); // No subscriber ID, so it's a create operation
        mockHandleRtTfSingleEventError.mockReturnValue(
          createMockErrorResponse(
            'Either keyword or keyword_id is required for subscriber creation',
          ),
        );

        const result = await processRouterDest(inputs, {});

        expect(mockHandleRtTfSingleEventError).toHaveBeenCalled();
        expect(result).toEqual([
          createMockErrorResponse(
            'Either keyword or keyword_id is required for subscriber creation',
          ),
        ]);
      });

      it('should process identify event for subscriber update when lookup finds existing subscriber', async () => {
        const message: Partial<RudderMessage> = {
          type: 'identify',
          userId: 'user_123',
          context: {
            traits: {
              phone: '+1234567890',
              email: 'updated@example.com',
              keyword: 'WELCOME',
            },
          },
        };

        const inputs = [createMockRouterRequest(message)];

        mockGetEventType.mockReturnValue('identify');
        mockGetFieldValueFromMessage
          .mockReturnValueOnce((message.context as any)?.traits || {})
          .mockReturnValueOnce('+1234567890');
        mockGetDestinationExternalID.mockReturnValue(null);
        // Mock lookup finding an existing subscriber
        mockPerformSubscriberLookup.mockResolvedValue([
          {
            exists: true,
            subscriberId: 'sub_found_123',
            identifierValue: '+1234567890',
            identifierType: 'phone',
          },
        ]);

        // Create a mock response with PATCH method for the existing subscriber update
        const mockPatchResponse = {
          ...createMockBatchedResponse(),
          batchedRequest: {
            ...createMockBatchedResponse().batchedRequest,
            method: 'PATCH',
            endpoint: 'https://api.postscript.io/api/v2/subscribers/sub_found_123',
          },
        };

        mockBatchResponseBuilder.mockReturnValue([mockPatchResponse]);

        const result = await processRouterDest(inputs, {});

        expect(mockBuildSubscriberPayload).toHaveBeenCalledWith(message);
        expect(mockPerformSubscriberLookup).toHaveBeenCalled();
        expect(mockBatchResponseBuilder).toHaveBeenCalled();
        expect(result).toHaveLength(1);
        // Verify that it uses PATCH for updating the found subscriber
        expect(result[0].batchedRequest.method).toBe('PATCH');
        expect(result[0].batchedRequest.endpoint).toBe(
          'https://api.postscript.io/api/v2/subscribers/sub_found_123',
        );
      });
    });

    describe('Track Events', () => {
      beforeEach(() => {
        mockBuildCustomEventPayload.mockReturnValue({
          name: 'custom_event',
          subscriber_id: 'sub_123',
          occurred_at: '2023-01-01T00:00:00Z',
          properties: {},
        });
      });

      it('should process track event', async () => {
        const message: Partial<RudderMessage> = {
          type: 'track',
          userId: 'user_123',
          event: 'Product Viewed',
          properties: {
            product_id: '123',
            product_name: 'Test Product',
          },
        };

        const inputs = [createMockRouterRequest(message)];

        mockGetEventType.mockReturnValue('track');
        mockBatchResponseBuilder.mockReturnValue([createMockBatchedResponse()]);

        const result = await processRouterDest(inputs, {});

        expect(mockBuildCustomEventPayload).toHaveBeenCalledWith(message);
        expect(mockBatchResponseBuilder).toHaveBeenCalled();
        expect(result).toHaveLength(1);
      });

      it('should handle missing event name error', async () => {
        const message: Partial<RudderMessage> = {
          type: 'track',
          userId: 'user_123',
          properties: {
            product_id: '123',
          },
        };

        const inputs = [createMockRouterRequest(message)];

        mockGetEventType.mockReturnValue('track');
        mockHandleRtTfSingleEventError.mockReturnValue(
          createMockErrorResponse('Event name is required'),
        );

        const result = await processRouterDest(inputs, {});

        expect(mockHandleRtTfSingleEventError).toHaveBeenCalled();
        expect(result).toEqual([createMockErrorResponse('Event name is required')]);
      });
    });

    describe('Unsupported Events', () => {
      it('should handle unsupported event type', async () => {
        const message: Partial<RudderMessage> = {
          type: 'alias',
          userId: 'user_123',
        };

        const inputs = [createMockRouterRequest(message)];

        mockGetEventType.mockReturnValue('alias');
        mockHandleRtTfSingleEventError.mockReturnValue(
          createMockErrorResponse('Unsupported event type'),
        );

        const result = await processRouterDest(inputs, {});

        expect(mockHandleRtTfSingleEventError).toHaveBeenCalled();
        expect(result).toEqual([createMockErrorResponse('Unsupported event type')]);
      });
    });
  });
});
