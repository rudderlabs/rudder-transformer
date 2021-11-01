const { send, sendRequest } = require("../../../adapters/network");
const {
  handleDestinationResponse
} = require("../../../adapters/networkhandler/genericnethandler");

const responseHandler = (dresponse, metadata) => {
  return handleDestinationResponse(dresponse, metadata);
};

const addToList = async (endpoint, payload, options) => {
  const requestOptions = {
    url: endpoint,
    data: payload,
    method: "post",
    ...options
  };
  const res = await send(requestOptions);
  const parsedResponse = responseHandler(res); // This is optional or a separate handler can be written
  return parsedResponse;
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedResponse = responseHandler(res, metadata); // Mandatory to have a handler here
  return parsedResponse;
};

module.exports = { sendData, addToList };
