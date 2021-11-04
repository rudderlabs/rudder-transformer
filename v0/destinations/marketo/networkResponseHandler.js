const { httpGET, httpPOST } = require("../../../adapters/network");
const {
  nodeSysErrorToStatus,
  trimResponse,
  getDynamicMeta
} = require("../../../adapters/utils/networkUtils");
const { isEmpty } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");

const MARKETO_RETRYABLE_CODES = ["601", "602", "604", "611"];
const MARKETO_ABORTABLE_CODES = ["600", "603", "605", "609", "610", "612"];
const MARKETO_THROTTLED_CODES = ["502", "606", "607", "608", "615"];
const { DESTINATION } = require("./config");

const marketoResponseHandler = ({
  clientResponse,
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
          .setDestinationResponse({ ...trimmedResponse, success: false })
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
          .setDestinationResponse({ ...trimmedResponse, success: false })
          .setStatTags({
            destination: DESTINATION,
            stage,
            scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
            meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
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
        .setStatTags({
          destination: DESTINATION,
          stage,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
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

const responseTransform = destResponse => {
  let respBody;
  try {
    respBody = JSON.parse(destResponse.responseBody);
  } catch (err) {
    respBody = !isEmpty(destResponse.responseBody)
      ? destResponse.responseBody
      : "";
  }
  if (respBody && !respBody.success) {
    // marketo application response level failure
    const { errors } = respBody;
    if (MARKETO_ABORTABLE_CODES.indexOf(errors[0].code) > -1) {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage(
          `Request Failed for Marketo, ${errors[0].message} (Aborted).`
        )
        .setDestinationResponse({
          response: respBody,
          status: destResponse.status
        })
        .isTransformResponseFailure(true)
        .setStatTags({
          destination: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
        })
        .build();
    } else if (MARKETO_THROTTLED_CODES.indexOf(errors[0].code) > -1) {
      throw new ErrorBuilder()
        .setStatus(429)
        .setMessage(
          `Request Failed for Marketo, ${errors[0].message} (Throttled).`
        )
        .setDestinationResponse({
          response: respBody,
          status: destResponse.status
        })
        .isTransformResponseFailure(true)
        .setStatTags({
          destination: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.THROTTLED
        })
        .build();
    } else if (MARKETO_RETRYABLE_CODES.indexOf(errors[0].code) > -1) {
      throw new ErrorBuilder()
        .setStatus(500)
        .setMessage(
          `Request Failed for Marketo, ${errors[0].message} (Retryable).`
        )
        .setDestinationResponse({
          response: respBody,
          status: destResponse.status
        })
        .isTransformResponseFailure(true)
        .setStatTags({
          destination: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
        })
        .build();
    }
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(`Request Failed for Marketo, ${errors[0].message} (Aborted).`)
      .setDestinationResponse({
        response: respBody,
        status: destResponse.status
      })
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      })
      .build();
  }
  const { status } = destResponse;
  const message = "Event delivered successfuly";
  const destinationResponse = {
    response: respBody,
    status: destResponse.status
  };
  const { apiLimit } = respBody;
  return {
    status,
    message,
    destinationResponse,
    apiLimit
  };
};

module.exports = {
  marketoResponseHandler,
  responseTransform,
  sendGetRequest,
  sendPostRequest
};
