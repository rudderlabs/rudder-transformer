const { EventType } = require("../../../constants");
const logger = require("../../../logger");
const {
  constructPayload,
  extractCustomFields,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  defaultBatchRequestConfig,
  returnArrayOfSubarrays,
  CustomError
} = require("../../util/index");
const {
  MAX_BATCH_SIZE,
  contactDataMapping,
  IDENTIFY_EXCLUSION_FIELDS,
  ENDPOINT
} = require("./config");

const identifyPayloadBuilder = message => {
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
  return removeUndefinedAndNullValues(payload);
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
  let apiKey = "";

  // divide into batches of size 100
  const arrayChunks = returnArrayOfSubarrays(destEvents, MAX_BATCH_SIZE);
  arrayChunks.forEach(chunk => {
    chunk.forEach(event => {
      if (event.Config.apiKey) {
        respList.push(process(event));
        apiKey = event.Config.apiKey;
      } else {
        logger.debug("apiKey missing. Dropping event from batch");
      }
    });
  });

  batchEventResponse.batchedRequest.body.JSON = respList;
  batchEventResponse.batchedRequest.endpoint = ENDPOINT;
  batchEventResponse.batchedRequest.headers = {
    "X-Ometria-Auth": apiKey
  };

  return batchEventResponse;
};

module.exports = { processRouterDest, process, batch };
