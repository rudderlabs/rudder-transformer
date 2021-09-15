const { proxyRequest } = require("../../../adapters/network");
const {
  trimResponse,
  nodeSysErrorToStatus
} = require("../../../adapters/utils/networkUtils");
const ErrorBuilder = require("../../util/error");

// eslint-disable-next-line consistent-return
const brazeResponseHandler = (clientResponse, metadata) => {
  if (clientResponse.success) {
    const trimmedResponse = trimResponse(clientResponse);
    const { data } = trimmedResponse;

    if (data.errors && data.errors.length > 0) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage("Braze Request Failed")
        .setDestinationResponse({ ...trimmedResponse, success: false })
        .setMetadata(metadata)
        .isTransformerNetworkFailure(true)
        .build();
    } else {
      return trimmedResponse;
    }
  } else {
    const { response } = clientResponse.response;
    if (!response && clientResponse.response && clientResponse.response.code) {
      const nodeSysErr = nodeSysErrorToStatus(clientResponse.response.code);
      throw new ErrorBuilder()
        .setStatus(nodeSysErr.status || 500)
        .setMessage(nodeSysErr.message)
        .setMetadata(metadata)
        .isTransformerNetworkFailure(true)
        .build();
    } else {
      const trimmedResponse = trimResponse(clientResponse.response);
      throw new ErrorBuilder()
        .setStatus(trimmedResponse.status || 500)
        .setMessage(trimmedResponse.statusText)
        .setDestinationResponse({
          ...trimmedResponse,
          status: trimmedResponse.status
        })
        .setMetadata(metadata)
        .isTransformerNetworkFailure(true)
        .build();
    }
  }
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await proxyRequest(payload);
  const parsedResponse = brazeResponseHandler(res, metadata);
  return parsedResponse;
};

module.exports = { sendData };
