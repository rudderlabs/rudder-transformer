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
// Catalog response =>
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

  const errorMsg = Array.isArray(element.errors)
    ? element.errors.join(', ')
    : Object.values(element.errors || {})
        .flat()
        .join(', ');

  return { isAbortable: true, errorMsg };
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;

  const message = '[BLOOMREACH Response V1 Handler] - Request Processed Successfully';
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    let { results } = response;
    // in case of catalog response
    if (Array.isArray(response)) {
      results = response;
    }
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
