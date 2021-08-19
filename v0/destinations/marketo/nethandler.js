const { send, sendRequest } = require("../../../adapters/network");
const {
  nodeSysErrorToStatus,
  trimResponse
} = require("../../../adapters/utils/networkUtils");
const { ErrorBuilder } = require("../../util/index");

const MARKETO_RETRYABLE_CODES = ["600", "601", "602", "604", "611"];
const MARKETO_ABORTABLE_CODES = ["603", "605", "609", "610"];
const MARKETO_THROTTLED_CODES = ["502", "606", "607", "608", "615"];

const responseHandler = ({
  dresponse,
  metadata,
  sourceMessage,
  authRequest
} = {}) => {
  // success case
  if (dresponse.success) {
    const trimmedResponse = trimResponse(dresponse);
    const { data } = trimmedResponse;

    if (data && authRequest) {
      // for authentication requests
      return trimmedResponse;
    }

    if (data && data.success) {
      // success
      return trimmedResponse;
    }

    if (data && !data.success) {
      // marketo application response level failure
      const { errors } = data;
      if (MARKETO_ABORTABLE_CODES.indexOf(errors[0].code) > -1) {
        throw new ErrorBuilder()
          .setStatus(400)
          .setMessage(
            `Request Failed for Marketo, ${errors[0].message} (Aborted).${sourceMessage}`
          )
          .setDestinationResponse({ ...trimmedResponse, success: false })
          .setMetadata(metadata)
          .isTransformerNetwrokFailure(true)
          .build();
      } else if (MARKETO_THROTTLED_CODES.indexOf(errors[0].code) > -1) {
        throw new ErrorBuilder()
          .setStatus(429)
          .setMessage(
            `Request Failed for Marketo, ${errors[0].message} (Throttled).${sourceMessage}`
          )
          .setDestinationResponse({ ...trimmedResponse, success: false })
          .setMetadata(metadata)
          .isTransformerNetwrokFailure(true)
          .build();
      } else if (MARKETO_RETRYABLE_CODES.indexOf(errors[0].code) > -1) {
        throw new ErrorBuilder()
          .setStatus(500)
          .setMessage(
            `Request Failed for Marketo, ${errors[0].message} (Retryable).${sourceMessage}`
          )
          .setDestinationResponse({ ...trimmedResponse, success: false })
          .setMetadata(metadata)
          .isTransformerNetwrokFailure(true)
          .build();
      }
      // default failure cases (keeping retryable for now)
      throw new ErrorBuilder()
        .setStatus(500)
        .setMessage(
          `Request Failed for Marketo, ${errors[0].message} (Retryable).${sourceMessage}`
        )
        .setDestinationResponse({ ...trimmedResponse, success: false })
        .setMetadata(metadata)
        .isTransformerNetwrokFailure(true)
        .build();
    }
    // http success but data not present
    throw new ErrorBuilder()
      .setStatus(500)
      .setMessage(`Request Failed for Marketo (Retryable).${sourceMessage}`)
      .setDestinationResponse({
        ...trimmedResponse,
        success: false
      })
      .setMetadata(metadata)
      .isTransformerNetwrokFailure(true)
      .build();
  }
  // http failure cases
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

const sendGetRequest = async (
  url,
  options,
  sourceMessage,
  authRequest = false
) => {
  const requestOptions = {
    url,
    method: "get",
    ...options
  };

  const res = await send(requestOptions);
  const parsedResponse = responseHandler({
    dresponse: res,
    sourceMessage,
    authRequest
  });
  return parsedResponse.data;
};

const sendPostRequest = async (
  url,
  data,
  options,
  sourceMessage,
  authRequest = false
) => {
  const requestOptions = {
    url,
    data,
    method: "post",
    ...options
  };

  const res = await send(requestOptions);
  const parsedResponse = responseHandler({
    dresponse: res,
    sourceMessage,
    authRequest
  });
  return parsedResponse.data;
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await sendRequest(payload);
  const parsedResponse = responseHandler({ dresponse: res, metadata });
  return {
    status: parsedResponse.status,
    destination: {
      response: parsedResponse.data,
      status: parsedResponse.status
    },
    apiLimit: {
      available: "",
      resetAt: ""
    },
    metadata,
    message: parsedResponse.statusText || "Request Processed Successfully"
  };
};

module.exports = { sendData, sendGetRequest, sendPostRequest };
