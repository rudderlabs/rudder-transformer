const { RetryableError, TAG_NAMES, NetworkError } = require('@rudderstack/integrations-lib');
const isString = require('lodash/isString');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { TransformerProxyError } = require('../../../v0/util/errorTypes');

const populateResponseWithDontBatch = (rudderJobMetadata, response) => {
  const errorMessage = JSON.stringify(response);
  return rudderJobMetadata.map((metadata) => {
    // eslint-disable-next-line no-param-reassign
    metadata.dontBatch = true;
    return {
      statusCode: 500,
      metadata,
      error: errorMessage,
    };
  });
};

const redditRespHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const { status, response } = destinationResponse;

  // to handle the case when authorization-token is invalid
  if (status === 401) {
    let errorMessage = 'Authorization failed';
    let authErrorCategory = '';

    if (isString(response) && response.includes('Authorization Required')) {
      errorMessage = `Request failed due to ${response}`;
      authErrorCategory = REFRESH_TOKEN;
    } else if (response?.error?.reason === 'UNAUTHORIZED') {
      errorMessage = response.error.explanation || errorMessage;
      authErrorCategory = REFRESH_TOKEN;
    }

    throw new RetryableError(
      `${errorMessage} during reddit response transformation`,
      status,
      destinationResponse,
      authErrorCategory,
    );
  }
  if (status === 400 && Array.isArray(rudderJobMetadata) && rudderJobMetadata.length > 1) {
    // sending back 500 for retry only when events came in a batch
    const responseWithDontBatch = populateResponseWithDontBatch(rudderJobMetadata, response);
    throw new TransformerProxyError(
      `REDDIT: Error transformer proxy during REDDIT response transformation`,
      500,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(500),
      },
      destinationResponse,
      '',
      responseWithDontBatch,
    );
  }

  throw new NetworkError(
    `${JSON.stringify(response)} during reddit response transformation`,
    status,
    {
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
  );
};
const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `Request Processed Successfully`;
  const { status } = destinationResponse;
  if (!isHttpStatusSuccess(status)) {
    // if error, successfully return status, message and original destination response
    redditRespHandler(responseParams);
  }
  const { response } = destinationResponse;
  const errorMessage =
    response.invalid_events && Array.isArray(response.invalid_events)
      ? response?.invalid_events[0]?.error_message
      : null;
  const destResp = errorMessage || destinationResponse;
  const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
    statusCode: 200,
    metadata,
    error: 'success',
  }));
  // Mostly any error will not have a status of 2xx
  return {
    status,
    message,
    destinationResponse: destResp,
    response: responseWithIndividualEvents,
  };
};
function networkHandler() {
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };
