// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
import {
  Destination,
  Metadata,
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
  RudderMessage,
} from '../../../types';

// v1 config. v2 renames restApiKey -> apiKey, dataCenter -> region and adds a required accountId
// (INT-6492). Only v1 is modelled here — the v2 branch is not implemented yet.
export interface TestDestinationV1Config {
  restApiKey?: string;
  dataCenter?: string;
}

export type TestDestination = Destination<TestDestinationV1Config>;

export type TestDestinationProcessorRequest = ProcessorTransformationRequest<
  RudderMessage,
  Metadata,
  TestDestination
>;

export type TestDestinationRouterRequest = RouterTransformationRequestData<
  RudderMessage,
  TestDestination,
  undefined, // no connection needed for this fixture
  Metadata
>;
