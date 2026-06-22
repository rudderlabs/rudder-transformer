import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { isHttpStatusSuccess, getAuthErrCategoryFromStCode } from '../../../v0/util/index';
import { processAxiosResponse, getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import type {
  DeliveryV1Response,
  DeliveryJobState,
  ProxyMetdata,
  ProxyV1Request,
} from '../../../types/index';

const tags = require('../../../v0/util/tags');

type CustomerIOError = {
  batch_index: number;
  reason?: string;
};

type CustomerIO207Response = {
  errors?: CustomerIOError[];
};

const handle207MultiStatus = (
  response: CustomerIO207Response,
  rudderJobMetadata: ProxyMetdata[],
): DeliveryV1Response => {
  const errors = response.errors ?? [];
  const failedByIndex = new Map<number, string>();
  errors.forEach((e) => {
    failedByIndex.set(e.batch_index, e.reason ?? 'Unknown error from CustomerIO');
  });

  const responseWithIndividualEvents: DeliveryJobState[] = rudderJobMetadata.map(
    (metadata, index) => {
      if (failedByIndex.has(index)) {
        return {
          statusCode: 400,
          metadata,
          error: failedByIndex.get(index)!,
        };
      }
      return { statusCode: 200, metadata, error: 'success' };
    },
  );

  return {
    status: 207,
    message: '[CustomerIO Response Handler] - Batch completed with partial failures',
    response: responseWithIndividualEvents,
  };
};

const responseHandler = (responseParams: {
  rudderJobMetadata: ProxyMetdata[];
  destinationResponse: { response: unknown; status: number };
  destinationRequest: ProxyV1Request;
}): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const { response, status } = destinationResponse;

  if (status === 207) {
    return handle207MultiStatus(response as CustomerIO207Response, rudderJobMetadata);
  }

  if (isHttpStatusSuccess(status)) {
    return {
      status,
      message: '[CustomerIO Response Handler] - Request Processed Successfully',
      response: rudderJobMetadata.map((metadata) => ({
        statusCode: 200,
        metadata,
        error: 'success',
      })),
    };
  }

  throw new TransformerProxyError(
    '[CustomerIO Response Handler] - Error in transformer proxy during CustomerIO response transformation',
    status,
    { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
    destinationResponse,
    getAuthErrCategoryFromStCode(status),
    response,
  );
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

export { networkHandler, handle207MultiStatus };
