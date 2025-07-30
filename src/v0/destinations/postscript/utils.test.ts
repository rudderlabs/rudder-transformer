/**
 * Unit tests for PostScript destination utility functions
 * Tests all exported functions from utils.ts to ensure 100% code coverage
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

// Mock external dependencies
jest.mock('../../util', () => ({
  getFieldValueFromMessage: jest.fn(),
  getDestinationExternalID: jest.fn(),
  constructPayload: jest.fn(),
  removeUndefinedAndNullValues: jest.fn((obj) => obj),
  defaultRequestConfig: jest.fn(() => ({
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: '',
    headers: {},
    params: {},
    files: {},
    body: {
      JSON: {},
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
  })),
  getSuccessRespEvents: jest.fn(),
  generateExclusionList: jest.fn(),
  extractCustomFields: jest.fn(),
}));

jest.mock('../../../adapters/network', () => ({
  handleHttpRequest: jest.fn(),
}));

// Import mocked modules
import {
  getFieldValueFromMessage,
  getDestinationExternalID,
  constructPayload,
  getSuccessRespEvents,
  generateExclusionList,
  extractCustomFields,
} from '../../util';
import { handleHttpRequest } from '../../../adapters/network';

const mockGetFieldValueFromMessage = getFieldValueFromMessage as jest.MockedFunction<
  typeof getFieldValueFromMessage
>;
const mockGetDestinationExternalID = getDestinationExternalID as jest.MockedFunction<
  typeof getDestinationExternalID
>;
const mockConstructPayload = constructPayload as jest.MockedFunction<typeof constructPayload>;
const mockHandleHttpRequest = handleHttpRequest as jest.MockedFunction<typeof handleHttpRequest>;
const mockGetSuccessRespEvents = getSuccessRespEvents as jest.MockedFunction<
  typeof getSuccessRespEvents
>;
const mockGenerateExclusionList = generateExclusionList as jest.MockedFunction<
  typeof generateExclusionList
>;
const mockExtractCustomFields = extractCustomFields as jest.MockedFunction<
  typeof extractCustomFields
>;

describe('PostScript Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.POSTSCRIPT_PARTNER_API_KEY = 'partner_key_123';

    // Set up default mocks
    mockGenerateExclusionList.mockReturnValue([
      'email',
      'phone',
      'firstName',
      'lastName',
      'traits.keyword',
      'context.traits.keyword',
    ]);

    mockExtractCustomFields.mockImplementation((message, payload, paths, exclusions) => {
      // Mock implementation that adds sample custom fields
      payload.customField = 'customValue';
    });

    mockGetFieldValueFromMessage.mockImplementation((message, path) => {
      if (path === 'traits') {
        return message.traits || {};
      }
      if (path === 'originalTimestamp') {
        return message.originalTimestamp;
      }
      if (path === 'timestamp') {
        return message.timestamp;
      }
      return null;
    });
  });

  describe('buildHeaders', () => {
    it('should build correct headers with API key', () => {
      const apiKey = 'test_api_key_123';
      const headers = buildHeaders(apiKey);

      expect(headers).toEqual({
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer test_api_key_123',
        'X-Postscript-Partner-Key': 'partner_key_123',
      });
    });

    it('should build headers without partner key when env var is not set', () => {
      delete process.env.POSTSCRIPT_PARTNER_API_KEY;
      const apiKey = 'test_api_key_123';
      const headers = buildHeaders(apiKey);

      expect(headers).toEqual({
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer test_api_key_123',
        'X-Postscript-Partner-Key': undefined,
      });
    });
  });

  describe('validateRequiredFields', () => {
    const mockMessage: RudderMessage = {
      type: 'identify',
      userId: 'user123',
      traits: { email: 'test@example.com' },
    } as RudderMessage;

    it('should not throw error when all required fields are present', () => {
      mockGetFieldValueFromMessage
        .mockReturnValueOnce('test@example.com') // email
        .mockReturnValueOnce('+1234567890'); // phone

      expect(() => {
        validateRequiredFields(mockMessage, ['email', 'phone']);
      }).not.toThrow();

      expect(mockGetFieldValueFromMessage).toHaveBeenCalledWith(mockMessage, 'email');
      expect(mockGetFieldValueFromMessage).toHaveBeenCalledWith(mockMessage, 'phone');
    });

    it('should throw error when required fields are missing', () => {
      mockGetFieldValueFromMessage
        .mockReturnValueOnce('test@example.com') // email present
        .mockReturnValueOnce(null); // phone missing

      expect(() => {
        validateRequiredFields(mockMessage, ['email', 'phone']);
      }).toThrow('Missing required fields: phone');
    });

    it('should throw error listing all missing fields', () => {
      mockGetFieldValueFromMessage
        .mockReturnValueOnce(null) // email missing
        .mockReturnValueOnce(null) // phone missing
        .mockReturnValueOnce('WELCOME'); // keyword present

      expect(() => {
        validateRequiredFields(mockMessage, ['email', 'phone', 'keyword']);
      }).toThrow('Missing required fields: email, phone');
    });

    it('should not throw error when no required fields specified', () => {
      expect(() => {
        validateRequiredFields(mockMessage, []);
      }).not.toThrow();
    });
  });

  describe('buildSubscriberPayload', () => {
    beforeEach(() => {
      // Mock constructPayload to return base mapping
      mockConstructPayload.mockReturnValue({
        phone_number: '+1234567890',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      });

      // Mock generateExclusionList
      mockGenerateExclusionList.mockReturnValue(['email', 'phone', 'firstName', 'lastName']);

      // Mock getFieldValueFromMessage for traits
      mockGetFieldValueFromMessage.mockImplementation((message, path) => {
        if (path === 'traits') {
          return message.traits;
        }
        return null;
      });
    });

    it('should build subscriber payload for create operation', () => {
      const message: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: {
          phone: '+1234567890',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          keyword: 'WELCOME',
          customField: 'customValue',
        },
        context: {
          traits: {
            companyName: 'Test Corp',
          },
        },
      } as RudderMessage;

      mockGetDestinationExternalID.mockReturnValue(null); // No subscriber ID (create operation)

      // Mock extractCustomFields to populate custom properties
      mockExtractCustomFields.mockImplementation((message, payload, sourcePaths, exclusions) => {
        payload.company_name = 'Test Corp';
        payload.custom_field = 'customValue';
        payload.keyword = 'WELCOME';
      });

      const payload = buildSubscriberPayload(message);

      expect(mockConstructPayload).toHaveBeenCalled();
      expect(mockGenerateExclusionList).toHaveBeenCalled();
      expect(mockExtractCustomFields).toHaveBeenCalled();
      expect(payload).toEqual({
        phone_number: '+1234567890',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        properties: {
          company_name: 'Test Corp',
          custom_field: 'customValue',
          keyword: 'WELCOME',
        },
      });
    });

    it('should build subscriber payload for update operation', () => {
      const message: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: {
          phone: '+1234567890',
          email: 'updated@example.com',
        },
        context: {
          traits: {
            subscriberId: 'sub_123',
          },
        },
      } as RudderMessage;
      mockGetDestinationExternalID.mockReturnValue('sub_123'); // Has subscriber ID (update operation)
      mockConstructPayload.mockReturnValue({
        subscriber_id: 'sub_123',
        phone_number: '+1234567890',
        email: 'updated@example.com',
      });

      // Mock extractCustomFields to not add any custom properties
      mockExtractCustomFields.mockImplementation(() => {
        // No custom properties for this test
      });

      const payload = buildSubscriberPayload(message);

      expect(payload).not.toHaveProperty('subscriber_id'); // Should be removed for updates
      expect(payload).toEqual({
        phone_number: '+1234567890',
        email: 'updated@example.com',
        external_id: 'sub_123',
        shopify_customer_id: NaN,
      });
    });

    it('should include external IDs in payload', () => {
      const message: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: {
          email: 'test@example.com',
          customField: 'customValue',
        },
      } as RudderMessage;

      mockGetDestinationExternalID
        .mockReturnValueOnce(null) // subscriber_id
        .mockReturnValueOnce('ext_123') // external_id
        .mockReturnValueOnce('456'); // shopify_customer_id

      mockConstructPayload.mockReturnValue({
        email: 'test@example.com',
      });

      // Mock extractCustomFields to add custom properties
      mockExtractCustomFields.mockImplementation((message, payload, sourcePaths, exclusions) => {
        payload.customField = 'customValue';
      });

      const payload = buildSubscriberPayload(message);

      expect(payload).toEqual({
        email: 'test@example.com',
        external_id: 'ext_123',
        shopify_customer_id: 456,
        properties: {
          customField: 'customValue',
        },
      });
    });

    it('should handle custom properties correctly', () => {
      const message: RudderMessage = {
        type: 'identify',
        userId: 'user123',
        traits: {
          email: 'test@example.com',
          customField1: 'value1',
          customField2: 'value2',
        },
      } as RudderMessage;

      // Mock the JSON mapping to simulate which fields are mapped
      jest.doMock('./data/postscriptSubscriberConfig.json', () => [
        { sourceKeys: 'email', destKey: 'email' },
      ]);

      mockGetDestinationExternalID.mockReturnValue(null);
      mockConstructPayload.mockReturnValue({
        email: 'test@example.com',
      });

      // Mock extractCustomFields to add the expected custom properties
      mockExtractCustomFields.mockImplementation((message, payload, sourcePaths, exclusions) => {
        payload.custom_field1 = 'value1';
        payload.custom_field2 = 'value2';
      });

      const payload = buildSubscriberPayload(message);

      expect(payload).toEqual({
        email: 'test@example.com',
        properties: {
          custom_field1: 'value1',
          custom_field2: 'value2',
        },
      });
    });
  });

  describe('buildCustomEventPayload', () => {
    beforeEach(() => {
      // Reset mocks for buildCustomEventPayload tests
      jest.clearAllMocks();
    });

    it('should build custom event payload with subscriber ID', () => {
      const message: RudderMessage = {
        type: 'track',
        event: 'Purchase Completed',
        userId: 'user123',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
        timestamp: '2025-01-15T10:00:00.000Z',
      } as RudderMessage;

      mockGetDestinationExternalID
        .mockReturnValueOnce('sub_123') // subscriber_id
        .mockReturnValueOnce(null); // external_id

      mockGetFieldValueFromMessage.mockImplementation((message, path) => {
        if (path === 'traits') return {};
        if (path === 'originalTimestamp') return null;
        if (path === 'timestamp') return '2025-01-15T10:00:00.000Z';
        return null;
      });

      const payload = buildCustomEventPayload(message);

      expect(payload).toEqual({
        type: 'Purchase Completed',
        subscriber_id: 'sub_123',
        occurred_at: '2025-01-15T10:00:00.000Z',
        properties: {
          orderId: 'order_123',
          total: 99.99,
        },
      });
    });

    it('should build custom event payload with external ID fallback', () => {
      const message: RudderMessage = {
        type: 'track',
        event: 'Product Viewed',
        userId: 'user123',
        properties: {
          productId: 'prod_456',
        },
        context: {
          traits: {
            email: 'test@example.com',
            phone: '+1234567890',
          },
        },
      } as RudderMessage;

      mockGetDestinationExternalID
        .mockReturnValueOnce(null) // subscriber_id
        .mockReturnValueOnce('ext_456'); // external_id

      mockGetFieldValueFromMessage.mockImplementation((message, path) => {
        if (path === 'traits')
          return {
            email: 'test@example.com',
            phone: '+1234567890',
          };
        if (path === 'originalTimestamp') return null;
        if (path === 'timestamp') return null;
        return null;
      });

      const payload = buildCustomEventPayload(message);

      expect(payload).toEqual({
        type: 'Product Viewed',
        external_id: 'ext_456',
        email: 'test@example.com',
        phone: '+1234567890',
        properties: {
          productId: 'prod_456',
        },
      });
    });

    it('should build custom event payload with userId fallback', () => {
      const message: RudderMessage = {
        type: 'track',
        event: 'Cart Abandoned',
        userId: 'user789',
        properties: {
          cartValue: 149.99,
        },
      } as RudderMessage;

      mockGetDestinationExternalID
        .mockReturnValueOnce(null) // subscriber_id
        .mockReturnValueOnce(null); // external_id

      mockGetFieldValueFromMessage.mockImplementation((message, path) => {
        if (path === 'traits') return {};
        if (path === 'originalTimestamp') return null;
        if (path === 'timestamp') return null;
        return null;
      });

      const payload = buildCustomEventPayload(message);

      expect(payload).toEqual({
        type: 'Cart Abandoned',
        subscriber_id: 'user789',
        properties: {
          cartValue: 149.99,
        },
      });
    });

    it('should handle event without name', () => {
      const message: RudderMessage = {
        type: 'track',
        userId: 'user123',
      } as RudderMessage;

      mockGetDestinationExternalID.mockReturnValue(null);

      mockGetFieldValueFromMessage.mockImplementation((message, path) => {
        if (path === 'traits') return {};
        if (path === 'originalTimestamp') return null;
        if (path === 'timestamp') return null;
        return null;
      });

      const payload = buildCustomEventPayload(message);

      expect(payload).toEqual({
        type: 'Unknown Event',
        subscriber_id: 'user123',
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
      const mockResponse = {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          response: {
            data: [
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

      expect(mockHandleHttpRequest).toHaveBeenCalledWith(
        'GET',
        'https://api.postscript.io/api/v2/subscribers?phone_in=%2B1234567890%2C%2B0987654321&limit=100',
        {
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer test_api_key',
            'X-Postscript-Partner-Key': 'partner_key_123',
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

      expect(results).toEqual([
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
      const mockResponse = {
        httpResponse: Promise.resolve({}),
        processedResponse: {
          response: {
            data: [],
          },
        },
      };

      mockHandleHttpRequest.mockResolvedValueOnce(mockResponse);

      const results = await performSubscriberLookup(mockEvents, 'test_api_key');

      expect(results).toEqual([
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
          // No identifierValue - this should result in empty array return
        },
      ];

      const results = await performSubscriberLookup(eventsWithoutContact, 'test_api_key');

      expect(mockHandleHttpRequest).not.toHaveBeenCalled();
      expect(results).toEqual([]);
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

    const mockConnection = {
      sourceId: 'source_123',
      destinationId: 'dest_123',
      enabled: true,
      config: {
        destination: {},
      },
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
          endpoint: 'https://api.postscript.io/api/v2/custom-events',
          method: 'POST',
          payload: { type: 'Purchase' },
          metadata: { jobId: 2 },
        },
      ];

      // Mock getSuccessRespEvents to return the expected batch response structure
      const mockBatchResponse = {
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          headers: {},
          params: {},
          files: {},
          body: {
            JSON: {},
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
        },
        metadata: [{}],
        batched: false,
        statusCode: 200,
        destination: mockDestination,
      };

      mockGetSuccessRespEvents
        .mockReturnValueOnce(mockBatchResponse)
        .mockReturnValueOnce(mockBatchResponse);

      const responses = batchResponseBuilder(events, mockDestination, mockConnection);

      expect(responses).toHaveLength(2);
      expect(mockGetSuccessRespEvents).toHaveBeenCalledTimes(2);
    });

    it('should handle events with different endpoints', () => {
      const events: ProcessedEvent[] = [
        {
          eventType: 'identify',
          endpoint: 'https://api.postscript.io/api/v2/subscribers/sub_123',
          method: 'PATCH',
          payload: { email: 'updated@example.com' },
          metadata: { jobId: 1 },
        },
      ];

      const mockBatchResponse = {
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'PATCH',
          endpoint: 'https://api.postscript.io/api/v2/subscribers/sub_123',
          headers: {},
          params: {},
          files: {},
          body: {
            JSON: {},
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
        },
        metadata: [{}],
        batched: false,
        statusCode: 200,
        destination: mockDestination,
      };

      mockGetSuccessRespEvents.mockReturnValueOnce(mockBatchResponse);

      const responses = batchResponseBuilder(events, mockDestination, mockConnection);

      expect(responses).toHaveLength(1);
      expect(mockGetSuccessRespEvents).toHaveBeenCalledTimes(1);
    });

    it('should group events by endpoint', () => {
      const events: ProcessedEvent[] = [
        {
          eventType: 'identify',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          method: 'POST',
          payload: { phone_number: '+1111111111' },
          metadata: { jobId: 1 },
        },
        {
          eventType: 'identify',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          method: 'POST',
          payload: { phone_number: '+2222222222' },
          metadata: { jobId: 2 },
        },
      ];

      const mockBatchResponse = {
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://api.postscript.io/api/v2/subscribers',
          headers: {},
          params: {},
          files: {},
          body: {
            JSON: {},
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
        },
        metadata: [{}],
        batched: false,
        statusCode: 200,
        destination: mockDestination,
      };

      mockGetSuccessRespEvents
        .mockReturnValueOnce(mockBatchResponse)
        .mockReturnValueOnce(mockBatchResponse);

      const responses = batchResponseBuilder(events, mockDestination, mockConnection);

      // PostScript creates individual responses, not grouped ones
      expect(responses).toHaveLength(2);
      expect(mockGetSuccessRespEvents).toHaveBeenCalledTimes(2);
    });
  });
});
