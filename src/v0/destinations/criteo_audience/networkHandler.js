const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const tags = require('../../util/tags');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const {
  NetworkError,
  ThrottledError,
  NetworkInstrumentationError,
  AbortedError,
  RetryableError,
} = require('../../util/errorTypes');

//  https://developers.criteo.com/marketing-solutions/v2021.01/docs/how-to-handle-api-errors#:~:text=the%20response%20body.-,401,-Authentication%20error
// Following fucntion tells us if there is a particular error code in the response.
const matchErrorCode = (errorCode, response) =>
  response &&
  Array.isArray(response?.errors) &&
  response.errors.some((resp) => resp?.code === errorCode);

const criteoAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;

  // https://developers.criteo.com/marketing-solutions/docs/api-error-types#error-category-types
  // to handle the case when authorization-token is invalid
  if (
    status === 401 &&
    (matchErrorCode('authorization-token-invalid', response) ||
      matchErrorCode('authorization-token-expired', response))
  ) {
    throw new NetworkError(
      `${response?.errors[0]?.title} ${stageMsg}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      response,
      REFRESH_TOKEN,
    );
  } else if (status === 404 && matchErrorCode('audience-invalid', response)) {
    // to handle the case when audience-id is invalid
    throw new NetworkInstrumentationError(
      `AudienceId is Invalid. Please Provide Valid AudienceId`,
      destResponse,
    );
  } else if (status === 429) {
    // https://developers.criteo.com/marketing-solutions/docs/api-error-types#429
    throw new ThrottledError(
      `Request Failed: ${stageMsg} - due to Request Limit exceeded, (Throttled)`,
      destResponse,
    );
  } else if (status === 503 || status === 500) {
    // see if its 500 internal error or 503 service unavailable
    throw new RetryableError(`Request Failed: ${stageMsg} (Retryable)`, 500, destResponse);
  }
  // else throw the error
  const errorMessage = response?.errors;
  throw new AbortedError(
    `Request Failed: ${stageMsg} with status "${status}" due to "${
      errorMessage ? JSON.stringify(errorMessage[0]) : JSON.stringify(response)
    }", (Aborted) `,
    400,
    destResponse,
  );
};

const responseHandler = (destinationResponse) => {
  const message = `Request Processed Successfully`;
  const { status } = destinationResponse;
  if (!isHttpStatusSuccess(status)) {
    // if error, successfully return status, message and original destination response
    criteoAudienceRespHandler(
      destinationResponse,
      'during criteo_audience response transformation',
    );
  }
  // Mostly any error will not have a status of 2xx
  return {
    status,
    message,
    destinationResponse,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.responseHandler = responseHandler;
    this.proxy = proxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = { networkHandler };
