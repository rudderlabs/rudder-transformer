/* eslint-disable @typescript-eslint/naming-convention */
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

function checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse) {
  // Extract the errors from the destination response
  const { errors } = destinationResponse.data;
  const { key_id } = event; // Assuming the 'key_id' is constant as before

  // Find the first abortable case
  const result = event.find((item) => {
    if (typeof item === 'string') {
      return errors[item]; // Check if the string is a key in errors
    }
    if (typeof item === 'object' && item[key_id]) {
      return errors[item[key_id]]; // Check if the object's value under key_id is a key in errors
    }
    return false; // Continue if no condition is met
  });

  if (result) {
    if (typeof result === 'string') {
      // Handle case where result is a string key found in errors
      return {
        isAbortable: true,
        errorMsg: errors[result][Object.keys(errors[result])[0]],
      };
    }
    if (typeof result === 'object') {
      // Handle case where result is an object found in errors
      const keyValue = result[key_id];
      return {
        isAbortable: true,
        errorMsg: errors[keyValue][Object.keys(errors[keyValue])[0]],
      };
    }
  }

  // If no match or abortable condition is found
  return {
    isAbortable: false,
    errorMsg: '',
  };
}

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const message = `[EMARSYS Response V1 Handler] - Request Processed Successfully`;
  let responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  // even if a single event is unsuccessful, the entire batch will fail, we will filter that event out and retry others
  if (!isHttpStatusSuccess(status)) {
    const errorMessage = response.message || 'unknown error format';
    responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));
    // if the status is 422, we need to parse the error message and construct the response array
    // if (status === 422) {
    //   const destPartialStatus = constructPartialStatus(response?.message);
    //   // if the error message is not in the expected format, we will abort all of the events
    //   if (!destPartialStatus || lodash.isEmpty(destPartialStatus)) {
    //     throw new TransformerProxyError(
    //       `EMARSYS: Error transformer proxy v1 during EMARSYS response transformation. Error parsing error message`,
    //       status,
    //       {
    //         [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    //       },
    //       destinationResponse,
    //       getAuthErrCategoryFromStCode(status),
    //       responseWithIndividualEvents,
    //     );
    //   }
    //   responseWithIndividualEvents = [...createResponseArray(rudderJobMetadata, destPartialStatus)];
    //   return {
    //     status,
    //     message,
    //     destinationResponse,
    //     response: responseWithIndividualEvents,
    //   };
    // }
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
    const { contacts, external_ids } = destinationRequest.body.JSON;
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

module.exports = { networkHandler };
