const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../../v0/util/index');
const tags = require('../../../v0/util/tags');

const checkIfUpdationOfStatusRequired = (response) => {
  let errorMsg = '';
  const responseBodyStatusCode = response.status_code;
  if (
    response.hasOwnProperty('error_message') ||
    response.hasOwnProperty('error_code') ||
    response.hasOwnProperty('errors')
  ) {
    errorMsg = response.error_message || response.errors?.map((error) => error.message).join(', ');
    return { hasError: true, errorMsg, responseBodyStatusCode };
  }
  return { hasError: false, errorMsg, responseBodyStatusCode };
};

// {
//   response: {
//     errors: [
//       {
//         message: "Field 'region' doesn't exist on type 'User'",
//         locations: [{ line: 322, column: 5 }],
//         fields: ['query', 'me', 'region'],
//       },
//     ],
//     account_id: 123456789,
//   },
//   status: 200,
// }
// Ref: https://developer.monday.com/api-reference/docs/errors

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;

  const message = '[MONDAY Response V1 Handler] - Request Processed Successfully';
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  // batching not supported
  if (isHttpStatusSuccess(status)) {
    const proxyOutput = {
      statusCode: 200,
      metadata: rudderJobMetadata[0],
      error: 'success',
    };
    // update status of event if abortable or retryable
    const { hasError, errorMsg, responseBodyStatusCode } =
      checkIfUpdationOfStatusRequired(response);
    if (hasError) {
      proxyOutput.statusCode = responseBodyStatusCode || 400;
      proxyOutput.error = errorMsg;
    }
    responseWithIndividualEvents.push(proxyOutput);

    if (responseBodyStatusCode === 500 || responseBodyStatusCode === 429) {
      throw new TransformerProxyError(
        `MONDAY: Error encountered in transformer proxy V1 with error: ${errorMsg}`,
        responseBodyStatusCode,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(responseBodyStatusCode),
        },
        destinationResponse,
        '',
        responseWithIndividualEvents,
      );
    }

    return {
      status,
      message,
      response: responseWithIndividualEvents,
    };
  }

  const errorMsg =
    response.error_message || response.errors?.map((error) => error.message).join(', ');

  responseWithIndividualEvents.push({
    statusCode: status,
    metadata: rudderJobMetadata,
    error: errorMsg,
  });

  throw new TransformerProxyError(
    `MONDAY: Error encountered in transformer proxy V1 with error: ${errorMsg}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
};
function networkHandler() {
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };
