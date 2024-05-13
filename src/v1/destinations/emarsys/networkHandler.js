/* eslint-disable @typescript-eslint/naming-convention */
const { isObject } = require('@rudderstack/integrations-lib');
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

// ref : https://dev.emarsys.com/docs/emarsys-core-api-guides/c47a64a8ea7dc-http-200-errors
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
  if (errors && isObject(errors) && errors[errorKey]) {
    // const errorCode = Object.keys(errors[errorKey])[0]; // Assume there is at least one error code
    const errorMsg = JSON.stringify(errors[errorKey]);
    return { isAbortable: true, errorMsg };
  }

  // if '<NO_KEY_ID>' is present in the error object, that means, it is a root level error, and none of the events are supposed to be successful
  if (errors && isObject(errors) && errors['<NO_KEY_ID>']) {
    const errorMsg = JSON.stringify(errors['<NO_KEY_ID>']);
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

  // ref : https://dev.emarsys.com/docs/emarsys-core-api-guides/5e68295991665-http-400-errors
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

  // ref : https://dev.emarsys.com/docs/emarsys-core-api-guides/45c776d275862-http-500-errors

  throw new TransformerProxyError(
    `EMARSYS: Error transformer proxy v1 during EMARSYS response transformation`,
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
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler, checkIfEventIsAbortableAndExtractErrorMessage };
