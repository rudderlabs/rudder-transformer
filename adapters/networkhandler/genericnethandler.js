const { sendRequest } = require("../network");
const { nodeSysErrorToStatus, trimResponse } = require("../utils/networkUtils");
const { ErrorBuilder } = require("../../v0/util/index");
/**
 * network handler as a fall back for all destination nethandlers, this file provides abstraction for all the network comms btw
 * dest transformer along with dest specific reqeusts from server to actual APIs
 *
 * --sendData-- is the mandatory function for destination requests to be proxied through transformer
 * --and responseHandler should always be accompanied with sendData for parsing the destination response
 * to formatted response for server.
 *
 */

/**
 * This is a generic handler for all transformer requests that passes through network layer
 * can be reused further
 * Response format:
 * {
 *   "status" : 429,
 *   "destination": {
 *       "response": "",
 *       "status": 200/400...
 *   },
 *   "apiLimit" {
 *       "available": 455,
 *       "resetAt": timestamp
 *   },
 *   "metadata": {router_meta},
 *   "message" : "simplified message for understanding"
 * }
 */
const handleDestinationResponse = (dresponse, metadata) => {
  let status;
  let handledResponse;

  if (dresponse.success) {
    // success case
    handledResponse = trimResponse(dresponse);
    if (handledResponse.status >= 200 && handledResponse.status < 300) {
      status = 200;
    } else {
      status = handledResponse.status;
    }
    const message = handledResponse.statusText;
    const destination = {
      ...handledResponse,
      success: true
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

  // failure case
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
      .setDestinationResponse({ ...temp, success: false })
      .setMetadata(metadata)
      .isTransformerNetwrokFailure(true)
      .build();
  }
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedResponse = handleDestinationResponse(res, metadata); // Mandatory
  return parsedResponse;
};

module.exports = { handleDestinationResponse, sendData };
