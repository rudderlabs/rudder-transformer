const {
  BASE_ENDPOINT,
  CRITEO_ADD_USER,
  CRITEO_REMOVE_USER
} = require("./config");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  defaultPatchRequestConfig
} = require("../../util");
const { InstrumentationError } = require("../../util/errorTypes");

const { getAccessToken, preparePayload } = require("./util");

const prepareResponse = (payload, audienceId, accessToken) => {
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}audiences/${audienceId}/contactlist`;
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
    throw new InstrumentationError(`Payload could not be populated`);
  }
  if (responseArray.length === 1) {
    return responseArray[0];
  }
  return responseArray;
};

const processEvent = async (metadata, message, destination) => {
  const accessToken = await getAccessToken(metadata);
  let response;
  if (!message.type) {
    throw new InstrumentationError(
      "Message Type is not present. Aborting message."
    );
  }
  if (!message.properties) {
    throw new InstrumentationError(
      "Message properties is not present. Aborting message."
    );
  }
  if (!message.properties.listData) {
    throw new InstrumentationError(
      "listData is not present inside properties. Aborting message."
    );
  }
  if (message.type.toLowerCase() === "audiencelist") {
    response = await responseBuilder(message, destination, accessToken);
  } else {
    throw new InstrumentationError(
      `Event type ${message.type} is not supported`
    );
  }
  return response;
};

const process = async event => {
  return processEvent(event.metadata, event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
