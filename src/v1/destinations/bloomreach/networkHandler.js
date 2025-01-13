const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../../v0/util/index');
const tags = require('../../../v0/util/tags');

// {
//   "results": [
//       {
//           "success": true
//       },
//       {
//           "success": false,
//           "errors": [
//               "At least one id should be specified."
//           ]
//       }
//   ],
//   "start_time": 1710750816.8504393,
//   "end_time": 1710750816.8518236,
//   "success": true
// }
const checkIfEventIsAbortableAndExtractErrorMessage = (element) => {
  if (element.success) {
    return { isAbortable: false, errorMsg: '' };
  }

  const errorMsg = element.errors.join(', ');
  return { isAbortable: true, errorMsg };
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;

  const message = '[BLOOMREACH Response V1 Handler] - Request Processed Successfully';
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    const { results } = response;
    results.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };
      // update status of partial event if abortable
      const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(event);
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
    `BLOOMREACH: Error encountered in transformer proxy V1`,
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
