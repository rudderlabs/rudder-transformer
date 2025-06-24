import { randomBytes } from 'crypto';
import { generateMetadata } from '../../../testUtils';
import {
  destination,
  destinationV2,
  destinationWithDynamicConfig,
  destinationWithDynamicConfigV2,
  destinationWithoutDynamicConfig,
  destinationWithoutDynamicConfigV2,
  testConnection,
  buildMessage,
  buildRouterInput,
  buildCompactedRouterInput,
} from '../common';
import { RudderTestScenario, RudderTestData, RudderTestLoadConfig, EventData } from './types';
import { ContextGenerator } from './contextGenerator';
import { FieldGenerator } from './fieldGenerator';

export class RudderTestDataGenerator {
  public config: RudderTestLoadConfig;
  private eventCounter = 0;
  private contextGenerator: ContextGenerator;
  private fieldGenerator: FieldGenerator;

  constructor(config: RudderTestLoadConfig) {
    this.config = config;
    this.contextGenerator = new ContextGenerator();
    this.fieldGenerator = new FieldGenerator();
  }

  /**
   * Generate test data for a specific scenario
   */
  generateScenarioData(scenario: RudderTestScenario): RudderTestData {
    const envOverrides = scenario.envOverrides || {};
    const result: RudderTestData = { envOverrides };

    const events = this.generateEvents(scenario);

    if (scenario.testType === 'proxy-v0') {
      result.proxyPayload = this.generateProxyV0Payload(events[0], scenario);
    } else {
      result.processorPayload = {
        request: {
          method: 'POST',
          body: events,
        },
      };

      result.routerPayload = scenario.useCompaction
        ? this.generateCompactedRouterPayload(events, scenario)
        : this.generateStandardRouterPayload(events, scenario);
    }

    return result;
  }

  /**
   * Generate events for a scenario
   */
  private generateEvents(scenario: RudderTestScenario): EventData[] {
    const events: EventData[] = [];

    for (let i = 0; i < scenario.batchSize; i++) {
      const message = this.generateMessageForScenario(scenario);
      events.push({
        message,
        metadata: generateMetadata(this.eventCounter++),
        destination: this.getDestinationForScenario(scenario),
      });
    }

    return events;
  }

  /**
   * Generate multiple scenarios for load testing
   */
  generateLoadTestBatch(): Array<{
    scenario: RudderTestScenario;
    data: RudderTestData;
  }> {
    return this.config.scenarios.map((scenario) => ({
      scenario,
      data: this.generateScenarioData(scenario),
    }));
  }

  /**
   * Generate a message using buildMessage format for a specific scenario
   */
  private generateMessageForScenario(scenario: RudderTestScenario): unknown {
    const contextOverrides = this.contextGenerator.generateContext(scenario.complexity);

    const message = buildMessage({
      ...contextOverrides,
      action: this.getRandomRecordAction(),
      fields: this.fieldGenerator.generateFields(scenario.complexity),
      identifiers: this.fieldGenerator.generateIdentifiers(scenario.complexity),
      recordId: `record_${this.generateRandomId()}`,
      messageId: `msg_${this.generateRandomId()}`,
      timestamp: new Date().toISOString(),
    });

    return this.enhanceMessageForScenario(message, scenario);
  }

  /**
   * Enhance message with scenario-specific data
   */
  private enhanceMessageForScenario(message: any, scenario: RudderTestScenario): unknown {
    if (scenario.testBehavior) {
      message.context = message.context || {};
      message.context.testBehavior = scenario.testBehavior;
    }

    if (scenario.useDynamicConfig) {
      message.context = message.context || {};
      message.context.endpoint = `https://dynamic-${Math.floor(Math.random() * 100)}.example.com/v1/record`;
      message.traits = message.traits || {};
      message.traits.appId = `dynamic-app-${this.generateRandomId().substring(0, 8)}`;
    }

    return message;
  }

  /**
   * Get destination configuration for scenario
   */
  private getDestinationForScenario(scenario: RudderTestScenario): unknown {
    if (scenario.useCdkV2) {
      return this.getCdkV2Destination(scenario);
    }

    return this.getNativeDestination(scenario);
  }

  /**
   * Get CDK v2 destination configuration
   */
  private getCdkV2Destination(scenario: RudderTestScenario): unknown {
    if (scenario.useDynamicConfig) {
      return destinationWithDynamicConfigV2;
    }
    if (scenario.useDynamicConfig === false) {
      return destinationWithoutDynamicConfigV2;
    }
    return destinationV2;
  }

