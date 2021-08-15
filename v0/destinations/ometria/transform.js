const { EventType } = require("../../../constants");
const {
  constructPayload,
  extractCustomFields,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  defaultBatchRequestConfig,
  returnArrayOfSubarrays,
  defaultPostRequestConfig,
  CustomError,
  defaultRequestConfig
} = require("../../util/index");
const {
  MAX_BATCH_SIZE,
  contactDataMapping,
  IDENTIFY_EXCLUSION_FIELDS,
  ENDPOINT,
  MARKETING_OPTIN_LIST
} = require("./config");

const identifyPayloadBuilder = (message, { Config }) => {
  // TODO: validate payload
  const payload = constructPayload(message, contactDataMapping);
  payload["@type"] = "contact";
  if (!payload.properties) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ["traits", "context.traits"],
      IDENTIFY_EXCLUSION_FIELDS
    );
    payload.properties = customFields;
  }
  if (
    payload.marketing_optin &&
    !MARKETING_OPTIN_LIST.includes(payload.marketing_optin)
  ) {
    payload.marketing_optin = null;
  }
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = [removeUndefinedAndNullValues(payload)];
  response.endpoint = ENDPOINT;
  response.headers = {
    "X-Ometria-Auth": Config.apiKey
  };
  return response;
};

/**
 * Processing Single event
 */
const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.apiKey) {
    throw new CustomError("Invalid api key", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyPayloadBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

const batch = destEvents => {
  const respList = [];
  const batchEventResponse = defaultBatchRequestConfig();
  const apiKey = destEvents[0].body.JSON[0].headers["X-Ometria-Auth"];

  const arrayChunks = returnArrayOfSubarrays(destEvents, MAX_BATCH_SIZE);
  arrayChunks.forEach(chunk => {
    respList.push(chunk.body.JSON[0]);
  });

  batchEventResponse.batchedRequest.body.JSON = respList;
  batchEventResponse.batchedRequest.endpoint = ENDPOINT;
  batchEventResponse.batchedRequest.headers = {
    "X-Ometria-Auth": apiKey
  };

  return batchEventResponse;
};

module.exports = { processRouterDest, process, batch };
