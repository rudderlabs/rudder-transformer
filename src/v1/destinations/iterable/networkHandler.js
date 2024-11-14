/* eslint-disable @typescript-eslint/naming-convention */
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');
const {
  checkIfEventIsAbortableAndExtractErrorMessage,
} = require('../../../v0/destinations/iterable/util');

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const message = `[ITERABLE Response V1 Handler] - Request Processed Successfully`;
  let responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (!isHttpStatusSuccess(status)) {
    const errorMessage = JSON.stringify(response.params) || 'unknown error format';
    responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));
    throw new TransformerProxyError(
      `ITERABLE: Error transformer proxy v1 during ITERABLE response transformation. ${errorMessage}`,
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
    const { events } = destinationRequest.body.JSON;
    const finalData = events;
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

  throw new TransformerProxyError(
    `ITERABLE: Error transformer proxy v1 during ITERABLE response transformation`,
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
