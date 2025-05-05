import { DynamicConfigParser } from './dynamicConfigParser';
import { ProcessorTransformationRequest } from '../types';
import cloneDeep from 'lodash/cloneDeep';

// Mock the required types for testing
const createTestEvent = (
  config: any,
  traits: any = {},
  messageType: string = 'identify',
): ProcessorTransformationRequest => {
  return {
    message: {
      type: messageType, // Required field
      anonymousId: 'test-id',
      channel: 'web',
      context: {},
      traits,
    },
    metadata: {
      jobId: 1,
      messageId: 'msg-1',
      sourceId: 'src-1',
      workspaceId: 'ws-1',
      sourceType: 'js',
      sourceCategory: 'web',
      destinationId: 'dest-1',
      destinationType: 'test',
    },
    destination: {
      ID: 'dest-1',
      Name: 'Test Destination',
      DestinationDefinition: {
        ID: 'def-1',
        Name: 'TEST',
        DisplayName: 'Test Destination',
        Config: {},
      },
      Config: config,
      Enabled: true,
      WorkspaceID: 'ws-1',
      Transformations: [],
    },
  } as ProcessorTransformationRequest;
};

describe('DynamicConfigParser', () => {
  describe('process', () => {
    // Table-driven test cases for basic functionality
    const testCases = [
      {
        name: 'should not modify the original event',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { email: 'test@example.com', appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
      },
      {
        name: 'should handle nested configuration values',
        config: {
          settings: {
            apiKey: '{{ message.traits.appId || "default-api-key" }}',
            userId: '{{ message.traits.userId || "default-user" }}',
          },
          options: [
            {
              name: 'Option 1',
              value: '{{ message.traits.email || "default@example.com" }}',
            },
          ],
        },
        traits: {
          email: 'test@example.com',
          appId: 'test-app-id',
          userId: 'user-123',
        },
        expectedConfig: {
          settings: {
            apiKey: 'test-app-id',
            userId: 'user-123',
          },
          options: [
            {
              name: 'Option 1',
              value: 'test@example.com',
            },
          ],
        },
      },
      {
        name: 'should use default values when the path does not exist',
        config: {
          apiKey: '{{ message.traits.appId || "default-api-key" }}',
          userId: '{{ message.traits.userId || "default-user" }}',
        },
        traits: { email: 'test@example.com' },
        expectedConfig: {
          apiKey: 'default-api-key',
          userId: 'default-user',
        },
      },
      {
        name: 'should handle event alias for message',
        config: { apiKey: '{{ event.traits.appId || "default-api-key" }}' },
        traits: { email: 'test@example.com', appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
      },
    ];

    // Run the table-driven tests
    test.each(testCases)('$name', ({ config, traits, expectedConfig }) => {
      // Arrange
      const event = createTestEvent(config, traits);
      const originalEvent = cloneDeep(event);

      // Act
      const result = DynamicConfigParser.process([event]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).not.toBe(event); // Should be a new object
      expect(result[0].destination.Config).toEqual(expectedConfig);

      // Original event should not be modified
      expect(event).toEqual(originalEvent);
    });

    it('should handle multiple events', () => {
      // Arrange
      const events: ProcessorTransformationRequest[] = [
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test1@example.com', appId: 'test-app-id-1' },
        ),
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test2@example.com', appId: 'test-app-id-2' },
        ),
      ];
      const originalEvents = cloneDeep(events);

      // Act
      const result = DynamicConfigParser.process(events);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].destination.Config).toEqual({ apiKey: 'test-app-id-1' });
      expect(result[1].destination.Config).toEqual({ apiKey: 'test-app-id-2' });

      // Original events should not be modified
      expect(events).toEqual(originalEvents);
    });

    // Table-driven test for different message types
    const messageTypeTestCases = [
      {
        name: 'should handle identify message type',
        messageType: 'identify',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
      },
      {
        name: 'should handle track message type',
        messageType: 'track',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
      },
      {
        name: 'should handle page message type',
        messageType: 'page',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
      },
    ];

    // Run the message type table-driven tests
    test.each(messageTypeTestCases)('$name', ({ messageType, config, traits, expectedConfig }) => {
      // Arrange
      const event = createTestEvent(config, traits, messageType);
      const originalEvent = cloneDeep(event);

      // Act
      const result = DynamicConfigParser.process([event]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].message.type).toBe(messageType);
      expect(result[0].destination.Config).toEqual(expectedConfig);

      // Original event should not be modified
      expect(event).toEqual(originalEvent);
    });

    it('should not modify shared destination objects', () => {
      // Arrange
      // Create a shared destination object
      const sharedDestination = {
        ID: 'dest-1',
        Name: 'Test Destination',
        DestinationDefinition: {
          ID: 'def-1',
          Name: 'TEST',
          DisplayName: 'Test Destination',
          Config: {},
        },
        Config: {
          apiKey: '{{ message.traits.appId || "default-api-key" }}',
        },
        Enabled: true,
        WorkspaceID: 'ws-1',
        Transformations: [],
      };

      // Create two events that share the same destination object reference
      const event1 = {
        message: {
          type: 'identify',
          anonymousId: 'test-id-1',
          channel: 'web',
          context: {},
          traits: {
            email: 'test1@example.com',
            appId: 'test-app-id-1',
          },
        },
        metadata: {
          jobId: 1,
          messageId: 'msg-1',
          sourceId: 'src-1',
          workspaceId: 'ws-1',
          sourceType: 'js',
          sourceCategory: 'web',
          destinationId: 'dest-1',
          destinationType: 'test',
        },
        destination: sharedDestination,
      } as ProcessorTransformationRequest;

      const event2 = {
        message: {
          type: 'identify',
          anonymousId: 'test-id-2',
          channel: 'web',
          context: {},
          traits: {
            email: 'test2@example.com',
            appId: 'test-app-id-2',
          },
        },
        metadata: {
          jobId: 2,
          messageId: 'msg-2',
          sourceId: 'src-1',
          workspaceId: 'ws-1',
          sourceType: 'js',
          sourceCategory: 'web',
          destinationId: 'dest-1',
          destinationType: 'test',
        },
        destination: sharedDestination,
      } as ProcessorTransformationRequest;

      // Verify they share the same destination reference
      expect(event1.destination).toBe(event2.destination);

      const originalDestinationConfig = { ...sharedDestination.Config };

      // Act
      const result = DynamicConfigParser.process([event1, event2]);

      // Assert
      expect(result).toHaveLength(2);

      // Check that results have different destination objects
      expect(result[0].destination).not.toBe(result[1].destination);

      // Check that the original shared destination was not modified
      expect(sharedDestination.Config).toEqual(originalDestinationConfig);

      // Check that the processed events have the correct values
      expect(result[0].destination.Config).toEqual({ apiKey: 'test-app-id-1' });
      expect(result[1].destination.Config).toEqual({ apiKey: 'test-app-id-2' });
    });
  });
});
