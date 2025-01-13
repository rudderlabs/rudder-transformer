import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { isHttpStatusSuccess, getAuthErrCategoryFromStCode } from '../../../v0/util/index';
import { DeliveryV1Response, DeliveryJobState } from '../../../types/index';

import { processAxiosResponse, getDynamicErrorType } from '../../../adapters/utils/networkUtils';

const tags = require('../../../v0/util/tags');

/**
 *
 * @param results
 * @param rudderJobMetadata
 * @param destinationConfig
 * @returns boolean
 */

const findFeatureandVersion = (response, rudderJobMetadata, destinationConfig) => {
  const { results, errors } = response;
  if (Array.isArray(rudderJobMetadata) && rudderJobMetadata.length === 1) {
    return 'singleEvent';
  }
  if (destinationConfig?.apiVersion === 'legacyApi') {
    return 'legacyApiWithMultipleEvents';
  }
  if (destinationConfig?.apiVersion === 'newApi') {
    if (Array.isArray(results) && results.length === rudderJobMetadata.length)
      return 'newApiWithMultipleEvents';

    if (
      Array.isArray(results) &&
      results.length !== rudderJobMetadata.length &&
      Array.isArray(errors) &&
      results.length + errors.length === rudderJobMetadata.length
    )
      return 'newApiWithMultipleEventsAndErrors';
  }
  return 'unableToFindVersionWithMultipleEvents';
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

type Response = {
  status?: string;
  results?: Array<object>;
  errors?: Array<object>;
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
    const destResponse = response as Response;
    let proxyOutputObj: DeliveryJobState;
    const featureAndVersion = findFeatureandVersion(
      destResponse,
      rudderJobMetadata,
      destinationRequest?.destinationConfig,
    );
    switch (featureAndVersion) {
      case 'singleEvent':
        proxyOutputObj = {
          statusCode: status,
          metadata: rudderJobMetadata[0],
          error: JSON.stringify(destResponse),
        };
        responseWithIndividualEvents.push(proxyOutputObj);
        break;
      case 'newApiWithMultipleEvents':
        rudderJobMetadata.forEach((metadata: any, index: string | number) => {
          proxyOutputObj = {
            statusCode: 200,
            metadata,
            error: JSON.stringify(destResponse.results?.[index]),
          };
          responseWithIndividualEvents.push(proxyOutputObj);
        });
        break;
      default:
        rudderJobMetadata.forEach((metadata) => {
          proxyOutputObj = {
            statusCode: 200,
            metadata,
            error: 'success',
          };
          responseWithIndividualEvents.push(proxyOutputObj);
        });
        break;
    }
    return {
      status,
      message: successMessage,
      response: responseWithIndividualEvents,
    } as DeliveryV1Response;
  }

  // At least one event in the batch is invalid.
  if (status === 400 && Array.isArray(rudderJobMetadata) && rudderJobMetadata.length > 1) {
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
    response,
  );
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
