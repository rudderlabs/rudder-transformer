// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import { simpleProcessRouterDest } from '../../util';
import { getDestinationVersion } from '../../../util/utils';
import { processV1 } from './utils';
import { TestDestinationProcessorRequest, TestDestinationRouterRequest } from './type';

// Integration major at which the v2 config shape (apiKey/region/accountId) kicks in (INT-6492).
const V2_MAJOR = 2;

// In-file dispatch on the integration major (destination.version). Defaults to v1: a major of
// 0, undefined ("1" not yet stamped) or 1 all normalize to 1 (< 2) and run the v1 path.
const process = (event: TestDestinationProcessorRequest) => {
  const major = getDestinationVersion(event.destination.version);
  if (major >= V2_MAJOR) {
    throw new ConfigurationError('test_destination v2 transformation is not yet implemented');
  }
  return processV1(event);
};

const processRouterDest = async (
  inputs: TestDestinationRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => simpleProcessRouterDest(inputs, process, reqMetadata, {});

export { process, processRouterDest };
