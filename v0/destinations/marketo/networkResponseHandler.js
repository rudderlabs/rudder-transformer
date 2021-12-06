const { httpGET, httpPOST } = require("../../../adapters/network");
const {
  nodeSysErrorToStatus,
  trimResponse,
  getDynamicMeta
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");

const MARKETO_RETRYABLE_CODES = ["601", "602", "604", "611"];
const MARKETO_ABORTABLE_CODES = ["600", "603", "605", "609", "610", "612"];
const MARKETO_THROTTLED_CODES = ["502", "606", "607", "608", "615"];
const { DESTINATION } = require("./config");

// handles marketo application level failures
const processResponse = (
  marketoResponse,
  marketoStatus,
  sourceMessage,
  stage
) => {
  if (!!marketoResponse && !marketoResponse.success) {
    // marketo application response level failure
    const { errors } = marketoResponse;
    const destResponse = {
      response: marketoResponse,
      status: marketoStatus
    };
    if (MARKETO_ABORTABLE_CODES.indexOf(errors[0].code) > -1) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage(
          `Request Failed for Marketo, ${errors[0].message} (Aborted).${sourceMessage}`
        )
        .setDestinationResponse(destResponse)
        .isTransformResponseFailure(true)
        .setStatTags({
          destination: DESTINATION,
          stage,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
        })
        .build();
    } else if (MARKETO_THROTTLED_CODES.indexOf(errors[0].code) > -1) {
      throw new ErrorBuilder()
        .setStatus(429)
        .setMessage(
          `Request Failed for Marketo, ${errors[0].message} (Throttled).${sourceMessage}`
        )
        .setDestinationResponse(destResponse)
        .isTransformResponseFailure(true)
        .setStatTags({
          destination: DESTINATION,
          stage,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.THROTTLED
        })
        .build();
    } else if (MARKETO_RETRYABLE_CODES.indexOf(errors[0].code) > -1) {
      throw new ErrorBuilder()
        .setStatus(500)
        .setMessage(
          `Request Failed for Marketo, ${errors[0].message} (Retryable).${sourceMessage}`
        )
        .setDestinationResponse(destResponse)
        .isTransformResponseFailure(true)
        .setStatTags({
          destination: DESTINATION,
          stage,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
        })
        .build();
    }
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `Request Failed for Marketo, ${errors[0].message} (Aborted).${sourceMessage}`
      )
      .setDestinationResponse(destResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      })
      .build();
  }
};

const marketoResponseHandler = ({
  clientResponse,
  sourceMessage,
  stage
} = {}) => {
  // success case
  if (clientResponse.success) {
    const trimmedResponse = trimResponse(clientResponse);
    const { data } = trimmedResponse;
    if (data && data.access_token) {
      // for authentication requests
      return trimmedResponse;
    }
    if (data && data.success) {
      // success
      return trimmedResponse;
    }
    if (data) {
      // failure
      processResponse(data, trimmedResponse.status, sourceMessage, stage);
    }
    // http success but data not present
    throw new ErrorBuilder()
      .setStatus(500)
      .setMessage(`Request Failed for Marketo (Retryable).${sourceMessage}`)
      .setDestinationResponse({
        ...trimmedResponse,
        success: false
      })
      .setStatTags({
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
      })
      .build();
  }
  // http failure cases
  const { response } = clientResponse.response;
  if (!response && clientResponse.response && clientResponse.response.code) {
    const nodeSysErr = nodeSysErrorToStatus(clientResponse.response.code);
    throw new ErrorBuilder()
      .setStatus(nodeSysErr.status || 500)
      .setMessage(`Error occured ${sourceMessage} Error: ${nodeSysErr.message}`)
      .setStatTags({
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(nodeSysErr.status || 500)
      })
      .build();
  } else {
    const temp = trimResponse(clientResponse.response);
    throw new ErrorBuilder()
      .setStatus(temp.status || 500)
      .setMessage(`Error occured ${sourceMessage} Error: ${temp.statusText}`)
      .setDestinationResponse({ ...temp, success: false })
      .setStatTags({
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(temp.status || 500)
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

// eslint-disable-next-line no-unused-vars
const responseTransform = (destinationResponse, _dest) => {
  const message = `[Marketo Response Transform] Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;
  // if the responsee from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[Marketo Response Transfom] Request failed for ${DESTINATION} with status: ${status}`
      )
      .setDestinationResponse(destinationResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      })
      .build();
  }
  processResponse(
    response,
    status,
    "During Response Transform",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
  );
  return {
    status,
    message,
    destinationResponse
  };
};

module.exports = {
  marketoResponseHandler,
  responseTransform,
  sendGetRequest,
  sendPostRequest
};
