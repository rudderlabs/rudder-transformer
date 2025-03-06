import type { CatchErr } from '../util/types';
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
