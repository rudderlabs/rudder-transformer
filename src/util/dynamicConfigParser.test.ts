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
      async ({ config, traits, expectedConfig, hasDynamicConfig, expectedSameReference }) => {
        // Arrange
        const event = createTestEvent(config, traits);
        // Set hasDynamicConfig if specified in the test case
        if (hasDynamicConfig !== undefined) {
          event.destination.hasDynamicConfig = hasDynamicConfig;
        }
        const originalEvent = cloneDeep(event);

        // Act
        const result = await DynamicConfigParser.process([event]);

        // Assert
        expect(result).toHaveLength(1);

        // Check if the result should be the same reference as the original event
        if (expectedSameReference) {
          expect(result[0]).toBe(event); // Should be the same object (not processed)
        } else {
          expect(result[0]).not.toBe(event); // Should be a new object (processed)
          expect(result[0].destination).not.toBe(event.destination); // Destination should be cloned
          expect(result[0].destination.Config).not.toBe(event.destination.Config); // Config should be cloned
          expect(result[0].message).toBe(event.message); // Message should be the same reference (gets modified by unset)
        }

        expect(result[0].destination.Config).toEqual(expectedConfig);

        // For events that were processed, the destination config should remain unchanged
        if (!expectedSameReference) {
          // The destination config should remain unchanged in the original event (because we cloned it)
          expect(event.destination.Config).toEqual(originalEvent.destination.Config);
          // The message may or may not be modified depending on whether unset operations occurred
          // We can't make a blanket assertion here since it depends on the specific test case
        }
      },
    );

    it('should handle multiple events', async () => {
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
      const result = await DynamicConfigParser.process(events);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].destination.Config).toEqual({ apiKey: 'test-app-id-1' });
      expect(result[1].destination.Config).toEqual({ apiKey: 'test-app-id-2' });

      // Original events' destination configs should remain unchanged (because we cloned them)
      // but messages will be modified by unset operations
      events.forEach((event, index) => {
        expect(event.destination.Config).toEqual(originalEvents[index].destination.Config);
        // The messages should have fields removed by unset operations
        expect(event.message).not.toEqual(originalEvents[index].message);
      });
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
      async ({
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
        const result = await DynamicConfigParser.process([event]);

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0].message.type).toBe(messageType);

        // Check if the result should be the same reference as the original event
        if (expectedSameReference) {
          expect(result[0]).toBe(event); // Should be the same object (not processed)
        } else {
          expect(result[0]).not.toBe(event); // Should be a new object (processed)
          expect(result[0].destination).not.toBe(event.destination); // Destination should be cloned
          expect(result[0].destination.Config).not.toBe(event.destination.Config); // Config should be cloned
          expect(result[0].message).toBe(event.message); // Message should be the same reference (gets modified by unset)
        }

        expect(result[0].destination.Config).toEqual(expectedConfig);

        // For events that were processed, the destination config should remain unchanged
        if (!expectedSameReference) {
          // The destination config should remain unchanged in the original event (because we cloned it)
          expect(event.destination.Config).toEqual(originalEvent.destination.Config);
          // The message may or may not be modified depending on whether unset operations occurred
          // We can't make a blanket assertion here since it depends on the specific test case
        }
      },
    );

    it('should not modify shared destination objects', async () => {
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
      const result = await DynamicConfigParser.process([event1, event2]);

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
    test.each(batchTestCases)('$name', async ({ eventConfigs }) => {
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
      const result = await DynamicConfigParser.process(events);

      // Assert
      expect(result).toHaveLength(events.length);

      // Verify each event was processed correctly
      eventConfigs.forEach((eventConfig, index) => {
        if (eventConfig.expectedSameReference) {
          expect(result[index]).toBe(events[index]); // Should be the same object (not processed)
        } else {
          expect(result[index]).not.toBe(events[index]); // Should be a new object (processed)
          expect(result[index].destination).not.toBe(events[index].destination); // Destination should be cloned
          expect(result[index].destination.Config).not.toBe(events[index].destination.Config); // Config should be cloned
        }
        expect(result[index].destination.Config).toEqual(eventConfig.expectedConfig);
      });

      // Original events' destination configs should remain unchanged (because we cloned them)
      // but messages will be modified by unset operations for processed events
      events.forEach((event, index) => {
        const eventConfig = eventConfigs[index];
        expect(event.destination.Config).toEqual(originalEvents[index].destination.Config);

        // Only processed events should have their messages modified by unset operations
        if (!eventConfig.expectedSameReference) {
          expect(event.message).not.toEqual(originalEvents[index].message);
        } else {
          // Events that were not processed should have unchanged messages
          expect(event.message).toEqual(originalEvents[index].message);
        }
      });
    });

    it('should unset fields from the processed event after extracting values', async () => {
      // Arrange
      const event = createTestEvent(
        { apiKey: '{{ message.traits.appId || "default-api-key" }}' },
        { email: 'test@example.com', appId: 'test-app-id' },
      );

      // Act
      const result = await DynamicConfigParser.process([event]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].destination.Config).toEqual({ apiKey: 'test-app-id' });

      // The processed event should have the appId field unset from traits
      expect(result[0].message.traits).toEqual({ email: 'test@example.com' });
      expect((result[0].message.traits as any).appId).toBeUndefined();

      // Since we only clone destination config (not message), the original event's message
      // will also be modified by unset operations - this is the performance optimization
      expect((event.message.traits as any).appId).toBeUndefined();
      expect(event.message.traits).toEqual({ email: 'test@example.com' });
    });
  });

  describe('Edge cases and error handling', () => {
    // Test cases for uncovered lines to improve coverage
    const edgeCaseTestCases = [
      {
        name: 'should handle malformed templates without {{ or }}',
        config: { apiKey: 'not a template' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: 'not a template' },
      },
      {
        name: 'should handle templates that start with {{ but do not end with }}',
        config: { apiKey: '{{ message.traits.appId || "default"' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: '{{ message.traits.appId || "default"' },
      },
      {
        name: 'should handle templates without || separator',
        config: { apiKey: '{{ message.traits.appId }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: '{{ message.traits.appId }}' },
      },
      {
        name: 'should handle templates with invalid path format',
        config: { apiKey: '{{ 123invalid.path || "default" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: '{{ 123invalid.path || "default" }}' },
      },
      {
        name: 'should handle templates with empty path',
        config: { apiKey: '{{  || "default" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: '{{  || "default" }}' },
      },
      {
        name: 'should handle templates with path containing invalid characters',
        config: { apiKey: '{{ path.with-dash || "default" }}' },
        traits: { appId: 'test-app-id' },
        expectedConfig: { apiKey: '{{ path.with-dash || "default" }}' },
      },
      {
        name: 'should handle null and undefined values in config',
        config: {
          nullValue: null,
          undefinedValue: undefined,
          numberValue: 42,
          booleanValue: true,
          template: '{{ message.traits.appId || "default" }}',
        },
        traits: { appId: 'test-app-id' },
        expectedConfig: {
          nullValue: null,
          undefinedValue: undefined,
          numberValue: 42,
          booleanValue: true,
          template: 'test-app-id',
        },
      },
    ];

    // Run the edge case tests
    test.each(edgeCaseTestCases)('$name', async ({ config, traits, expectedConfig }) => {
      // Arrange
      const event = createTestEvent(config, traits);

      // Act
      const result = await DynamicConfigParser.process([event]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].destination.Config).toEqual(expectedConfig);
    });

    it('should handle arrays with mixed value types', async () => {
      // Arrange
      const event = createTestEvent(
        {
          mixedArray: [
            '{{ message.traits.appId || "default1" }}',
            42,
            true,
            null,
            undefined,
            { nested: '{{ message.traits.email || "default2" }}' },
          ],
        },
        { appId: 'test-app-id', email: 'test@example.com' },
      );

      // Act
      const result = await DynamicConfigParser.process([event]);

      // Assert
      expect(result[0].destination.Config.mixedArray).toEqual([
        'test-app-id',
        42,
        true,
        null,
        undefined,
        { nested: 'test@example.com' },
      ]);
    });

    it('should handle deeply nested objects with various value types', async () => {
      // Arrange
      const event = createTestEvent(
        {
          level1: {
            level2: {
              template: '{{ message.traits.appId || "default" }}',
              number: 123,
              boolean: false,
              nullValue: null,
              array: ['{{ message.traits.email || "default-email" }}', 456],
            },
          },
        },
        { appId: 'test-app-id', email: 'test@example.com' },
      );

      // Act
      const result = await DynamicConfigParser.process([event]);

      // Assert
      expect(result[0].destination.Config).toEqual({
        level1: {
          level2: {
            template: 'test-app-id',
            number: 123,
            boolean: false,
            nullValue: null,
            array: ['test@example.com', 456],
          },
        },
      });
    });
  });
});
