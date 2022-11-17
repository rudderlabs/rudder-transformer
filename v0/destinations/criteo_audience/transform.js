const {
  BASE_ENDPOINT,
  CRITEO_ADD_USER,
  CRITEO_REMOVE_USER
} = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  defaultPatchRequestConfig
} = require("../../util");

const { getAccessToken, preparePayload } = require("./util");

const prepareResponse = (payload, audienceId, accessToken) => {
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}/audiences/${audienceId}/contactlist`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = defaultPatchRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  return response;
};
/**
 * This function is used for building the final response to be returned.
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const responseBuilder = async (message, destination, accessToken) => {
  const responseArray = [];
  let criteoAddPayload = {};
  let criteoRemovePayload = {};
  const { Config } = destination;
  const { audienceId } = Config;
  const { listData } = message.properties;

  if (listData[CRITEO_ADD_USER]) {
    criteoAddPayload = preparePayload(
      listData[CRITEO_ADD_USER],
      CRITEO_ADD_USER,
      Config
    );
    responseArray.push(
      prepareResponse(criteoAddPayload, audienceId, accessToken)
    );
  }
  if (listData[CRITEO_REMOVE_USER]) {
    criteoRemovePayload = preparePayload(
      listData[CRITEO_REMOVE_USER],
      CRITEO_REMOVE_USER,
      Config
    );
    responseArray.push(
      prepareResponse(criteoRemovePayload, audienceId, accessToken)
    );
  }
  if (responseArray.length === 0) {
    throw new CustomError(
      `[Criteo_Audience]:: Payload could not be populated`,
      400
    );
  }
  if (responseArray.length === 1) {
    return responseArray[0];
  }
  return responseArray;
};

const processEvent = async (message, destination) => {
  const accessToken = await getAccessToken(destination);
  if (!accessToken) {
    throw new CustomError(
      `[Criteo_Audience]:: access token is not available`,
      400
    );
  }
  let response;
  if (!message.type) {
    throw new CustomError(
      "[Criteo_Audience]:: Message Type is not present. Aborting message.",
      400
    );
  }
  if (!message.properties) {
    throw new CustomError(
      "[Criteo_Audience]:: Message properties is not present. Aborting message.",
      400
    );
  }
  if (!message.properties.listData) {
    throw new CustomError(
      "[Criteo_Audience]:: listData is not present inside properties. Aborting message.",
      400
    );
  }
  if (message.type.toLowerCase() === "audiencelist") {
    response = await responseBuilder(message, destination, accessToken);
  } else {
    throw new CustomError(
      `[Criteo_Audience]:: Message type ${message.type} not supoorted`,
      400
    );
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(
    inputs,
    "CRITEO_AUDIENCE",
    process
  );
  return respList;
};

module.exports = { process, processRouterDest };
