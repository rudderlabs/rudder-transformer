const {
  getHashFromArray,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  marketoBulkUploadRequestConfig
} = require("../../util");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES } = require("./config");

function responseBuilderSimple(message, category, destination) {
  let payload;
  const fieldHashmap = getHashFromArray(destination.Config.columnFieldsMapping);
  const traits = getFieldValueFromMessage(message, "traits");
  Object.keys(fieldHashmap).forEach(key => {
    const val = traits[key];
    payload[fieldHashmap[key]] = val;
  });
  const response = marketoBulkUploadRequestConfig();

  const payloadString = JSON.parse(payload);
  const payloadValues = Object.values(payloadString);

  response.body.CSVRow = payloadValues.toString();

  return response;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.category;
      response = responseBuilderSimple(message, category, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  return response;
};
const process = event => {
  return processEvent(event.message, event.destination);
};

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
