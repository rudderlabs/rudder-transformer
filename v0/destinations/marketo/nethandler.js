const { STATS_PRIORITY, TRANSFORMER_STAGE } = require("../../util/constant");
const {
  proxyRequest,
  httpGET,
  httpPOST
} = require("../../../adapters/network");
const {
  nodeSysErrorToStatus,
  trimResponse
} = require("../../../adapters/utils/networkUtils");
const ErrorBuilder = require("../../util/error");

const MARKETO_RETRYABLE_CODES = ["601", "602", "604", "611"];
const MARKETO_ABORTABLE_CODES = ["600", "603", "605", "609", "610"];
const MARKETO_THROTTLED_CODES = ["502", "606", "607", "608", "615"];
const { DESTINATION } = require("./config");

const marketoResponseHandler = ({
  clientResponse,
  metadata,
  sourceMessage,
  stage
} = {}) => {
  // success case
  if (clientResponse.success) {
    const trimmedResponse = trimResponse(clientResponse);
    const { data } = trimmedResponse;

    // for authentication requests
    if (data && data.access_token) {
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
          .setFailureAt(stage)
          .statsIncrement("transformation_and_proxy_errors", 1, {
            DESTINATION,
            stage,
            priority: STATS_PRIORITY.P1
          })
          .build();
      } else if (MARKETO_THROTTLED_CODES.indexOf(errors[0].code) > -1) {
        throw new ErrorBuilder()
          .setStatus(429)
          .setMessage(
            `Request Failed for Marketo, ${errors[0].message} (Throttled).${sourceMessage}`
          )
          .setDestinationResponse({ ...trimmedResponse, success: false })
          .setMetadata(metadata)
          .setFailureAt(stage)
          .statsIncrement("transformation_and_proxy_errors", 1, {
            DESTINATION,
            stage,
            priority: STATS_PRIORITY.P3
          })
          .build();
      } else if (MARKETO_RETRYABLE_CODES.indexOf(errors[0].code) > -1) {
        throw new ErrorBuilder()
          .setStatus(500)
          .setMessage(
            `Request Failed for Marketo, ${errors[0].message} (Retryable).${sourceMessage}`
          )
          .setDestinationResponse({ ...trimmedResponse, success: false })
          .setMetadata(metadata)
          .setFailureAt(stage)
          .statsIncrement("transformation_and_proxy_errors", 1, {
            DESTINATION,
            stage,
            priority: STATS_PRIORITY.P3
          })
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
        .setFailureAt(stage)
        .statsIncrement("transformation_and_proxy_errors", 1, {
          DESTINATION,
          stage,
          priority: STATS_PRIORITY.P3
        })
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
      .setFailureAt(stage)
      .statsIncrement("transformation_and_proxy_errors", 1, {
        DESTINATION,
        stage,
        priority: STATS_PRIORITY.P3
      })
      .build();
  }
  // http failure cases
  const { response } = clientResponse.response;
  if (!response && clientResponse.response && clientResponse.response.code) {
    const nodeSysErr = nodeSysErrorToStatus(clientResponse.response.code);
    throw new ErrorBuilder()
      .setStatus(nodeSysErr.status || 500)
      .setMessage(nodeSysErr.message)
      .setMetadata(metadata)
      .setFailureAt(stage)
      .statsIncrement("transformation_and_proxy_errors", 1, {
        DESTINATION,
        stage,
        priority: STATS_PRIORITY.P1
      })
      .build();
  } else {
    const temp = trimResponse(clientResponse.response);
    throw new ErrorBuilder()
      .setStatus(temp.status || 500)
      .setMessage(temp.statusText)
      .setDestinationResponse({ ...temp, success: false })
      .setMetadata(metadata)
      .setFailureAt(stage)
      .statsIncrement("transformation_and_proxy_errors", 1, {
        DESTINATION,
        stage,
        priority: STATS_PRIORITY.P1
      })
      .build();
  }
};

const sendGetRequest = async (url, options) => {
  let clientResponse;
  try {
    const response = await httpGET(url, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
};

const sendPostRequest = async (url, data, options) => {
  let clientResponse;
  try {
    const response = await httpPOST(url, data, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
};

const sendData = async payload => {
  const { metadata } = payload;
  const res = await proxyRequest(payload);
  const parsedResponse = marketoResponseHandler({
    clientResponse: res,
    metadata,
    stage: TRANSFORMER_STAGE.PROXY
  });
  return {
    status: parsedResponse.status,
    destination: {
      ...parsedResponse,
      success: true
    },
    apiLimit: {
      available: "",
      resetAt: ""
    },
    metadata,
    message: parsedResponse.statusText || "Request Processed Successfully"
  };
};

module.exports = {
  marketoResponseHandler,
  sendData,
  sendGetRequest,
  sendPostRequest
};
