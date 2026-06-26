// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
import { ConfigurationError, NetworkError } from '@rudderstack/integrations-lib';
import { isHttpStatusSuccess } from '../../util/index';
import { proxyRequest, prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { getDestinationVersion } from '../../../util/utils';
import tags from '../../util/tags';
import { ProxyRequest } from '../../../types';
import { TestDestinationResponseParams } from './type';

const DEST = 'test_destination';

// Integration major at which the v2 delivery shape kicks in (INT-6492). Only v1 ships today.
const V2_MAJOR = 2;

// Proxy/dataDelivery carries no destination object — the major arrives as the top-level
// `destinationVersion` on the proxy payload. Dispatch on it: 0/undefined/1 deliver via the v1 path.
const proxy = async (deliveryRequest: ProxyRequest, destType: string) => {
  const major = getDestinationVersion(deliveryRequest.destinationVersion);
  if (major >= V2_MAJOR) {
    throw new ConfigurationError(`${DEST} v2 delivery is not yet implemented`);
  }
  return proxyRequest(deliveryRequest, destType);
};

const responseHandler = (responseParams: TestDestinationResponseParams) => {
  const { destinationResponse } = responseParams;
  const { status } = destinationResponse;
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `[${DEST}] delivery failed with status: ${status}`,
      status,
      { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
    );
  }
  return {
    status,
    message: `[${DEST}] delivery processed successfully`,
    destinationResponse,
  };
};

function networkHandler(this: {
  responseHandler: typeof responseHandler;
  proxy: typeof proxy;
  prepareProxy: typeof prepareProxyRequest;
  processAxiosResponse: typeof processAxiosResponse;
}) {
  this.responseHandler = responseHandler;
  this.proxy = proxy;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

export { networkHandler };
