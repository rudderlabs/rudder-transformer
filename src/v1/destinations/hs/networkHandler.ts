import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { isHttpStatusSuccess, getAuthErrCategoryFromStCode } from '../../../v0/util/index';
import { DeliveryV1Response, DeliveryJobState } from '../../../types/index';

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

const verify = (results, rudderJobMetadata, destinationConfig) => {
  if (destinationConfig?.apiVersion === 'legacyApi') {
    return true;
  }
  if (destinationConfig?.apiVersion === 'newApi') {
    return Array.isArray(results) && results.length === rudderJobMetadata.length;
  }
  return false;
};

const populateResponseWithDontBatch = (rudderJobMetadata, response) => {
  const errorMessage = JSON.stringify(response);
  const responseWithIndividualEvents: DeliveryJobState[] = [];

  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      statusCode: 500,
      metadata: { ...metadata, dontBatch: true },
      error: errorMessage,
    });
  });
  return responseWithIndividualEvents;
};

type Result = {
  status?: string;
  results?: Array<object>;
  startedAt?: Date;
  completedAt?: Date;
  message?: string;
  correlationId?: string;
  failureMessages?: Array<object>;
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const successMessage = `[HUBSPOT Response V1 Handler] - Request Processed Successfully`;
  const failureMessage =
    'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation';
  const responseWithIndividualEvents: DeliveryJobState[] = [];
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // populate different response for each event
    const results = (response as Result)?.results;
    if (verify(results, rudderJobMetadata, destinationRequest?.destinationConfig)) {
      rudderJobMetadata.forEach((metadata) => {
        const proxyOutputObj: DeliveryJobState = {
          statusCode: 200,
          metadata,
          error: 'success',
        };
        responseWithIndividualEvents.push(proxyOutputObj);
      });

      return {
        status,
        message: successMessage,
        response: responseWithIndividualEvents,
      } as DeliveryV1Response;
    }
    // return the destiantionResponse as it is when the response is not in expected format
    throw new TransformerProxyError(
      failureMessage,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
      getAuthErrCategoryFromStCode(status),
    );
  }

  // At least one event in the batch is invalid.
  if (status === 400 && rudderJobMetadata.length > 1) {
    // sending back 500 for retry only when events came in a batch
    return {
      status: 500,
      message: failureMessage,
      response: populateResponseWithDontBatch(rudderJobMetadata, response),
    } as DeliveryV1Response;
  }
  throw new TransformerProxyError(
    failureMessage,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    getAuthErrCategoryFromStCode(status),
    responseWithIndividualEvents,
  );
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
