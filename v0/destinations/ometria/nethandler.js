const { sendRequest } = require("../../../adapters/network");
const {
  nodeSysErrorToStatus,
  trimResponse
} = require("../../../adapters/utils/networkUtils");
const { ErrorBuilder, isDefinedAndNotNull } = require("../../util/index");

const responseHandler = (dresponse, metadata) => {
  let status;
  // success case
  if (dresponse.success) {
    // true success case
    const trimmedResponse = trimResponse(dresponse);
    const { data } = trimmedResponse;
    if (data && isDefinedAndNotNull(data.rejected) && data.rejected === 0) {
      status = 200;
      const message = trimmedResponse.statusText;
      const destination = {
        response: trimmedResponse,
        status: trimmedResponse.status
      };
      const apiLimit = {
        available: "",
        resetAt: ""
      };
      return {
        status,
        message,
        destination,
        apiLimit,
        metadata
      };
    }
    // some requests rejected
    if (data && isDefinedAndNotNull(data.rejected) && data.rejected > 0) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage(`${data.rejected} requests rejected.`)
        .setDestinationResponse({ ...trimmedResponse, success: false })
        .setMetadata(metadata)
        .isTransformerNetwrokFailure(true)
        .build();
    }

    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(`Request rejected due to bad request.`)
      .setDestinationResponse({ ...trimmedResponse, success: false })
      .setMetadata(metadata)
      .isTransformerNetwrokFailure(true)
      .build();
  }
  // failure case
  const { response } = dresponse.response;
  if (!response && dresponse.response && dresponse.response.code) {
    const nodeSysErr = nodeSysErrorToStatus(dresponse.response.code);
    throw new ErrorBuilder()
      .setStatus(nodeSysErr.status || 400)
      .setMessage(nodeSysErr.message)
      .setMetadata(metadata)
      .isTransformerNetwrokFailure(true)
      .build();
  } else {
    const trimmedErrorResponse = trimResponse(dresponse.response);
    throw new ErrorBuilder()
      .setStatus(trimmedErrorResponse.status || 400)
      .setMessage(
        `Authentication or destination side error : ${trimmedErrorResponse.statusText}`
      )
      .setDestinationResponse({ ...trimmedErrorResponse, success: false })
      .setMetadata(metadata)
      .isTransformerNetwrokFailure(true)
      .build();
  }
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedReponse = responseHandler(res, metadata);
  return parsedReponse;
};

module.exports = { sendData };
