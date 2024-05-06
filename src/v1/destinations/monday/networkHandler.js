const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../../v0/util/index');
const tags = require('../../../v0/util/tags');

// {"error_message":"User unauthorized to perform action","error_code":"UserUnauthorizedException","error_data":{},"status_code":403,"account_id":22879222}
// {"errors":[{"message":"Argument 'group_id' on Field 'create_item' has an invalid value (67565). Expected type 'String'.","locations":[{"line":1,"column":12}],"path":["mutation","create_item","group_id"],"extensions":{"code":"argumentLiteralsIncompatible","typeName":"Field","argumentName":"group_id"}}],"account_id":22879222}
// {"error_message":"Group not found","error_code":"ResourceNotFoundException","error_data":{"resource_type":"group","group_id":"67565","board_id":1860823405,"error_reason":"store.monday.automation.error.missing_group"},"status_code":404,"account_id":22879222}
const checkIfEventIsAbortableAndExtractErrorMessage = (element) => {
  if (element.success) {
    return { isAbortable: false, errorMsg: '' };
  }
  const errorMsg = element.errors.join(', ');
  return { isAbortable: true, errorMsg };
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;

  const message = '[MONDAY Response V1 Handler] - Request Processed Successfully';
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
    `MONDAY: Error encountered in transformer proxy V1`,
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
