const { send } = require("../../../adapters/network");

/*
Response format:
{
    "status" : 429,
    "destination": {
        "response": "",
        "status": 200/400...
    },
    "apiLimit" {
        "available": 455,
        "resetAt": timestamp
    },
    "metadata": {router_meta},
    "message" : "simplified message for understanding"
}
*/
const handleDestinationResponse = (dresponse, metadata) => {
  const { responseData, responseStatusText, responseStatus } = dresponse;
  let status;
  if (responseStatus >= 200 && responseStatus <= 300) {
    status = 200;
  } else {
    status = responseStatus;
  }
  const destination = {
    response: JSON.stringify(responseData),
    status: responseStatus
  };
  const apiLimit = {
    available: "",
    resetAt: ""
  };
  const message = responseStatusText || "Request processed Successfully";
  // TODO: What other info do we need to pass here
  const response = {
    status,
    destination,
    apiLimit,
    metadata,
    message
  };
  return response;
};

const getSubscriptionHistory = async (endpoint, payload, options) => {
  const requestOptions = {
    url: endpoint,
    data: payload,
    method: "get",
    ...options
  };
  const res = await send(requestOptions);
  const parsedResponse = handleDestinationResponse(res); // This is optional or a separate handler can be written
  return parsedResponse;
};

module.exports = { getSubscriptionHistory };