  /**
   * Get native destination configuration
   */
  private getNativeDestination(scenario: RudderTestScenario): unknown {
    if (scenario.useDynamicConfig) {
      return destinationWithDynamicConfig;
    }
    if (scenario.useDynamicConfig === false) {
      return destinationWithoutDynamicConfig;
    }
    return destination;
  }

  /**
   * Generate proxy v0 payload for single event
   */
  private generateProxyV0Payload(
    eventData: EventData,
    scenario: RudderTestScenario,
  ): {
    request: {
      method?: string;
      body: unknown;
      headers?: Record<string, string>;
      metadata?: unknown;
      destinationConfig?: unknown;
    };
  } {
    const message = eventData.message as any;
    const destinationConfig = (this.getDestinationForScenario(scenario) as any).Config;

    return {
      request: {
        body: {
          JSON: {
            action: message.action,
            recordId: message.recordId,
            fields: message.fields || {},
            identifiers: message.identifiers || {},
            timestamp: message.timestamp,
            ...(scenario.testBehavior && { testBehavior: scenario.testBehavior }),
          },
        },
        metadata: eventData.metadata,
        destinationConfig,
      },
    };
  }

  /**
   * Generate standard router payload
   */
  private generateStandardRouterPayload(
    events: EventData[],
    scenario: RudderTestScenario,
  ): { request: { method: string; body: unknown } } {
    return {
      request: {
        method: 'POST',
        body: {
          input: events.map((event) =>
            buildRouterInput(event.message, event.metadata, event.destination),
          ),
          destType: 'rudder_test',
        },
      },
    };
  }

  /**
   * Generate compacted router payload
   */
  private generateCompactedRouterPayload(
    events: EventData[],
    scenario: RudderTestScenario,
  ): { request: { method: string; body: unknown; headers?: Record<string, string> } } {
    const destinationId = `test-destination-${this.generateRandomId().substring(0, 8)}`;
    const sourceId = `test-source-${this.generateRandomId().substring(0, 8)}`;

    return {
      request: {
        method: 'POST',
        headers: {
          'x-content-format': 'json+compactedv1',
        },
        body: {
          input: events.map((event) =>
            buildCompactedRouterInput(event.message, {
              ...(event.metadata as Record<string, unknown>),
              destinationId,
              sourceId,
            }),
          ),
          destType: 'rudder_test',
          destinations: {
            [destinationId]: this.getDestinationForScenario(scenario),
          },
          connections: {
            [`${sourceId}:${destinationId}`]: testConnection,
          },
        },
      },
    };
  }

  /**
   * Generate large nested object for stress testing
   */
  private generateLargeNestedObject(depth: number): any {
    if (depth === 0) {
      return this.generateRandomString(30);
    }

    const obj: any = {};
    const numFields = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < numFields; i++) {
      const key = `field_${i}_${this.generateRandomString(5)}`;

      if (Math.random() > 0.5 && depth > 1) {
        obj[key] = this.generateLargeNestedObject(depth - 1);
      } else {
        obj[key] = [
          this.generateRandomString(50),
          Math.random() * 1000,
          Math.random() > 0.5,
          new Date().toISOString(),
        ][Math.floor(Math.random() * 4)];
      }
    }

    return obj;
  }

  private getRandomRecordAction(): string {
    return ['insert', 'update', 'upsert', 'delete'][Math.floor(Math.random() * 4)];
  }

  private generateRandomId(): string {
    return randomBytes(16).toString('hex');
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateRandomIP(): string {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  private generateRandomUserAgent(): string {
    const browsers = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    ];
    return browsers[Math.floor(Math.random() * browsers.length)];
  }

  getEventCounter(): number {
    return this.eventCounter;
  }

  resetEventCounter(): void {
    this.eventCounter = 0;
  }
}

/**
 * Predefined scenarios based on rudder_test component tests
 */
