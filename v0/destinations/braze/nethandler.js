const { sendRequest } = require("../../../adapters/network");
const { trimResponse } = require("../../../adapters/utils/networkUtils");
const { ErrorBuilder } = require("../../util/index");

// eslint-disable-next-line consistent-return
const responseHandler = (dresponse, metadata) => {
  if (dresponse.success) {
    const trimmedResponse = trimResponse(dresponse);
    const { data } = trimmedResponse;

    if (data.errors && data.errors.length > 0) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage("Braze Request Failed")
        .setDestinationResponse({ ...trimmedResponse, success: false })
        .setMetadata(metadata)
        .isTransformerNetwrokFailure(true)
        .build();
    } else {
      return trimmedResponse;
    }
  }
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedResponse = responseHandler(res, metadata); // Mandatory to have a handler here
  return parsedResponse;
};

module.exports = { sendData };
