import { TestScenario, GenericTestData } from '../../../integrationTestUtils';
import { ComplexityLevel, ContextData } from '../../../common/generators';

export interface TestBehavior {
  statusCode?: number;
  errorMessage?: string;
  mutateDestinationConfig?: boolean;
  replaceDestinationConfig?: boolean;
  batchScenario?: string;
}

export interface RudderTestScenario extends TestScenario {
  useCdkV2?: boolean;
  testBehavior?: TestBehavior;
  testType?: 'processor' | 'router' | 'proxy-v0' | 'proxy-v1';
}

// Extend the generic test data for rudder_test specific needs
export interface RudderTestData extends GenericTestData {
  // Additional rudder_test specific properties can be added here
}

export interface RudderTestLoadConfig {
  scenarios: RudderTestScenario[];
  maxConcurrentRequests: number;
  requestInterval: number;
  cooldownPeriod: number;
}

export interface MessageData {
  action: string;
  fields: Record<string, unknown>;
  identifiers: Record<string, unknown>;
  recordId: string;
  messageId: string;
  timestamp: string;
}

export interface EventData {
  message: unknown;
  metadata: unknown;
  destination: unknown;
}

// Re-export common types for convenience
export { ComplexityLevel, ContextData };
