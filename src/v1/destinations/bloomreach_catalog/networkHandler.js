const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../../v0/util/index');
const tags = require('../../../v0/util/tags');

// Catalog response
// [
//   {
//     "errors": {
//       "properties": [
//         "Fields [field1, field2] are not properly defined."
//       ]
//     },
//     "queued": false,
//     "success": false
//   },
//   {
//     "success" : "True",
//     "queued" : "True",
//   },
// ]
const checkIfEventIsAbortableAndExtractErrorMessage = (element) => {
  if (element.success) {
    return { isAbortable: false, errorMsg: '' };
  }

  const errorMsg = Object.values(element.errors || {})
    .flat()
    .join(', ');

  return { isAbortable: true, errorMsg };
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;

  const message = '[BLOOMREACH_CATALOG Response V1 Handler] - Request Processed Successfully';
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    response.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        error: 'success',
        metadata: rudderJobMetadata[idx],
      };
      // update status of partial event if abortable
      const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(event);
      if (isAbortable) {
        proxyOutput.error = errorMsg;
        proxyOutput.statusCode = 400;
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
    `BLOOMREACH_CATALOG: Error encountered in transformer proxy V1`,
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
