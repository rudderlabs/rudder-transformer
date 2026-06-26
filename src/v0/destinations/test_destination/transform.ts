// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import { simpleProcessRouterDest } from '../../util';
import { getDestinationVersion } from '../../../util/utils';
import { V2_MAJOR } from './config';
import { processV1 } from './utils';
import { TestDestinationProcessorRequest, TestDestinationRouterRequest } from './type';

// In-file dispatch on the integration major (destination.version). Defaults to v1: a major of
// 0, undefined ("1" not yet stamped) or 1 all normalize to 1 (< V2_MAJOR) and run the v1 path.
// Named transformEvent (not `process`) to avoid shadowing the Node.js global `process`; exported as `process`.
const transformEvent = (event: TestDestinationProcessorRequest) => {
  const major = getDestinationVersion(event.destination.version);
  if (major >= V2_MAJOR) {
    throw new ConfigurationError('test_destination v2 transformation is not yet implemented');
  }
  return processV1(event);
};

const processRouterDest = async (
  inputs: TestDestinationRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => simpleProcessRouterDest(inputs, transformEvent, reqMetadata, {});

export { transformEvent as process, processRouterDest };
