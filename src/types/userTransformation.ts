import type { CatchErr } from './index';
import type { Metadata, RudderMessage } from './rudderEvents';
import type { ProcessorTransformationResponse } from './destinationTransformation';

/**
 * Input structure for user transformations
 */
export type UserTransformationInput = {
  VersionID: string;
  ID: string;
  Config: object;
};

export type UserTransformationResponse = {
  transformedEvent: RudderMessage;
  metadata: Metadata;
  error: CatchErr;
};

export type UserTransformationServiceResponse = {
  transformedEvents: ProcessorTransformationResponse[];
  retryStatus: number;
};

interface CredentialInput {
  key: string;
  value: string;
  isSecret: boolean;
}

type LibraryInput = {
  versionId: string;
};

interface Dependencies {
  libraries: LibraryInput[];
  credentials: CredentialInput[];
}

export interface TestRunRequestBody {
  input: Record<string, any>[];
  code: string;
  language: string;
  codeVersion?: '0' | '1';
  dependencies: Dependencies;
}
