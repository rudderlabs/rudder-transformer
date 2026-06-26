// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import { getDestinationVersion } from '../../../util/utils';
import { V2_MAJOR } from './config';
import { processV1 } from './utils';
import { TestDestinationProcessorRequest } from './type';

// In-file dispatch on the integration major (destination.version). getDestinationVersion normalizes
// the raw major (0 / undefined / non-numeric -> 1), so a major below V2_MAJOR runs the v1 path.
// Named transformEvent (not `process`) to avoid shadowing the Node.js global `process`; exported as `process`.
// The router path runs through the native batching framework (routerTransform.ts), so there is no
// processRouterDest here — test_destination is batching-GA, so the legacy router path is never reached.
const transformEvent = (event: TestDestinationProcessorRequest) => {
  const major = getDestinationVersion(event.destination.version);
  if (major >= V2_MAJOR) {
    throw new ConfigurationError('test_destination v2 transformation is not yet implemented');
  }
  return processV1(event);
};

export { transformEvent as process };
