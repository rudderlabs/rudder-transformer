// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
import { ConfigurationError } from '@rudderstack/integrations-lib';
import { proxyRequest } from '../../../adapters/network';
import { networkHandler as genericNetworkHandler } from '../../../adapters/networkhandler/genericNetworkHandler';
import { getDestinationVersion } from '../../../util/utils';
import { ProxyRequest } from '../../../types';
import { V2_MAJOR } from './config';

const DEST = 'test_destination';

// Proxy/dataDelivery carries no destination object — the major arrives as the top-level
// `destinationVersion` on the proxy payload. Dispatch on it: 0/undefined/1 deliver via the v1 path.
const proxy = async (deliveryRequest: ProxyRequest, destType: string) => {
  const major = getDestinationVersion(deliveryRequest.destinationVersion);
  if (major >= V2_MAJOR) {
    throw new ConfigurationError(`${DEST} v2 delivery is not yet implemented`);
  }
  return proxyRequest(deliveryRequest, destType);
};

// Inherit the generic responseHandler / processAxiosResponse / prepareProxy contract and override
// only the proxy with integration-major dispatch, so future changes to the shared network contract
// reach this destination instead of silently bypassing a re-declared copy.
function networkHandler(this: Record<string, unknown>) {
  genericNetworkHandler.call(this);
  this.proxy = proxy;
}

export { networkHandler };
