const { removeUndefinedValues } = require("../../util");
const {
  prepareProxyRequest,
  getPayloadData,
  httpSend
} = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

/**
 * Verifies whether the input payload is in right format or not
 * @param {Object} message
 * @returns
 */
const validatePayload = message => {
  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Message Type is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Message properties is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties.listData) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::listData is not present inside properties. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (message.type.toLowerCase() !== "audiencelist") {
    throw new ErrorBuilder()
      .setMessage(
        `[snapchat_custom_audience]::Message Type ${message.type} not supported.`
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties.listData.add && !message.properties.listData.remove) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Neither 'add' nor 'remove' property is present inside 'listData'. Aborting message."
      )
      .setStatus(400)
      .build();
  }
};

const validateFields = (schema, data) => {
  // if required field is not present in all the cases
  if (data[0].length === 0) {
    throw new ErrorBuilder()
      .setMessage(
        `[snapchat_custom_audience]::${schema} is required for the chosen schema.`
      )
      .setStatus(400)
      .build();
  }
};

const prepareProxyReq = request => {
  const { body } = request;
  // Build the destination request data using the generic method
  const { endpoint, data, method, params, headers } = prepareProxyRequest(
    request
  );

  // Modify the data
  const { payloadFormat } = getPayloadData(body);
  if (payloadFormat === "FORM") {
    data.append("format", "json");
  }

  return removeUndefinedValues({
    endpoint,
    data,
    params,
    headers,
    method
  });
};

const scAudienceProxyRequest = async request => {
  const { endpoint, data, method, params, headers } = prepareProxyReq(request);

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method
  };
  const response = await httpSend(requestOptions);
  return response;
};

/**
 * This function helps to determine type of error occured. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to disable the destination.
 * @param {*} code
 * @param {*} response
 * @returns
 */
const getAuthErrCategory = (code, response) => {
  switch (code) {
    case 401:
      if (!response.error?.details) return REFRESH_TOKEN;
      return "";
    case 403: // Access Denied
      return DISABLE_DEST;
    default:
      return "";
  }
};

const scaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  // const respAttributes = response["@attributes"] || null;
  // const { stat, err_code: errorCode } = respAttributes;

  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `snapchat_custom_audience: ${response.error?.message} ${stageMsg}`
    )
    .setAuthErrorCategory(getAuthErrCategory(status, response))
    .build();
};

const responseHandler = destinationResponse => {
  const message = `[snapchat_custom_audience Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse
    };
  }
  // else successfully return status, message and original destination response
  scaAudienceRespHandler(
    destinationResponse,
    "during snapchat_custom_audience response transformation"
  );
};

const networkHandler = function() {
  this.proxy = scAudienceProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
};
module.exports = { validatePayload, validateFields, networkHandler };
