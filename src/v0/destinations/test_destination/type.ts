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
// A type alias (not an interface) so it carries an implicit index signature and stays assignable to
// Record<string, unknown> — required for the batching framework's RouterTransformationRequestData.
export type TestDestinationV1Config = {
  restApiKey?: string;
  dataCenter?: string;
};

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

// Per-event batch payload — the v1 transform echoes the whole message, so the payload is the message.
export type TestDestinationV1Payload = Record<string, unknown>;
