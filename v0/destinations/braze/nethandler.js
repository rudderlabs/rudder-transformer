const { sendRequest } = require("../../../adapters/network");
const {
  trimResponse,
  nodeSysErrorToStatus
} = require("../../../adapters/utils/networkUtils");
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
  } else {
    const { response } = dresponse.response;
    if (!response && dresponse.response && dresponse.response.code) {
      const nodeSysErr = nodeSysErrorToStatus(dresponse.response.code);
      throw new ErrorBuilder()
        .setStatus(nodeSysErr.status || 500)
        .setMessage(nodeSysErr.message)
        .setMetadata(metadata)
        .isTransformerNetwrokFailure(true)
        .build();
    } else {
      const temp = trimResponse(dresponse.response);
      throw new ErrorBuilder()
        .setStatus(temp.status || 500)
        .setMessage(temp.statusText)
        .setDestinationResponse({ ...temp, status: temp.status })
        .setMetadata(metadata)
        .isTransformerNetwrokFailure(true)
        .build();
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
