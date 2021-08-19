const { sendRequest } = require("../../../adapters/network");
const { trimResponse } = require("../utils/networkUtils");
const { ErrorBuilder } = require("../../v0/util/index");

const responseHandler = (dresponse, metadata) => {
  let status;
  let handledResponse;
  // success case
  if (
    dresponse &&
    dresponse.status &&
    dresponse.rejected &&
    dresponse.status >= 200 &&
    dresponse.status < 300 &&
    dresponse.rejected === 0
  ) {
    handledResponse = trimResponse(dresponse);
    status = 200;
    const message = handledResponse.statusText;
    const destination = {
      response: handledResponse,
      status: handledResponse.status
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
  if (dresponse && dresponse.rejected && dresponse.rejected > 0) {
    const message = "One or more requests were rejected.";
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(message)
      .setMetadata(metadata)
      .isTransformerNetworkFailure(true)
      .build();
  }
  if (
    dresponse &&
    dresponse.code &&
    dresponse.code >= 400 &&
    dresponse.code < 500
  ) {
    let message = "";
    if (dresponse.data) {
      message = JSON.stringify(dresponse.data);
    }
    throw new ErrorBuilder()
      .setStatus(dresponse.code || 400)
      .setMessage(`"Authentication error or destination side error. ${message}`)
      .setMetadata(metadata)
      .isTransformerNetworkFailure(true)
      .build();
  } else {
    const temp = trimResponse(dresponse.response);
    throw new ErrorBuilder()
      .setStatus(temp.status || 500)
      .setMessage(temp.statusText)
      .setDestinationResponse({ ...temp, success: false })
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
