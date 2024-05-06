/* eslint-disable @typescript-eslint/naming-convention */
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

function checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse, keyId) {
  const { errors } = destinationResponse.response.data;

  // Determine if event is a string or an object, then fetch the corresponding key or value
  let errorKey;
  if (typeof event === 'string') {
    errorKey = event;
  } else if (typeof event === 'object' && event[keyId]) {
    errorKey = event[keyId];
  } else {
    return { isAbortable: false, errorMsg: '' }; // Early return if neither condition is met or if keyId is missing in the object
  }

  // Check if this key has a corresponding error in the errors object
  if (errors[errorKey]) {
    // const errorCode = Object.keys(errors[errorKey])[0]; // Assume there is at least one error code
    const errorMsg = JSON.stringify(errors[errorKey]);
    return { isAbortable: true, errorMsg };
  }

  // Return false and an empty error message if no error is found
  return { isAbortable: false, errorMsg: '' };
}

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const message = `[EMARSYS Response V1 Handler] - Request Processed Successfully`;
  let responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (!isHttpStatusSuccess(status)) {
    const errorMessage = response.replyText || 'unknown error format';
    responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));
    throw new TransformerProxyError(
      `EMARSYS: Error transformer proxy v1 during EMARSYS response transformation. ${errorMessage}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { contacts, external_ids, key_id } = destinationRequest.body.JSON;
    const finalData = contacts || external_ids;
    finalData.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };
      // update status of partial event if abortable
      const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(
        event,
        destinationResponse,
        key_id,
      );
      if (isAbortable) {
        proxyOutput.statusCode = 400;
        proxyOutput.error = errorMsg;
      }
      responseWithIndividualEvents.push(proxyOutput);
    });
    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  // otherwise all events are successful
  responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
    statusCode: 200,
    metadata,
    error: 'success',
  }));

  return {
    status,
    message,
    destinationResponse,
    response: responseWithIndividualEvents,
  };
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler, checkIfEventIsAbortableAndExtractErrorMessage };