export const RUDDER_TEST_SCENARIOS: RudderTestScenario[] = [
  // Basic scenarios
  {
    name: 'basic-processor',
    description: 'Basic processor transformation with simple events',
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'processor',
  },
  {
    name: 'basic-router',
    description: 'Basic router transformation with simple events',
    batchSize: 3,
    complexity: 'simple',
    endpoint: 'router',
  },

  // Environment override scenarios
  {
    name: 'env-override-endpoint',
    description: 'Test with API endpoint override via environment variables',
    envOverrides: {
      RUDDER_TEST_API_ENDPOINT: 'https://staging.rudderstack.com/v1/record',
    },
    batchSize: 5,
    complexity: 'medium',
    endpoint: 'processor',
    features: ['Env Overrides'],
  },
  {
    name: 'env-override-debug',
    description: 'Test with debug mode enabled via environment variables',
    envOverrides: {
      RUDDER_TEST_DEBUG: 'true',
    },
    batchSize: 3,
    complexity: 'medium',
    endpoint: 'processor',
    features: ['Env Overrides'],
  },
  {
    name: 'env-override-dynamic-config',
    description: 'Test disabling dynamic config processing via environment variable',
    envOverrides: {
      USE_HAS_DYNAMIC_CONFIG_FLAG: 'false',
    },
    useDynamicConfig: true,
    batchSize: 2,
    complexity: 'medium',
    endpoint: 'processor',
    features: ['Dynamic Config', 'Env Overrides'],
  },

  // Dynamic config scenarios
  {
    name: 'dynamic-config-simple',
    description: 'Test dynamic config processing without compaction',
    useDynamicConfig: true,
    batchSize: 1,
    complexity: 'medium',
    endpoint: 'processor',
    features: ['Dynamic Config'],
  },
  {
    name: 'dynamic-config-multi-event',
    description: 'Test multiple events with different dynamic config values',
    useDynamicConfig: true,
    batchSize: 5,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Dynamic Config'],
  },

  // Payload compaction scenarios
  {
    name: 'compaction-simple',
    description: 'Test payload compaction without dynamic config',
    useCompaction: true,
    batchSize: 1,
    complexity: 'medium',
    endpoint: 'router',
    features: ['Compaction'],
  },
  {
    name: 'compaction-with-dynamic-config',
    description: 'Test both dynamic config and payload compaction together',
    useCompaction: true,
    useDynamicConfig: true,
    batchSize: 3,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Compaction', 'Dynamic Config'],
  },
  {
    name: 'compaction-multi-event',
    description: 'Test multiple events with compaction and different dynamic config values',
    useCompaction: true,
    useDynamicConfig: true,
    batchSize: 10,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Compaction', 'Dynamic Config'],
  },

  // Error scenarios
  {
    name: 'error-400',
    description: 'Test error response via testBehavior',
    testBehavior: {
      statusCode: 400,
      errorMessage: 'Test validation error',
    },
    batchSize: 2,
    complexity: 'simple',
    endpoint: 'processor',
    features: ['Test Behavior'],
  },
  {
    name: 'error-500',
    description: 'Test server error response via testBehavior',
    testBehavior: {
      statusCode: 500,
      errorMessage: 'Internal server error simulation',
    },
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'processor',
    features: ['Test Behavior'],
  },

  // Stress test scenarios
  {
    name: 'stress-large-payload',
    description: 'Test with large complex payloads',
    batchSize: 20,
    complexity: 'complex',
    endpoint: 'router',
  },
  {
    name: 'stress-compaction-large',
    description: 'Test large payloads with compaction',
    useCompaction: true,
    batchSize: 50,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Compaction'],
  },
  {
    name: 'stress-dynamic-config-large',
    description: 'Test large payloads with dynamic config',
    useDynamicConfig: true,
    batchSize: 30,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Dynamic Config'],
  },

  // Mixed scenarios
  {
    name: 'mixed-dynamic-config',
    description: 'Test mixed dynamic config scenarios with multiple events and different configs',
    useDynamicConfig: true,
    batchSize: 8,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Dynamic Config'],
  },
  {
    name: 'mutation-test',
    description: 'Test mutation of frozen destination config in compacted payload',
    useCompaction: true,
    testBehavior: {
      mutateDestinationConfig: true,
    },
    batchSize: 1,
    complexity: 'medium',
    endpoint: 'router',
    features: ['Compaction', 'Test Behavior'],
  },

  // Proxy v0 scenarios (Note: These use the proxy-v0 API endpoint)
  {
    name: 'proxy-v0-success',
    description: 'Proxy v0 endpoint with successful transformations',
    testType: 'proxy-v0',
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'proxy-v0',
  },
  {
    name: 'proxy-v0-error-400',
    description: 'Proxy v0 endpoint with 400 Bad Request simulation',
    testType: 'proxy-v0',
    testBehavior: {
      statusCode: 400,
      errorMessage: 'Bad Request - Invalid data format',
    },
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'proxy-v0',
    features: ['Test Behavior'],
  },
  {
    name: 'proxy-v0-error-401',
    description: 'Proxy v0 endpoint with 401 Unauthorized simulation',
    testType: 'proxy-v0',
    testBehavior: {
      statusCode: 401,
      errorMessage: 'Unauthorized - Invalid API key',
    },
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'proxy-v0',
    features: ['Test Behavior'],
  },
  {
    name: 'proxy-v0-error-500',
    description: 'Proxy v0 endpoint with 500 Internal Server Error simulation',
    testType: 'proxy-v0',
    testBehavior: {
      statusCode: 500,
      errorMessage: 'Internal server error - please retry',
    },
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'proxy-v0',
    features: ['Test Behavior'],
  },
  {
    name: 'proxy-v0-rate-limit',
    description: 'Proxy v0 endpoint with 429 Rate Limit simulation',
    testType: 'proxy-v0',
    testBehavior: {
      statusCode: 429,
      errorMessage: 'Rate limit exceeded - too many requests',
    },
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'proxy-v0',
    features: ['Test Behavior'],
  },

  // CDK v2 scenarios
  {
    name: 'cdk-v2-basic-processor',
    description: 'Basic CDK v2 processor transformation with simple events',
    useCdkV2: true,
    batchSize: 1,
    complexity: 'simple',
    endpoint: 'processor',
  },
  {
    name: 'cdk-v2-basic-router',
    description: 'Basic CDK v2 router transformation with simple events',
    useCdkV2: true,
    batchSize: 3,
    complexity: 'simple',
    endpoint: 'router',
  },
  {
    name: 'cdk-v2-dynamic-config',
    description: 'CDK v2 with dynamic config processing',
    useCdkV2: true,
    useDynamicConfig: true,
    batchSize: 2,
    complexity: 'medium',
    endpoint: 'processor',
    features: ['Dynamic Config'],
  },
  {
    name: 'cdk-v2-batch-processing',
    description: 'CDK v2 router with batch processing (multiple events)',
    useCdkV2: true,
    batchSize: 10,
    complexity: 'medium',
    endpoint: 'router',
  },
  {
    name: 'cdk-v2-dynamic-config-multi-event',
    description: 'CDK v2 with multiple events and different dynamic config values',
    useCdkV2: true,
    useDynamicConfig: true,
    batchSize: 8,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Dynamic Config'],
  },
  {
    name: 'cdk-v2-compaction',
    description: 'CDK v2 with payload compaction',
    useCdkV2: true,
    useCompaction: true,
    batchSize: 5,
    complexity: 'medium',
    endpoint: 'router',
    features: ['Compaction'],
  },
  {
    name: 'cdk-v2-compaction-dynamic-config',
    description: 'CDK v2 with both compaction and dynamic config',
    useCdkV2: true,
    useCompaction: true,
    useDynamicConfig: true,
    batchSize: 7,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Compaction', 'Dynamic Config'],
  },
  {
    name: 'cdk-v2-mutation-error',
    description: 'CDK v2 test mutation of frozen destination config (compacted payload)',
    useCdkV2: true,
    useCompaction: true,
    testBehavior: {
      mutateDestinationConfig: true,
    },
    batchSize: 1,
    complexity: 'medium',
    endpoint: 'router',
    features: ['Compaction', 'Test Behavior'],
  },
  {
    name: 'cdk-v2-error-handling',
    description: 'CDK v2 error response simulation',
    useCdkV2: true,
    testBehavior: {
      statusCode: 400,
      errorMessage: 'CDK v2 test validation error',
    },
    batchSize: 2,
    complexity: 'simple',
    endpoint: 'processor',
    features: ['Test Behavior'],
  },
  {
    name: 'cdk-v2-stress-large-payload',
    description: 'CDK v2 stress test with large complex payloads',
    useCdkV2: true,
    batchSize: 25,
    complexity: 'complex',
    endpoint: 'router',
  },
  {
    name: 'cdk-v2-stress-compaction-large',
    description: 'CDK v2 stress test with large payloads and compaction',
    useCdkV2: true,
    useCompaction: true,
    batchSize: 50,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Compaction'],
  },
  {
    name: 'cdk-v2-stress-dynamic-config-large',
    description: 'CDK v2 stress test with large payloads and dynamic config',
    useCdkV2: true,
    useDynamicConfig: true,
    batchSize: 40,
    complexity: 'complex',
    endpoint: 'router',
    features: ['Dynamic Config'],
  },
];
