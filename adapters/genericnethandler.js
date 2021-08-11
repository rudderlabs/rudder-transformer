const get = require("get-value");
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

const nodeSysErrorToStatus = code => {
  const sysErrorToStatusMap = {
    EACCES: { status: 400, message: "[EACCES] :: Permission denied" },
    EADDRINUSE: {
      status: 400,
      message: "[EADDRINUSE] :: Address already in use"
    },
    ECONNREFUSED: {
      status: 500,
      message: "[ECONNREFUSED] :: Connection refused"
    },
    ECONNRESET: {
      status: 500,
      message: "[ECONNRESET] :: Connection reset by peer"
    },
    EEXIST: { status: 400, message: "[EEXIST] :: File exists" },
    EISDIR: { status: 400, message: "[EEXIST] :: Is a directory" },
    EMFILE: {
      status: 400,
      message: "[EMFILE] :: Too many open files in system"
    },
    ENOENT: { status: 400, message: "[ENOENT] :: No such file or directory" },
    ENOTDIR: { status: 400, message: "[ENOTDIR] :: Not a directory" },
    ENOTEMPTY: { status: 400, message: "[ENOTEMPTY] :: Directory not empty)" },
    ENOTFOUND: { status: 400, message: "[ENOTFOUND] :: DNS lookup failed" },
    EPERM: { status: 400, message: "[EPERM] :: Operation not permitted" },
    EPIPE: { status: 400, message: "[EPIPE] :: Broken pipe" },
    ETIMEDOUT: { status: 500, message: "[ETIMEDOUT] :: Operation timed out" }
  };
  return sysErrorToStatusMap[code];
};

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
  let status;
  let message;

  const trimmedRes = {
    code: get(dresponse, "response.code"),
    status: get(dresponse, "response.status"),
    statusText: get(dresponse, "response.statusText"),
    headers: get(dresponse, "response.headers"),
    data: get(dresponse, "response.headers"),
    success: get(dresponse, "suceess")
  };

  if (
    trimmedRes.status &&
    trimmedRes.status >= 200 &&
    trimmedRes.status <= 300
  ) {
    status = 200;
  } else {
    status = trimmedRes.status;
  }

  message = trimmedRes.statusText;

  if (!trimmedRes.success && trimmedRes.code) {
    const nodeSysErr = nodeSysErrorToStatus(trimmedRes.code);
    status = nodeSysErr.status;
    message = nodeSysErr.message;
  }

  const destination = {
    response: JSON.stringify(trimmedRes),
    status: trimmedRes.status
  };

  const apiLimit = {
    available: "",
    resetAt: ""
  };

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
