const {
  getSuccessRespEvents,
  getErrorRespEvents,
  flattenMap,
  CustomError,
  warehouseSchemaExists,
  getSchemaForEventMappedToDest,
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays
} = require("../../util");
const { USER_ADD, MAX_ALLOWED_SIZE } = require("./config");
const { getIdentifierBasedOnPriority } = require("./util");

const prepareResponse = (userList, operationType) => {
  
};

const processEvent = (message, { Config }) => {
  if (!message.type) {
    throw new CustomError("Message not present or invalid");
  }
  if (message.type !== "audienceList") {
    throw new CustomError(`message type ${message.type} not supported`);
  }

  let { userSchema } = Config;
  if (warehouseSchemaExists(message)) {
    userSchema = getSchemaForEventMappedToDest(message);
  }

  let identifierType;
  if (userSchema.length > 1) {
    identifierType = getIdentifierBasedOnPriority(userSchema);
    if (!identifierType) {
      throw new CustomError("invalid identifier type", 400);
    }
  }

  const { listData } = message.properties;
  if (!listData) {
    throw new CustomError("listData is missing", 400);
  }

  const userDeleteList = listData[USER_ADD];
  if (isDefinedAndNotNullAndNotEmpty(userDeleteList)) {
    const audienceChunksArray = returnArrayOfSubarrays(
      listData[USER_ADD],
      MAX_ALLOWED_SIZE
    );
  }
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  const respList = inputs.map(input => {
    try {
      if (input.message.statusCode) {
        // already transformed event
        return getSuccessRespEvents(
          input.message,
          [input.metadata],
          input.destination
        );
      }
      const transformedList = process(input);
      const responseList = transformedList.map(transformedPayload => {
        return getSuccessRespEvents(
          transformedPayload,
          [input.metadata],
          input.destination
        );
      });
      return responseList;
    } catch (error) {
      return getErrorRespEvents(
        [input.metadata],
        // eslint-disable-next-line no-nested-ternary
        400,
        error.message || "Error occurred while processing payload."
      );
    }
  });
  return flattenMap(respList);
};

module.exports = {
  processRouterDest,
  process
};
