const { sendRequest } = require("./network");
/**
 * network handler as a fall back for all destination nethandlers, this file provides abstraction for all the network comms btw
 * dest transformer along with dest specific reqeusts from server to actual APIs
 *
 * --sendData-- is the mandatory function for destination requests to be proxied through transformer
 * --and responseHandler should always be accompanied with sendData for parsing the destination response
 * to formatted response for server.
 *
 */

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

const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedResponse = handleDestinationResponse(res, metadata); // Mandatory
  return parsedResponse;
};

module.exports = { sendData };
