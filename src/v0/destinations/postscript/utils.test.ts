/**
 * Unit tests for PostScript destination utility functions
 */

import {
  buildHeaders,
  validateRequiredFields,
  buildSubscriberPayload,
  buildCustomEventPayload,
  performSubscriberLookup,
  batchResponseBuilder,
} from './utils';
import { RudderMessage } from '../../../types';
import { ProcessedEvent, PostscriptDestination } from './types';

// Mock only external dependencies that make network calls
jest.mock('../../../adapters/network', () => ({
  handleHttpRequest: jest.fn(),
}));

// Mock only logger for warnings
jest.mock('../../../logger', () => ({
  warn: jest.fn(),
}));

import { handleHttpRequest } from '../../../adapters/network';
import * as logger from '../../../logger';

const mockHandleHttpRequest = handleHttpRequest as jest.MockedFunction<typeof handleHttpRequest>;
const mockLogger = logger.warn as jest.MockedFunction<typeof logger.warn>;

describe('PostScript Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.POSTSCRIPT_PARTNER_API_KEY = 'test_partner_key_123';
  });

  // Pure function - no mocks needed
  describe('buildHeaders', () => {
    it('should build correct headers with API key', () => {
      const apiKey = 'test_api_key_123';
      const headers = buildHeaders(apiKey);

      expect(headers).toMatchObject({
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer test_api_key_123',
        'X-Postscript-Partner-Key': 'test_partner_key_123',
      });
    });

    it('should build headers without partner key when env var is not set', () => {
      delete process.env.POSTSCRIPT_PARTNER_API_KEY;

      const apiKey = 'test_api_key_123';
      const headers = buildHeaders(apiKey);

      expect(headers).toMatchObject({
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer test_api_key_123',
      });
    });
  });

  describe('validateRequiredFields', () => {
    it('should not throw error when all required fields are present', () => {
      const mockMessage: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: { email: 'test@example.com', phone: '+1234567890' },
      } as RudderMessage;

      expect(() => {
        validateRequiredFields(mockMessage, ['email', 'phone']);
      }).not.toThrow();
    });

    it('should throw error when required fields are missing', () => {
      const mockMessage: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: { email: 'test@example.com' }, // phone is missing
      } as RudderMessage;

      expect(() => {
        validateRequiredFields(mockMessage, ['email', 'phone']);
      }).toThrow('Missing required fields: phone');
    });

    it('should throw error listing all missing fields', () => {
      const mockMessage: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: { keyword: 'WELCOME' }, // email and phone missing
      } as RudderMessage;

      expect(() => {
        validateRequiredFields(mockMessage, ['email', 'phone', 'traits.keyword']);
      }).toThrow('Missing required fields: email, phone');
    });

    it('should not throw error when no required fields specified', () => {
      const mockMessage: RudderMessage = {
        type: 'identify',
        userId: 'user123',
      } as RudderMessage;

      expect(() => {
        validateRequiredFields(mockMessage, []);
      }).not.toThrow();
    });
  });

  describe('buildSubscriberPayload', () => {
    it('should build basic subscriber payload', () => {
      const message: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: {
          phone: '+1234567890',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          customField: 'customValue',
        },
      } as RudderMessage;

      const payload = buildSubscriberPayload(message);

      expect(payload).toHaveProperty('phone_number', '+1234567890');
      expect(payload).toHaveProperty('email', 'test@example.com');
      expect(payload).toHaveProperty('first_name', 'John');
      expect(payload).toHaveProperty('last_name', 'Doe');
      expect(payload).toHaveProperty('properties');
      expect(payload.properties).toHaveProperty('customField', 'customValue');
    });

    it('should handle payload with external ID from traits', () => {
      const message: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: {
          email: 'test@example.com',
          phone: '+1234567890',
          externalId: 'ext_123',
        },
      } as RudderMessage;

      const payload = buildSubscriberPayload(message);

      expect(payload).toHaveProperty('phone_number', '+1234567890');
      expect(payload).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('buildCustomEventPayload', () => {
    it('should build custom event payload with basic data', () => {
      const message: RudderMessage = {
        type: 'track',
        event: 'Purchase Completed',
        userId: 'user123',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
        timestamp: '2025-01-15T10:00:00.000Z',
        traits: {
          email: 'test@example.com',
          phone: '+1234567890',
        },
      };

      const payload = buildCustomEventPayload(message);

      expect(payload).toMatchObject({
        type: 'Purchase Completed',
        email: 'test@example.com',
        phone: '+1234567890',
        occurred_at: '2025-01-15 10:00:00.000',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
      });
    });

    it('should build custom event payload with subscriber_id', () => {
      const message: RudderMessage = {
        type: 'track',
        event: 'Purchase Completed',
        userId: 'user123',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
        timestamp: '2025-01-15T10:00:00.000Z',
        traits: {
          email: 'test@example.com',
          phone: '+1234567890',
        },
        context: {
          externalId: [
            {
              type: 'subscriber_id',
              id: 'ext_123',
            },
          ],
        },
      };

      const payload = buildCustomEventPayload(message);

      expect(payload).toMatchObject({
        type: 'Purchase Completed',
        subscriber_id: 'ext_123',
        email: 'test@example.com',
        phone: '+1234567890',
        occurred_at: '2025-01-15 10:00:00.000',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
      });
    });

    it('should build custom event payload with externalId', () => {
      const message: RudderMessage = {
        type: 'track',
        event: 'Purchase Completed',
        userId: 'user123',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
        timestamp: '2025-01-15T10:00:00.000Z',
        traits: {
          email: 'test@example.com',
          phone: '+1234567890',
        },
        context: {
          externalId: [
            {
              type: 'external_id',
              id: 'ext_123',
            },
          ],
        },
      };

      const payload = buildCustomEventPayload(message);

      expect(payload).toMatchObject({
        type: 'Purchase Completed',
        external_id: 'ext_123',
        email: 'test@example.com',
        phone: '+1234567890',
        occurred_at: '2025-01-15 10:00:00.000',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
      });
    });

    it('should handle different timestamp formats', () => {
      const testCases = [
        {
          input: '2023-03-15T12:30:45.123Z',
          expected: '2023-03-15 12:30:45.123',
          description: 'standard ISO with milliseconds',
        },
        {
          input: '2023-03-15T12:30:45Z',
          expected: '2023-03-15 12:30:45.000',
          description: 'ISO without milliseconds',
        },
        {
          input: '2023-12-31T23:59:59.999Z',
          expected: '2023-12-31 23:59:59.999',
          description: 'end of year timestamp',
        },
      ];

      testCases.forEach(({ input, expected, description }) => {
        const message: RudderMessage = {
          type: 'track',
          event: 'Test Event',
          userId: 'user123',
          timestamp: input,
          traits: {},
        };

        const payload = buildCustomEventPayload(message);
        expect(payload.occurred_at).toBe(expected);
      });
    });
  });

  describe('performSubscriberLookup', () => {
    const mockEvents: ProcessedEvent[] = [
      {
        eventType: 'identify',
        endpoint: 'https://api.postscript.io/api/v2/subscribers',
        method: 'POST',
        payload: { phone_number: '+1234567890', email: 'test1@example.com' },
        metadata: {},
        identifierValue: '+1234567890',
        identifierType: 'phone',
      },
      {
        eventType: 'identify',
        endpoint: 'https://api.postscript.io/api/v2/subscribers',
        method: 'POST',
        payload: { phone_number: '+0987654321', email: 'test2@example.com' },
        metadata: {},
        identifierValue: '+0987654321',
        identifierType: 'phone',
      },
    ];

    it('should perform successful subscriber lookup', async () => {
      // Mock only the network response
      const mockResponse = {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          response: {
            subscribers: [
              {
                id: 'sub_123',
                phone_number: '+1234567890',
                email: 'test1@example.com',
              },
            ],
          },
        },
      };

      mockHandleHttpRequest.mockResolvedValueOnce(mockResponse);

      const results = await performSubscriberLookup(mockEvents, 'test_api_key');

      // Verify the correct API call was made
      expect(mockHandleHttpRequest).toHaveBeenCalledWith(
        'GET',
        'https://api.postscript.io/api/v2/subscribers?phone_number__in=%2B1234567890&phone_number__in=%2B0987654321',
        {
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer test_api_key',
            'X-Postscript-Partner-Key': 'test_partner_key_123',
          },
        },
        {
          feature: 'subscriber-batch-lookup',
          destType: 'postscript',
          endpointPath: '/subscribers',
          requestMethod: 'GET',
          module: 'router',
        },
      );

      expect(results).toMatchObject([
        {
          exists: true,
          subscriberId: 'sub_123',
          identifierValue: '+1234567890',
          identifierType: 'phone',
        },
        {
          exists: false,
          subscriberId: undefined,
          identifierValue: '+0987654321',
          identifierType: 'phone',
        },
      ]);
    });

    it('should handle empty subscriber lookup response', async () => {
      mockHandleHttpRequest.mockResolvedValueOnce({
        httpResponse: Promise.resolve({}),
        processedResponse: {
          response: { subscribers: [] },
        },
      });

      const results = await performSubscriberLookup(mockEvents, 'test_api_key');

      expect(results).toMatchObject([
        { exists: false, identifierValue: '+1234567890', identifierType: 'phone' },
        { exists: false, identifierValue: '+0987654321', identifierType: 'phone' },
      ]);
    });

    it('should handle events without phone or email', async () => {
      const eventsWithoutContact: ProcessedEvent[] = [
        {
          eventType: 'identify',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          method: 'POST',
          payload: { first_name: 'John' },
          metadata: {},
          // No identifierValue
        },
      ];

      const results = await performSubscriberLookup(eventsWithoutContact, 'test_api_key');

      expect(mockHandleHttpRequest).not.toHaveBeenCalled();
      expect(results).toMatchObject([]);
    });

    it('should handle API errors gracefully', async () => {
      const mockEvents: ProcessedEvent[] = [
        {
          eventType: 'identify',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          method: 'POST',
          payload: { phone_number: '+1234567890' },
          metadata: {},
          identifierValue: '+1234567890',
          identifierType: 'phone',
        },
      ];

      // Mock API error response
      mockHandleHttpRequest.mockResolvedValueOnce({
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 500,
          response: { error: 'Internal server error' },
        },
      });

      const results = await performSubscriberLookup(mockEvents, 'test_api_key');

      expect(mockLogger).toHaveBeenCalledWith('PostScript subscriber lookup failed:', {
        status: 500,
        response: { error: 'Internal server error' },
      });

      expect(results).toMatchObject([
        {
          exists: false,
          subscriberId: undefined,
          identifierValue: '+1234567890',
          identifierType: 'phone',
        },
      ]);
    });
  });

  describe('batchResponseBuilder', () => {
    const mockDestination: PostscriptDestination = {
      ID: 'dest_123',
      Name: 'PostScript',
      Config: { apiKey: 'test_key' },
      DestinationDefinition: {
        ID: 'postscript_def_123',
        Name: 'POSTSCRIPT',
        DisplayName: 'PostScript',
        Config: {},
      },
      Enabled: true,
      WorkspaceID: 'workspace_123',
      Transformations: [],
    };

    it('should build batched responses correctly', () => {
      const events: ProcessedEvent[] = [
        {
          eventType: 'identify',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          method: 'POST',
          payload: { phone_number: '+1234567890' },
          metadata: { jobId: 1 },
        },
        {
          eventType: 'track',
          endpoint: 'https://api.postscript.io/api/v2/events',
          method: 'POST',
          payload: { type: 'Purchase' },
          metadata: { jobId: 2 },
        },
      ];

      const responses = batchResponseBuilder(events, mockDestination);

      expect(responses).toHaveLength(2);
      expect(responses[0]).toHaveProperty('batchedRequest');
      expect(responses[0].batchedRequest).toHaveProperty('endpoint');
      expect(responses[0].batchedRequest).toHaveProperty('method');
    });

    it('should handle empty events array', () => {
      const responses = batchResponseBuilder([], mockDestination);
      expect(responses).toHaveLength(0);
    });

    it('should set correct headers for all responses', () => {
      const events: ProcessedEvent[] = [
        {
          eventType: 'identify',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          method: 'POST',
          payload: { phone_number: '+1234567890' },
          metadata: { jobId: 1 },
        },
      ];

      const responses = batchResponseBuilder(events, mockDestination);

      expect(responses).toHaveLength(1);
      expect(responses[0].batchedRequest.headers).toHaveProperty('Authorization');
      expect(responses[0].batchedRequest.headers).toHaveProperty('Content-type');
    });
  });
});
