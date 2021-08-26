const { sendRequest } = require("../../../adapters/network");
const {
  handleDestinationResponse
} = require("../../../adapters/networkhandler/genericnethandler");

const responseHandler = (dresponse, metadata) => {
  return handleDestinationResponse(dresponse, metadata);
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedResponse = responseHandler(res, metadata); // Mandatory to have a handler here
  return parsedResponse;
};

module.exports = { sendData };
