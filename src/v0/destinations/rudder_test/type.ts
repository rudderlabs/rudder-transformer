import {
  Destination,
  RudderRecordV2,
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
  Metadata,
  ProcessorTransformationRequest,
} from '../../../types';
import { RecordAction } from '../../../types/rudderEvents';

// Test behavior configuration for controlling response
export interface TestBehavior {
  statusCode: number;
  errorMessage?: string;
  mutateDestinationConfig?: boolean; // For mutation test
  replaceDestinationConfig?: boolean; // For config reference replacement test
}

// Extended message type that includes testBehavior in context
export type RudderTestMessage = RudderRecordV2 & {
  context?: RudderRecordV2['context'] & {
    testBehavior?: TestBehavior;
  };
};

// Configuration interface for rudder_test destination
export interface RudderTestConfig {
  endpoint?: string;
  apiKey?: string;
  staticValue?: string;
  mutatedByTest?: boolean; // For mutation test
}

export type RudderTestDestination = Destination<RudderTestConfig>;

export type RudderTestProcessorRequest = ProcessorTransformationRequest<
  RudderTestMessage,
  Metadata,
  RudderTestDestination
>;

// Router request type for our destination
export type RudderTestRouterRequest = RouterTransformationRequestData<
  RudderTestMessage,
  RudderTestDestination,
  undefined, // No connection needed for this simple destination
  Metadata
>;

// Type for the JSON payload that echoes back the record event data
export interface RudderTestResponsePayload {
  action: RecordAction;
  fields: Record<string, any>;
  identifiers: Record<string, string | number>;
  recordId?: string;
  timestamp: string;
}

// Use existing ProcessorTransformationOutput with our specific payload type
export type RudderTestResponse = ProcessorTransformationOutput & {
  body?: {
    JSON?: RudderTestResponsePayload;
  };
};
