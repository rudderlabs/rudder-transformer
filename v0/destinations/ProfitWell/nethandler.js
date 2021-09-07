const { send, sendRequest } = require("../../../adapters/network");
const {
  handleDestinationResponse
} = require("../../../adapters/networkhandler/genericnethandler");

const getSubscriptionHistory = async (endpoint, options) => {
  const requestOptions = {
    url: endpoint,
    method: "get",
    ...options
  };
  const res = await send(requestOptions);
  return res;
};

const responseHandler = (dresponse, metadata) => {
  return handleDestinationResponse(dresponse, metadata);
};
const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedResponse = responseHandler(res, metadata);
  return parsedResponse;
};

module.exports = { getSubscriptionHistory, sendData };
