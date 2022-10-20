const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  flattenJson,
  CustomError,
  defaultPostRequestConfig
} = require("../../util");

const { ConfigCategories, mappingConfig, BASE_URL } = require("./config");

// build final response
function buildResponse(payload, factorsAIApiKey) {
  const response = defaultRequestConfig();
  const apiKey = Buffer.from(`${factorsAIApiKey}:`).toString("base64");
  response.endpoint = BASE_URL;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${apiKey}`
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}

// process identify call
function processIdentify(message, factorsAIApiKey) {
  const requestJson = constructPayload(
    message,
    mappingConfig[ConfigCategories.IDENTIFY.name]
  );
  return buildResponse(requestJson, factorsAIApiKey);
}

// process track call
function processTrack(message, factorsAIApiKey) {
  const requestJson = constructPayload(
    message,
    mappingConfig[ConfigCategories.TRACK.name]
  );
  // flatten json as factorsAi do not support nested properties
  requestJson.properties = flattenJson(requestJson.properties);
  return buildResponse(requestJson, factorsAIApiKey);
}

function process(event) {
  const { message, destination } = event;
  const { factorsAIApiKey } = destination.Config;

  if (!message.type) {
    throw new CustomError(
      "[FACTORSAI]: Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.IDENTIFY:
      return processIdentify(message, factorsAIApiKey);
    case EventType.TRACK:
      return processTrack(message, factorsAIApiKey);
    default:
      throw new CustomError("Message type is not supported", 400);
  }
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
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

module.exports = { process, processRouterDest };
