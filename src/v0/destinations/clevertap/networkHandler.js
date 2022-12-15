const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const {
  proxyRequest,
  prepareProxyRequest
} = require("../../../adapters/network");
const {
  processAxiosResponse,
  getDynamicMeta
} = require("../../../adapters/utils/networkUtils");
const { ApiError } = require("../../util/errors");
const { DESTINATION } = require("./config");

const responseHandler = destinationResponse => {
  const message =
    "[CleverTap Response Handler] - Request Processed Successfully";
  const { response, status } = destinationResponse;

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ApiError(
      `[CleverTap Response Handler] - Request failed  with status: ${status}`,
      status,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      },
      destinationResponse,
      undefined,
      DESTINATION
    );
  }

  // check for clevertap application level failures
  // clevertap returns 200 with response body status :success, partial, fail
  //   {
  //     "status": "fail",
  //     "processed": 0,
  //     "unprocessed": []
  //   }

  if (!!response && response.status !== "success") {
    throw new ApiError(
      `[CleverTap Response Handler] - Request failed  with status: ${status}`,
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      },
      destinationResponse,
      undefined,
      DESTINATION
    );
  }

  // else successfully return status, message and original destination response
  return {
    status,
    message,
    destinationResponse
  };
};

class networkHandler {
  constructor() {
    this.responseHandler = responseHandler;
    this.proxy = proxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler
};
