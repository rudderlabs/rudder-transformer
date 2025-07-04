/**
 * PostScript Destination Test Data
 *
 * This file contains test data for PostScript destination implementation.
 * Includes mock events for identify, track, and error scenarios.
 */

import { Destination, Connection } from '../../../types';

// Mock destination configuration
export const mockDestination: Destination = {
  Config: {
    apiKey: 'test-api-key-123',
  },
  DestinationDefinition: {
    ID: 'postscript-definition-id',
    Name: 'POSTSCRIPT',
    DisplayName: 'PostScript',
    Config: {},
  },
  ID: 'dest-postscript-123',
  Name: 'PostScript Test',
  Enabled: true,
  WorkspaceID: 'test-workspace-id',
  Transformations: [],
};

// Mock connection configuration
export const mockConnection: Connection = {
  sourceId: 'test-source-id',
  destinationId: 'test-destination-id',
  enabled: true,
  config: {},
};

// Mock metadata factory function
const generateMetadata = (jobId: number, userId = 'default-user-id') => ({
  jobId,
  attemptNum: 1,
  userId,
  sourceId: 'test-source-id',
  destinationId: 'test-destination-id',
  workspaceId: 'test-workspace-id',
  sourceType: 'HTTP',
  sourceCategory: 'webhook',
  destinationType: 'POSTSCRIPT',
  messageId: `msg-${jobId}`,
  dontBatch: false,
});

// Test identify event - new subscriber creation
export const identifyEventCreate = {
  message: {
    type: 'identify',
    userId: 'user123',
    traits: {
      phone: '+1234567890',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      keyword: 'WELCOME',
      tags: ['new-subscriber', 'welcome-flow'],
      customField1: 'value1',
      customField2: 'value2',
    },
    timestamp: '2025-06-29T10:00:00.000Z',
  },
  metadata: generateMetadata(1, 'user123'),
  destination: mockDestination,
  connection: mockConnection,
};

// Test identify event - subscriber update with external ID
export const identifyEventUpdate = {
  message: {
    type: 'identify',
    userId: 'user456',
    traits: {
      phone: '+1987654321',
      email: 'updated@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      tags: ['updated-subscriber'],
    },
    context: {
      externalId: [
        {
          type: 'subscriber_id',
          id: 'ps_subscriber_789',
        },
      ],
    },
    timestamp: '2025-06-29T10:05:00.000Z',
  },
  metadata: generateMetadata(2, 'user456'),
  destination: mockDestination,
  connection: mockConnection,
};

// Test track event - custom event
export const trackEvent = {
  message: {
    type: 'track',
    event: 'Product Viewed',
    userId: 'user123',
    properties: {
      productId: 'prod_123',
      productName: 'Premium SMS Package',
      category: 'subscription',
      price: 29.99,
      currency: 'USD',
    },
    context: {
      externalId: [
        {
          type: 'subscriber_id',
          id: 'ps_subscriber_456',
        },
      ],
    },
    timestamp: '2025-06-29T10:10:00.000Z',
  },
  metadata: generateMetadata(3, 'user123'),
  destination: mockDestination,
  connection: mockConnection,
};

// Test error case - missing required fields
export const invalidIdentifyEvent = {
  message: {
    type: 'identify',
    userId: 'user789',
    traits: {
      email: 'invalid@example.com',
      // Missing phone number and keyword/keywordId
    },
    timestamp: '2025-06-29T10:15:00.000Z',
  },
  metadata: generateMetadata(4, 'user789'),
  destination: mockDestination,
  connection: mockConnection,
};

// Test error case - missing event name for track
export const invalidTrackEvent = {
  message: {
    type: 'track',
    // Missing event name
    userId: 'user123',
    properties: {
      someProperty: 'someValue',
    },
    timestamp: '2025-06-29T10:20:00.000Z',
  },
  metadata: generateMetadata(5, 'user123'),
  destination: mockDestination,
  connection: mockConnection,
};

// Test unsupported event type
export const unsupportedEvent = {
  message: {
    type: 'page',
    name: 'Home Page',
    userId: 'user123',
    timestamp: '2025-06-29T10:25:00.000Z',
  },
  metadata: generateMetadata(6, 'user123'),
  destination: mockDestination,
  connection: mockConnection,
};

// Batch test with mixed events
export const batchTestEvents = [
  identifyEventCreate,
  identifyEventUpdate,
  trackEvent,
  invalidIdentifyEvent,
  invalidTrackEvent,
];

// Expected successful transformation results count
export const expectedSuccessCount = 3; // identifyEventCreate, identifyEventUpdate, trackEvent
export const expectedErrorCount = 2; // invalidIdentifyEvent, invalidTrackEvent

export default {
  mockDestination,
  mockConnection,
  identifyEventCreate,
  identifyEventUpdate,
  trackEvent,
  invalidIdentifyEvent,
  invalidTrackEvent,
  unsupportedEvent,
  batchTestEvents,
  expectedSuccessCount,
  expectedErrorCount,
};
