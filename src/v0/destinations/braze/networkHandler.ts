/* eslint-disable no-unused-vars */
import { NetworkError } from '@rudderstack/integrations-lib';
import { isHttpStatusSuccess } from '../../util/index';
import { proxyRequest, prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { DESTINATION } from './config';
import type { BrazeResponseHandlerParams } from './types';
import tags from '../../util/tags';
import stats from '../../../util/stats';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const responseHandler = (responseParams: BrazeResponseHandlerParams) => {
  const { destinationResponse } = responseParams;
  const message = `Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;
  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }

  // Partial errors
  if (response?.message === 'success' && response?.errors && response.errors.length > 0) {
    stats.increment('braze_partial_failure');
  }

  // application level errors
  if (response?.message !== 'success' && response?.errors && response.errors.length > 0) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
  return {
    status,
    message,
    destinationResponse,
  };
};

function networkHandler(this: {
  responseHandler: typeof responseHandler;
  proxy: typeof proxyRequest;
  prepareProxy: typeof prepareProxyRequest;
  processAxiosResponse: typeof processAxiosResponse;
}) {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

export { networkHandler };
