const {
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

const { getTopic, createAttributesMetadata } = require("./util");

function process(event) {
  const { message, destination } = event;
  const topicId = getTopic(event);
  if (topicId) {
    const attributes = createAttributesMetadata(message, destination);

    return {
      userId: message.userId || message.anonymousId,
      message,
      topicId,
      attributes
    };
  }
  throw new CustomError("No topic set for this event");
}

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

module.exports = { process, processRouterDest };
