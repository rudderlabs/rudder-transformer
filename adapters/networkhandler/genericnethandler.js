const { proxyRequest } = require("../network");
const { nodeSysErrorToStatus, trimResponse } = require("../utils/networkUtils");
const ErrorBuilder = require("../../v0/util/error");
/**
 * network handler as a fall back for all destination nethandlers, this file provides abstraction
 * for all the network comms btw dest transformer along with dest specific reqeusts from server to actual APIs
 *
 * --sendData-- is the mandatory function for destination requests to be proxied through transformer
 * and responseHandler should always be accompanied with sendData for parsing the destination response
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
const handleDestinationResponse = (clientResponse, metadata) => {
  let status;
  let trimmedResponse;

  if (clientResponse.success) {
    // success case
    trimmedResponse = trimResponse(clientResponse);
    if (trimmedResponse.status >= 200 && trimmedResponse.status < 300) {
      status = 200;
    } else {
      status = trimmedResponse.status;
    }
    const message = trimmedResponse.statusText;
    const destination = {
      ...trimmedResponse,
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
  const { response } = clientResponse.response;
  if (!response && clientResponse.response && clientResponse.response.code) {
    const nodeSysErr = nodeSysErrorToStatus(clientResponse.response.code);
    throw new ErrorBuilder()
      .setStatus(nodeSysErr.status || 500)
      .setMessage(nodeSysErr.message)
      .setMetadata(metadata)
      .isTransformerNetworkFailure(true)
      .build();
  } else {
    const temp = trimResponse(clientResponse.response);
    throw new ErrorBuilder()
      .setStatus(temp.status || 500)
      .setMessage(temp.statusText)
      .setDestinationResponse({ ...temp, success: false })
      .setMetadata(metadata)
      .isTransformerNetworkFailure(true)
      .build();
  }
};

/**
 * sendData is the entry point of proxying reqeust server to destination using transformer
 * @param {*} payload
 * @returns
 */
const sendData = async payload => {
  const { metadata } = payload;
  const res = await proxyRequest(payload);
  const parsedResponse = handleDestinationResponse(res, metadata);
  return parsedResponse;
};

const responseTransform = destResponse => {
  let respBody;
  try {
    respBody = JSON.parse(destResponse.Body);
  } catch (err) {
    respBody = JSON.stringify(destResponse.Body);
  }
  const status = destResponse.Status;
  const message = respBody.message || "Event delivered successfuly";
  const destination = { ...respBody, status: destResponse.Status };
  const { apiLimit } = respBody;
  return {
    status,
    message,
    destination,
    apiLimit
  };
};
module.exports = { handleDestinationResponse, responseTransform, sendData };
