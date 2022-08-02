const { getErrorRespEvents } = require("../../util");

function process(event) {
  const { destination } = event;
  const { invocationType, clientContext, lambda } = destination.Config;
  return {
    message: event.message,
    userId: event.message.anonymousId,
    invocationType,
    clientContext,
    lambda
  };
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  await Promise.all(
    inputs.forEach(event => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          eventsChunk.push(event.message);
        } else {
          // if not transformed
          let response = process(event);
          response = Array.isArray(response) ? response : [response];
          response.forEach(res => {
            eventsChunk.push({
              message: res,
              metadata: event.metadata,
              destination: event.destination
            });
          });
        }
      } catch (error) {
        errorRespList.push(
          getErrorRespEvents(
            [event.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );

  return [...eventsChunk, ...errorRespList];
};

module.exports = { process, processRouterDest };
