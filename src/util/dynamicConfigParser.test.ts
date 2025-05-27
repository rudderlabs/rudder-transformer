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
      // hasDynamicConfig is intentionally not set by default to test backward compatibility
      // Tests that need to test specific hasDynamicConfig values will set it explicitly
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
        hasDynamicConfig: undefined,
        expectedSameReference: false,
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
        hasDynamicConfig: undefined,
        expectedSameReference: false,
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
        hasDynamicConfig: undefined,
        expectedSameReference: false,
      },
      {
        name: 'should handle event alias for message',
        config: { apiKey: '{{ event.traits.appId || "default-api-key" }}' },
        traits: { email: 'test@example.com', appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
        hasDynamicConfig: undefined,
        expectedSameReference: false,
      },
      {
        name: 'should skip processing when hasDynamicConfig is false',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { email: 'test@example.com', appId: 'test-app-id' },
        expectedConfig: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        hasDynamicConfig: false,
        expectedSameReference: true,
      },
      {
        name: 'should process events when hasDynamicConfig is undefined (backward compatibility)',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { email: 'test@example.com', appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
        hasDynamicConfig: undefined,
        expectedSameReference: false,
      },
      {
        name: 'should process events when hasDynamicConfig is true',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { email: 'test@example.com', appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
        hasDynamicConfig: true,
        expectedSameReference: false,
      },
    ];

    // Run the table-driven tests
    test.each(testCases)(
      '$name',
      ({ config, traits, expectedConfig, hasDynamicConfig, expectedSameReference }) => {
        // Arrange
        const event = createTestEvent(config, traits);
        // Set hasDynamicConfig if specified in the test case
        if (hasDynamicConfig !== undefined) {
          event.destination.hasDynamicConfig = hasDynamicConfig;
        }
        const originalEvent = cloneDeep(event);

        // Act
        const result = DynamicConfigParser.process([event]);

        // Assert
        expect(result).toHaveLength(1);

        // Check if the result should be the same reference as the original event
        if (expectedSameReference) {
          expect(result[0]).toBe(event); // Should be the same object (not processed)
        } else {
          expect(result[0]).not.toBe(event); // Should be a new object (processed)
        }

        expect(result[0].destination.Config).toEqual(expectedConfig);

        // Original event should not be modified
        expect(event).toEqual(originalEvent);
      },
    );

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
        hasDynamicConfig: undefined,
        expectedSameReference: false,
      },
      {
        name: 'should handle track message type',
        messageType: 'track',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
        hasDynamicConfig: undefined,
        expectedSameReference: false,
      },
      {
        name: 'should handle page message type',
        messageType: 'page',
        config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: 'test-app-id' },
        hasDynamicConfig: undefined,
        expectedSameReference: false,
      },
    ];

    // Run the message type table-driven tests
    test.each(messageTypeTestCases)(
      '$name',
      ({
        messageType,
        config,
        traits,
        expectedConfig,
        hasDynamicConfig,
        expectedSameReference,
      }) => {
        // Arrange
        const event = createTestEvent(config, traits, messageType);
        // Set hasDynamicConfig if specified in the test case
        if (hasDynamicConfig !== undefined) {
          event.destination.hasDynamicConfig = hasDynamicConfig;
        }
        const originalEvent = cloneDeep(event);

        // Act
        const result = DynamicConfigParser.process([event]);

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0].message.type).toBe(messageType);

        // Check if the result should be the same reference as the original event
        if (expectedSameReference) {
          expect(result[0]).toBe(event); // Should be the same object (not processed)
        } else {
          expect(result[0]).not.toBe(event); // Should be a new object (processed)
        }

        expect(result[0].destination.Config).toEqual(expectedConfig);

        // Original event should not be modified
        expect(event).toEqual(originalEvent);
      },
    );

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

    // Table-driven test for batch processing with mixed hasDynamicConfig flags
    const batchTestCases = [
      {
        name: 'should handle mixed hasDynamicConfig flags in a batch',
        eventConfigs: [
          {
            config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
            traits: { email: 'test1@example.com', appId: 'test-app-id-1' },
            hasDynamicConfig: false,
            expectedConfig: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
            expectedSameReference: true,
          },
          {
            config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
            traits: { email: 'test2@example.com', appId: 'test-app-id-2' },
            hasDynamicConfig: true,
            expectedConfig: { apiKey: 'test-app-id-2' },
            expectedSameReference: false,
          },
          {
            config: { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
            traits: { email: 'test3@example.com', appId: 'test-app-id-3' },
            hasDynamicConfig: undefined,
            expectedConfig: { apiKey: 'test-app-id-3' },
            expectedSameReference: false,
          },
        ],
      },
    ];

    // Run the batch test cases
    test.each(batchTestCases)('$name', ({ eventConfigs }) => {
      // Arrange
      const events = eventConfigs.map((eventConfig) => {
        const event = createTestEvent(eventConfig.config, eventConfig.traits);
        if (eventConfig.hasDynamicConfig !== undefined) {
          event.destination.hasDynamicConfig = eventConfig.hasDynamicConfig;
        }
        return event;
      });

      // Store original events to verify they're not modified
      const originalEvents = cloneDeep(events);

      // Act
      const result = DynamicConfigParser.process(events);

      // Assert
      expect(result).toHaveLength(events.length);

      // Verify each event was processed correctly
      eventConfigs.forEach((eventConfig, index) => {
        if (eventConfig.expectedSameReference) {
          expect(result[index]).toBe(events[index]); // Should be the same object (not processed)
        } else {
          expect(result[index]).not.toBe(events[index]); // Should be a new object (processed)
        }
        expect(result[index].destination.Config).toEqual(eventConfig.expectedConfig);
      });

      // Original events should not be modified
      expect(events).toEqual(originalEvents);
    });

    it('should unset fields from the processed event after extracting values', () => {
      // Arrange
      const event = createTestEvent(
        { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        { email: 'test@example.com', appId: 'test-app-id' },
      );

      // Act
      const result = DynamicConfigParser.process([event]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].destination.Config).toEqual({ apiKey: 'test-app-id' });

      // The processed event should have the appId field unset from traits
      expect(result[0].message.traits).toEqual({ email: 'test@example.com' });
      expect((result[0].message.traits as any).appId).toBeUndefined();

      // Original event should still have the appId field
      expect((event.message.traits as any).appId).toBe('test-app-id');
    });
  });

  describe('USE_HAS_DYNAMIC_CONFIG_FLAG environment variable', () => {
    const originalEnv = process.env.USE_HAS_DYNAMIC_CONFIG_FLAG;

    afterEach(() => {
      // Restore original environment variable
      if (originalEnv === undefined) {
        delete process.env.USE_HAS_DYNAMIC_CONFIG_FLAG;
      } else {
        process.env.USE_HAS_DYNAMIC_CONFIG_FLAG = originalEnv;
      }
    });

    it('should use hasDynamicConfig flag when USE_HAS_DYNAMIC_CONFIG_FLAG is not set (default behavior)', () => {
      // Arrange
      delete process.env.USE_HAS_DYNAMIC_CONFIG_FLAG;

      const events = [
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test@example.com', appId: 'test-app-id' },
        ),
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test2@example.com', appId: 'test-app-id-2' },
        ),
      ];

      // Set hasDynamicConfig flags
      events[0].destination.hasDynamicConfig = false; // Should skip processing
      events[1].destination.hasDynamicConfig = true; // Should process

      // Act
      const result = DynamicConfigParser.process(events);

      // Assert
      expect(result[0]).toBe(events[0]); // Should be same reference (not processed)
      expect(result[0].destination.Config.apiKey).toBe(
        '{{ message.traits.appId || "default-api-key" }}',
      );

      expect(result[1]).not.toBe(events[1]); // Should be new reference (processed)
      expect(result[1].destination.Config.apiKey).toBe('test-app-id-2');
    });

    it('should use hasDynamicConfig flag when USE_HAS_DYNAMIC_CONFIG_FLAG is set to "true"', () => {
      // Arrange
      process.env.USE_HAS_DYNAMIC_CONFIG_FLAG = 'true';

      const events = [
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test@example.com', appId: 'test-app-id' },
        ),
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test2@example.com', appId: 'test-app-id-2' },
        ),
      ];

      // Set hasDynamicConfig flags
      events[0].destination.hasDynamicConfig = false; // Should skip processing
      events[1].destination.hasDynamicConfig = true; // Should process

      // Act
      const result = DynamicConfigParser.process(events);

      // Assert
      expect(result[0]).toBe(events[0]); // Should be same reference (not processed)
      expect(result[0].destination.Config.apiKey).toBe(
        '{{ message.traits.appId || "default-api-key" }}',
      );

      expect(result[1]).not.toBe(events[1]); // Should be new reference (processed)
      expect(result[1].destination.Config.apiKey).toBe('test-app-id-2');
    });

    it('should ignore hasDynamicConfig flag when USE_HAS_DYNAMIC_CONFIG_FLAG is set to "false"', () => {
      // Arrange
      process.env.USE_HAS_DYNAMIC_CONFIG_FLAG = 'false';

      const events = [
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test@example.com', appId: 'test-app-id' },
        ),
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test2@example.com', appId: 'test-app-id-2' },
        ),
      ];

      // Set hasDynamicConfig flags (should be ignored)
      events[0].destination.hasDynamicConfig = false; // Should still process because flag is disabled
      events[1].destination.hasDynamicConfig = true; // Should process

      // Act
      const result = DynamicConfigParser.process(events);

      // Assert
      // Both events should be processed regardless of hasDynamicConfig flag
      expect(result[0]).not.toBe(events[0]); // Should be new reference (processed)
      expect(result[0].destination.Config.apiKey).toBe('test-app-id');

      expect(result[1]).not.toBe(events[1]); // Should be new reference (processed)
      expect(result[1].destination.Config.apiKey).toBe('test-app-id-2');
    });

    it('should use hasDynamicConfig flag when USE_HAS_DYNAMIC_CONFIG_FLAG is set to any other value', () => {
      // Arrange
      process.env.USE_HAS_DYNAMIC_CONFIG_FLAG = 'some-other-value';

      const events = [
        createTestEvent(
          { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
          { email: 'test@example.com', appId: 'test-app-id' },
        ),
      ];

      // Set hasDynamicConfig flag
      events[0].destination.hasDynamicConfig = false; // Should skip processing

      // Act
      const result = DynamicConfigParser.process(events);

      // Assert
      expect(result[0]).toBe(events[0]); // Should be same reference (not processed)
      expect(result[0].destination.Config.apiKey).toBe(
        '{{ message.traits.appId || "default-api-key" }}',
      );
    });
  });
});
